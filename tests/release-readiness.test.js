const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pages = ['index.html', 'tools.html', 'commands.html', 'recipes.html', 'enchanting.html', 'guides.html', 'farms.html', 'about.html'];
const root = path.resolve(__dirname, '..');

function localReferences(html) {
  return [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map(([, value]) => value.split('?')[0])
    .filter(value => value && !value.startsWith('#') && !/^(?:https?:|mailto:|tel:|data:)/.test(value));
}

test('public pages provide a title, description, favicon, skip link, and one main heading', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/, `${page} title`);
    assert.match(html, /<meta name="description" content="[^"]+">/, `${page} description`);
    assert.match(html, /<link rel="icon" href="favicon\.svg" type="image\/svg\+xml">/, `${page} favicon`);
    assert.match(html, /<a class="skip-link" href="#main">/, `${page} skip link`);
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `${page} has one h1`);
  }
});

test('local public-page assets and links resolve from the static hosting root', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    for (const reference of localReferences(html)) {
      assert.ok(fs.existsSync(path.join(root, reference)), `${page} references missing local file: ${reference}`);
    }
  }
});
