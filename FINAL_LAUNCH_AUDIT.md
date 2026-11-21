# BlockWise final production launch audit

Audit date: November 21, 2026. This is an evidence-based engineering review, not legal advice, an AdSense approval, or a promise of search indexing.

## Scope and source state

| Item | Evidence |
| --- | --- |
| Deployed production baseline audited | `origin/main` at `045bf4e6afcbfb7d3e99fcd1789ed33e28e008e0` (the latest merged commit when audited). |
| Local release candidate checked | `legal/privacy-about-rights` at `a2403a01376482e058e52b05b1993b50c00893ae`, plus nine uncommitted user-request changes already present in the working tree. |
| Pull requests | One open PR: [#6 — Add privacy policy and expand About page](https://github.com/unknown10998/BlockWise/pull/6). It is one commit ahead of `main`, has no merge conflict in a `git merge-tree` check, and includes the missing Privacy Policy. |
| CI | GitHub Actions run [49](https://github.com/unknown10998/BlockWise/actions/runs/43986001486) for PR #6 completed successfully. The last `main` workflow run also completed successfully. |
| Deployment comparison | All 19 live `main` sitemap routes returned HTTP 200 in the live route check. `/BlockWise/privacy.html` returned HTTP 503 and `privacy.html` is absent from `origin/main`, so the deployed site cannot truthfully claim the candidate Privacy Policy is live. |

## What was checked

- Discovered 19 deployed HTML pages from `origin/main` and checked every sitemap route over HTTPS. The local candidate sitemap has 20 routes, adding the Privacy Policy.
- Ran the complete dependency-free test suite in the current local candidate: `node --test tests/*.test.js` — **81 passed, 0 failed**.
- Ran `git diff --check` and `node --check` for every root and `scripts/` JavaScript file — **passed**.
- Reviewed the GitHub Actions workflow, repository branches, open pull requests, candidate mergeability, static local paths, local asset references, local storage behavior, third-party patterns, and source-visible credential markers.
- Reviewed the local recipe coverage report: all 1,470 imported definitions are structurally represented (1,396 standard, 74 special), with zero unresolved static item/tag references. This is not in-game or per-recipe visual validation.
- Measured local scenic-asset file sizes. `blockwise-site-background.webp` is 1,650,660 bytes; the remaining supplied WebPs range from about 127 KB to 399 KB.
- Reviewed the current official Minecraft Usage Guidelines/EULA, Google AdSense guidance, and Google Search Central sitemap guidance.

## Findings

| Severity | Finding | Evidence | Fix / owner action | Verification |
| --- | --- | --- | --- | --- |
| P0 | The live site has no published Privacy Policy. | Live `/BlockWise/privacy.html` returned 503; `origin/main` has no `privacy.html`. | Merge PR #6, wait for Pages deployment, then recheck the live policy and every footer link. | Not fixed in production; no merge was performed. |
| P1 | The supplied WebP scenery has no retained source, ownership, AI-generation, or commercial-use record. | `ASSET_RIGHTS_AUDIT.md` classifies all ten supplied WebPs as **NEEDS HUMAN VERIFICATION**. | Responsible owner must retain source and permission/license evidence, or replace the images with documented original/cleared artwork. | Needs human verification. |
| P1 | No public owner/contact method is published. | Candidate About and Privacy pages accurately state this is not yet provided. Minecraft's current fan guidelines require identifying the owner and a contact method. | Responsible adult owner must choose and maintain a safe public contact channel before commercial activity. | Needs owner decision. |
| P1 | AdSense prerequisites are incomplete. | No ad/analytics tags or publisher ID are present, but there is no adult account decision, ad-specific policy, consent implementation, or rights record. | Do not apply or add ads until the adult owner completes the documented privacy, rights, consent, and account steps. | Not ready by design. |
| P2 | Current browser, assistive-technology, physical-device, and Lighthouse checks are unavailable for this audit environment. | No browser-control or Lighthouse capability was available. | Run real desktop/mobile, screen-reader, and performance checks after PR #6 deploys. | Not tested. |
| P2 | The large shared background merits measured production performance review. | It is 1.65 MB and decorative. No throttled or Core Web Vitals measurement was run. | Measure production LCP/INP/CLS and image transfer; optimize or defer only if results show a problem. | Not tested. |
| P2 | Farm source availability and full Java 1.21.11 compatibility are not independently confirmed for every card. | Seven attributable embeds are in the candidate; all rate/material/compatibility limits are labelled. | Recheck external playback and mechanics before representing any claim as independently verified. | Not tested in a browser. |
| P3 | Project-hosted `robots.txt` is unavailable. | `/BlockWise/robots.txt` returned 503; project-local robots cannot control the shared `unknown10998.github.io` host root. | No code fix recommended for GitHub Pages project hosting; submit the sitemap in Search Console when an eligible owner can manage it. | Documented limitation. |

## Security and reliability review

- No credentials, AdSense publisher identifiers, analytics tags, server endpoints, account system, payment flow, or first-party database were found in the source scan.
- Browser-local preferences and Smart Command Finder history/favorites are parsed defensively. The automated suite covers malformed saved/shared data, calculator input validation, command-generator bounds, recipe rendering structure, alternatives, clipboard fallback, and optimizer minimum-level modeling.
- `innerHTML` rendering remains in the command and farm interfaces, but command/user-controlled strings are escaped before insertion and farm content is static data. No confirmed DOM-XSS defect was reproduced in this audit.
- No unnecessary `robots.txt` was added: a file under `/BlockWise/` would not set crawler policy for the shared GitHub Pages hostname root.

## Privacy, copyright, and policy review

- The candidate `privacy.html` describes the current localStorage use, GitHub Pages hosting, privacy-enhanced YouTube embeds, external links, and absence of advertising/analytics. It is not deployed yet.
- The candidate does not distribute extracted Minecraft textures or game files; recipe items use version-matched display-name initials. The Minecraft Usage Guidelines expressly allow Minecraft information websites subject to their conditions, but their definition of assets includes graphics, textures, images, models, screenshots, and game files. This audit does not treat possession of an image, a game-data extraction, or a third-party repository license as permission to redistribute Minecraft-owned material.
- Google states that AdSense publishers must show a privacy policy addressing cookie use; Google also requires a certified CMP integrated with IAB TCF for personalized-ad traffic in the EEA, UK, and Switzerland. The responsible account holder must recheck the current requirement and applicable law before activation.

## SEO and content review

- Candidate public pages have unique titles ending in `— BlockWise`, descriptions, canonical GitHub Pages project URLs, favicon links, a skip link, one main heading, Open Graph references, and a sitemap. Static tests cover those checks.
- The live sitemap returned HTTP 200. A sitemap assists discovery; it neither guarantees indexing nor ranking.
- The new Privacy page is included in the candidate sitemap but not live. It must be deployed before the site’s privacy claims, custom-domain decision, or future advertising review can rely on it.

## Tests actually run in this audit

| Check | Result |
| --- | --- |
| `git fetch origin --prune` | Passed; remote references refreshed. |
| `git diff --check` | Passed. |
| `node --check` for root and `scripts/` JavaScript | Passed. |
| `node --test tests/*.test.js` | Passed: 81/81 tests. |
| GitHub Actions static checks for PR #6 | Passed: run 49. |
| Live HTTP checks | 19 live sitemap routes: 200. Live Privacy and project-path `robots.txt`: 503. |
| Real-browser visual/interaction checks | Not tested in this audit environment. |
| Screen-reader and physical-device checks | Not tested. |
| Lighthouse/Core Web Vitals | Not tested. |
| External YouTube playback | Not tested. |
| Minecraft in-game recipe/command validation | Not tested. |

## Readiness decisions

### A. Public launch — NO-GO

Blockers:

1. Merge and deploy PR #6 so the actual live footer and Privacy Policy exist; then verify them at the live HTTPS URLs.
2. Obtain or replace the ten unverified scenic-background assets with a documented rights record.
3. Complete a post-deployment browser pass for desktop/mobile, settings, keyboard flow, console errors, and key tools.

### B. Custom domain — NO-GO

The domain should not be connected until the production Privacy page and footer links are live, asset-rights status is resolved, and the post-deployment release checks pass. No DNS changes were made.

### C. Google AdSense application — NO-GO

Blockers:

1. All public-launch blockers.
2. A responsible adult owner/account holder and an appropriate public contact method.
3. A pre-activation policy update for the actual advertising/data flows.
4. A current consent-management decision for applicable regions and advertising configuration.
5. Rights evidence for scenic assets and a current review of Minecraft/Google policies.

## Required next steps

1. Review and merge PR #6 only after approval; wait for GitHub Pages to deploy.
2. Repeat live route, footer, Privacy, console, mobile, accessibility, and performance checks against the deployed commit.
3. Resolve the WebP rights record and owner contact decision before public commercial activity or an AdSense application.
4. Keep all claims about farm rates, compatibility, recipes, commands, and icon rights within the documented limitations.

No deployment, DNS update, advertisement activation, AdSense application, merge, or external-account change was made in this audit.
