const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = ['index.html', 'tools.html', 'commands.html', 'recipes.html', 'enchanting.html', 'guides.html', 'farms.html', 'about.html'];
test('each page has its own heading and links to the other sections', () => {
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, page);
    for (const target of pages) assert.ok(html.includes(`href="${target}"`), `${page} links to ${target}`);
  }
});
