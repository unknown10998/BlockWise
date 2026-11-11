(() => {
  const recipes = Array.isArray(window.BLOCKWISE_RECIPES) ? window.BLOCKWISE_RECIPES : [];
  const search = document.querySelector('#recipeSearch');
  const station = document.querySelector('#recipeStation');
  const typeFilter = document.querySelector('#recipeType');
  const list = document.querySelector('#recipeList');
  const detail = document.querySelector('#recipeDetail');
  const count = document.querySelector('#recipeCount');
  const prev = document.querySelector('#recipePrev');
  const next = document.querySelector('#recipeNext');
  const pageLabel = document.querySelector('#recipePage');
  const names = window.BLOCKWISE_ITEM_NAMES || {};
  const pageSize = 30;
  let page = 0;
  let selectedId = '';
  const fallbackName = id => id.replace(/^minecraft:/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const name = id => names[id] || fallbackName(id);
  const stationName = type => type.startsWith('crafting_') ? 'crafting' : type.startsWith('smithing_') ? 'smithing' : type;
  const stationLabels = { crafting: 'Crafting', smelting: 'Furnace', blasting: 'Blast furnace', smoking: 'Smoker', campfire_cooking: 'Campfire', stonecutting: 'Stonecutter', smithing: 'Smithing table' };
  const specialLabels = {
    crafting_special_armordye: 'Armor dyeing', crafting_special_bannerduplicate: 'Banner duplication',
    crafting_special_bookcloning: 'Book cloning', crafting_decorated_pot: 'Decorated pot',
    crafting_special_firework_rocket: 'Firework rocket', crafting_special_firework_star: 'Firework star',
    crafting_special_firework_star_fade: 'Firework star fade', crafting_special_mapcloning: 'Map cloning',
    crafting_special_mapextending: 'Map extending', crafting_special_repairitem: 'Item repair',
    crafting_special_shielddecoration: 'Shield decoration', crafting_special_tippedarrow: 'Tipped arrow'
  };
  const el = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };
  function icon(id) {
    const itemName = name(id);
    const element = el('span', 'recipe-icon', itemName.trim().charAt(0).toLocaleUpperCase());
    element.setAttribute('data-item-id', id);
    element.setAttribute('aria-hidden', 'true');
    return element;
  }
  function itemNames(options) { return options.map(name).join(' or '); }
  function itemButton(options, className) {
    const itemName = itemNames(options);
    const button = el('button', `${className} recipe-item-button`);
    button.type = 'button';
    button.setAttribute('aria-label', itemName);
    button.append(icon(options[0]));
    return button;
  }
  function motionIsReduced() {
    return document.documentElement.classList.contains('reduce-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }
  function closeRecipeModal(modal) {
    if (!modal.open || modal.classList.contains('is-closing')) return;
    const finish = () => modal.close();
    if (motionIsReduced()) { finish(); return; }
    modal.classList.add('is-closing');
    window.setTimeout(finish, 200);
  }
  // Output-to-recipe index: ingredient navigation remains independent of the current search filters.
  const recipeByOutput = new Map();
  recipes.forEach(entry => {
    if (!entry.result?.id || entry.special || !(entry.slots || entry.ingredients || entry.ingredient || entry.stationInputs)) return;
    if (!recipeByOutput.has(entry.result.id)) recipeByOutput.set(entry.result.id, []);
    recipeByOutput.get(entry.result.id).push(entry);
  });
  const availableRecipes = id => recipeByOutput.get(id) || [];
  function firstRecipe(id) {
    const options = availableRecipes(id);
    return options.find(entry => entry.slots || entry.ingredients) || options[0] || null;
  }
  function recipeSlots(entry) {
    if (entry.slots) return Array.from({ length: 9 }, (_, i) => entry.slots[Math.floor(i / 3)]?.[i % 3] || null);
    if (entry.ingredients) return Array.from({ length: 9 }, (_, i) => entry.ingredients[i] || null);
    return [];
  }
  function openRecipeModal(recipe, opener) {
    const modal = el('dialog', 'recipe-modal');
    const history = [recipe];
    const header = el('div', 'recipe-modal-header');
    const headingWrap = el('div');
    headingWrap.append(el('p', 'eyebrow', 'FULL-SCREEN RECIPE'));
    const heading = el('h2', '', '');
    headingWrap.append(heading);
    const controls = el('div', 'recipe-modal-controls');
    const back = el('button', 'recipe-modal-back', '← Back');
    back.type = 'button';
    const close = el('button', 'recipe-modal-close', 'Close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close full-screen recipe');
    controls.append(back, close);
    header.append(headingWrap, controls);
    const note = el('p', 'recipe-modal-note');
    const layout = el('div', 'recipe-modal-layout');
    const preview = el('section', 'recipe-ingredient-preview');
    preview.setAttribute('aria-label', 'Ingredient recipe preview');
    preview.setAttribute('aria-live', 'polite');
    modal.append(header, note, layout, preview);
    function chooseRecipe(itemId) {
      const matches = availableRecipes(itemId);
      if (!matches.length) return null;
      return firstRecipe(itemId);
    }
    function previewIngredient(itemId) {
      preview.replaceChildren();
      const recipeMatch = chooseRecipe(itemId);
      preview.append(el('p', 'eyebrow', 'INGREDIENT RECIPE PREVIEW'));
      preview.append(el('h3', '', name(itemId)));
      if (!recipeMatch) {
        preview.append(el('p', 'recipe-preview-caption', 'No defined crafting or station recipe for this item in the imported Java 1.21.11 data. It may be gathered, mined, traded, or obtained another way.'));
        return;
      }
      const stationLabel = stationLabels[stationName(recipeMatch.type)] || fallbackName(recipeMatch.type);
      preview.append(el('p', 'recipe-preview-caption', stationLabel + ' · makes ' + recipeMatch.result.count + ' × ' + name(itemId)));
      const ingredients = recipeSlots(recipeMatch);
      if (ingredients.length) {
        const grid = el('div', 'recipe-preview-grid');
        ingredients.forEach(options => {
          const slot = el('div', 'recipe-preview-slot');
          if (options?.length) {
            slot.append(icon(options[0]));
            slot.title = itemNames(options);
          } else slot.classList.add('recipe-preview-empty');
          grid.append(slot);
        });
        preview.append(grid);
      } else {
        const input = recipeMatch.ingredient || recipeMatch.stationInputs?.[0]?.options;
        if (input?.length) preview.append(el('p', 'recipe-preview-caption', 'Input: ' + itemNames(input)));
      }
      if (availableRecipes(itemId).length > 1)
        preview.append(el('p', 'recipe-preview-caption', availableRecipes(itemId).length + ' known recipe variants; the first crafting recipe is shown.'));
      const openButton = el('button', 'recipe-preview-open', 'Open ' + name(itemId) + ' recipe');
      openButton.type = 'button';
      openButton.addEventListener('click', () => navigateTo(recipeMatch));
      preview.append(openButton);
    }
    function navigateTo(nextRecipe) {
      if (!nextRecipe || history.length > 24) return;
      history.push(nextRecipe);
      renderModal(nextRecipe);
      back.focus();
    }
    function makeIngredient(options) {
      const slot = el('div', 'recipe-modal-slot');
      let current = options[0];
      const action = el('button', 'recipe-modal-ingredient');
      action.type = 'button';
      function refreshChoice() {
        action.replaceChildren(icon(current), el('span', 'recipe-modal-item-name', name(current)));
        const matched = Boolean(chooseRecipe(current));
        action.setAttribute('aria-label', name(current) + (matched ? ': preview or open its recipe' : ': no recipe listed'));
        action.title = matched ? 'Hover to preview; click to open ' + name(current) + ' recipe' : 'No recipe listed for ' + name(current);
        action.classList.toggle('recipe-modal-no-recipe', !matched);
      }
      action.addEventListener('mouseenter', () => previewIngredient(current));
      action.addEventListener('focus', () => previewIngredient(current));
      action.addEventListener('click', () => {
        const next = chooseRecipe(current);
        if (next) navigateTo(next);
        else previewIngredient(current);
      });
      slot.append(action);
      if (options.length > 1) {
        const choice = el('select', 'recipe-modal-choice');
        choice.setAttribute('aria-label', 'Choose ingredient alternative');
        options.forEach(id => {
          const item = el('option', '', name(id));
          item.value = id;
          choice.append(item);
        });
        choice.addEventListener('change', () => {
          current = choice.value;
          refreshChoice();
          previewIngredient(current);
        });
        slot.append(choice);
      }
      refreshChoice();
      return slot;
    }
    function renderModal(currentRecipe) {
      heading.textContent = name(currentRecipe.result.id);
      const special = currentRecipe.type === 'crafting_shapeless';
      const gridEntries = recipeSlots(currentRecipe);
      note.textContent = gridEntries.length
        ? (special ? 'Shapeless recipe: positions are interchangeable.' : 'Hover, focus, or tap an ingredient for its recipe. Click to follow a craftable ingredient, then use Back to return.')
        : 'This recipe uses a crafting station or a special process. Ingredient details may vary.';
      back.disabled = history.length < 2;
      layout.replaceChildren();
      const grid = el('div', 'recipe-modal-grid');
      if (gridEntries.length) {
        gridEntries.forEach(options => grid.append(options?.length ? makeIngredient(options) : el('div', 'recipe-modal-slot recipe-modal-empty')));
      } else {
        grid.className = 'recipe-modal-station-inputs';
        const inputs = currentRecipe.stationInputs?.map(entry => entry.options) ||
          (currentRecipe.ingredient ? [currentRecipe.ingredient] : []);
        inputs.forEach(options => { if (options?.length) grid.append(makeIngredient(options)); });
      }
      const output = el('div', 'recipe-modal-output');
      output.append(icon(currentRecipe.result.id), el('strong', '', name(currentRecipe.result.id)), el('span', '', '× ' + currentRecipe.result.count));
      layout.append(grid, el('span', 'recipe-modal-arrow', '→'), output);
      preview.replaceChildren(el('p', 'recipe-preview-caption', 'Hover, focus, or tap any ingredient to preview its recipe here. Click a craftable ingredient to open its full recipe.'));
    }
    back.addEventListener('click', () => {
      if (history.length <= 1) return;
      history.pop();
      renderModal(history[history.length - 1]);
      back.focus();
    });
    close.addEventListener('click', () => closeRecipeModal(modal));
    modal.addEventListener('click', event => { if (event.target === modal) closeRecipeModal(modal); });
    modal.addEventListener('cancel', event => { event.preventDefault(); closeRecipeModal(modal); });
    modal.addEventListener('close', () => { modal.remove(); opener?.focus(); });
    document.body.append(modal);
    renderModal(recipe);
    modal.showModal();
    close.focus();
  }
  const groupKey = recipe => recipe.result?.id || `special:${recipe.id}`;
  const groupName = (key, recipe) => key.startsWith('special:') ? `${fallbackName(recipe.id)} (special)` : name(key);
  [...new Set(recipes.map(recipe => recipe.type))].sort().forEach(type => {
    const option = el('option', '', fallbackName(type)); option.value = type; typeFilter.append(option);
  });
  function renderDetail(outputId, visible) {
    detail.replaceChildren();
    const variants = visible.filter(recipe => groupKey(recipe) === outputId);
    if (!variants.length) { detail.append(el('p', '', 'Choose a recipe to see its ingredients.')); return; }
    detail.append(el('h3', '', groupName(outputId, variants[0])));
    variants.forEach((recipe, index) => {
      const card = el('article', 'recipe-variant');
      const recipeLabel = specialLabels[recipe.type] || fallbackName(recipe.type);
      card.append(el('h4', '', `${variants.length > 1 ? `Recipe ${index + 1} · ` : ''}${stationLabels[stationName(recipe.type)] || (recipe.special ? 'Game-rule recipe' : fallbackName(recipe.type))} · ${recipeLabel}`));
      if (recipe.type === 'crafting_shapeless') card.append(el('p', 'recipe-note', 'Shapeless: ingredient positions do not matter.'));
      if (recipe.limitation) card.append(el('p', 'recipe-note', recipe.limitation));
      const inputs = recipe.slots ? recipe.slots.flat().filter(Boolean) : recipe.ingredients || (recipe.ingredient ? [recipe.ingredient] : recipe.stationInputs?.map(input => input.options) || []);
      if (inputs.length) {
      const layout = el('div', 'recipe-layout');
      const isCraftingGrid = Boolean(recipe.slots || recipe.ingredients);
      const grid = el('div', isCraftingGrid ? 'recipe-grid' : 'recipe-station-inputs');
      let gridControl = grid;
      if (isCraftingGrid && recipe.result) {
        const openFullscreen = (event) => openRecipeModal(recipe, event?.currentTarget);
        grid.setAttribute('role', 'button');
        grid.setAttribute('tabindex', '0');
        grid.setAttribute('aria-label', `Open ${name(recipe.result.id)} recipe in full screen`);
        grid.addEventListener('click', openFullscreen);
        grid.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openFullscreen(); }
        });
        const expandButton = el('button', 'recipe-fullscreen-button', '⛶ Full-screen recipe');
        expandButton.type = 'button';
        expandButton.setAttribute('aria-label', `Open ${name(recipe.result.id)} recipe in full screen`);
        expandButton.addEventListener('click', openFullscreen);
        gridControl = el('div', 'recipe-grid-control');
        gridControl.append(grid, expandButton);
      }
      let slots = [];
      if (recipe.slots) {
        slots = Array.from({ length: 9 }, (_, i) => recipe.slots[Math.floor(i / 3)]?.[i % 3] || null);
      } else if (recipe.ingredients) slots = Array.from({ length: 9 }, (_, i) => recipe.ingredients[i] || null);
      else slots = inputs;
      slots.forEach((options, index) => {
        const wrapper = el('div', 'recipe-slot-wrap');
        const slot = el('div', 'recipe-slot');
        if (options?.length) {
          const optionNames = options.map(name);
          const accessibleName = optionNames.length === 1 ? optionNames[0] : `${optionNames[0]} or ${optionNames.length - 1} other valid option${optionNames.length === 2 ? '' : 's'}`;
          slot.setAttribute('aria-label', accessibleName);
          slot.append(icon(options[0]));
        } else slot.setAttribute('aria-label', 'Empty slot');
        wrapper.append(slot);
        if (recipe.stationInputs) wrapper.append(el('span', 'recipe-note', fallbackName(recipe.stationInputs[index].label)));
        grid.append(wrapper);
      });
      const output = el('div', 'recipe-output');
      if (recipe.result) output.append(itemButton([recipe.result.id], 'recipe-output-icon'), el('span', '', `${name(recipe.result.id)} × ${recipe.result.count}`));
      else output.append(el('span', '', 'Output depends on input'));
      layout.append(gridControl, el('span', 'recipe-arrow', '→'), output);
      card.append(layout);
      const ingredientList = el('ul', 'recipe-ingredients');
      const groups = new Map();
      inputs.forEach(options => { const key = options.join('|'); groups.set(key, (groups.get(key) || 0) + 1); });
      groups.forEach((quantity, key) => {
        const options = key.split('|');
        const line = el('li', '', `${quantity} × ${name(options[0])}${options.length > 1 ? ` (${options.length} valid choices)` : ''}`);
        if (options.length > 1) {
          const choices = el('details', 'recipe-options');
          choices.append(el('summary', '', 'Show valid choices'));
          choices.append(el('span', '', options.map(name).join(', ')));
          line.append(choices);
        }
        ingredientList.append(line);
      });
      card.append(ingredientList);
      }
      if (recipe.special && !inputs.length) card.append(el('p', 'recipe-note', 'The game supplies this recipe’s valid ingredients and/or output at runtime. This browser preserves the definition without guessing a grid.'));
      if (recipe.cookingtime !== undefined) card.append(el('p', 'recipe-note', `Cooking time: ${recipe.cookingtime} game ticks · Experience: ${recipe.experience || 0}`));
      if (recipe.rawResult?.components) card.append(el('p', 'recipe-note', 'Output includes item components; inspect the source for details.'));
      card.append(el('p', 'recipe-note', `Java Edition 1.21.11 · ${recipe.id}${recipe.result ? ` · ${recipe.result.id}` : ''}`));
      detail.append(card);
    });
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = recipes.filter(recipe => (station.value === 'all' || stationName(recipe.type) === station.value) && (typeFilter.value === 'all' || recipe.type === typeFilter.value) && `${recipe.id} ${recipe.result?.id || ''} ${groupName(groupKey(recipe), recipe)}`.toLowerCase().includes(query));
    const groups = new Map();
    visible.forEach(recipe => { if (!groups.has(groupKey(recipe))) groups.set(groupKey(recipe), recipe); });
    const outputs = [...groups.keys()].sort((a, b) => groupName(a, groups.get(a)).localeCompare(groupName(b, groups.get(b))));
    const pages = Math.max(1, Math.ceil(outputs.length / pageSize));
    page = Math.min(page, pages - 1);
    if (!outputs.includes(selectedId)) selectedId = outputs[0] || '';
    list.replaceChildren();
    outputs.slice(page * pageSize, (page + 1) * pageSize).forEach(id => {
      const button = el('button', 'recipe-choice');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(id === selectedId));
      if (!id.startsWith('special:')) {
        const label = groupName(id, groups.get(id));
        button.title = label;
        button.setAttribute('aria-label', label);
        button.append(icon(id));
      }
      button.append(el('span', '', groupName(id, groups.get(id))));
      button.addEventListener('click', () => { selectedId = id; render(); });
      list.append(button);
    });
    count.textContent = outputs.length ? `${outputs.length} results · ${visible.length} recipes` : 'No recipes found. Try another search or reset filters.';
    pageLabel.textContent = `Page ${page + 1} of ${pages}`;
    prev.disabled = page === 0; next.disabled = page >= pages - 1;
    renderDetail(selectedId, visible);
  }
  function filter() { page = 0; selectedId = ''; render(); }
  search.addEventListener('input', filter);
  station.addEventListener('change', filter);
  typeFilter.addEventListener('change', filter);
  prev.addEventListener('click', () => { page--; render(); });
  next.addEventListener('click', () => { page++; render(); });
  document.querySelector('#recipeReset').addEventListener('click', () => { search.value = ''; station.value = 'all'; typeFilter.value = 'all'; filter(); });
  render();
})();
