const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const css = fs.readFileSync("styles.css", "utf8");
const script = fs.readFileSync("script.js", "utf8");
const recipes = fs.readFileSync("recipe-browser.js", "utf8");

test("motion system uses shared tokens and avoids transition-all", () => {
  ["--motion-fast", "--motion-normal", "--motion-slow", "--ease-standard", "--ease-out", "--ease-in"].forEach((token) => {
    assert.match(css, new RegExp(token));
  });
  assert.doesNotMatch(css, /transition\s*:\s*all\b/i);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.reduce-motion .*animation: none !important/);
});

test("mobile navigation has backdrop, animated close state, and Escape focus restoration", () => {
  assert.match(script, /navBackdrop/);
  assert.match(script, /function openNavigation\(\)/);
  assert.match(script, /function closeNavigation/);
  assert.match(script, /closeNavigation\(\{ restoreFocus: true \}\)/);
  assert.match(css, /\.site-nav\.is-closing/);
});

test("settings and recipe dialogs support animated exit without losing keyboard focus", () => {
  assert.match(script, /dialog\.addEventListener\("cancel"/);
  assert.match(script, /trigger\.focus\(\)/);
  assert.match(recipes, /modal\.addEventListener\('cancel'/);
  assert.match(recipes, /opener\?\.focus\(\)/);
  assert.match(css, /\.settings-dialog\.is-closing, \.recipe-modal\.is-closing/);
});
