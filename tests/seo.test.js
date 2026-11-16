const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = 'https://unknown10998.github.io/BlockWise/';
const publicPages = [
  'index.html', 'tools.html', 'commands.html', 'recipes.html', 'enchanting.html', 'guides.html',
  'knockback-stick-java-1-21-11.html', 'permanent-effects-java-1-21-11.html',
  'keep-inventory-java-1-21-11.html', 'farms.html', 'about.html',
  'crafting-table-recipe-java-1-21-11.html', 'chest-recipe-java-1-21-11.html',
  'furnace-recipe-java-1-21-11.html', 'torch-recipe-java-1-21-11.html',
  'enchanting-table-recipe-java-1-21-11.html', 'hopper-recipe-java-1-21-11.html'
];

test('sitemap contains every intended public canonical URL and only existing pages', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.equal(new Set(urls).size, urls.length, 'sitemap has no duplicate URLs');
  assert.equal(urls.length, publicPages.length);
  for (const page of publicPages) {
    const url = page === 'index.html' ? base : `${base}${page}`;
    assert.ok(urls.includes(url), `sitemap includes ${url}`);
    assert.ok(fs.existsSync(path.join(root, page)), `${page} exists`);
  }
  assert.match(sitemap, /<lastmod>2026-11-10<\/lastmod>/);
});

test('new reference guides are crawlable, version-scoped, and link to their related tool', () => {
  const guides = [
    ['knockback-stick-java-1-21-11.html', 'commands.html'],
    ['permanent-effects-java-1-21-11.html', 'commands.html'],
    ['keep-inventory-java-1-21-11.html', 'commands.html']
  ];
  for (const [page, relatedTool] of guides) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, /Java Edition 1\.21\.11/, `${page} scope`);
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `${page} one H1`);
    assert.match(html, new RegExp(`href="${relatedTool}"`), `${page} related tool link`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${base}${page}">`), `${page} canonical`);
  }
});

test('the homepage declares only a truthful WebSite structured-data description', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const match = home.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  assert.ok(match, 'WebSite JSON-LD exists');
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'WebSite');
  assert.equal(data.url, base);
  assert.equal(data.name, 'BlockWise');
});

test('every public page has a unique descriptive title and useful meta description', () => {
  const titles = new Set();
  for (const page of publicPages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, 'title exists: ' + page);
    assert.match(title, /BlockWise/);
    assert.ok(!titles.has(title), 'unique title: ' + title);
    titles.add(title);
    assert.ok(title.length < 110, 'title not excessively long: ' + page);
    const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(desc && desc.length > 60, 'meaningful description: ' + page);
  }
});
test('six standalone recipes have visible ingredients, crafting grids, and crawlable links', () => {
  const items = ['crafting-table','chest','furnace','torch','enchanting-table','hopper'];
  const index = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const recipeHub = fs.readFileSync(path.join(root,'recipes.html'),'utf8');
  const browser = fs.readFileSync(path.join(root,'recipe-browser.js'),'utf8');
  assert.match(browser,/itemParam/);
  for (const id of items) {
    const filename = id + '-recipe-java-1-21-11.html';
    const html = fs.readFileSync(path.join(root,filename),'utf8');
    assert.equal((html.match(/class="seo-recipe-slot/g)||[]).length,9,'exactly 9 crafting cells for '+id);
    assert.match(html, /recipe ingredients/);
    assert.match(html, /recipes\.html\?item=minecraft%3A/);
    assert.ok(recipeHub.includes('href="' + filename + '"'));
  }
  assert.match(index,/href="crafting-table-recipe-java-1-21-11.html"/);
  assert.match(index,/href="knockback-stick-java-1-21-11.html"/);
});
