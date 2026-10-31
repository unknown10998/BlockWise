const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync("script.js", "utf8");
const start = script.indexOf("const plannerRecipes");
const recipeEnd = script.indexOf("const plannerForm");
const functionStart = script.indexOf("function getPlannerItemLabel");
const end = script.indexOf("function renderPlannerChecklist");

if (start === -1 || recipeEnd === -1 || functionStart === -1 || end === -1) {
  throw new Error("Could not find the planner calculation section in script.js.");
}

const context = {};
const plannerCalculationCode = `${script.slice(start, recipeEnd)}${script.slice(functionStart, end)}`;
vm.runInNewContext(`${plannerCalculationCode}\nglobalThis.plannerCore = { plannerIngredientTotals, plannerItemStats, plannerRecipeBatches };`, context);
const { plannerIngredientTotals, plannerItemStats, plannerRecipeBatches } = context.plannerCore;

function totalsFor(itemId, quantity) {
  return Object.fromEntries(plannerIngredientTotals(itemId, quantity, "java-bedrock").totals);
}

test("stone bricks round recipe batches up", () => {
  assert.equal(plannerRecipeBatches({ output: 4 }, 5), 2);
  assert.deepEqual(totalsFor("stone_bricks", 5), { stone: 2 });
});

test("iron pickaxe combines recursive ingredients", () => {
  assert.deepEqual(totalsFor("iron_pickaxe", 1), {
    iron_ingot: 3,
    log: 1
  });
});

test("planks use their four-item crafting output", () => {
  assert.deepEqual(totalsFor("planks", 5), { log: 2 });
});

test("storage stats respect the modeled stack size", () => {
  assert.deepEqual({ ...plannerItemStats("bucket", 17) }, {
    fullStacks: 1,
    leftovers: 1,
    slots: 2
  });
  assert.deepEqual({ ...plannerItemStats("iron_pickaxe", 2) }, {
    fullStacks: 2,
    leftovers: 0,
    slots: 2
  });
});

function createCopyFallbackHarness(labels, navigatorValue = {}) {
  const copyButton = {
    addEventListener(eventName, callback) {
      if (eventName === "click") this.copyHandler = callback;
    }
  };
  const status = { textContent: "" };
  const fallback = { hidden: true };
  const copyText = {
    value: "",
    focused: false,
    selected: false,
    focus() { this.focused = true; },
    select() { this.selected = true; }
  };
  const copyContext = {
    navigator: navigatorValue,
    plannerChecklist: { querySelectorAll: () => labels },
    plannerCopy: copyButton,
    plannerCopyFallback: fallback,
    plannerCopyText: copyText,
    plannerStatus: status
  };
  const helpersStart = script.indexOf("function getPlannerChecklistText");
  const helpersEnd = script.indexOf("function updatePlannerResult");
  const listenerStart = script.indexOf("plannerCopy.addEventListener");
  const listenerEnd = script.indexOf("plannerItem.addEventListener");

  if ([helpersStart, helpersEnd, listenerStart, listenerEnd].some((index) => index === -1)) {
    throw new Error("Could not find the planner copy handler in script.js.");
  }

  vm.runInNewContext(`${script.slice(helpersStart, helpersEnd)}${script.slice(listenerStart, listenerEnd)}`, copyContext);
  return { copyButton, copyText, fallback, status };
}

test("clipboard-unavailable fallback selects the real checklist text", async () => {
  const harness = createCopyFallbackHarness([
    { textContent: "3 Iron Ingot — 0 full stacks + 3 leftover; 1 storage slot" },
    { textContent: "1 Log — 0 full stacks + 1 leftover; 1 storage slot" }
  ]);

  await harness.copyButton.copyHandler();

  assert.equal(harness.fallback.hidden, false);
  assert.equal(harness.copyText.value, "3 Iron Ingot — 0 full stacks + 3 leftover; 1 storage slot\n1 Log — 0 full stacks + 1 leftover; 1 storage slot");
  assert.equal(harness.copyText.focused, true);
  assert.equal(harness.copyText.selected, true);
  assert.equal(harness.status.textContent, "Clipboard access is unavailable. The checklist text is selected below so you can copy it manually.");
});

test("copy ignores the empty checklist placeholder", async () => {
  const harness = createCopyFallbackHarness([]);

  await harness.copyButton.copyHandler();

  assert.equal(harness.fallback.hidden, true);
  assert.equal(harness.copyText.value, "");
  assert.equal(harness.status.textContent, "Nothing to copy yet. Build a resource list first.");
});
