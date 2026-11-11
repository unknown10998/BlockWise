const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.attributes = {}; this.listeners = {}; this.value = ''; this.textContent = ''; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  trigger(event, detail) { if (!this.listeners[event]) throw new Error('Missing event handler: ' + event); this.listeners[event](detail); }
  get classList() {
    const node = this;
    return {
      contains(value) { return (node.className || '').split(/\s+/).includes(value); },
      add(value) { if (!this.contains(value)) node.className = ((node.className || '') + ' ' + value).trim(); },
      toggle(value, force) { const has = this.contains(value); const shouldAdd = force === undefined ? !has : force; node.className = (node.className || '').split(/\s+/).filter(x => x && x !== value).concat(shouldAdd ? [value] : []).join(' '); return shouldAdd; }
    };
  }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.listeners.close?.(); }
  remove() { this.removed = true; }

}
function setup() {
  const elements = Object.fromEntries(['recipeSearch', 'recipeStation', 'recipeType', 'recipeList', 'recipeDetail', 'recipeCount', 'recipeReset', 'recipePrev', 'recipeNext', 'recipePage'].map(id => [id, new Element('div')]));
  elements.recipeStation.value = 'all';
  elements.recipeType.value = 'all';
  const body = new Element('body');
  elements._body = body;
  const context = { window: {}, document: { body, querySelector: selector => elements[selector.slice(1)], createElement: tag => new Element(tag) } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('recipe-data.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('recipe-browser.js', 'utf8'), context);
  return elements;
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }

test('search, multiple recipes, station filtering and reset', () => {
  const ui = setup();
  ui.recipeSearch.value = 'white dye'; ui.recipeSearch.trigger('input');
  assert.ok(ui.recipeList.children.length >= 1);
  assert.ok(descendants(ui.recipeDetail).filter(node => node.className === 'recipe-variant').length >= 2);
  assert.ok(descendants(ui.recipeDetail).some(node => node.textContent.includes('Shapeless')));
  ui.recipeSearch.value = 'stone bricks'; ui.recipeSearch.trigger('input');
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Stone Bricks')).trigger('click');
  assert.ok(descendants(ui.recipeDetail).filter(node => node.className === 'recipe-variant').length >= 2);
  ui.recipeStation.value = 'stonecutting'; ui.recipeStation.trigger('change');
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Stone Bricks')).trigger('click');
  assert.equal(descendants(ui.recipeDetail).filter(node => node.className === 'recipe-variant').length, 1);
  assert.ok(descendants(ui.recipeDetail).some(node => node.className === 'recipe-station-inputs'));
  ui.recipeReset.trigger('click');
  assert.equal(ui.recipeStation.value, 'all');
  assert.ok(ui.recipeList.children.length > 1);
});

test('shaped grid keeps empty positions and output quantity', () => {
  const ui = setup();
  ui.recipeSearch.value = 'oak stairs'; ui.recipeSearch.trigger('input');
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Oak Stairs')).trigger('click');
  const nodes = descendants(ui.recipeDetail);
  const slots = nodes.filter(node => node.className === 'recipe-slot');
  assert.equal(slots.length, 9);
  assert.equal(slots.filter(slot => slot.attributes['aria-label'] === 'Empty slot').length, 3);
  assert.ok(nodes.some(node => node.textContent === 'Oak Stairs × 4'));
  ui.recipeSearch.value = 'nothing matches'; ui.recipeSearch.trigger('input');
  assert.match(ui.recipeCount.textContent, /No recipes found/);
});

test('crafting grids are keyboard-accessible full-screen recipe triggers and special recipes do not invent a grid', () => {
  const ui = setup();
  ui.recipeSearch.value = 'oak stairs'; ui.recipeSearch.trigger('input');
  assert.ok(descendants(ui.recipeList).some(node => node.attributes['data-item-id'] === 'minecraft:oak_stairs'));
  assert.ok(descendants(ui.recipeList).some(node => node.className === 'recipe-icon' && node.textContent === 'O'));
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Oak Stairs')).trigger('click');
  const grid = descendants(ui.recipeDetail).find(node => node.className === 'recipe-grid');
  assert.equal(grid.attributes.role, 'button');
  assert.equal(grid.attributes.tabindex, '0');
  assert.match(grid.attributes['aria-label'], /Open Oak Stairs recipe in full screen/);
  const fullscreenButton = descendants(ui.recipeDetail).find(node => node.className === 'recipe-fullscreen-button');
  assert.equal(fullscreenButton.textContent, '⛶ Full-screen recipe');
  assert.match(fullscreenButton.attributes['aria-label'], /Open Oak Stairs recipe in full screen/);
  const ingredientSlot = descendants(grid).find(node => node.className === 'recipe-slot' && node.attributes['aria-label'] === 'Oak Planks');
  assert.ok(ingredientSlot);
  const outputButton = descendants(ui.recipeDetail).find(node => node.className === 'recipe-output-icon recipe-item-button');
  assert.equal(outputButton.attributes['aria-label'], 'Oak Stairs');
  assert.equal(descendants(outputButton).find(node => node.className === 'recipe-icon').textContent, 'O');
  ui.recipeSearch.value = 'firework rocket'; ui.recipeSearch.trigger('input');
  ui.recipeList.children[1].trigger('click');
  assert.ok(descendants(ui.recipeDetail).some(node => node.textContent.includes('The game supplies this recipe')));
  assert.equal(descendants(ui.recipeDetail).filter(node => node.className === 'recipe-grid').length, 0);
});

test('tag alternatives retain their version-matched accessible names in crafting slots', () => {
  const ui = setup();
  ui.recipeSearch.value = 'crafting table'; ui.recipeSearch.trigger('input');
  ui.recipeList.children[0].trigger('click');
  const itemSlot = descendants(ui.recipeDetail).find(node => node.className === 'recipe-slot' && /^Oak Planks or 11 other valid options/.test(node.attributes['aria-label'] || ''));
  assert.ok(itemSlot);
  assert.equal(descendants(itemSlot).find(node => node.className === 'recipe-icon').textContent, 'O');
});


test('fullscreen ingredients preview nested recipes, open on click, and return with Back', () => {
  const ui = setup();
  ui.recipeSearch.value = 'oak stairs'; ui.recipeSearch.trigger('input');
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Oak Stairs')).trigger('click');
  const grid = descendants(ui.recipeDetail).find(node => node.className === 'recipe-grid');
  grid.trigger('click');
  const modal = ui._body.children.find(child => child.tag === 'dialog');
  assert.ok(modal?.open, 'fullscreen dialog should open');
  const ingredient = descendants(modal).find(node => node.className === 'recipe-modal-ingredient');
  assert.ok(ingredient);
  ingredient.trigger('mouseenter');
  assert.ok(descendants(modal).some(node => node.textContent === 'Oak Planks'), 'ingredient recipe preview should show output name');
  assert.ok(descendants(modal).some(node => node.className === 'recipe-preview-grid'), 'preview includes a miniature crafting layout');
  ingredient.trigger('click');
  const title = descendants(modal).find(node => node.tag === 'h2');
  assert.equal(title.textContent, 'Oak Planks');
  const back = descendants(modal).find(node => node.className === 'recipe-modal-back');
  assert.equal(back.disabled, false);
  back.trigger('click');
  assert.equal(title.textContent, 'Oak Stairs');
  assert.equal(back.disabled, true);
});

test('fullscreen recipe alternatives allow switching and previewing alternate ingredients', () => {
  const ui = setup();
  ui.recipeSearch.value = 'crafting table'; ui.recipeSearch.trigger('input');
  ui.recipeList.children.find(button => descendants(button).some(node => node.textContent === 'Crafting Table')).trigger('click');
  descendants(ui.recipeDetail).find(node => node.className === 'recipe-grid').trigger('click');
  const modal = ui._body.children.find(child => child.tag === 'dialog');
  const selection = descendants(modal).find(node => node.className === 'recipe-modal-choice');
  assert.ok(selection, 'ingredient alternatives have a selector');
  const alternatives = selection.children.map(child => child.value);
  assert.ok(alternatives.includes('minecraft:birch_planks'));
  selection.value = 'minecraft:birch_planks';
  selection.trigger('change');
  assert.ok(descendants(modal).some(node => node.textContent === 'Birch Planks'));
  assert.ok(descendants(modal).some(node => node.className === 'recipe-preview-grid'));
});

test('site provides locally hosted scenic backgrounds and recipe explorer styling', () => {
  const css = fs.readFileSync('styles.css', 'utf8');
  const home = fs.readFileSync('index.html', 'utf8');
  const recipesPage = fs.readFileSync('recipes.html', 'utf8');
  assert.match(home, /class="hero hero-scenic section-wrap"/);
  for (const path of ['assets/backgrounds/overworld-landscape.svg', 'assets/backgrounds/enchanting-cavern.svg']) {
    assert.ok(fs.existsSync(path), 'background exists locally: ' + path);
    const artwork = fs.readFileSync(path, 'utf8');
    assert.match(artwork, /^<svg /);
    assert.ok(css.includes(path), 'stylesheet references ' + path);
  }
  assert.match(css, /recipe-ingredient-preview/);
  assert.match(css, /recipe-modal-ingredient/);
  assert.match(recipesPage, /Hover or focus an ingredient/);
});
