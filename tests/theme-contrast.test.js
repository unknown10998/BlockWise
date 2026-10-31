const test = require("node:test");
const assert = require("node:assert/strict");

function rgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
}

function luminance(hex) {
  return rgb(hex)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(foreground, background) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const normalTextPairs = {
  "light primary text on surface": ["#19251e", "#ffffff"],
  "light muted text on page": ["#53675a", "#f5f7f3"],
  "light button text on primary": ["#ffffff", "#246b45"],
  "light warning text": ["#684a0a", "#fff5dd"],
  "light error text": ["#8a2f28", "#fff0ed"],
  "dark primary text on surface": ["#ebf5ed", "#1b2920"],
  "dark muted text on page": ["#c3d5c8", "#101a15"],
  "dark button text on primary": ["#102519", "#83d9a5"],
  "dark warning text": ["#ffe4a6", "#3c3017"],
  "dark error text": ["#ffcbc5", "#481f1b"]
};

test("theme normal-text pairs meet WCAG AA 4.5:1 contrast", () => {
  Object.entries(normalTextPairs).forEach(([name, [foreground, background]]) => {
    assert.ok(contrast(foreground, background) >= 4.5, `${name}: ${contrast(foreground, background).toFixed(2)}:1`);
  });
});

test("theme focus colors meet 3:1 non-text contrast against their page", () => {
  assert.ok(contrast("#b86b07", "#f5f7f3") >= 3, "light focus ring must be visible");
  assert.ok(contrast("#ffd27a", "#101a15") >= 3, "dark focus ring must be visible");
});
