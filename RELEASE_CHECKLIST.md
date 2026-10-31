# BlockWise public beta release checklist

Status key: **Pass** was verified in this release audit; **Fail** needs resolution before calling the beta fully release-ready; **Not Tested** was not verified in this audit.

## Product and data trust

| Requirement | Status | Evidence / action |
| --- | --- | --- |
| Public pages have clear scope and independent-fan-project disclosure | Pass | Footer disclaimer is present on all seven public pages. |
| Recipe Browser is identified as Java Edition 1.21.11 data, not the cross-edition starter planner | Pass | Recipe heading and README describe the separate scope. |
| Recipe coverage is not overstated | Pass | Documentation records 1,470 structurally imported definitions and says visual/in-game validation is incomplete. |
| Farm cards distinguish creator claims from verified results | Pass | Gold is labelled creator-stated/not independently benchmarked; all other rates are unverified and materials are not audited. |
| Farm cards accurately identify embed, creator, compatibility, rate, and material confidence | Pass | Six verified embeds are rendered; four cards retain external YouTube links only; unverified compatibility, rates, and materials are explicitly labelled. |
| Every farm has a current 1.21.11-compatible, independently verified tutorial and materials list | Not Tested | This is a future research goal, not a public-beta blocker while the catalog remains clearly labelled. See `farm-verification-report.md`. |
| Restricted Minecraft textures are not bundled | Pass | BlockWise uses original item initials; no game textures are distributed. |

## Functionality and accessibility

| Requirement | Status | Evidence / action |
| --- | --- | --- |
| Stack calculator works | Pass | Browser: 1,000 items returned 15 full stacks and 40 leftovers. |
| Survival Planner works | Pass | Browser: Iron Pickaxe produced 3 Iron Ingots and 1 Log in the checklist. |
| Build Material Estimator works | Pass | Browser: default house estimate returned 143 blocks and 3 inventory slots. |
| Enchantment Optimizer works within its stated model | Pass | Browser: default setup returned 23 levels and four steps; automated exhaustive-model tests passed. |
| Recipe search and full-screen grid work | Pass | Browser: “oak stairs” yielded three results, a nine-slot grid, and a full-screen view with item names. |
| Guide and Farm search work | Pass | Browser: “mining” showed two guide cards; “gold” showed 1 of 10 farm references. |
| Mobile navigation and keyboard Escape work | Pass | Browser at 390px: menu closed on Escape and returned focus to the menu button. |
| Settings persist across reload | Pass | Browser: Light theme was retained after reload. Settings save handler supports both `input` and native select `change`. |
| Keyboard behavior with screen readers | Not Tested | Requires manual testing with VoiceOver, NVDA, or a comparable assistive technology. |
| Physical iOS/Android touch behavior | Not Tested | Browser viewport testing is not a substitute for device testing. |

## Responsive, visual, and technical quality

| Requirement | Status | Evidence / action |
| --- | --- | --- |
| 320px content layouts avoid horizontal overflow | Pass | Browser: Guides had no horizontal overflow and retained its mobile menu. Earlier beta checks covered Recipes, Tools, and Farms. |
| 390px content layouts avoid horizontal overflow | Pass | Browser: Guides and Farms had no horizontal overflow; mobile menu Escape returned focus to its trigger. |
| 768px content layouts avoid horizontal overflow | Pass | Browser: Tools applied Dark and Reduced Motion preferences with no horizontal overflow. |
| 1440px every public page avoids horizontal overflow | Pass | Browser: Home, Tools, Recipes, Optimizer, Guides, Farms, and About all fit. |
| Light/dark/system preferences and reduced motion | Pass | Browser: Dark and Reduced Motion were applied at 768px, then Reset restored defaults. Earlier beta checks rechecked saved Light persistence. |
| WCAG AA tested text pairs and focus contrast | Pass | `tests/theme-contrast.test.js` checks documented color pairs. This is not a complete automated accessibility conformance audit. |
| Exactly one H1, meaningful title/description, skip link, and favicon on every public page | Pass | Automated release-readiness test and browser check passed. |
| Local static links and assets resolve | Pass | New automated static-hosting-path test passed. |
| External links, YouTube playback, and third-party availability | Not Tested | External sources can change; embeds were not played during this audit. |
| Browser console errors | Pass | Final local-browser error log was empty. |
| Performance metrics (Lighthouse/Core Web Vitals) | Not Tested | No Lighthouse or throttled-network measurement was run. |

## Hosting handoff

| Requirement | Status | Evidence / action |
| --- | --- | --- |
| Buildless static hosting compatibility | Pass | The site has plain HTML, CSS, JavaScript, local assets, and no build step or server dependency. |
| GitHub Pages / Cloudflare Pages deployment configuration | Not Tested | No account, repository, or hosting configuration was changed. |
| GitHub Actions automated checks | Not Tested | `.github/workflows/tests.yml` was created and structurally tested locally; it has not run on GitHub yet. |
| Production HTTPS, custom domain, and cache behavior | Not Tested | Verify after deployment. |

## Deploy after approval

1. Push the reviewed `beta-readiness` branch and open a pull request into `main`; wait for the GitHub Actions workflow to pass, then merge only when you approve it.
2. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. Keep the repository private and do not enable Pages until you approve publication.
3. After GitHub reports a successful deployment, verify `https://unknown10998.github.io/BlockWise/` over HTTPS: Home, Tools, Recipes, Optimizer, Guides, Farms, Settings persistence, mobile navigation, and external source/video fallback links.
4. Do not enable ads until the content, privacy/disclosure obligations, and applicable platform requirements have been reviewed.
5. Run a Lighthouse pass and device/screen-reader checks before promoting beyond beta.

## Remaining work

### Before publication

- Push the branch and confirm the new GitHub Actions workflow completes successfully.
- Enable GitHub Pages only after an explicit publication decision, then complete the post-deployment HTTPS checks above.

### Future improvements, not beta blockers

- Independently validate a current Java 1.21.11 build, material list, and production conditions for each farm.
- Test with physical mobile devices and a screen reader.
- Measure production performance with Lighthouse or an equivalent tool.
