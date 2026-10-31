const assert = require("node:assert/strict");
const test = require("node:test");
const { calculateBuild, calculateMaterialPlan, checklistText } = require("../build-estimator.js");

test("room shell counts each wall corner once and keeps interior floor separate", () => {
  const plan = calculateBuild({ type: "room", length: 5, width: 5, height: 3, thickness: 1, floor: true, ceiling: true, doors: 1, windows: 2, quantity: 1 });
  assert.equal(plan.walls, 48); // (5×5×3) - (3×3×3)
  assert.equal(plan.floorBlocks, 9);
  assert.equal(plan.ceilingBlocks, 9);
  assert.equal(plan.openings, 4);
  assert.equal(plan.totalBlocks, 62);
});

test("solid cuboids ignore optional floors and openings", () => {
  const plan = calculateBuild({ type: "solid_cuboid", length: 4, width: 3, height: 2, thickness: 1, floor: true, ceiling: true, doors: 99, windows: 99, quantity: 2 });
  assert.equal(plan.totalBlocks, 48);
  assert.equal(plan.openings, 0);
});

test("material plan rounds recipe batches and reports storage", () => {
  const plan = calculateMaterialPlan({ type: "floor", length: 5, width: 1, height: 1, thickness: 1, quantity: 1, doors: 0, windows: 0, material: "oak_planks" });
  assert.equal(plan.totalBlocks, 5);
  assert.equal(plan.fullStacks, 0);
  assert.equal(plan.slots, 1);
  assert.deepEqual(plan.ingredients.map(({ name, total }) => ({ name, total })), [{ name: "Oak Log", total: 2 }]);
  assert.equal(checklistText(plan), "2 Oak Log");
});

test("invalid geometry and unsupported materials are rejected", () => {
  assert.throws(() => calculateBuild({ type: "wall", length: 0, width: 1, height: 2, thickness: 1, quantity: 1 }), /Length/);
  assert.throws(() => calculateMaterialPlan({ type: "floor", length: 1, width: 1, height: 1, thickness: 1, quantity: 1, doors: 0, windows: 0, material: "unknown" }), /material/);
});
