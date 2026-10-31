const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('guides.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

test('guide links have matching no-JavaScript fallback destinations', () => {
  for (const id of ['starter-storage', 'starter-mining', 'starter-building']) {
    assert.match(html, new RegExp(`href="#${id}"`), `${id} link exists`);
    assert.match(html, new RegExp(`<article class="starter-details" id="${id}">`), `${id} fallback exists`);
  }
  assert.match(html, /<section class="guide-fallbacks" aria-label="Starter guide tips">/);
});

test('JavaScript guide detail view manages expanded state and focus', () => {
  assert.match(html, /aria-controls="starterDetails" aria-expanded="false"/);
  assert.match(html, /id="starterDetails" hidden aria-live="polite" tabindex="-1"/);
  assert.match(script, /document\.documentElement\.classList\.add\("js-guides"\)/);
  assert.match(script, /starterDetails\.focus\(\{ preventScroll: true \}\)/);
  assert.match(script, /activeGuideLink\?\.focus\(\)/);
});
