(function buildEstimatorModule(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.BlockWiseBuildEstimator = api;
})(typeof globalThis !== "undefined" ? globalThis : null, function createBuildEstimator() {
  "use strict";

  const MATERIALS = {
    oak_planks: { name: "Oak Planks", stackSize: 64, ingredients: [{ id: "oak_log", name: "Oak Log", amount: 1, output: 4 }] },
    stone_bricks: { name: "Stone Bricks", stackSize: 64, ingredients: [{ id: "stone", name: "Stone", amount: 1, output: 4 }] },
    glass: { name: "Glass", stackSize: 64, ingredients: [{ id: "sand", name: "Sand", amount: 1, output: 1 }], warning: "Glass requires smelting. This first estimator includes sand but not furnace fuel; use the forthcoming Smelting & Fuel Calculator before gathering." },
    cobblestone: { name: "Cobblestone", stackSize: 64, ingredients: [{ id: "cobblestone", name: "Cobblestone", amount: 1, output: 1 }] },
    bricks: { name: "Bricks", stackSize: 64, ingredients: [{ id: "brick", name: "Brick", amount: 4, output: 1 }] }
  };

  function wholePositive(value, field) {
    if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${field} must be a whole number of at least 1.`);
  }

  function shellWalls(length, width, height, thickness) {
    const innerLength = Math.max(0, length - (2 * thickness));
    const innerWidth = Math.max(0, width - (2 * thickness));
    return (length * width * height) - (innerLength * innerWidth * height);
  }

  function calculateBuild(input) {
    const { type, length, width, height, thickness = 1, floor = false, ceiling = false, doors = 0, windows = 0, quantity = 1 } = input;
    [ [length, "Length"], [width, "Width"], [height, "Height"], [thickness, "Wall thickness"], [quantity, "Quantity"] ].forEach(([value, field]) => wholePositive(value, field));
    if (!Number.isSafeInteger(doors) || doors < 0 || !Number.isSafeInteger(windows) || windows < 0) throw new RangeError("Doors and windows must be whole numbers of zero or more.");

    let walls = 0;
    let floorBlocks = 0;
    let ceilingBlocks = 0;
    let openings = 0;
    const innerLength = Math.max(0, length - (2 * thickness));
    const innerWidth = Math.max(0, width - (2 * thickness));

    if (type === "solid_cuboid") {
      walls = length * width * height;
    } else if (type === "floor") {
      floorBlocks = length * width * thickness;
    } else if (type === "wall") {
      walls = length * height * thickness;
      openings = Math.min(walls, (doors * 2) + windows);
    } else if (type === "room" || type === "house") {
      walls = shellWalls(length, width, height, thickness);
      // The floor and ceiling fill only the hollow interior, so they never double-count wall corners or wall blocks.
      floorBlocks = floor ? innerLength * innerWidth * thickness : 0;
      ceilingBlocks = ceiling ? innerLength * innerWidth * thickness : 0;
      openings = Math.min(walls, (doors * 2) + windows);
    } else {
      throw new RangeError("Choose a supported structure type.");
    }

    const perStructure = walls + floorBlocks + ceilingBlocks - openings;
    return {
      type,
      perStructure,
      totalBlocks: perStructure * quantity,
      quantity,
      walls: walls * quantity,
      floorBlocks: floorBlocks * quantity,
      ceilingBlocks: ceilingBlocks * quantity,
      openings: openings * quantity,
      innerLength,
      innerWidth
    };
  }

  function calculateMaterialPlan(input) {
    const geometry = calculateBuild(input);
    const material = MATERIALS[input.material];
    if (!material) throw new RangeError("Choose a supported building material.");
    const fullStacks = Math.floor(geometry.totalBlocks / material.stackSize);
    const leftovers = geometry.totalBlocks % material.stackSize;
    const slots = Math.ceil(geometry.totalBlocks / material.stackSize);
    const ingredients = material.ingredients.map((ingredient) => {
      const batches = Math.ceil(geometry.totalBlocks / ingredient.output);
      return { ...ingredient, total: batches * ingredient.amount, batches };
    });
    return {
      ...geometry,
      material,
      fullStacks,
      leftovers,
      slots,
      shulkerBoxes: Math.ceil(slots / 27),
      ingredients,
      warnings: material.warning ? [material.warning] : []
    };
  }

  function checklistText(plan) {
    return plan.ingredients.map((ingredient) => `${ingredient.total.toLocaleString()} ${ingredient.name}`).join("\n");
  }

  function setupBuildEstimator(document) {
    const form = document.querySelector("#buildEstimatorForm");
    if (!form) return;
    const type = document.querySelector("#buildType");
    const length = document.querySelector("#buildLength");
    const width = document.querySelector("#buildWidth");
    const height = document.querySelector("#buildHeight");
    const thickness = document.querySelector("#buildThickness");
    const floor = document.querySelector("#buildFloor");
    const ceiling = document.querySelector("#buildCeiling");
    const doors = document.querySelector("#buildDoors");
    const windows = document.querySelector("#buildWindows");
    const quantity = document.querySelector("#buildQuantity");
    const material = document.querySelector("#buildMaterial");
    const status = document.querySelector("#buildEstimatorStatus");
    const total = document.querySelector("#buildTotal");
    const stacks = document.querySelector("#buildStacks");
    const slots = document.querySelector("#buildSlots");
    const boxes = document.querySelector("#buildBoxes");
    const breakdown = document.querySelector("#buildBreakdown");
    const checklist = document.querySelector("#buildChecklist");
    const warnings = document.querySelector("#buildWarnings");
    const copy = document.querySelector("#buildCopy");
    const reset = document.querySelector("#buildReset");
    const fallback = document.querySelector("#buildCopyFallback");
    const copyText = document.querySelector("#buildCopyText");
    let currentPlan = null;

    function readNumber(element) { return Number(element.value.trim()); }
    function showPlan(event) {
      if (event) event.preventDefault();
      try {
        currentPlan = calculateMaterialPlan({
          type: type.value, length: readNumber(length), width: readNumber(width), height: readNumber(height), thickness: readNumber(thickness),
          floor: floor.checked, ceiling: ceiling.checked, doors: readNumber(doors), windows: readNumber(windows), quantity: readNumber(quantity), material: material.value
        });
      } catch (error) {
        const field = [length, width, height, thickness, doors, windows, quantity].find((element) => !Number.isSafeInteger(readNumber(element)) || readNumber(element) < (element === doors || element === windows ? 0 : 1));
        if (field) { field.setCustomValidity(error.message); field.reportValidity(); field.setCustomValidity(""); }
        status.textContent = error.message;
        return;
      }
      const plan = currentPlan;
      total.textContent = plan.totalBlocks.toLocaleString();
      stacks.textContent = plan.fullStacks.toLocaleString();
      slots.textContent = plan.slots.toLocaleString();
      boxes.textContent = plan.shulkerBoxes.toLocaleString();
      status.textContent = `${plan.totalBlocks.toLocaleString()} ${plan.material.name} needed for ${plan.quantity.toLocaleString()} structure${plan.quantity === 1 ? "" : "s"}.`;
      breakdown.replaceChildren();
      [
        `Walls: ${plan.walls.toLocaleString()} blocks`,
        `Interior floor: ${plan.floorBlocks.toLocaleString()} blocks`,
        `Interior ceiling / flat roof: ${plan.ceilingBlocks.toLocaleString()} blocks`,
        `Openings removed: ${plan.openings.toLocaleString()} blocks`
      ].forEach((line) => { const item = document.createElement("li"); item.textContent = line; breakdown.append(item); });
      checklist.replaceChildren();
      plan.ingredients.forEach((ingredient) => { const item = document.createElement("li"); item.textContent = `${ingredient.total.toLocaleString()} ${ingredient.name}`; checklist.append(item); });
      warnings.replaceChildren();
      const notes = ["Outer dimensions are used. Room/house floors and ceilings fill only the hollow interior; doors are 1×2 and windows are 1×1, removed from walls only. A house uses a flat ceiling as its roof when selected; decorative/sloped roofs are not estimated.", ...plan.warnings];
      notes.forEach((note) => { const item = document.createElement("p"); item.textContent = note; warnings.append(item); });
      warnings.hidden = false;
      fallback.hidden = true;
      copyText.value = "";
      if (event?.isTrusted) window.BlockWiseMotion?.pulseResult(document.querySelector(".build-estimator-card .planner-results"));
    }

    form.addEventListener("submit", showPlan);
    [length, width, height, thickness, doors, windows, quantity].forEach((element) => element.addEventListener("input", () => element.setCustomValidity("")));
    reset.addEventListener("click", () => { form.reset(); currentPlan = null; status.textContent = "Set your dimensions, then calculate a material list."; [total, stacks, slots, boxes].forEach((output) => { output.textContent = "—"; }); breakdown.replaceChildren(); checklist.replaceChildren(); warnings.hidden = true; fallback.hidden = true; copyText.value = ""; });
    copy.addEventListener("click", async () => {
      if (!currentPlan) { status.textContent = "Calculate a material list before copying it."; return; }
      const text = checklistText(currentPlan);
      try { if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(text); status.textContent = "Gathering checklist copied to your clipboard."; }
      catch { copyText.value = text; fallback.hidden = false; copyText.focus(); copyText.select(); status.textContent = "Clipboard access is unavailable. The gathering list is selected below so you can copy it manually."; }
    });
  }

  return { MATERIALS, calculateBuild, calculateMaterialPlan, checklistText, setupBuildEstimator };
});
