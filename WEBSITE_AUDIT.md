# BlockWise website quality audit

Audit date: November 16, 2026  
Audit branch: `audit/full-site-quality` (not merged or deployed)

## Scope and evidence

- Static audit: all 19 HTML documents, local links/assets, document landmarks, metadata, source references, JavaScript syntax, and the dependency-free Node suite.
- Local real-browser audit: the eight primary pages at 320px, 375px, 390px, 768px, 1024px, 1440px, and 1920px; the 11 standalone guides at 390px; and core calculator, recipe, command, farm, guide, navigation, and settings flows.
- Production baseline: `https://unknown10998.github.io/BlockWise/` returned HTTP 200 on November 16, 2026. It is the current `main` deployment, so it does not contain this audit branch's unmerged fixes.

| Severity | Problem | Location | Fix | Evidence | Verification |
| --- | --- | --- | --- | --- | --- |
| Medium | The mobile navigation did not implement Escape-key closing. | `script.js` navigation setup | Added a document keydown handler that closes an open menu and restores focus to the menu trigger. | Browser test initially could not close the menu with Escape; source inspection confirmed no keydown listener. | Real browser at 390px: Escape closed the menu after the fix. Regression test added. |
| Medium | Header navigation plus Settings caused 103px horizontal overflow at 1024px. | `styles.css` responsive navigation breakpoint | Moved the navigation/menu breakpoint from 940px to 1100px, so tablet widths use the accessible menu before controls collide. | Browser measured document width 1,112px against 1,009px client width; overflowing element was `.settings-trigger`. | Real-browser sweep: all eight primary pages had no overflow at 1024px after the fix. |
| Low | A user-edited localStorage value such as `"false"` incorrectly enabled High Contrast because non-empty strings are truthy. | `theme-init.js`, `script.js` | Normalize the setting only when it is boolean `true`. | Static source review found `Boolean(preferences.contrast)` and `Boolean(prefs.contrast)`. | New regression test checks both initialization paths. |
| Low | The Enchanting Table guide used the ungrammatical phrase “a enchanting”. | `enchanting-table-recipe-java-1-21-11.html` | Corrected visible heading/body text plus description and Open Graph description. | Four occurrences found by text audit. | New regression test verifies the corrected wording. |
| Informational | Browser caches can keep static CSS/JS query versions during local QA. | All 19 HTML documents | Advanced shared asset query markers to `quality-audit-1` after the responsive fixes. | The initial browser retained the pre-edit stylesheet; a new query marker loaded the changed stylesheet. | Tablet browser check observed the new menu layout and no overflow. |

## Confirmed checks

- `git diff --check` passed.
- `node --check` passed for every root and `scripts/` JavaScript file.
- `node --test tests/*.test.js` passed: **73 tests, 0 failures**.
- Static local-reference scan resolved all paths from all **19** HTML pages: **0 missing**.
- The eight primary pages had one H1 and no horizontal overflow at 320px, 375px, 390px, 768px, 1024px, 1440px, and 1920px. The 390px standalone-guide sweep also found no overflow and exactly one H1 per page.
- Browser interaction checks completed: Stack Calculator (`1,000` → `15` stacks and `40` leftovers), Build Estimator (default → `143` blocks), Survival Planner (Iron Pickaxe → `3` Iron Ingots and `1` Log), Recipe search/full-screen view (Oak Stairs → `3` recipes), Smart Command Finder (`/give @s minecraft:diamond 64`), Farm search (Gold → `1 of 10`), Guide search, and default enchantment optimization (`23` total levels under its stated model).
- Settings Dark theme persisted after reload, then Reset returned defaults. The final local Home page console log contained **0 errors**.
- The live GitHub Pages homepage returned HTTP 200 (8,543 bytes; 0.054 seconds observed transfer). This was availability-only, not a full production browser audit.

## Not tested or still unverified

- No Lighthouse, PageSpeed Insights, throttled-network, Core Web Vitals, or full performance-budget measurement. The local background WebPs total about 4.0 MB, so performance needs a production measurement before a stronger performance claim.
- No physical iOS/Android device or VoiceOver/NVDA screen-reader audit.
- No in-game Java/Bedrock verification of all commands, recipes, enchantment costs, or farm behavior.
- External YouTube/source availability and playback were not rechecked; farm cards remain appropriately qualified and must not be read as independently verified rates/material lists.
- The supplied WebP background pack still lacks a source/capture/license record in the repository; retain permission/provenance before public advertising or wider distribution.
- The legacy `tests/browser-smoke.cjs` did not run because its expected Chrome debugging endpoint (`127.0.0.1:9227`) was unavailable. This is a test-environment limitation, not a confirmed site failure.

## Release recommendation

The audited branch is suitable for code review: confirmed functional and responsive defects found in this pass are fixed and covered by tests. Do not describe BlockWise as fully release-ready until the unverified accessibility, external-content, in-game accuracy, image-provenance, and performance items above are completed or formally accepted as beta limitations.
