const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("saved contrast is enabled only by a boolean true value", () => {
  const init = read("theme-init.js");
  const shared = read("script.js");

  assert.match(init, /preferences\.contrast = preferences\.contrast === true/);
  assert.match(shared, /prefs\.contrast = prefs\.contrast === true/);
  assert.doesNotMatch(init, /Boolean\(preferences\.contrast\)/);
  assert.doesNotMatch(shared, /prefs\.contrast = Boolean\(prefs\.contrast\)/);
});

test("the enchanting-table guide uses grammatically correct visible and share text", () => {
  const html = read("enchanting-table-recipe-java-1-21-11.html");

  assert.doesNotMatch(html, /a enchanting/i);
  assert.match(html, /How to make an enchanting table in Minecraft/);
  assert.match(html, /How to craft an enchanting table in Minecraft Java 1\.21\.11/);
});

test("every sitemap page keeps baseline static accessibility and SEO hooks", () => {
  const sitemap = read("sitemap.xml");
  const pages = [...sitemap.matchAll(/<loc>https:\/\/unknown10998\.github\.io\/BlockWise\/(?:([^<]+))?<\/loc>/g)]
    .map(([, filename]) => filename || "index.html");

  assert.equal(pages.length, 20, "current public sitemap size");
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<html lang="en"/i, `${page}: document language`);
    assert.match(html, /class="skip-link"/i, `${page}: skip link`);
    assert.match(html, /<meta name="description" content="[^"]{60,}"/i, `${page}: useful description`);
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/gi) || []).length, 1, `${page}: one H1`);
  }
});
