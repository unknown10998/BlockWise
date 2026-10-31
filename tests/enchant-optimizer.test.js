const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync("script.js", "utf8");
const code = source.slice(source.indexOf("function penalty("), source.indexOf("function renderPlanSteps("));
const context = {};
vm.runInNewContext(`${code}\nglobalThis.core = { optimizeItemPlan, optimizeBookTree, conflictMessage };`, context);
const { optimizeItemPlan, optimizeBookTree, conflictMessage } = context.core;

// Independent exhaustive simulation: maintain the actual pool of books and
// try every directed book merge and every possible application to the item.
function bruteForce(weights, initialUses) {
  function search(pool, uses) {
    if (!pool.length) return 0;
    let best = Infinity;
    for (let i = 0; i < pool.length; i++) {
      const book = pool[i];
      const cost = (2 ** uses - 1) + (2 ** book.uses - 1) + book.value;
      if (cost < 40) best = Math.min(best, cost + search(pool.filter((_, k) => k !== i), Math.max(uses, book.uses) + 1));
      for (let j = 0; j < pool.length; j++) {
        if (i === j) continue;
        const other = pool[j];
        const merge = (2 ** book.uses - 1) + (2 ** other.uses - 1) + other.value;
        if (merge >= 40) continue;
        const rest = pool.filter((_, k) => k !== i && k !== j);
        rest.push({ uses: Math.max(book.uses, other.uses) + 1, value: book.value + other.value });
        best = Math.min(best, merge + search(rest, uses));
      }
    }
    return best;
  }
  return search(weights.map(value => ({ uses: 0, value })), initialUses);
}

function books(weights) {
  return weights.map((weight, i) => ({ key: `e${i}`, name: `Book ${i}`, weight }));
}

test("optimizer matches independent exhaustive simulation across varied books and prior work", () => {
  for (const weights of [[1], [1, 2], [5, 2, 1], [1, 4, 6, 8], [12, 8, 4, 2]]) {
    for (const uses of [0, 1, 3, 5]) {
      const plan = optimizeItemPlan(books(weights), uses, "Sword");
      const expected = bruteForce(weights, uses);
      assert.equal(plan?.total ?? Infinity, expected, `${weights} with prior work ${uses}`);
      if (plan) {
        assert.equal(plan.steps.reduce((sum, step) => sum + step.cost, 0), plan.total);
        assert.ok(plan.steps.every(step => step.cost < 40));
      }
    }
  }
});

test("two fresh books can be applied separately for fewer levels", () => {
  const input = books([1, 2]);
  const plan = optimizeItemPlan(input, 0, "Sword");
  assert.equal(plan.total, 4);
  assert.equal(plan.steps.filter(step => step.type === "item").length, 2);
  assert.ok(plan.total < Math.min(...optimizeBookTree(input).map(tree => tree.cost + (2 ** tree.uses - 1) + tree.value)));
});

test("mace damage enchantment conflicts include density and breach", () => {
  assert.match(conflictMessage([{ key: "density" }, { key: "breach" }], "mace"), /conflict/);
});

test("book cost multipliers match Java 1.21.11 enchantment data", () => {
  const data = {};
  vm.runInNewContext(`${source.slice(source.indexOf("const enchantments ="), source.indexOf("const itemNames"))}\nglobalThis.enchantments = enchantments;`, data);
  const expected = { sharpness: 1, smite: 1, bane: 1, knockback: 1, fireAspect: 2, looting: 2, sweeping: 2, efficiency: 1, fortune: 2, silkTouch: 4, unbreaking: 1, mending: 2, protection: 1, blastProtection: 2, fireProtection: 1, projectileProtection: 1, featherFalling: 1, respiration: 2, aquaAffinity: 2, thorns: 4, depthStrider: 2, frostWalker: 2, soulSpeed: 4, swiftSneak: 4, power: 1, punch: 2, flame: 2, infinity: 4, multishot: 2, piercing: 1, quickCharge: 1, loyalty: 1, riptide: 2, channeling: 4, impaling: 2, density: 1, breach: 2, windBurst: 2, swiftSneakDummy: 4 };
  for (const [key, weight] of Object.entries(expected)) assert.equal(data.enchantments[key].weight, weight, key);
  assert.equal(Object.keys(data.enchantments).length, Object.keys(expected).length);
});
