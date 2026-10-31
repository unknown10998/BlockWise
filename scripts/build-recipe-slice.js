// Generate the version-pinned recipe library and audit its references.
const fs = require('node:fs');
const path = require('node:path');
const { parseRecipe } = require('./audit-java-recipes');

const qualify = id => id.includes(':') ? id : `minecraft:${id}`;

function createResolver(items, tags) {
  const registry = new Set(items.map(qualify));
  function resolve(value, stack = []) {
    if (Array.isArray(value)) return [...new Set(value.flatMap(v => resolve(v, stack)))];
    if (typeof value !== 'string') throw new Error('Invalid ingredient reference');
    if (!value.startsWith('#')) {
      const id = qualify(value);
      if (!registry.has(id)) throw new Error(`Missing item ${id}`);
      return [id];
    }
    const id = qualify(value.slice(1));
    if (stack.includes(id)) throw new Error(`Cyclic tag ${id}`);
    const tag = tags[id];
    if (!tag || !Array.isArray(tag.values)) throw new Error(`Missing tag ${id}`);
    return [...new Set(tag.values.flatMap(entry => {
      const ref = typeof entry === 'string' ? entry : entry.id;
      try { return resolve(ref, [...stack, id]); }
      catch (error) { if (typeof entry === 'object' && entry.required === false) return []; throw error; }
    }))];
  }
  return resolve;
}

function references(raw) {
  return [...Object.values(raw.key || {}), ...(raw.ingredients || []), ...['ingredient', 'base', 'addition', 'template', 'input', 'material'].filter(key => raw[key] !== undefined).map(key => raw[key]), ...(raw.result?.id ? [raw.result.id] : [])];
}

function loadTags(directory, prefix = '') {
  const tags = {};
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) Object.assign(tags, loadTags(path.join(directory, entry.name), relative));
    else if (entry.name.endsWith('.json')) tags[`minecraft:${relative.slice(0, -5).split(path.sep).join('/')}`] = JSON.parse(fs.readFileSync(path.join(directory, entry.name)));
  }
  return tags;
}

function build(recipeDir, tagDir, itemRegistry) {
  const resolve = createResolver(JSON.parse(fs.readFileSync(itemRegistry)), loadTags(tagDir));
  const errors = [];
  const recipes = [];
  const files = fs.readdirSync(recipeDir).filter(file => file.endsWith('.json')).sort();
  for (const file of files) {
    const id = file.slice(0, -5);
    const raw = JSON.parse(fs.readFileSync(path.join(recipeDir, file)));
    let bad = false;
    for (const reference of references(raw)) {
      try { resolve(reference); } catch (error) { errors.push({ recipe: `minecraft:${id}`, reference, error: error.message }); bad = true; }
    }
    if (bad) continue;
    try {
      const parsed = parseRecipe(`minecraft:${id}`, raw);
      const result = { id: parsed.id, type: parsed.type, result: parsed.result || null, rawResult: raw.result || null };
      if (parsed.slots) result.slots = parsed.slots.map(row => row.map(slot => slot === null ? null : resolve(slot)));
      if (parsed.ingredients) result.ingredients = parsed.ingredients.map(value => resolve(value));
      if (parsed.ingredient) result.ingredient = resolve(parsed.ingredient);
      if (['smithing_transform', 'smithing_trim'].includes(parsed.type)) {
        result.stationInputs = ['template', 'base', 'addition'].map(key => ({ label: key, options: resolve(raw[key]) }));
        if (parsed.type === 'smithing_transform') result.result = { id: raw.result.id, count: raw.result.count || 1 };
        else result.limitation = 'Output is the supplied armor with the selected trim; its item and components depend on the inputs.';
      } else if (parsed.type === 'crafting_transmute') {
        result.stationInputs = ['input', 'material'].map(key => ({ label: key, options: resolve(raw[key]) }));
        result.result = { id: raw.result.id, count: raw.result.count || 1 };
        result.limitation = 'Input components may be carried to the output; consult the game for component behavior.';
      } else if (parsed.status !== 'basic') {
        result.limitation = 'This recipe is implemented by game code; its input rules and output cannot be reconstructed from this data file alone.';
      }
      result.special = parsed.status !== 'basic';
      if (raw.cookingtime !== undefined) result.cookingtime = raw.cookingtime;
      if (raw.experience !== undefined) result.experience = raw.experience;
      recipes.push(result);
    } catch (error) { errors.push({ recipe: `minecraft:${id}`, error: error.message }); }
  }
  return { files: files.length, errors, recipes };
}

if (require.main === module) {
  if (process.argv.length !== 8) throw new Error('Usage: node scripts/build-recipe-slice.js <recipes> <item-tags> <item-registry-json> <english-lang-json> <output-js> <coverage-json>');
  const result = build(process.argv[2], process.argv[3], process.argv[4]);
  const lang = JSON.parse(fs.readFileSync(process.argv[5]));
  const items = JSON.parse(fs.readFileSync(process.argv[4])).map(qualify);
  const names = Object.fromEntries(items.map(id => { const key = id.replace(/^minecraft:/, ''); return [id, lang[`item.minecraft.${key}`] || lang[`block.minecraft.${key}`] || null]; }));
  const dynamic = result.recipes.filter(recipe => recipe.limitation);
  const report = { sourceDefinitions: result.files, importedDefinitions: result.recipes.length, standardDefinitions: result.recipes.filter(r => !r.special).length, specialDefinitions: result.recipes.filter(r => r.special).length, representedStandardDefinitions: result.recipes.filter(r => !r.special).length, visuallyVerifiedDefinitions: null, rendererStructuralValidation: { status: 'validated-by-automated-tests', definitionCount: result.recipes.length, notes: 'Automated structural checks validate grid dimensions, non-empty defined ingredients, positive fixed outputs, and station-input layouts. This is not individual visual or in-game verification.' }, iconCoverage: { strategy: 'version-matched-name-initials', renderedRegistryItems: items.length, gameDerivedTextureFilesIncluded: 0, approvedGameDerivedIcons: 0, unavailableGameDerivedIcons: items.length, notes: 'All item IDs render the first letter of their version-matched display name. No Minecraft texture is bundled because redistribution permission for extracted game textures has not been established.' }, uniqueFixedOutputs: new Set(result.recipes.filter(r => r.result).map(r => r.result.id)).size, missingOfficialIcons: items, unresolved: result.errors, specialHandling: dynamic.map(r => ({ recipe: r.id, type: r.type, reason: r.limitation })) };
  fs.writeFileSync(process.argv[6], `// Generated from mcmeta Java 1.21.11; see README.\nwindow.BLOCKWISE_RECIPES = ${JSON.stringify(result.recipes)};\nwindow.BLOCKWISE_ITEM_NAMES = ${JSON.stringify(names)};\n`);
  fs.writeFileSync(process.argv[7], `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ source: report.sourceDefinitions, imported: report.importedDefinitions, standard: report.standardDefinitions, special: report.specialDefinitions, fixedOutputs: report.uniqueFixedOutputs, limitations: dynamic.length, missingIcons: items.length, unresolved: result.errors.length }, null, 2));
}
module.exports = { createResolver, references, build };
