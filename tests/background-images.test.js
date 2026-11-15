const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const imageDirectory = 'assets/backgrounds';
const pages = [
  ['index.html', '.hero.hero-scenic', 'home-hero.webp'],
  ['tools.html', '#tools > .section-heading', 'tools-hero.webp'],
  ['commands.html', '.commands-section .section-wrap > .section-heading', 'commands-hero.webp'],
  ['recipes.html', '#recipes > .section-heading', 'recipes-hero.webp'],
  ['enchanting.html', '.enchant-section .section-wrap > .section-heading', 'enchanting-hero.webp'],
  ['guides.html', '.guides-section .section-wrap > .section-heading', 'guides-hero.webp'],
  ['farms.html', '.farms-section .section-wrap > .section-heading', 'farms-hero.webp'],
  ['about.html', '#about.cta-section', 'about-hero.webp']
];

test('the supplied WebP background pack is present and has WebP headers', () => {
  for (const [, , filename] of pages.concat([['social-share', '', 'social-share.webp']])) {
    const image = fs.readFileSync(`${imageDirectory}/${filename}`);
    assert.equal(image.subarray(0, 4).toString('ascii'), 'RIFF', `${filename} starts as RIFF`);
    assert.equal(image.subarray(8, 12).toString('ascii'), 'WEBP', `${filename} is WebP`);
  }
});

test('every primary page has the intended locally hosted scenic background and share card', () => {
  const css = fs.readFileSync('styles.css', 'utf8');
  for (const [page, selector, filename] of pages) {
    const html = fs.readFileSync(page, 'utf8');
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedImage = filename.replace('.', '\\.');
    assert.match(css, new RegExp(`${escapedSelector}\\s*\\{[^}]*assets/backgrounds/${escapedImage}`), `${page} maps to ${filename}`);
    assert.match(html, /property="og:image" content="https:\/\/unknown10998\.github\.io\/BlockWise\/assets\/backgrounds\/social-share\.webp"/);
    assert.match(html, /name="twitter:image" content="https:\/\/unknown10998\.github\.io\/BlockWise\/assets\/backgrounds\/social-share\.webp"/);
  }
});
