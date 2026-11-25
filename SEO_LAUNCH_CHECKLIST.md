# BlockWise search and image launch checklist

This checklist records the remaining human steps for the GitHub Pages site at `https://unknown10998.github.io/BlockWise/`. It does not enable hosting, submit anything to Google, or add advertising.

## Completed in the final-polish branch

- [x] Every intended public page has a unique title, meta description, H1, project-path canonical URL, favicon, and crawlable HTML.
- [x] `sitemap.xml` contains the 11 intended public canonical URLs; the eight primary pages changed by the scenic-background update use genuine `2026-11-15` modification dates.
- [x] The homepage has a minimal, accurate `WebSite` JSON-LD record. No rating, review, FAQ, or unsupported rich-result markup was added.
- [x] The JavaScript-driven catalog pages have explanatory visible HTML around their tools; the recipe data itself remains client-rendered.
- [x] The site has no `robots.txt` file in this repository. A `/BlockWise/robots.txt` file would not be the hostname-root `https://unknown10998.github.io/robots.txt`, so it must not be treated as crawler control for the shared GitHub Pages host.
- [x] The supplied local WebP scenic-background pack and social card are used without external image requests; no extracted game textures, analytics, cookies, advertisements, or external font downloads were added.

## Before requesting indexing

1. Merge the reviewed PR only after the automated GitHub Actions run passes.
2. Enable GitHub Pages from `main` and `/ (root)` only with owner approval.
3. Confirm the live home page and all sitemap URLs use HTTPS and load below `https://unknown10998.github.io/BlockWise/`.
4. In Google Search Console, add and verify the exact URL-prefix property `https://unknown10998.github.io/BlockWise/`.
5. Submit `https://unknown10998.github.io/BlockWise/sitemap.xml` in Search Console. A sitemap helps discovery but does not guarantee indexing.
6. Use URL Inspection for the homepage, Tools, Commands, Recipes, and one reference guide after deployment. Fix real indexing errors; do not repeatedly request indexing for unchanged pages.
7. Recheck the visible titles, descriptions, canonicals, and internal links on the deployed site. Do not use a `robots.txt` file inside the project directory as evidence of host-level crawl control.

## Scenic-background provenance handoff

The active WebP files are in `assets/backgrounds/` and their November 23, 2026 replacement hashes are documented in `IMAGE_PROVENANCE_REGISTER.md`. Before advertising, retain privately, if available:

- The original ChatGPT generation conversation, prompts, model/product context, and generation date.
- An owner record confirming whether any reference images were supplied and that they were permitted for the intended use.
- A responsible-adult review of the current full-resolution images, current Minecraft fan-site policy, and potential advertising-supported use.
- A descriptive filename and the original source image kept outside the public repository when appropriate.
- A WebP or AVIF derivative sized for its display use, with an unambiguous subject and focal point. The hero should not be lazy-loaded; secondary decorative images can be considered for lazy loading.

Do not invent unavailable evidence: the named private source ZIP was not found in this workspace during the November 24 audit. Keep any source/credit record with the project, preserve the overlay and fixed hero geometry so text remains readable and layout shift stays low, and use an `<img>` with useful alt text for any informational screenshot. The existing CSS backgrounds are decorative and therefore hidden from assistive technology. Google can discover standard HTML images, but not CSS backgrounds as image-search assets.

## Rights and scope reminders

- Minecraft's [Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines) say fans can run Minecraft-information websites when they follow the naming, disclaimer, and brand conditions; third-party advertising must not harm the brand.
- The same guidance allows creators to use and share gameplay screenshots, while also stating not to redistribute games or game files. This project therefore does not bundle extracted textures or game-derived item icons.
- Keep the footer's independent-fan-project notice and do not imply official approval by Mojang or Microsoft.
- If analytics, advertising, or another third party is introduced later, perform a separate privacy, consent, security, and usage-guidelines review before launch.

## External sources consulted

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
- [Google sitemap overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
