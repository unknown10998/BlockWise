// Read-only audit of an extracted mcmeta Java recipe directory. No dependencies.
const fs = require('node:fs');
const path = require('node:path');

const itemId = /^(?:#)?[a-z0-9_.-]+:[a-z0-9_./-]+$/;
const simpleStations = new Set(['smelting', 'blasting', 'smoking', 'campfire_cooking', 'stonecutting']);

function ingredient(value) {
  if (typeof value === 'string' && itemId.test(value)) return value;
  if (Array.isArray(value) && value.length) return value.map(ingredient);
  throw new Error('Invalid or missing ingredient');
}

function output(value) {
  if (!value || typeof value !== 'object' || typeof value.id !== 'string' || !itemId.test(value.id) || value.id.startsWith('#')) {
    throw new Error('Invalid or missing result item');
  }
  const count = value.count === undefined ? 1 : value.count;
  if (!Number.isSafeInteger(count) || count < 1) throw new Error('Invalid result count');
  return { id: value.id, count };
}

// Returns a view model only for types whose basic display has been checked.
// Preserve other types as raw data, rather than inventing an output or layout.
function parseRecipe(id, raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.type !== 'string' || !raw.type.startsWith('minecraft:')) {
    throw new Error('Invalid or missing recipe type');
  }
  const type = raw.type.slice('minecraft:'.length);
  const base = { id, type, category: raw.category || null, raw };
  if (type === 'crafting_shaped') {
    if (!Array.isArray(raw.pattern) || !raw.pattern.length || raw.pattern.length > 3 || !raw.key || typeof raw.key !== 'object') throw new Error('Invalid shaped pattern');
    const width = typeof raw.pattern[0] === 'string' ? raw.pattern[0].length : 0;
    if (!width || width > 3 || raw.pattern.some(row => typeof row !== 'string' || row.length !== width)) throw new Error('Invalid shaped rows');
    const slots = raw.pattern.map(row => [...row].map(symbol => {
      if (symbol === ' ') return null;
      if (!Object.hasOwn(raw.key, symbol)) throw new Error('Missing shaped key');
      return ingredient(raw.key[symbol]);
    }));
    return { ...base, status: 'basic', result: output(raw.result), slots };
  }
  if (type === 'crafting_shapeless') {
    if (!Array.isArray(raw.ingredients) || !raw.ingredients.length || raw.ingredients.length > 9) throw new Error('Invalid shapeless ingredients');
    return { ...base, status: 'basic', result: output(raw.result), ingredients: raw.ingredients.map(ingredient) };
  }
  if (simpleStations.has(type)) return { ...base, status: 'basic', result: output(raw.result), ingredient: ingredient(raw.ingredient) };
  return { ...base, status: 'requires-special-rendering' };
}

function audit(directory) {
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.json')).sort();
  if (!files.length) throw new Error('No recipe JSON files found');
  const summary = { files: files.length, types: {}, basic: 0, requiresSpecialRendering: 0, errors: [] };
  for (const file of files) {
    try {
      const recipe = parseRecipe(`minecraft:${file.slice(0, -5)}`, JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
      summary.types[recipe.type] = (summary.types[recipe.type] || 0) + 1;
      if (recipe.status === 'basic') summary.basic++;
      else summary.requiresSpecialRendering++;
    } catch (error) {
      summary.errors.push({ file, error: error.message });
    }
  }
  return summary;
}

if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node scripts/audit-java-recipes.js <recipe-directory>');
    const summary = audit(process.argv[2]);
    console.log(JSON.stringify(summary, null, 2));
    if (summary.errors.length) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseRecipe, audit };
