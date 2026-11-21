const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("High Contrast is a mutually exclusive theme and migrates only the former boolean preference", () => {
  const init = read("theme-init.js");
  const shared = read("script.js");

  assert.match(init, /theme: \["system", "light", "dark", "high-contrast"\]/);
  assert.match(shared, /theme: \["system", "light", "dark", "high-contrast"\]/);
  assert.match(init, /if \(preferences\.contrast === true\) preferences\.theme = "high-contrast"/);
  assert.match(shared, /if \(prefs\.contrast === true\) prefs\.theme = "high-contrast"/);
  assert.match(init, /delete preferences\.contrast/);
  assert.match(shared, /delete prefs\.contrast/);
  assert.doesNotMatch(shared, /name="contrast"/);
  assert.match(shared, /<option value="high-contrast">High contrast<\/option>/);
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
