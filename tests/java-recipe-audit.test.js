const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRecipe } = require('../scripts/audit-java-recipes');

test('shaped recipes retain empty positions, tags, and batch output', () => {
  const recipe = parseRecipe('minecraft:example', {
    type: 'minecraft:crafting_shaped', pattern: ['# #', ' # '],
    key: { '#': '#minecraft:planks' }, result: { id: 'minecraft:stick', count: 4 }
  });
  assert.deepEqual(recipe.slots, [['#minecraft:planks', null, '#minecraft:planks'], [null, '#minecraft:planks', null]]);
  assert.deepEqual(recipe.result, { id: 'minecraft:stick', count: 4 });
});

test('shapeless alternatives remain alternatives and default count is one', () => {
  const recipe = parseRecipe('minecraft:example', { type: 'minecraft:crafting_shapeless', ingredients: [['minecraft:stone', '#minecraft:planks']], result: { id: 'minecraft:stone' } });
  assert.deepEqual(recipe.ingredients, [['minecraft:stone', '#minecraft:planks']]);
  assert.equal(recipe.result.count, 1);
});

test('station recipes preserve station and ingredient', () => {
  const recipe = parseRecipe('minecraft:iron_ingot_from_smelting_raw_iron', { type: 'minecraft:smelting', ingredient: 'minecraft:raw_iron', result: { id: 'minecraft:iron_ingot' }, cookingtime: 200 });
  assert.equal(recipe.type, 'smelting');
  assert.equal(recipe.ingredient, 'minecraft:raw_iron');
  assert.equal(recipe.raw.cookingtime, 200);
});

test('alternative recipe IDs for the same output remain distinct', () => {
  const make = (id, input) => parseRecipe(id, { type: 'minecraft:smelting', ingredient: input, result: { id: 'minecraft:iron_ingot' } });
  const a = make('minecraft:iron_ingot_from_raw_iron', 'minecraft:raw_iron');
  const b = make('minecraft:iron_ingot_from_iron_ore', 'minecraft:iron_ore');
  assert.notEqual(a.id, b.id);
  assert.equal(a.result.id, b.result.id);
  assert.notEqual(a.ingredient, b.ingredient);
});

test('special types stay explicit and retain original data', () => {
  const raw = { type: 'minecraft:crafting_special_firework_rocket', category: 'misc' };
  assert.equal(parseRecipe('minecraft:firework_rocket', raw).status, 'requires-special-rendering');
  assert.equal(parseRecipe('minecraft:firework_rocket', raw).raw, raw);
});

test('malformed definitions fail rather than silently guessing', () => {
  assert.throws(() => parseRecipe('minecraft:bad', null));
  assert.throws(() => parseRecipe('minecraft:bad', { type: 'minecraft:crafting_shaped', pattern: ['#'], key: {}, result: { id: 'minecraft:stone' } }));
  assert.throws(() => parseRecipe('minecraft:bad', { type: 'minecraft:crafting_shapeless', ingredients: ['minecraft:stone'], result: { id: 'minecraft:stone', count: 0 } }));
});
