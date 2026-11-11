# BlockWise project context

## Goal

BlockWise is a free, beginner-friendly Minecraft guides-and-tools site for ordinary Java and Bedrock survival players. It uses plain HTML, CSS, and JavaScript with no dependencies, paid APIs, or build step.

## Current features

- Stack calculator
- Responsive mobile navigation
- Guide search, category filtering, and starter-detail panels
- Java Edition enchantment optimizer
- Resource & Crafting Planner with recursive recipe expansion, combined raw-resource totals, batch-aware crafting, storage estimates, checklist ticking, copying, reset, warnings, and live announcements
- Java 1.21.11 recipe browser: 1,470 source definitions, search, station/type filtering, pagination, alternatives, grids, smithing and other station layouts, and accessible initials with full-screen crafting-grid views.
- Build Material Estimator: overlap-safe room/house, wall, floor, and solid-cuboid calculations; repeated structures; openings; storage summaries; initial material ingredients; and a copyable gathering list.
- Farm Library: a searchable/filterable Java farm research directory for ten requested categories, with source attribution, dimension/type/difficulty metadata, requirements, and explicit data-confidence labels.
- Commands Explorer: a curated 39-command browser with command/goal search, category and edition filters, Java Edition 1.21.11 syntax, separate Bedrock reference syntax, safety guidance, copyable examples, and generators for ten common commands. Its separate Smart Command Finder is a deterministic local parser for bounded custom-item, effect, item-giving, teleport, world-control, summon, fill, clear, Java-XP, and game-mode intents, with intent-specific controls, source links, local favorites/recent history, and validated share URLs.
- Shared appearance settings: System/Light/Dark theme, four text sizes, compact/comfortable spacing, high contrast, reduced motion, persistence, and reset across every page.

## Important decisions

- Recipe data remains separate from planner calculation/rendering logic.
- Recipe coverage is intentionally small and limited to common vanilla recipes shared by Java and Bedrock.
- Storage calculations use each resource's modeled stack size, then total per-resource slots before estimating shulker boxes.
- Glass is an estimate: its fuel requirement is deliberately not modeled.
- Clipboard fallback must remain usable without clipboard permission: it exposes a focused, selected read-only text field for manual copying.
- The enchantment optimizer minimizes total levels across modeled legal book merges and successive applications. Books must each have a distinct enchantment and no prior work; selected or conflicting enchantments already on the item are unsupported. Minimum levels do not necessarily minimize raw XP points. Its book multipliers and maximum levels were compared against locally installed Java 1.21.11 data.
- Recipe item cues are initials derived from the Java 1.21.11 name data. Clicking or keyboard-activating a crafting grid opens a full-screen recipe view with full item names/alternatives. Zero game-derived textures are distributed because their public redistribution rights have not been established. The recipe browser represents all 1,470 source definitions structurally, but does not claim per-recipe visual or in-game verification.
- Build geometry uses external dimensions. Rooms/houses subtract an inner cuboid from the outer shell, while optional floors and ceilings occupy only that interior. Doors are 1×2, windows are 1×1, and a selected house ceiling is treated as a flat roof. The isolated `build-estimator.js` core can be reused by later tools.
- Farm research does not infer current compatibility, materials, storage, or output rates from unrelated or older designs. Only one creator-stated gold figure is retained, clearly marked as not independently benchmarked; all other catalog rates/materials remain unverified/not audited. See `farm-verification-report.md`.
- Visual design uses semantic CSS tokens rather than individual page-color patches. `theme-init.js` loads before the stylesheet on every page to apply saved preferences before paint. See `UI_DESIGN_REVIEW.md` for the palette, contrast measurements, and browser review.
- Motion is intentionally short and state-oriented: shared tokens govern controls, hover-capable cards, dialogs, menu navigation, disclosures, and calculation feedback. It uses opacity/transform/color transitions, never continuous effects, and is disabled by the saved Reduced Motion preference or the system reduced-motion preference.
- Public-beta baseline: all eight public pages now have page-specific descriptions and the local SVG favicon, while `tests/release-readiness.test.js` guards title/description/favicon/skip-link/H1/static-path basics. The focused Settings save handler responds to both `input` and `change` for native controls.
- Beta-readiness repository cleanup uses `.gitignore` to exclude local metadata, secrets, dependencies, logs, editor files, and local test artifacts. `.DS_Store` is intentionally removed from Git tracking but never deleted from the user's disk. The default remote is `https://github.com/unknown10998/BlockWise.git`; use a non-main branch for review.
- Guide links retain JavaScript detail-panel behavior but now have matching static fragment destinations with the essential tips for no-JavaScript navigation. The active JavaScript detail panel receives focus and its Close button returns focus to the originating link.
- Farm documentation and UI distinguish six verified rendered embeds from four external-only candidate source links. The candidate links have unverified creator identity and no rendered embed; all material lists remain unaudited, and the sole numeric rate is creator-stated rather than independently measured.
- Commands are an intentionally scoped reference, not an exhaustive in-game command parser. Command data is separate from rendering in `commands-data.js`; `commands-browser.js` renders it without dependencies. Java syntax is labeled for 1.21.11, while Bedrock is separately labeled as a stable-reference comparison. Smart custom-item output uses the Java 1.21.5+ simplified `minecraft:enchantments={...}` component form; Java 1.21.11 gamerules use registry IDs such as `minecraft:advance_time` and `minecraft:keep_inventory`. Generated commands are suggestions requiring player review, especially for permissions, selectors, destructive block operations, and edition-specific behavior. LocalStorage may be unavailable, in which case Smart favorites/history simply do not persist.
- `commands-intent.js` deliberately supports only recognized intent patterns. It uses Java 1.21.11 item-component syntax for custom items and accepts component enchantment values from 1 through 255; a natural-language request above 255 is clamped only with an explicit warning. It never executes a command, makes network calls, treats an unknown request as valid, or generates custom-item component syntax for Bedrock.

## Verification status

- Earlier-session test claims remain historical only.
- This session verified the normal browser clipboard path and that Reset does not copy the empty-state placeholder.
- This session also verified the stack calculator, guide search/filter, enchant optimizer, and 390px mobile navigation; browser console errors were empty.
- `node --check script.js`, the HTML/script ID check, and `node --test tests/planner-calculations.test.js` passed in this session. The six-test suite covers batch crafting, recursive totals, stack-size calculations, the clipboard-unavailable fallback, and the empty checklist guard.

## Current limitations and next steps

- Validate each new recipe before adding it, especially edition/version-specific ones.
- The planner does not model smelting fuel or every Minecraft recipe.
- The Java recipe dataset is imported, but special behavior and full display accuracy are not complete; do not conflate it with the existing cross-edition planner.
- Candidate source: misode/mcmeta `1.21.11-data-json`, commit `3926dfaf527cbf692f161ef8f7cdad17a1a06b74`. The source contains 1,470 recipe files. The new read-only audit parses 1,396 basic definitions and flags 74 special definitions; it does not establish completeness, game accuracy, valid item/tag references, or asset rights.
- Static item/tag references in all 1,470 pinned files resolved against Java 1.21.11 registry commit `208aa83038851414dfe235068fe36650b068384b`. See `recipe-coverage.json` for 62 special limitations and missing icons. Real Chrome smoke tests covered desktop and 390px mobile; further visual, in-game and special-recipe validation and an approved icon source remain.
- Current recipe audit verification: `node --check script.js`, `node --check scripts/audit-java-recipes.js`, `node --test tests/*.test.js`, and an audit of the pinned local checkout were run. No browser tests were run for this increment, which does not modify the website UI.
- Build-estimator verification this session: `node --check build-estimator.js`, `node --check script.js`, and `node --test tests/*.test.js` passed (31 tests). A local real-browser check confirmed the rendered default calculation and breakdown at desktop and 390px mobile width, with no console errors.
- Farm Library verification: `node --check farm-data.js`, `node --check farm-browser.js`, `node --check script.js`, and `node --test tests/*.test.js` ran successfully with 34 passing tests. A real local browser verified the desktop directory, Gold search, expanded sources/requirements, and the 390px mobile layout with no console errors. Rate/material accuracy beyond the explicit statuses in `farm-verification-report.md` remains unverified.
- Theme-audit verification: `node --check script.js`, `node --check theme-init.js`, and the full Node suite passed with 37 tests. Real-browser screenshots and interactions covered 320px, 375px, 390px, 768px, and 1440px layouts, both light and dark palettes, Extra Large text, high contrast, density, reduced motion, navigation Escape, settings persistence/reset, recipe/full-screen grid, stack/planner, farm/recipe search, and optimizer. Two visual overflows and a high-contrast specificity bug were found and fixed during that review.
- Motion-audit verification: syntax checks for `script.js`, `build-estimator.js`, and `recipe-browser.js` plus the 40-test Node suite passed. Real-browser checks covered 1440px, 768px, 390px, and 320px layouts; settings entry/exit and theme change, mobile menu/backdrop/Escape/focus, recipe-modal focus restoration, calculator result feedback, disclosure reveal, and reduced-motion behavior. No browser console errors were reported in the final check.
- Public-beta audit verification: shared-script syntax checks and `node --test tests/*.test.js` passed with 42 tests. A fresh local browser exercised every desktop public page and the principal responsive/functionality flows. See `RELEASE_CHECKLIST.md` for pass/fail/not-tested release criteria; do not claim production availability, device/screen-reader testing, external-link health, or complete Farm/texture readiness from this local audit.
- Commands Explorer verification is recorded in `CODEX_PROGRESS.md` after its final automated and browser checks. It still needs in-game syntax verification for every entry, exhaustive command coverage, physical-device testing, and screen-reader testing before any claim of complete command documentation.
