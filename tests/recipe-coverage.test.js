const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const report = require('../recipe-coverage.json');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('recipe-data.js', 'utf8'), context);
const recipes = context.window.BLOCKWISE_RECIPES;

test('generated library has one entry per source definition', () => {
  assert.equal(report.sourceDefinitions, 1470);
  assert.equal(recipes.length, report.sourceDefinitions);
  assert.equal(new Set(recipes.map(recipe => recipe.id)).size, recipes.length);
  assert.equal(recipes.filter(recipe => !recipe.special).length, 1396);
  assert.equal(report.unresolved.length, 0);
});

test('tag ingredients and special types retain their actual options', () => {
  const table = recipes.find(recipe => recipe.id === 'minecraft:crafting_table');
  assert.ok(table.slots[0][0].includes('minecraft:oak_planks'));
  assert.ok(table.slots[0][0].includes('minecraft:spruce_planks'));
  const smithing = recipes.find(recipe => recipe.id === 'minecraft:netherite_sword_smithing');
  assert.equal(smithing.stationInputs.length, 3);
  assert.equal(smithing.result.id, 'minecraft:netherite_sword');
  assert.ok(recipes.find(recipe => recipe.id === 'minecraft:firework_rocket').limitation);
});

test('every imported definition has a renderer-safe structure', () => {
  for (const recipe of recipes) {
    if (recipe.result) {
      assert.match(recipe.result.id, /^minecraft:/, recipe.id);
      assert.ok(Number.isInteger(recipe.result.count) && recipe.result.count > 0, recipe.id);
    }
    if (recipe.slots) {
      assert.ok(recipe.slots.length >= 1 && recipe.slots.length <= 3, recipe.id);
      for (const row of recipe.slots) {
        assert.ok(row.length >= 1 && row.length <= 3, recipe.id);
        for (const slot of row) assert.ok(slot === null || (Array.isArray(slot) && slot.length > 0), recipe.id);
      }
    }
    if (recipe.ingredients) {
      assert.ok(recipe.ingredients.length >= 1 && recipe.ingredients.length <= 9, recipe.id);
      recipe.ingredients.forEach(options => assert.ok(Array.isArray(options) && options.length > 0, recipe.id));
    }
    if (recipe.stationInputs) {
      assert.ok(recipe.stationInputs.length >= 2 && recipe.stationInputs.length <= 3, recipe.id);
      recipe.stationInputs.forEach(input => assert.ok(input.label && input.options.length, recipe.id));
    }
  }
  assert.equal(report.iconCoverage.renderedRegistryItems, 1505);
  assert.equal(report.iconCoverage.gameDerivedTextureFilesIncluded, 0);
});
