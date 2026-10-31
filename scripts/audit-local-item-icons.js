// Audits a locally installed Minecraft Java JAR without extracting or copying
// Minecraft assets. It is intentionally for local investigation only.
// Usage: node scripts/audit-local-item-icons.js /path/to/1.21.11.jar /tmp/icon-audit.json
const childProcess = require('node:child_process');
const fs = require('node:fs');

function list(jar) {
  return new Set(childProcess.execFileSync('unzip', ['-Z1', jar], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim().split('\n'));
}
function readJson(jar, entry) {
  return JSON.parse(childProcess.execFileSync('unzip', ['-p', jar, entry], { encoding: 'utf8' }));
}
function unnamespace(value) {
  return value.replace(/^minecraft:/, '');
}
function modelEntry(model) {
  return `assets/minecraft/models/${unnamespace(model)}.json`;
}
function textureEntry(texture) {
  return `assets/minecraft/textures/${unnamespace(texture)}.png`;
}

function auditJar(jar) {
  const entries = list(jar);
  const itemDefinitions = [...entries].filter(entry => entry.startsWith('assets/minecraft/items/') && entry.endsWith('.json')).sort();
  const mapping = {};
  for (const entry of itemDefinitions) {
    const id = `minecraft:${entry.slice('assets/minecraft/items/'.length, -'.json'.length)}`;
    try {
      const item = readJson(jar, entry);
      const model = item.model?.type === 'minecraft:model' ? item.model.model : null;
      if (!model) { mapping[id] = { status: 'dynamic-item-model', itemDefinition: entry }; continue; }
      const file = modelEntry(model);
      if (!entries.has(file)) { mapping[id] = { status: 'missing-model', model, itemDefinition: entry }; continue; }
      const definition = readJson(jar, file);
      const texture = definition.textures?.layer0;
      if (texture && entries.has(textureEntry(texture))) {
        mapping[id] = { status: 'direct-transparent-item-texture', itemDefinition: entry, model: file, texture: textureEntry(texture) };
      } else if (definition.textures) {
        mapping[id] = { status: 'requires-model-render', itemDefinition: entry, model: file, textures: Object.values(definition.textures).map(textureEntry) };
      } else {
        mapping[id] = { status: 'requires-parent-model-render', itemDefinition: entry, model: file, parent: definition.parent || null };
      }
    } catch (error) {
      mapping[id] = { status: 'unreadable', error: error.message };
    }
  }
  const byStatus = {};
  for (const value of Object.values(mapping)) byStatus[value.status] = (byStatus[value.status] || 0) + 1;
  return { jar, generatedAt: new Date().toISOString(), assetPolicy: 'No assets are extracted, copied, or redistributed by this audit.', itemDefinitionCount: itemDefinitions.length, statusCounts: byStatus, mapping };
}

if (require.main === module) {
  if (process.argv.length !== 4) throw new Error('Usage: node scripts/audit-local-item-icons.js <1.21.11.jar> <output-json>');
  fs.writeFileSync(process.argv[3], `${JSON.stringify(auditJar(process.argv[2]), null, 2)}\n`);
}

module.exports = { auditJar, modelEntry, textureEntry };
