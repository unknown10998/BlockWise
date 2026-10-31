const test = require('node:test');
const assert = require('node:assert/strict');
const { createResolver, references } = require('../scripts/build-recipe-slice');

test('nested tags and alternatives resolve to registered items', () => {
  const resolve = createResolver(['oak_planks', 'spruce_planks'], {
    'minecraft:planks': { values: ['minecraft:oak_planks', '#minecraft:other_planks'] },
    'minecraft:other_planks': { values: ['minecraft:spruce_planks'] }
  });
  assert.deepEqual(resolve(['#minecraft:planks', 'minecraft:oak_planks']), ['minecraft:oak_planks', 'minecraft:spruce_planks']);
});

test('missing items, missing tags and tag cycles are reported', () => {
  const resolve = createResolver(['stone'], { 'minecraft:loop': { values: ['#minecraft:loop'] } });
  assert.throws(() => resolve('minecraft:unknown'), /Missing item/);
  assert.throws(() => resolve('#minecraft:unknown'), /Missing tag/);
  assert.throws(() => resolve('#minecraft:loop'), /Cyclic tag/);
});

test('references include smithing and transmutation inputs and outputs', () => {
  assert.deepEqual(references({ input: '#minecraft:planks', material: 'minecraft:stone', result: { id: 'minecraft:stick' } }), ['#minecraft:planks', 'minecraft:stone', 'minecraft:stick']);
});
