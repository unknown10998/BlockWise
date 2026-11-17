const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("privacy policy is a crawlable public page with a canonical URL", () => {
  const privacy = read("privacy.html");
  assert.match(privacy, /<title>Privacy Policy — BlockWise<\/title>/);
  assert.match(privacy, /<link rel="canonical" href="https:\/\/unknown10998\.github\.io\/BlockWise\/privacy\.html">/);
  assert.match(privacy, /<h1>Privacy Policy<\/h1>/);
  assert.match(privacy, /Advertising is <strong>not active<\/strong>/);
  assert.doesNotMatch(privacy, /ca-pub-/i, "no invented AdSense publisher ID");
  assert.doesNotMatch(privacy, /googlesyndication|pagead2|doubleclick/i, "no advertising script or endpoint");
});

test("all public pages expose a crawlable Privacy footer link", () => {
  for (const page of pages) {
    const html = read(page);
    const footer = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] || "";
    const privacyLinks = footer.match(/href="privacy\.html"/g) || [];
    assert.equal(privacyLinks.length, 1, `${page}: exactly one footer Privacy link`);
  }
});

test("About page links every advertised feature and the privacy policy", () => {
  const about = read("about.html");
  for (const target of ["tools.html", "recipes.html", "commands.html", "enchanting.html", "farms.html", "guides.html", "privacy.html"]) {
    assert.match(about, new RegExp(`href="${target}"`), `About links ${target}`);
  }
  assert.match(about, /NOT AN OFFICIAL MINECRAFT WEBSITE/i);
  assert.match(about, /Advertising is not currently enabled/i);
});

test("privacy, sitemap, and local site paths resolve from the project root", () => {
  const sitemap = read("sitemap.xml");
  assert.match(sitemap, /<loc>https:\/\/unknown10998\.github\.io\/BlockWise\/privacy\.html<\/loc>/);
  for (const page of pages) {
    const html = read(page);
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = raw.split(/[?#]/, 1)[0];
      if (!reference || /^(?:https?:|mailto:|tel:|data:|#)/.test(reference)) continue;
      assert.ok(fs.existsSync(path.join(root, reference)), `${page}: ${reference} exists`);
    }
  }
});

test("all tracked scenic assets named by the rights audit are present", () => {
  const assets = [
    "about-hero.webp", "blockwise-site-background.webp", "commands-hero.webp",
    "enchanting-cavern.svg", "enchanting-hero.webp", "farms-hero.webp",
    "guides-hero.webp", "home-hero.webp", "overworld-landscape.svg",
    "recipes-hero.webp", "social-share.webp", "tools-hero.webp"
  ];
  for (const asset of assets) {
    assert.ok(fs.existsSync(path.join(root, "assets", "backgrounds", asset)), `asset exists: ${asset}`);
  }
  assert.match(read("ASSET_RIGHTS_AUDIT.md"), /NEEDS HUMAN VERIFICATION/);
});
