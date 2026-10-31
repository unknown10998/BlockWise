const stackForm = document.querySelector("#stackForm");
const quantityInput = document.querySelector("#itemQuantity");
const fullStacksOutput = document.querySelector("#fullStacks");
const leftoverOutput = document.querySelector("#leftoverItems");
const shulkerOutput = document.querySelector("#totalShulker");
const stackResult = document.querySelector("#stackResult");

function motionIsReduced() {
  return document.documentElement.classList.contains("reduce-motion") || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function pulseResult(element) {
  if (!element || motionIsReduced()) return;
  element.classList.remove("result-updated");
  requestAnimationFrame(() => element.classList.add("result-updated"));
  window.setTimeout(() => element.classList.remove("result-updated"), 300);
}

// Small shared hook for independent calculator modules. It never delays results.
window.BlockWiseMotion = { isReduced: motionIsReduced, pulseResult };

// Kept in a dedicated module so geometry and material calculations can be reused
// by future tools without coupling them to this page's DOM handlers.
window.BlockWiseBuildEstimator?.setupBuildEstimator(document);

function calculateStacks(quantity) {
  const stackSize = 64;
  const itemsPerShulker = stackSize * 27;
  return {
    fullStacks: Math.floor(quantity / stackSize),
    leftovers: quantity % stackSize,
    shulkers: Math.ceil(quantity / itemsPerShulker)
  };
}

function updateStackResult(event) {
  event.preventDefault();
  const rawValue = quantityInput.value.trim();
  const quantity = Number(rawValue);

  if (rawValue === "" || !Number.isSafeInteger(quantity) || quantity < 0 || quantity > 1_000_000_000) {
    quantityInput.setCustomValidity("Enter a whole number from 0 to 1,000,000,000.");
    quantityInput.reportValidity();
    quantityInput.setCustomValidity("");
    return;
  }

  const result = calculateStacks(quantity);
  fullStacksOutput.textContent = result.fullStacks.toLocaleString();
  leftoverOutput.textContent = result.leftovers.toLocaleString();
  shulkerOutput.textContent = result.shulkers.toLocaleString();
  stackResult.setAttribute("aria-label", `${result.fullStacks} full stacks, ${result.leftovers} leftover items, estimated ${result.shulkers} shulker boxes`);
  if (event.isTrusted) pulseResult(stackResult);
}

if (stackForm) {
  stackForm.addEventListener("submit", updateStackResult);
  quantityInput.addEventListener("input", () => quantityInput.setCustomValidity(""));
}

const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");
const navBackdrop = document.createElement("button");
const navCloseMs = 240;
let navCloseTimer = 0;
navBackdrop.className = "nav-backdrop";
navBackdrop.type = "button";
navBackdrop.hidden = true;
navBackdrop.setAttribute("aria-label", "Close navigation");
siteNav.before(navBackdrop);

function setNavigationTrigger(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
}

function openNavigation() {
  window.clearTimeout(navCloseTimer);
  navBackdrop.hidden = false;
  navBackdrop.classList.remove("is-closing");
  siteNav.classList.remove("is-closing");
  siteNav.classList.add("open");
  navBackdrop.classList.add("open");
  setNavigationTrigger(true);
}

function closeNavigation({ restoreFocus = false, immediate = false } = {}) {
  if (!siteNav.classList.contains("open") && !siteNav.classList.contains("is-closing")) return;
  window.clearTimeout(navCloseTimer);
  siteNav.classList.remove("open");
  navBackdrop.classList.remove("open");
  setNavigationTrigger(false);

  const finish = () => {
    siteNav.classList.remove("is-closing");
    navBackdrop.classList.remove("is-closing");
    navBackdrop.hidden = true;
    if (restoreFocus) menuToggle.focus();
  };

  if (immediate || motionIsReduced()) {
    finish();
    return;
  }
  siteNav.classList.add("is-closing");
  navBackdrop.classList.add("is-closing");
  navCloseTimer = window.setTimeout(finish, navCloseMs);
}

menuToggle.addEventListener("click", () => {
  if (siteNav.classList.contains("open")) closeNavigation();
  else openNavigation();
});
navBackdrop.addEventListener("click", () => closeNavigation({ restoreFocus: true }));

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeNavigation({ immediate: true }));
});

// Shared, versioned local preferences. Kept dependency-free for static hosting.
(() => {
  const key = "blockwise.preferences.v1";
  const defaults = { theme: "system", text: "normal", density: "comfortable", contrast: false, motion: "system" };
  const allowed = { theme: ["system", "light", "dark"], text: ["small", "normal", "large", "xlarge"], density: ["compact", "comfortable"], motion: ["system", "reduce"] };
  let prefs = { ...defaults };
  try { prefs = { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch (_) {}
  Object.keys(allowed).forEach(name => { if (!allowed[name].includes(prefs[name])) prefs[name] = defaults[name]; });
  prefs.contrast = Boolean(prefs.contrast);
  let themeTimer = 0;
  const apply = (animateTheme = false) => {
    const root = document.documentElement;
    const shouldAnimateTheme = animateTheme && !motionIsReduced();
    if (shouldAnimateTheme) {
      root.classList.add("theme-transitioning");
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(() => root.classList.remove("theme-transitioning"), 260);
    }
    root.dataset.theme = prefs.theme;
    root.dataset.text = prefs.text;
    root.dataset.density = prefs.density;
    root.classList.toggle("high-contrast", prefs.contrast);
    root.classList.toggle("reduce-motion", prefs.motion === "reduce");
    try { localStorage.setItem(key, JSON.stringify(prefs)); } catch (_) {}
  };
  apply();
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => { if (prefs.theme === "system") apply(true); });
  const header = document.querySelector(".nav-wrap");
  if (!header) return;
  const trigger = document.createElement("button");
  trigger.className = "settings-trigger"; trigger.type = "button"; trigger.setAttribute("aria-haspopup", "dialog"); trigger.setAttribute("aria-label", "Settings"); trigger.innerHTML = "<span aria-hidden=\"true\">⚙</span><span>Settings</span>";
  header.append(trigger);
  const dialog = document.createElement("dialog"); dialog.className = "settings-dialog"; dialog.setAttribute("aria-labelledby", "settingsTitle");
  dialog.innerHTML = `<form><div class="settings-head"><h2 id="settingsTitle">Settings</h2><button type="button" data-close aria-label="Close settings">×</button></div><p>Preferences stay on this device.</p><label>Theme <select name="theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Text size <select name="text"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label><label>Layout density <select name="density"><option value="compact">Compact</option><option value="comfortable">Comfortable</option></select></label><label class="settings-check"><input name="contrast" type="checkbox"> High contrast</label><label>Motion <select name="motion"><option value="system">Use system preference</option><option value="reduce">Reduce motion</option></select></label><div class="settings-actions"><button type="button" class="button button-quiet" data-reset>Reset defaults</button><button class="button button-primary" type="submit">Done</button></div></form>`;
  document.body.append(dialog);
  const form = dialog.querySelector("form");
  const sync = () => { ["theme", "text", "density", "motion"].forEach(n => form.elements[n].value = prefs[n]); form.elements.contrast.checked = prefs.contrast; };
  let dialogCloseTimer = 0;
  const closeDialog = () => {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    const finish = () => { dialog.classList.remove("is-closing"); dialog.close(); trigger.focus(); };
    if (motionIsReduced()) { finish(); return; }
    dialog.classList.add("is-closing");
    dialogCloseTimer = window.setTimeout(finish, 200);
  };
  trigger.addEventListener("click", () => { window.clearTimeout(dialogCloseTimer); dialog.classList.remove("is-closing"); sync(); dialog.showModal(); });
  const savePreferences = () => { ["theme", "text", "density", "motion"].forEach(n => prefs[n] = form.elements[n].value); prefs.contrast = form.elements.contrast.checked; apply(true); };
  form.addEventListener("input", savePreferences);
  form.addEventListener("change", savePreferences);
  form.addEventListener("submit", event => { event.preventDefault(); closeDialog(); });
  form.querySelector("[data-close]").addEventListener("click", closeDialog);
  form.querySelector("[data-reset]").addEventListener("click", () => { prefs = { ...defaults }; sync(); apply(true); });
  dialog.addEventListener("cancel", event => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && siteNav.classList.contains("open")) closeNavigation({ restoreFocus: true }); });
})();

const guideSearch = document.querySelector("#guideSearch");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const guideCards = [...document.querySelectorAll(".guide-card")];
const noGuides = document.querySelector("#noGuides");
let activeFilter = "all";

function filterGuides() {
  const query = guideSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  guideCards.forEach((card) => {
    const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesSearch = searchableText.includes(query);
    const visible = matchesCategory && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  noGuides.hidden = visibleCount !== 0;
}

guideSearch?.addEventListener("input", filterGuides);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle("active", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    filterGuides();
  });
});

const guideDetails = {
  storage: {
    category: "PLANNING / STARTER GUIDE",
    title: "Organize your storage before it gets messy",
    bullets: [
      "Start with broad categories: building blocks, natural blocks, ores and valuables, mob drops, food, tools, and miscellaneous items.",
      "Put the categories you use most often closest to your crafting area or main entrance.",
      "Use signs, item frames, or another label system so you can identify a chest without opening every one.",
      "Keep a small temporary chest near your entrance for items you have not sorted yet, and empty it regularly."
    ]
  },
  mining: {
    category: "SURVIVAL / STARTER GUIDE",
    title: "Prepare for a longer mining trip",
    bullets: [
      "Bring a suitable pickaxe, a backup tool if available, food, torches, and enough empty inventory space.",
      "Carry blocks you can place to cross gaps or mark a route back. A consistent marker system is easier to follow than random turns.",
      "Store valuable finds safely when practical, and avoid carrying every spare item you own.",
      "Check the mechanics for your Minecraft edition and version before relying on a specific ore level or farming method."
    ]
  },
  building: {
    category: "BUILDING / STARTER GUIDE",
    title: "Plan a build before placing blocks",
    bullets: [
      "Sketch the footprint and decide the width, length, and height before gathering materials.",
      "Build a small sample wall or corner to check that your block palette works together.",
      "Estimate major materials separately, then add a buffer for mistakes and decorative details.",
      "Build in stages—foundation, frame, walls, roof, and details—so progress is easy to track."
    ]
  }
};

const starterDetails = document.querySelector("#starterDetails");
const detailCategory = document.querySelector("#detailCategory");
const detailTitle = document.querySelector("#detailTitle");
const detailContent = document.querySelector("#detailContent");

document.querySelectorAll("[data-guide-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const guide = guideDetails[link.dataset.guideLink];
    if (!guide) return;

    detailCategory.textContent = guide.category;
    detailTitle.textContent = guide.title;
    const list = document.createElement("ul");
    guide.bullets.forEach((bullet) => {
      const item = document.createElement("li");
      item.textContent = bullet;
      list.append(item);
    });
    detailContent.replaceChildren(list);
    starterDetails.hidden = false;
    pulseResult(starterDetails);
    starterDetails.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

document.querySelector("#closeDetails")?.addEventListener("click", () => {
  starterDetails.hidden = true;
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();

// Calculate the default value on page load, rather than relying only on sample HTML.
if (stackForm) updateStackResult(new Event("submit", { cancelable: true }));


// Enchantment optimizer: Java-style prior-work penalty and exhaustive subset search.
const enchantments = {
  sharpness: { name: "Sharpness", max: 5, weight: 1, items: ["sword", "axe"] },
  smite: { name: "Smite", max: 5, weight: 1, items: ["sword", "axe", "mace"] },
  bane: { name: "Bane of Arthropods", max: 5, weight: 1, items: ["sword", "axe", "mace"] },
  knockback: { name: "Knockback", max: 2, weight: 1, items: ["sword"] },
  fireAspect: { name: "Fire Aspect", max: 2, weight: 2, items: ["sword"] },
  looting: { name: "Looting", max: 3, weight: 2, items: ["sword"] },
  sweeping: { name: "Sweeping Edge", max: 3, weight: 2, items: ["sword"] },
  efficiency: { name: "Efficiency", max: 5, weight: 1, items: ["pickaxe", "axe", "shovel", "hoe"] },
  fortune: { name: "Fortune", max: 3, weight: 2, items: ["pickaxe", "axe", "shovel", "hoe"] },
  silkTouch: { name: "Silk Touch", max: 1, weight: 4, items: ["pickaxe", "axe", "shovel", "hoe"] },
  unbreaking: { name: "Unbreaking", max: 3, weight: 1, items: ["sword", "pickaxe", "axe", "shovel", "hoe", "helmet", "chestplate", "leggings", "boots", "bow", "crossbow", "trident", "mace", "elytra"] },
  mending: { name: "Mending", max: 1, weight: 2, items: ["sword", "pickaxe", "axe", "shovel", "hoe", "helmet", "chestplate", "leggings", "boots", "bow", "crossbow", "trident", "mace", "elytra"] },
  protection: { name: "Protection", max: 4, weight: 1, items: ["helmet", "chestplate", "leggings", "boots"] },
  blastProtection: { name: "Blast Protection", max: 4, weight: 2, items: ["helmet", "chestplate", "leggings", "boots"] },
  fireProtection: { name: "Fire Protection", max: 4, weight: 1, items: ["helmet", "chestplate", "leggings", "boots"] },
  projectileProtection: { name: "Projectile Protection", max: 4, weight: 1, items: ["helmet", "chestplate", "leggings", "boots"] },
  featherFalling: { name: "Feather Falling", max: 4, weight: 1, items: ["boots"] },
  respiration: { name: "Respiration", max: 3, weight: 2, items: ["helmet"] },
  aquaAffinity: { name: "Aqua Affinity", max: 1, weight: 2, items: ["helmet"] },
  thorns: { name: "Thorns", max: 3, weight: 4, items: ["helmet", "chestplate", "leggings", "boots"] },
  depthStrider: { name: "Depth Strider", max: 3, weight: 2, items: ["boots"] },
  frostWalker: { name: "Frost Walker", max: 2, weight: 2, items: ["boots"] },
  soulSpeed: { name: "Soul Speed", max: 3, weight: 4, items: ["boots"] },
  swiftSneak: { name: "Swift Sneak", max: 3, weight: 4, items: ["leggings"] },
  power: { name: "Power", max: 5, weight: 1, items: ["bow"] },
  punch: { name: "Punch", max: 2, weight: 2, items: ["bow"] },
  flame: { name: "Flame", max: 1, weight: 2, items: ["bow"] },
  infinity: { name: "Infinity", max: 1, weight: 4, items: ["bow"] },
  multishot: { name: "Multishot", max: 1, weight: 2, items: ["crossbow"] },
  piercing: { name: "Piercing", max: 4, weight: 1, items: ["crossbow"] },
  quickCharge: { name: "Quick Charge", max: 3, weight: 1, items: ["crossbow"] },
  loyalty: { name: "Loyalty", max: 3, weight: 1, items: ["trident"] },
  riptide: { name: "Riptide", max: 3, weight: 2, items: ["trident"] },
  channeling: { name: "Channeling", max: 1, weight: 4, items: ["trident"] },
  impaling: { name: "Impaling", max: 5, weight: 2, items: ["trident"] },
  density: { name: "Density", max: 5, weight: 1, items: ["mace"] },
  breach: { name: "Breach", max: 4, weight: 2, items: ["mace"] },
  windBurst: { name: "Wind Burst", max: 3, weight: 2, items: ["mace"] },
  swiftSneakDummy: { name: "Curse of Binding", max: 1, weight: 4, items: ["helmet", "chestplate", "leggings", "boots"] }
};

const itemNames = {
  sword: "Sword", pickaxe: "Pickaxe", axe: "Axe", shovel: "Shovel", hoe: "Hoe",
  helmet: "Helmet", chestplate: "Chestplate", leggings: "Leggings", boots: "Boots",
  bow: "Bow", crossbow: "Crossbow", trident: "Trident", mace: "Mace", elytra: "Elytra", book: "Book"
};
const enchantRows = document.querySelector("#enchantBookRows");
const addBookButton = document.querySelector("#addEnchantBook");
const enchantForm = document.querySelector("#enchantForm");
const targetItemSelect = document.querySelector("#targetItem");
const itemPriorWorkInput = document.querySelector("#itemPriorWork");
const bookCountDisplay = document.querySelector("#bookCount");
const enchantError = document.querySelector("#enchantError");
const planHeadline = document.querySelector("#planHeadline");
const planSummary = document.querySelector("#planSummary");
const planTotal = document.querySelector("#planTotal");
const planWorst = document.querySelector("#planWorst");
const planSavings = document.querySelector("#planSavings");
const planSteps = document.querySelector("#planSteps");
const planStepCount = document.querySelector("#planStepCount");
const MAX_BOOKS = 8;

function createBookRow(enchantKey = "sharpness", level = null) {
  const row = document.createElement("div");
  row.className = "enchant-book-row";
  const enchantSelect = document.createElement("select");
  enchantSelect.setAttribute("aria-label", "Book enchantment");
  Object.entries(enchantments).sort(([, left], [, right]) => left.name.localeCompare(right.name, "en")).forEach(([key, data]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = data.name;
    option.selected = key === enchantKey;
    enchantSelect.append(option);
  });
  const levelSelect = document.createElement("select");
  levelSelect.setAttribute("aria-label", "Enchantment level");
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-book";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", "Remove this enchanted book");

  function fillLevels(preferredLevel = null) {
    const selected = enchantments[enchantSelect.value];
    levelSelect.replaceChildren();
    for (let i = 1; i <= selected.max; i += 1) {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = `Lvl ${i}`;
      levelSelect.append(option);
    }
    levelSelect.value = String(Math.min(preferredLevel || selected.max, selected.max));
  }

  fillLevels(level);
  enchantSelect.addEventListener("change", () => {
    fillLevels();
    updateBookCount();
  });
  levelSelect.addEventListener("change", updateBookCount);
  removeButton.addEventListener("click", () => {
    row.remove();
    updateBookCount();
  });
  row.append(enchantSelect, levelSelect, removeButton);
  row.dataset.bookRow = "true";
  return row;
}

function updateBookCount() {
  const count = enchantRows.querySelectorAll(".enchant-book-row").length;
  bookCountDisplay.textContent = `${count} / ${MAX_BOOKS}`;
  addBookButton.disabled = count >= MAX_BOOKS;
  addBookButton.setAttribute("aria-disabled", String(count >= MAX_BOOKS));
}

function selectedBooks() {
  return [...enchantRows.querySelectorAll(".enchant-book-row")].map((row) => {
    const selects = row.querySelectorAll("select");
    const key = selects[0].value;
    const level = Number(selects[1].value);
    return { key, level, name: `${enchantments[key].name} ${level}`, weight: enchantments[key].weight * level };
  });
}

function penalty(uses) {
  return (2 ** uses) - 1;
}

function conflictMessage(books, target) {
  const byKey = new Set(books.map(book => book.key));
  const groups = [
    { keys: ["sharpness", "smite", "bane"], name: "Sharpness, Smite, and Bane of Arthropods conflict with each other." },
    { keys: ["protection", "blastProtection", "fireProtection", "projectileProtection"], name: "The four Protection enchantments conflict with each other." },
    { keys: ["fortune", "silkTouch"], name: "Fortune and Silk Touch conflict with each other." },
    { keys: ["depthStrider", "frostWalker"], name: "Depth Strider and Frost Walker conflict with each other." },
    { keys: ["infinity", "mending"], name: "Infinity and Mending conflict with each other." },
    { keys: ["multishot", "piercing"], name: "Multishot and Piercing conflict with each other." },
    { keys: ["loyalty", "riptide"], name: "Loyalty and Riptide conflict with each other." },
    { keys: ["riptide", "channeling"], name: "Riptide and Channeling conflict with each other." }
  ];
  for (const group of groups) {
    const found = group.keys.filter(key => byKey.has(key));
    if (found.length > 1) return group.name;
  }
  if (["density", "breach", "smite", "bane"].filter(key => byKey.has(key)).length > 1) {
    return "Density and Breach conflict with each other and with Smite or Bane of Arthropods on a mace.";
  }
  if (target === "book") return "";
  const unsupported = books.find(book => !enchantments[book.key].items.includes(target));
  if (unsupported) return `${enchantments[unsupported.key].name} cannot be applied to a ${itemNames[target].toLowerCase()} in this calculator.`;
  return "";
}

// Exhaustively finds the minimum total level cost for up to 8 books under the modeled anvil rules.
// A state is the subset of books, the resulting prior-work count, total cost, and merge steps.
function createBookTreeSolver(books) {
  const n = books.length;
  const valueCache = new Map();
  function bookValue(mask) {
    if (!valueCache.has(mask)) {
      let sum = 0;
      for (let i = 0; i < n; i += 1) if (mask & (1 << i)) sum += books[i].weight;
      valueCache.set(mask, sum);
    }
    return valueCache.get(mask);
  }
  const memo = new Map();

  function solve(mask) {
    if (memo.has(mask)) return memo.get(mask);
    if ((mask & (mask - 1)) === 0) {
      const idx = Math.log2(mask);
      const leaf = [{ mask, uses: 0, cost: 0, steps: [], label: books[idx].name, value: books[idx].weight }];
      memo.set(mask, leaf);
      return leaf;
    }

    const bestByUses = new Map();
    // Fix the lowest set bit in left side to avoid duplicate unordered partitions,
    // then test both left/right orientations because anvil cost is directional.
    const firstBit = mask & -mask;
    for (let leftMask = (mask - 1) & mask; leftMask; leftMask = (leftMask - 1) & mask) {
      if (!(leftMask & firstBit)) continue;
      const rightMask = mask ^ leftMask;
      if (!rightMask) continue;
      const leftStates = solve(leftMask);
      const rightStates = solve(rightMask);
      for (const [aStates, bStates] of [[leftStates, rightStates], [rightStates, leftStates]]) {
        for (const a of aStates) for (const b of bStates) {
          const uses = Math.max(a.uses, b.uses) + 1;
          const stepCost = penalty(a.uses) + penalty(b.uses) + b.value;
          if (stepCost >= 40) continue;
          const cost = a.cost + b.cost + stepCost;
          const step = {
            type: "book",
            title: `Combine ${a.label} + ${b.label}`,
            detail: `Book-to-book merge · prior-work penalties ${penalty(a.uses)} + ${penalty(b.uses)}`,
            cost: stepCost,
            mask,
            uses,
            value: a.value + b.value
          };
          const candidate = {
            mask, uses, cost, value: a.value + b.value,
            label: `book [${books.filter((_, i) => mask & (1 << i)).map(book => book.name).join(" + ")}]`,
            steps: [...a.steps, ...b.steps, step]
          };
          const existing = bestByUses.get(uses);
          if (!existing || candidate.cost < existing.cost) bestByUses.set(uses, candidate);
        }
      }
    }
    const result = [...bestByUses.values()];
    memo.set(mask, result);
    return result;
  }

  return solve;
}

function optimizeBookTree(books) {
  return books.length ? createBookTreeSolver(books)((1 << books.length) - 1) : [];
}

// For each subset already applied to the item, retain the cheapest plan for
// each resulting work count. Every remaining subset can be merged as a book
// tree and applied next, covering all legal sequences of modeled operations.
function optimizeItemPlan(books, itemUses, targetName) {
  const fullMask = (1 << books.length) - 1;
  const solveBook = createBookTreeSolver(books);
  const states = Array.from({ length: fullMask + 1 }, () => new Map());
  states[0].set(itemUses, { total: 0, uses: itemUses, steps: [] });
  for (let mask = 0; mask <= fullMask; mask += 1) {
    const remaining = fullMask ^ mask;
    for (const state of states[mask].values()) {
      for (let subset = remaining; subset; subset = (subset - 1) & remaining) {
        for (const tree of solveBook(subset)) {
          const stepCost = penalty(state.uses) + penalty(tree.uses) + tree.value;
          if (stepCost >= 40) continue;
          const uses = Math.max(state.uses, tree.uses) + 1;
          const total = state.total + tree.cost + stepCost;
          const next = mask | subset;
          const existing = states[next].get(uses);
          if (existing && existing.total <= total) continue;
          states[next].set(uses, {
            total, uses,
            steps: [...state.steps, ...tree.steps, {
              type: "item",
              title: `Apply ${tree.label} to ${targetName}`,
              detail: `Item penalty ${penalty(state.uses)} + book penalty ${penalty(tree.uses)}`,
              cost: stepCost
            }]
          });
        }
      }
    }
  }
  return [...states[fullMask].values()].reduce((best, state) => !best || state.total < best.total ? state : best, null);
}

function renderPlanSteps(steps) {
  planSteps.replaceChildren();
  if (!steps.length) {
    const li = document.createElement("li");
    li.className = "empty-step";
    li.textContent = "No anvil operations are needed.";
    planSteps.append(li);
    return;
  }
  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "plan-step";
    const number = document.createElement("span");
    number.className = "plan-step-number";
    number.textContent = String(index + 1);
    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "plan-step-title";
    title.textContent = step.title;
    const detail = document.createElement("p");
    detail.className = "plan-step-detail";
    detail.textContent = step.detail;
    content.append(title, detail);
    const cost = document.createElement("span");
    cost.className = "plan-step-cost";
    cost.textContent = `${step.cost} lvl${step.cost === 1 ? "" : "s"}`;
    li.append(number, content, cost);
    planSteps.append(li);
  });
}

function naiveListedOrderCost(books, itemUses) {
  let total = 0;
  for (const book of books) {
    const cost = penalty(itemUses) + book.weight;
    if (cost >= 40) return Infinity;
    total += cost;
    itemUses += 1;
  }
  return total;
}

function optimizeEnchantments(event) {
  event.preventDefault();
  enchantError.hidden = true;
  const books = selectedBooks();
  const target = targetItemSelect.value;
  const itemUses = Number(itemPriorWorkInput.value);

  if (books.length === 0) {
    enchantError.textContent = "Add at least one enchanted book to calculate a plan.";
    enchantError.hidden = false;
    return;
  }
  if (books.length > MAX_BOOKS) {
    enchantError.textContent = `This version supports up to ${MAX_BOOKS} books at once.`;
    enchantError.hidden = false;
    return;
  }
  if (!Number.isInteger(itemUses) || itemUses < 0 || itemUses > 5) {
    enchantError.textContent = "Enter a prior-work count from 0 to 5.";
    enchantError.hidden = false;
    return;
  }
  const seen = new Set();
  for (const book of books) {
    if (seen.has(book.key)) {
      enchantError.textContent = `You selected ${enchantments[book.key].name} more than once. This first version expects one book per enchantment; duplicate-book upgrades will be added later.`;
      enchantError.hidden = false;
      return;
    }
    seen.add(book.key);
  }
  const conflict = conflictMessage(books, target);
  if (conflict) {
    enchantError.textContent = conflict;
    enchantError.hidden = false;
    return;
  }

  if (target === "book") {
    // Book-only mode: show the cheapest merged book tree without applying it to gear.
    const trees = optimizeBookTree(books);
    if (!trees.length) {
      planHeadline.textContent = "No valid combination found";
      planSummary.textContent = "At least one book merge would cost 40 or more levels, which Survival mode refuses.";
      planTotal.textContent = "—";
      planWorst.textContent = "40+";
      planSavings.textContent = "—";
      planStepCount.textContent = "No valid plan";
      renderPlanSteps([]);
      return;
    }
    const best = trees.reduce((a,b) => a.cost <= b.cost ? a : b);
    const worst = Math.max(0, ...best.steps.map(step => step.cost));
    planHeadline.textContent = "Cheapest book merge found";
    planSummary.textContent = "This plan combines the books together, without applying them to gear.";
    planTotal.textContent = best.cost.toLocaleString();
    planWorst.textContent = worst.toLocaleString();
    planSavings.textContent = "—";
    planStepCount.textContent = `${best.steps.length} steps`;
    renderPlanSteps(best.steps);
    return;
  }

  const bestPlan = optimizeItemPlan(books, itemUses, itemNames[target]);

  const listedCost = naiveListedOrderCost(books, itemUses);
  if (!bestPlan) {
    planHeadline.textContent = "No Survival-legal plan found";
    planSummary.textContent = "Every tested order includes a step costing 40 or more levels. Try a fresh item, fewer enchantments, or combine fewer books at a time.";
    planTotal.textContent = "—";
    planWorst.textContent = "40+";
    planSavings.textContent = "—";
    planStepCount.textContent = "No valid plan";
    renderPlanSteps([]);
    return;
  }

  const worst = Math.max(...bestPlan.steps.map(step => step.cost));
  planHeadline.textContent = "Minimum total level cost found";
  planSummary.textContent = `The lowest total level cost under this calculator’s assumptions, across all legal book merges and applications. Apply ${books.length} books in ${bestPlan.steps.length} operations.`;
  planTotal.textContent = bestPlan.total.toLocaleString();
  planWorst.textContent = worst.toLocaleString();
  planSavings.textContent = Number.isFinite(listedCost) ? Math.max(0, listedCost - bestPlan.total).toLocaleString() : "∞";
  planStepCount.textContent = `${bestPlan.steps.length} steps`;
  renderPlanSteps(bestPlan.steps);
  if (event.isTrusted) pulseResult(document.querySelector("#enchantResults"));
}

// Recipe data stays separate from the calculation code so additional recipes can
// be added without changing the planner's recursive logic. `output` is the
// number made by one craft/smelt operation; raw materials use output: 1.
const plannerRecipes = {
  stone_bricks: { name: "Stone Bricks", stackSize: 64, output: 4, recipe: [{ item: "stone", qty: 1 }] },
  glass: { name: "Glass", stackSize: 64, output: 1, recipe: [{ item: "sand", qty: 1 }], warning: "This estimate assumes one sand smelt produces one glass and does not include fuel." },
  furnace: { name: "Furnace", stackSize: 64, output: 1, recipe: [{ item: "cobblestone", qty: 8 }] },
  bread: { name: "Bread", stackSize: 64, output: 1, recipe: [{ item: "wheat", qty: 3 }] },
  crafting_table: { name: "Crafting Table", stackSize: 64, output: 1, recipe: [{ item: "planks", qty: 4 }] },
  chest: { name: "Chest", stackSize: 64, output: 1, recipe: [{ item: "planks", qty: 8 }] },
  iron_pickaxe: { name: "Iron Pickaxe", stackSize: 1, output: 1, recipe: [{ item: "iron_ingot", qty: 3 }, { item: "stick", qty: 2 }] },
  bucket: { name: "Bucket", stackSize: 16, output: 1, recipe: [{ item: "iron_ingot", qty: 3 }] },
  brick_block: { name: "Brick Block", stackSize: 64, output: 1, recipe: [{ item: "brick", qty: 4 }] },
  stick: { name: "Stick", stackSize: 64, output: 4, recipe: [{ item: "planks", qty: 2 }] },
  planks: { name: "Planks", stackSize: 64, output: 4, recipe: [{ item: "log", qty: 1 }] },
  log: { name: "Log", stackSize: 64, output: 1, recipe: [] },
  stone: { name: "Stone", stackSize: 64, output: 1, recipe: [] },
  cobblestone: { name: "Cobblestone", stackSize: 64, output: 1, recipe: [] },
  sand: { name: "Sand", stackSize: 64, output: 1, recipe: [] },
  wheat: { name: "Wheat", stackSize: 64, output: 1, recipe: [] },
  brick: { name: "Brick", stackSize: 64, output: 1, recipe: [] },
  iron_ingot: { name: "Iron Ingot", stackSize: 64, output: 1, recipe: [] }
};

const plannerForm = document.querySelector("#plannerForm");
const plannerItem = document.querySelector("#plannerItem");
const plannerTargetQty = document.querySelector("#plannerTargetQty");
const plannerEdition = document.querySelector("#plannerEdition");
const plannerStatus = document.querySelector("#plannerStatus");
const plannerWarnings = document.querySelector("#plannerWarnings");
const plannerBreakdown = document.querySelector("#plannerBreakdown");
const plannerChecklist = document.querySelector("#plannerChecklist");
const plannerCopy = document.querySelector("#plannerCopy");
const plannerCopyFallback = document.querySelector("#plannerCopyFallback");
const plannerCopyText = document.querySelector("#plannerCopyText");
const plannerReset = document.querySelector("#plannerReset");
const plannerStackSummary = document.querySelector("#plannerStackSummary");
const plannerSlotSummary = document.querySelector("#plannerSlotSummary");
const plannerBoxSummary = document.querySelector("#plannerBoxSummary");

function getPlannerItemLabel(itemId) {
  return plannerRecipes[itemId]?.name || itemId.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function plannerRecipeBatches(recipe, quantity) {
  return Math.ceil(quantity / (recipe.output || 1));
}

function plannerIngredientTotals(itemId, quantity, selectedEdition, visited = new Set()) {
  const recipe = plannerRecipes[itemId];
  const totals = new Map();
  const warnings = [];

  if (!recipe) {
    totals.set(itemId, quantity);
    warnings.push(`"${getPlannerItemLabel(itemId)}" is not supported yet. This planner currently focuses on a small set of common survival recipes.`);
    return { totals, warnings };
  }

  if (visited.has(itemId)) {
    warnings.push(`The recipe for ${recipe.name} loops back on itself, so the planner stopped expanding it to avoid a recursion loop.`);
    return { totals, warnings };
  }

  if (recipe.warning) warnings.push(`${recipe.name}: ${recipe.warning}`);
  if (recipe.edition && recipe.edition !== "java-bedrock" && recipe.edition !== selectedEdition && selectedEdition !== "java-bedrock") {
    warnings.push(`${recipe.name} is modeled for ${recipe.edition.toUpperCase()} recipes. Your selected edition may need a different recipe or material mix.`);
  }

  if (!recipe.recipe || recipe.recipe.length === 0) {
    totals.set(itemId, quantity);
    return { totals, warnings };
  }

  const nextVisited = new Set(visited);
  nextVisited.add(itemId);
  const batches = plannerRecipeBatches(recipe, quantity);

  recipe.recipe.forEach((ingredient) => {
    const required = ingredient.qty * batches;
    const ingredientRecipe = plannerRecipes[ingredient.item];
    if (!ingredientRecipe) {
      totals.set(ingredient.item, (totals.get(ingredient.item) || 0) + required);
      warnings.push(`"${getPlannerItemLabel(ingredient.item)}" is not modeled as a recipe in this version, so it is treated as a raw ingredient.`);
      return;
    }

    const childResult = plannerIngredientTotals(ingredient.item, required, selectedEdition, nextVisited);
    childResult.totals.forEach((value, childItemId) => {
      totals.set(childItemId, (totals.get(childItemId) || 0) + value);
    });
    childResult.warnings.forEach((warning) => warnings.push(warning));
  });

  return { totals, warnings };
}

function buildPlannerBreakdown(itemId, quantity, selectedEdition, visited = new Set(), depth = 0) {
  const recipe = plannerRecipes[itemId];
  if (!recipe) {
    return [`${"  ".repeat(depth)}${quantity.toLocaleString()} ${getPlannerItemLabel(itemId)}`];
  }

  const key = `${itemId}:${quantity}`;
  if (visited.has(key)) {
    return [];
  }

  const nextVisited = new Set(visited);
  nextVisited.add(key);

  if (!recipe.recipe || recipe.recipe.length === 0) {
    return [`${"  ".repeat(depth)}${quantity.toLocaleString()} ${recipe.name}`];
  }

  const batches = plannerRecipeBatches(recipe, quantity);
  const made = batches * (recipe.output || 1);
  const ingredientList = recipe.recipe.map((ingredient) => `${(ingredient.qty * batches).toLocaleString()} ${getPlannerItemLabel(ingredient.item)}`).join(" + ");
  const batchNote = batches > 1 || made !== quantity ? ` (${batches.toLocaleString()} batches, ${made.toLocaleString()} made)` : "";
  const lines = [`${"  ".repeat(depth)}${quantity.toLocaleString()} ${recipe.name}${batchNote} = ${ingredientList}`];

  recipe.recipe.forEach((ingredient) => {
    const childQty = ingredient.qty * batches;
    const childRecipe = plannerRecipes[ingredient.item];
    if (!childRecipe) {
      lines.push(`${"  ".repeat(depth + 1)}${childQty.toLocaleString()} ${getPlannerItemLabel(ingredient.item)}`);
      return;
    }
    lines.push(...buildPlannerBreakdown(ingredient.item, childQty, selectedEdition, nextVisited, depth + 1));
  });

  return lines;
}

function plannerItemStats(itemId, total) {
  const stackSize = plannerRecipes[itemId]?.stackSize || 64;
  return {
    fullStacks: Math.floor(total / stackSize),
    leftovers: total % stackSize,
    slots: Math.ceil(total / stackSize)
  };
}

function renderPlannerChecklist(items) {
  plannerChecklist.replaceChildren();
  plannerChecklist.dataset.hasItems = String(items.length > 0);
  if (!items.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No resources to gather yet.";
    plannerChecklist.append(emptyItem);
    return;
  }

  items.forEach(([itemId, total]) => {
    const stats = plannerItemStats(itemId, total);
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `planner-item-${itemId}`;
    checkbox.setAttribute("aria-label", `Check off ${getPlannerItemLabel(itemId)}`);
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    const stackText = stats.leftovers ? `${stats.fullStacks.toLocaleString()} full stacks + ${stats.leftovers.toLocaleString()} leftover` : `${stats.fullStacks.toLocaleString()} full stacks`;
    label.textContent = `${total.toLocaleString()} ${getPlannerItemLabel(itemId)} — ${stackText}; ${stats.slots.toLocaleString()} storage slot${stats.slots === 1 ? "" : "s"}`;
    checkbox.addEventListener("change", () => {
      label.classList.toggle("completed", checkbox.checked);
    });
    item.append(checkbox, label);
    plannerChecklist.append(item);
  });
}

function getPlannerChecklistText() {
  return [...plannerChecklist.querySelectorAll("label")]
    .map((label) => label.textContent.trim())
    .filter(Boolean)
    .join("\n");
}

function hidePlannerCopyFallback() {
  plannerCopyFallback.hidden = true;
  plannerCopyText.value = "";
}

function updatePlannerResult(event) {
  if (event) event.preventDefault();

  const rawTarget = plannerTargetQty.value.trim();
  const quantity = Number(rawTarget);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
    plannerTargetQty.setCustomValidity("Choose a whole number from 1 to 100,000.");
    plannerTargetQty.reportValidity();
    plannerTargetQty.setCustomValidity("");
    return;
  }

  const itemId = plannerItem.value;
  const selectedEdition = plannerEdition.value;
  const targetRecipe = plannerRecipes[itemId];
  const result = plannerIngredientTotals(itemId, quantity, selectedEdition);
  const totals = [...result.totals.entries()].sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    return left[0].localeCompare(right[0]);
  });
  const stackInfo = totals.reduce((summary, [resourceId, value]) => {
    const stats = plannerItemStats(resourceId, value);
    summary.fullStacks += stats.fullStacks;
    summary.leftovers += stats.leftovers;
    summary.storageSlots += stats.slots;
    return summary;
  }, { fullStacks: 0, leftovers: 0, storageSlots: 0 });
  stackInfo.shulkerBoxes = Math.ceil(stackInfo.storageSlots / 27);

  plannerStatus.textContent = `${quantity.toLocaleString()} ${targetRecipe ? targetRecipe.name : getPlannerItemLabel(itemId)} needs ${stackInfo.storageSlots.toLocaleString()} storage slot${stackInfo.storageSlots === 1 ? "" : "s"}: ${stackInfo.fullStacks.toLocaleString()} full stacks and ${stackInfo.leftovers.toLocaleString()} loose items.`;
  plannerStackSummary.textContent = stackInfo.fullStacks.toLocaleString();
  plannerSlotSummary.textContent = stackInfo.storageSlots.toLocaleString();
  plannerBoxSummary.textContent = stackInfo.shulkerBoxes.toLocaleString();

  plannerWarnings.replaceChildren();
  const warnings = [...new Set(result.warnings.filter(Boolean))];
  if (warnings.length) {
    plannerWarnings.hidden = false;
    warnings.forEach((warning) => {
      const line = document.createElement("div");
      line.textContent = warning;
      plannerWarnings.append(line);
    });
  } else {
    plannerWarnings.hidden = true;
  }

  const breakdownLines = buildPlannerBreakdown(itemId, quantity, selectedEdition);
  plannerBreakdown.replaceChildren();
  if (!breakdownLines.length) {
    const emptyLine = document.createElement("li");
    emptyLine.textContent = "No recipe details are available for this item.";
    plannerBreakdown.append(emptyLine);
  } else {
    breakdownLines.slice(0, 10).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      plannerBreakdown.append(item);
    });
    if (breakdownLines.length > 10) {
      const item = document.createElement("li");
      item.textContent = "…";
      plannerBreakdown.append(item);
    }
  }

  renderPlannerChecklist(totals);
  hidePlannerCopyFallback();
  if (event?.isTrusted) pulseResult(document.querySelector("#plannerResults"));
}

if (plannerForm) {
plannerForm.addEventListener("submit", updatePlannerResult);
plannerReset.addEventListener("click", () => {
  plannerForm.reset();
  plannerItem.value = "stone_bricks";
  plannerTargetQty.value = "1";
  plannerEdition.value = "java-bedrock";
  plannerStatus.textContent = "Choose a target and build a checklist.";
  plannerWarnings.replaceChildren();
  plannerWarnings.hidden = true;
  plannerBreakdown.replaceChildren();
  const emptyLine = document.createElement("li");
  emptyLine.textContent = "Your recipe breakdown will appear here.";
  plannerBreakdown.append(emptyLine);
  plannerChecklist.replaceChildren();
  plannerChecklist.dataset.hasItems = "false";
  const emptyChecklist = document.createElement("li");
  emptyChecklist.textContent = "No checklist items yet.";
  plannerChecklist.append(emptyChecklist);
  plannerStackSummary.textContent = "—";
  plannerSlotSummary.textContent = "—";
  plannerBoxSummary.textContent = "—";
  hidePlannerCopyFallback();
});

plannerCopy.addEventListener("click", async () => {
  const text = getPlannerChecklistText();
  if (!text) {
    plannerStatus.textContent = "Nothing to copy yet. Build a resource list first.";
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      plannerStatus.textContent = "Checklist copied to your clipboard.";
      hidePlannerCopyFallback();
      return;
    }
    throw new Error("Clipboard API unavailable");
  } catch (error) {
    plannerCopyText.value = text;
    plannerCopyFallback.hidden = false;
    plannerCopyText.focus();
    plannerCopyText.select();
    plannerStatus.textContent = "Clipboard access is unavailable. The checklist text is selected below so you can copy it manually.";
  }
});

plannerItem.addEventListener("change", updatePlannerResult);
plannerEdition.addEventListener("change", updatePlannerResult);
plannerTargetQty.addEventListener("input", () => plannerTargetQty.setCustomValidity(""));
}

if (enchantForm) {
addBookButton.addEventListener("click", () => {
  const count = enchantRows.querySelectorAll(".enchant-book-row").length;
  if (count >= MAX_BOOKS) return;
  enchantRows.append(createBookRow("mending", 1));
  updateBookCount();
});
enchantForm.addEventListener("submit", optimizeEnchantments);

// Start with a sample sword setup that visitors can edit.
[
  ["sharpness", 5],
  ["looting", 3],
  ["unbreaking", 3],
  ["mending", 1]
].forEach(([key, level]) => enchantRows.append(createBookRow(key, level)));
updateBookCount();
optimizeEnchantments(new Event("submit", { cancelable: true }));
}
if (plannerForm) updatePlannerResult(new Event("submit", { cancelable: true }));
