// Run against a separately launched Chrome debugging session on localhost:9227.
const assert = require('node:assert/strict');

async function main() {
  const tabs = await (await fetch('http://127.0.0.1:9227/json')).json();
  const tab = tabs.find(entry => entry.type === 'page' && entry.url.startsWith('http://127.0.0.1:8765'));
  if (!tab) throw new Error('Local BlockWise tab not found');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const pending = new Map(); let nextId = 0; const errors = [];
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push('console.error');
    if (msg.id && pending.has(msg.id)) { const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id); msg.error ? reject(Error(msg.error.message)) : resolve(msg.result); }
  };
  function command(method, params = {}) { return new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); }); }
  async function evaluate(expression) { const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw Error(result.exceptionDetails.text); return result.result.value; }
  await command('Runtime.enable'); await command('Page.enable');
  async function visit(page) {
    await command('Page.navigate', { url: `http://127.0.0.1:8765/${page}` });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  await visit('recipes.html');
  const desktop = await evaluate(`(() => {
    const q = id => document.querySelector(id);
    const input = (selector, value, event='input') => { q(selector).value=value; q(selector).dispatchEvent(new Event(event, {bubbles:true})); };
    input('#recipeSearch', 'oak stairs');
    [...document.querySelectorAll('.recipe-choice')].find(b => b.textContent.includes('Oak Stairs') && !b.textContent.includes('Dark') && !b.textContent.includes('Pale')).click();
    const slots = [...document.querySelectorAll('.recipe-slot')];
    const grid = [slots.length, slots.filter(s => s.getAttribute('aria-label') === 'Empty slot').length, q('#recipeDetail').textContent.includes('Oak Stairs × 4')];
    input('#recipeSearch', 'stone bricks');
    [...document.querySelectorAll('.recipe-choice')].find(b => b.textContent.trim().endsWith('Stone Bricks')).click();
    const alternatives = document.querySelectorAll('.recipe-variant').length;
    input('#recipeStation', 'stonecutting', 'change');
    const station = [...document.querySelectorAll('.recipe-choice')].find(b => b.textContent.trim().endsWith('Stone Bricks')); station.click();
    const stonecutter = !!q('.recipe-station-inputs');
    q('#recipeReset').click();
    const pagination = !q('#recipeNext').disabled; q('#recipeNext').click();
    const nextPage = q('#recipePage').textContent.includes('Page 2');
    return {grid, alternatives, stonecutter, pagination, nextPage, overflow: document.documentElement.scrollWidth > innerWidth};
  })()`);
  assert.deepEqual(desktop.grid, [9, 3, true]); assert.ok(desktop.alternatives >= 2); assert.ok(desktop.stonecutter && desktop.pagination && desktop.nextPage); assert.equal(desktop.overflow, false);
  await visit('tools.html');
  const tools = await evaluate(`(() => { const q = s => document.querySelector(s); q('#itemQuantity').value = '1000'; q('#stackForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); q('#plannerItem').value = 'iron_pickaxe'; q('#plannerItem').dispatchEvent(new Event('change',{bubbles:true})); return {stack:[q('#fullStacks').textContent,q('#leftoverItems').textContent],planner:q('#plannerChecklist').textContent.includes('Iron Ingot')}; })()`);
  assert.deepEqual(tools.stack, ['15', '40']); assert.ok(tools.planner);
  await visit('guides.html');
  const guide = await evaluate(`(() => { const e=document.querySelector('#guideSearch'); e.value='mining'; e.dispatchEvent(new Event('input',{bubbles:true})); return [...document.querySelectorAll('.guide-card')].some(e => !e.hidden && e.dataset.category === 'survival'); })()`);
  assert.ok(guide);
  await visit('enchanting.html');
  const optimizer = await evaluate(`document.querySelector('#planHeadline').textContent`);
  assert.ok(optimizer);
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await visit('recipes.html');
  const mobile = await evaluate(`(() => { document.querySelector('#menuToggle').click(); return {menu:document.querySelector('#menuToggle').getAttribute('aria-expanded'), overflow:document.documentElement.scrollWidth>innerWidth, columns:getComputedStyle(document.querySelector('.recipe-browser')).gridTemplateColumns}; })()`);
  assert.equal(mobile.menu, 'true'); assert.equal(mobile.overflow, false);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ desktop, tools, guide, optimizer, mobile, consoleErrors: errors }, null, 2));
  ws.close();
}
main().catch(error => { console.error(error); process.exitCode = 1; });
