# BlockWise planner progress

## GitHub repository cleanup and beta-preparation follow-up

- Confirmed the `origin` fetch/push remote is `https://github.com/unknown10998/BlockWise.git`; work is on the local `beta-readiness` branch and does not alter `main`.
- Added `.gitignore` for macOS metadata, local secrets, dependencies, generated outputs, logs, and editor/test artifacts. The tracked `.DS_Store` entry is removed from Git's index without deleting the local Finder metadata file.
- Added `.github/workflows/tests.yml`. It uses Node 22, runs syntax checks and the dependency-free Node suite on pushes to `main` and pull requests targeting `main`; its first real GitHub execution remains to be verified after a push.
- Corrected the Farm Library documentation: six categories have rendered verified embeds (Iron, Sugar Cane, Bamboo, Gold & XP, Enderman XP, Honey & Honeycomb). General Mob & XP, Creeper, Villager Crop, and Slime have external YouTube source links only, with unverified creator identity and no rendered embed. No farm material list is audited; Gold & XP's 360 gold blocks/hour remains creator-stated and not independently benchmarked.
- Fixed guide-link fallback behavior. `#starter-storage`, `#starter-mining`, and `#starter-building` now resolve to static content if JavaScript is unavailable. With JavaScript, the existing focused detail panel remains the interaction path and Close returns focus to the trigger.
- Added Node regression tests for guide fallbacks/focus source behavior and GitHub Actions workflow structure. Release checklist deployment instructions now cover the approved GitHub Pages path, while distinguishing publication gates from future research.
- Verification actually run for this follow-up: `git diff --check`; syntax checks for `script.js` and `farm-browser.js`; and `node --test tests/*.test.js` (46 passing, 0 failing after the Farm embed-split regression test). Real-browser checks used a fresh localhost preview at 320px, 390px, 768px, and 1440px: guide detail focus/close focus return; mobile navigation Escape focus return; Farms' ten cards/six iframe embeds/external-only notice; Dark + Reduced Motion Settings; seven desktop page titles/descriptions/no horizontal overflow; and a final empty console-error log. GitHub Actions has not yet run remotely.

## Public beta readiness audit

- Audited Home, Tools, Recipes, Enchant Optimizer, Guides, Farms, and About for public-facing scope, static paths, page metadata, heading structure, responsive overflow, and feature regressions.
- Fixed two confirmed release-baseline gaps: every public page now declares the existing SVG favicon, and each page now has a page-specific meta description. Added `tests/release-readiness.test.js` to keep these SEO/accessibility basics, skip links, and local static-hosting references checked.
- Improved Settings compatibility: native select controls now save preferences on both `input` and `change`, rather than relying on only one event type.
- Verification actually run: syntax checks for shared, calculator, recipe, and Farm scripts; `node --test tests/*.test.js` completed with **42 passing tests and 0 failures**. Browser testing used a fresh local static server: all seven pages passed a 1440px title/H1/main/favicon/no-overflow check; Recipes, Tools, and Farms had no horizontal overflow at 320px; Guides and Optimizer had no overflow at 768px; the 390px menu closed with Escape and restored focus; Light theme persisted through reload; search, recipe modal, stack/planner/build calculators, Farm accuracy labels, and optimizer output were exercised. Final console-error log was empty.
- Created `RELEASE_CHECKLIST.md`, which clearly records the remaining blockers: Farm Library research/coverage, Minecraft-texture rights, external video/link availability, production performance measurements, physical-device testing, screen-reader testing, and post-deploy HTTPS checks. No hosting accounts or external services were changed.

## Professional motion and interaction audit

- Added a shared motion system in `styles.css`: 140ms/200ms/280ms timing tokens, three reusable easing curves, scoped transition properties, and no `transition: all`, continuous loops, flashing, or list-wide recipe animation.
- Added restrained hover, pressed, disabled, and focus-compatible feedback to controls. Cards lift only 2px on fine hover-capable devices, avoiding sticky touch hover states.
- Reworked the tablet/mobile navigation state in `script.js`: a fading click-to-close backdrop, short opacity/transform panel entry/exit, Escape support, and focus restoration to the menu trigger. The layout remains stable and does not lock scroll.
- Settings and full-screen recipe dialogs now have subtle entry/exit motion. Their close behavior remains immediate enough to cancel interactions, preserves native dialog semantics, handles Escape/backdrop close, and restores focus to the invoking control.
- Added one-shot result feedback for the Stack Calculator, Survival Planner, Build Material Estimator, and normal Enchantment Optimizer result path; values are never counted or delayed.
- Existing Reduced Motion and system `prefers-reduced-motion` preferences disable the added movement while retaining state changes and focus feedback.
- Added `tests/motion-system.test.js`. Final verification actually run: JavaScript syntax checks for `script.js`, `build-estimator.js`, and `recipe-browser.js`; `node --test tests/*.test.js` passed 40 tests with 0 failures. Browser testing at 1440px, 768px, 390px, and 320px covered dark/light states, mobile menu open/close/focus, settings dialog, theme transition, recipe dialog focus restoration, calculator feedback, farm disclosure, reduced motion, responsive overflow, and console errors. See `UI_DESIGN_REVIEW.md` for details and sources.

## Professional theme and visual UX audit

- Rebuilt the shared appearance layer around semantic light/dark tokens for page, surfaces, controls, text, borders, accents, focus, warnings, errors, and information states. Existing calculators, recipe data, and farm data were not changed.
- Added `theme-init.js`, loaded before `styles.css` on every site page. It safely applies the saved appearance choice before the first paint, while `script.js` continues to own the accessible, automatically saved Settings dialog.
- Settings now work consistently across pages for System/Light/Dark, Small/Normal/Large/Extra Large text, Compact/Comfortable density, High Contrast, Reduced Motion, and Reset. The compact gear control retains an explicit accessible name.
- Browser screenshot review found and fixed a 320px Extra Large-text footer overflow, a 768px desktop-navigation overflow, and a high-contrast CSS-specificity defect. The tablet header now uses the existing hamburger pattern below 940px.
- Added `tests/theme-contrast.test.js`. Its measured WCAG calculations cover ten normal-text pairs (all at least 4.5:1) and both focus colors (at least 3:1). See `UI_DESIGN_REVIEW.md` for palette, ratios, UX sources, viewport review, and remaining limits.
- Verification actually run: `node --check script.js`, `node --check theme-init.js`, and `node --test tests/*.test.js` (37 pass, 0 fail). Real browser checks covered 320px, 375px, 390px, 768px, and 1440px layouts in light/dark states; settings persistence/reset/high contrast/density/reduced-motion, mobile Escape behavior, recipe full-screen view, stack/planner, recipe/farm search, and optimizer were exercised. Final Farms and optimizer browser-console checks had no errors.

## YouTube farm-tutorial upgrade — partial, evidence-limited

- Added lazy privacy-enhanced YouTube embeds inside the Farms source disclosures for the directly verified Iron, Gold & XP, Honey & Honeycomb, Sugar Cane, and Bamboo tutorial references. Sugar Cane and Bamboo intentionally share ilmango's combined tutorial. Each embed has creator credit, a channel link, `allowfullscreen`, and a direct YouTube fallback.
- Six cards remain unembedded because a credible creator tutorial with a verified URL, author, version fit, and exact matching material list was not established in this research pass. No substitute video IDs, material counts, timestamps, build stages, or production values were invented.
- Follow-up research added Jumper's direct Java 1.21.11 Enderman XP Farm tutorial embed. The remaining unembedded cards are General Mob & XP, Creeper, Villager Crop, and Slime; each needs a source that establishes the actual channel/creator as well as a working farm video.
- A fresh browser test found the General Mob candidate's `youtube-nocookie` iframe remained blank, so unverified candidate embeds for General Mob & XP, Creeper, Villager Crop, and Slime were removed rather than shown as watchable. Existing/directly verified embeds remain; the Enderman embed loaded with player controls and the Jumper channel link.

## Farm Library — research catalog first increment

- Added a dedicated `farms.html` page with a responsive searchable/filterable directory for the ten requested categories: Iron, General Mob & XP, Sugar Cane, Bamboo, Creeper, Gold & XP, Enderman XP, Villager Crop, Slime, and Honey & Honeycomb. Every card has a direct source link, a separate mechanics reference, dimension/type/difficulty fields, requirements, and an explicit version/rate/materials status.
- Added `farm-data.js` as the source-of-truth catalog and `farm-browser.js` as its dependency-free renderer. The “Known rate first” sort is intentionally not presented as a performance ranking: it only puts cited numeric claims first and displays a warning because the other cards have no comparable verified rate.
- Retained only one numeric figure: ianxofour’s Gold & XP tutorial states 360 gold blocks/hour and Java 1.13–1.21 support. It is labelled creator-stated and not independently benchmarked. The iron and honey creator links are older-version references; all other rates are explicitly “Not verified for 1.21.11,” and every material list is “Not audited.” No materials, storage totals, simulator values, or block-by-block build instructions were invented.
- Added `farm-verification-report.md` and `tests/farms.test.js`. The next gate is selecting one exact 1.21.11 creator build per farm, auditing its materials/conditions, and validating its output in a controlled test world before planner integration.
- Verification run for this increment: `node --check farm-data.js`, `node --check farm-browser.js`, `node --check script.js`, and `node --test tests/*.test.js` completed successfully (34 tests passed, 0 failed). A real local-browser check covered the desktop directory, Gold search (1 of 10), the expanded source/requirements disclosure, and a 390px-wide mobile layout; the browser console had no errors.

## Recipe grid full-screen recipe view

- Replaced crafting-grid hover tooltips and individual-slot expansion with a full-screen recipe view. Clicking or keyboard-activating the crafting grid opens a larger 3×3 layout with full Java Edition 1.21.11 item names; tag alternatives show their complete accepted-name list.
- Added a close button and backdrop-close behavior, plus regression coverage for the keyboard-accessible full-screen grid trigger and alternatives.
- Added a visible “⛶ Full-screen recipe” button below every crafting grid, in addition to the clickable grid itself, so the larger interactive view is discoverable without guessing.

## Build Material Estimator — completed first increment

- Replaced the inactive Storage planner card with a working Build Material Estimator. It supports houses, rectangular rooms, walls, floors, solid cuboids, material selection, dimensions, wall thickness, floor/flat-ceiling options, door/window openings, and repeated identical builds.
- Added `build-estimator.js` as an independent calculation module. Its room/house formula makes an outer shell minus an inner shell, so corners are counted once, and interior floor/ceiling blocks do not overlap walls. It produces block totals, stack leftovers, slots, shulker estimates, batch-rounded ingredients, warnings, checklist copying, and a manual-copy fallback.
- Initial material mappings are intentionally explicit: oak planks, stone bricks, glass, cobblestone, and bricks. Glass warns that furnace fuel is not yet modeled; sloped roofs, decorative details, and arbitrary recipe-database material selection remain future work.
- Added four Node tests covering overlap-safe geometry, solid cuboids, crafting batch/storage math, and invalid geometry/material values. `node --check build-estimator.js`, `node --check script.js`, and `node --test tests/*.test.js` all passed: 31 passing tests, 0 failures.
- Real-browser QA used the local site at desktop and 390px mobile width. The default house rendered 143 Oak Planks, 36 Oak Logs, and the expected walls/floor/openings breakdown; browser-console errors were empty.
- Next requested tool: What Can I Craft? It must use the complete Java recipe data while distinguishing independent craftability from simultaneous inventory allocation.

## Recipe initials and accessible tooltips

- Removed the semantic-glyph renderer. Recipe-list, ingredient-grid, station-input, and output item cues now show the first letter of the Java Edition 1.21.11 display name sourced from the existing item-name data.
- Added full-name tooltips: hover and keyboard focus reveal them; each grid/output item is an accessible button whose touch-style tap toggles the tooltip. Ingredient tags retain their complete valid-name alternatives in the tooltip and accessible name.
- Live-browser verification covered an initial in a recipe list/grid/output, the visible focused tooltip, touch-style tap expansion, and Space-key toggling. No Minecraft texture was downloaded or bundled.

## Real Minecraft texture investigation

- Verified the locally installed Java 1.21.11 JAR’s version-matched asset layout: `assets/minecraft/items/` item definitions, `assets/minecraft/models/item/` and `models/block/` models, plus `textures/item/` and `textures/block/`. Added `scripts/audit-local-item-icons.js`, a local-only ID-to-JAR-path audit that does not extract, copy, or publish any artwork. Its actual 1.21.11 run found 1,505 item definitions: 651 direct transparent item textures, 705 model-render cases, 147 dynamic model cases, and 2 parent-model cases.
- Official guidance distinguishes shareable gameplay screenshots from copied game content. The EULA and Usage Guidelines do not expressly permit redistributing standalone extracted item textures for this potentially ad-supported fan site; third-party repositories cannot grant Mojang/Microsoft rights they do not own. Therefore no texture asset, derivative icon, or runtime URL mapping was added to the website.
- Required before enabling actual icons: a written Mojang/Microsoft authorization or a clearly applicable official license that covers hosting the extracted/generated 1.21.11 item-icon library on this website, including the intended advertising. The existing original glyphs remain in place.

## Recipe-browser visual reliability increment

- Replaced temporary letter placeholders with original BlockWise semantic glyphs for all item IDs. The glyphs distinguish item families and common color variants; no Minecraft texture or game file is bundled.
- Reviewed Minecraft’s Usage Guidelines. They allow Minecraft-focused informational websites and advertising that does not harm the brand, while treating textures as Minecraft assets and prohibiting redistribution of game files. No independent redistribution grant for extracted item textures was established, so game-derived icons remain unavailable.
- Improved special-recipe rendering: 32 transmutations and 30 smithing recipes retain their source-defined station inputs; long alternative lists are collapsible; the 12 game-rule definitions have explicit limitation panels rather than fabricated grids.
- Added renderer-structural validation over all 1,470 definitions plus browser-renderer tests for glyphs and game-rule special recipes. Updated `recipe-coverage.json` with structural-validation and icon-coverage status.
- Browser QA verified local search, shaped empty slots/output quantity, glyph visibility, and game-rule limitation panels. The automated Chrome desktop/390px smoke runner could not run because no Chrome debugging session was available; full cross-feature desktop/mobile browser regression and in-game verification remain.

## Enchantment optimizer minimum-level correction

- Expanded the optimizer to search all modeled combinations of book merges and successive applications to the item, rather than requiring all books to be combined before the final application. The baseline now applies individual books in the listed order.
- Compared the existing enchantment multipliers and maximum levels with the locally installed Java 1.21.11 game data and corrected 13 multipliers. Fixed the Density/Breach conflict check.
- Added independent exhaustive small-case comparisons and multiplier regression tests. The guarantee is for total levels within the displayed assumptions, not raw XP points; duplicate enchantments, previously worked books, and selected/conflicting enchantments already on the item are not modeled.
- Current verification: JavaScript syntax and Node suite run as reported in the final handoff. Browser testing was blocked by the environment denying a local server socket; in-game validation and mobile/browser testing remain.

## Full Java 1.21.11 data import

- Generated all 1,470 definitions: 1,396 standard and 74 special, with 977 unique fixed output IDs and zero unresolved static references. `recipe-coverage.json` lists each limited special case and all 1,505 item-registry IDs without approved icons.
- Added station/type filters, pagination, version-matched English item names, smithing inputs, transmutation inputs and explicit explanations for code-defined or input-dependent behavior. The full dataset is imported; full display accuracy has not been verified.
- Chrome headless smoke checks covered desktop and 390px mobile, including search, oak stairs grid, stone-brick alternatives, stonecutting, pagination, stack calculator, planner, guides, optimizer, mobile navigation and console errors. More in-game recipe-by-recipe and mobile-device testing remains.

## First visual recipe slice

- Added eight Java 1.21.11 recipe definitions generated from pinned mcmeta data, with search, station filters, alternative output recipes, ingredient choices, crafting grids and station-specific layouts.
- Validated static item and tag references in 1,470 recipe files against registry commit `208aa83038851414dfe235068fe36650b068384b`; the audit returned zero unresolved references. Special recipes with code-defined behavior remain unvalidated.
- Original letter placeholders are used while rights to redistribute game textures remain unconfirmed. The Minecraft usage guidelines and mcmeta's source description were reviewed; see README.
- Ran syntax checks and 17 Node tests, including reference resolution and DOM-simulated browser interactions. No real browser or mobile visual test was run for this slice.

## Recipe browser research and first data-pipeline increment

- Identified community-maintained mcmeta Java `1.21.11-data-json`, commit `3926dfaf527cbf692f161ef8f7cdad17a1a06b74`, as a candidate version-specific source. Its generated recipe data is separate from its code license; rights to redistribute game data and imagery need review.
- Added `scripts/audit-java-recipes.js` and parser tests. The read-only audit of that checkout found 1,470 definitions: 1,396 basic shaped, shapeless, cooking, or stonecutting definitions and 74 other definitions needing special handling. No recipe data or images were imported and there is no browser UI yet.
- Ran JavaScript syntax checks on `script.js` and the audit script; ran all Node tests and the source audit. The audit reported no structural parsing errors. This is not item/tag/icon validation or complete-coverage verification.
- Remaining: review source and image rights, obtain and validate version-matched item/icon mappings, implement a real-data end-to-end UI slice, then import and verify the full dataset and test browser/mobile regressions. No browser testing was performed for this increment.

## Completed

- Audited the existing static site and preserved the stack calculator, navigation, guide search/filter, guide details, and enchantment optimizer.
- Kept planner recipe data separate from recursive calculation and rendering logic.
- Added batch-aware recipe expansion for common recipes, including planks, sticks, and stone bricks.
- Combined repeated resources and calculated stacks/leftovers and storage slots per item type.
- Preserved checklist ticking, copy, reset, warnings, and live result announcements.
- Updated the README with usage examples and limitations.
- Added a visible manual-copy fallback: when clipboard access fails, the generated checklist text appears in a focused, selected read-only field.
- Added dependency-free Node tests for recipe batch rounding, recursive totals, and modeled stack sizes.

## Verified in the current session

- Browser: normal checklist copy works; Reset no longer allows the empty checklist placeholder to be copied.
- Browser: iron pickaxe planning still produces 3 iron ingots and 1 log.
- Browser: stack calculator returns 15 full stacks and 40 leftovers for 1,000 items; guide search/filter, enchant optimizer, and the 390px mobile navigation still work with no console errors.
- Automated: `node --check script.js` and the HTML/script ID check passed.
- Automated: `node --test tests/planner-calculations.test.js` passed 6 tests covering recipe/storage math, clipboard-unavailable manual copy, and the empty checklist guard.

## Still needs manual/browser testing

- Optionally test clipboard permission denial in a browser or device that blocks clipboard access; its expected fallback behavior is now automated, but a device-level permission check would provide extra confidence.
- Test responsive layout at narrow mobile widths and keyboard focus order.
- Expand recipe coverage only after validating each recipe for the intended edition/version.
