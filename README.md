# BlockWise

A lightweight, responsive Minecraft guides-and-tools website built with plain HTML, CSS, and JavaScript. No build step, package manager, paid API, or external library is required.

## Run locally

1. Open this folder in Visual Studio Code.
2. Open `index.html` in a browser to preview the page.
3. For a more realistic local web server, install the free **Live Server** extension in VS Code, then right-click `index.html` and choose **Open with Live Server**.

## Files

- `index.html`, `tools.html`, `recipes.html`, `enchanting.html`, `guides.html`, `farms.html`, and `about.html` — the individual site pages
- `styles.css` — responsive layout and visual design
- `script.js` — stack calculator, mobile navigation, guide search/filter, guide detail panels, enchant optimizer, and the Minecraft Survival Planner
- `build-estimator.js` — reusable geometry and material-list core for the Build Material Estimator

## Current interactions

- Stack calculator supports whole-number quantities from 0 through 1,000,000,000.
- Guide cards can be filtered by category and searched by text.
- Guide links open short starter tips without leaving the page.
- Mobile navigation opens and closes with a button.
- The anvil optimizer searches book merges and successive item applications for the minimum total levels under its Java Edition Survival model. It assumes distinct single-enchantment books with no prior work and an item without selected or conflicting enchantments; duplicate upgrades and pre-enchanted items are not modeled. Raw XP points depend on player level and when XP is earned, so minimum levels do not guarantee minimum XP points.
- The survival planner recursively expands a small set of common Java/Bedrock vanilla recipes, combines repeated raw resources, and summarizes per-resource stacks, slots, and shulker-box count.
- The Build Material Estimator plans rooms, houses, walls, floors, and solid cuboids, then lists blocks, storage, modeled crafting ingredients, and a copyable gathering checklist.
- The Farm Library provides a searchable, filterable set of ten Java farm research references with direct source links, requirements, and transparent rate/material verification status.
- The header Settings control saves System/Light/Dark theme, Small/Normal/Large/Extra Large text, Compact/Comfortable density, High Contrast, and Reduced Motion preferences locally. Settings work across all pages and can be reset to defaults.

## Appearance and accessibility

BlockWise uses a restrained Minecraft-inspired palette: natural greens for identity and primary actions, neutral surfaces for content, and separately colored warning/error states. The saved appearance is applied before the main stylesheet loads to avoid a visible wrong-theme flash. Keyboard focus uses a dedicated high-visibility ring, and high-contrast/reduced-motion modes are available in Settings.

The automated suite includes contrast checks for the active light and dark normal-text pairs and focus colors. The latest audit measured all tested text pairs at 4.5:1 or greater and focus colors at 3:1 or greater. See [UI_DESIGN_REVIEW.md](UI_DESIGN_REVIEW.md) for the full palette, calculations, UX references, browser viewport review, and remaining testing limits.

## Motion and interaction feedback

BlockWise uses a small shared motion system for immediate feedback: controls acknowledge hover/press, hover-capable cards lift slightly, disclosures reveal their related content, calculators briefly acknowledge completed results, and mobile navigation/dialogs fade and move a few pixels. These transitions use 140–280ms tokens, do not delay actions, and do not animate the large recipe list in bulk.

The **Reduced Motion** setting and operating-system reduced-motion preference disable nonessential movement while preserving all interaction states, keyboard focus, and feedback. See [UI_DESIGN_REVIEW.md](UI_DESIGN_REVIEW.md) for the tested behaviors and motion-design sources.

## Farm Library

Open `farms.html` for Iron, General Mob & XP, Sugar Cane, Bamboo, Creeper, Gold & XP, Enderman XP, Villager Crop, Slime, and Honey & Honeycomb references. This is deliberately a research catalog rather than a claim that all ten builds are verified for Java 1.21.11: nine cards say “Rate not verified,” and their materials are “Not audited.” The Gold & XP card retains ianxofour’s linked creator-stated 360-gold-blocks/hour figure but labels it as not independently benchmarked. See [farm-verification-report.md](farm-verification-report.md) for all coverage and limits.

Only videos verified as loadable embeds are shown in the Farm Library. Candidate videos with an unverified creator or player availability are not displayed as watchable embeds.

## Build Material Estimator notes

- Dimensions are outer block dimensions. For rooms and houses, the wall shell is `length × width × height − inner length × inner width × height`, so corner blocks are counted once.
- Optional floors and ceilings fill only the hollow interior, avoiding overlap with wall blocks. Doors remove 2 wall blocks each and windows remove 1. A house ceiling is treated as a flat roof; sloped and decorative roofs are not estimated.
- The initial material mappings are oak planks, stone bricks, glass, cobblestone, and bricks. Ingredient quantities round up to whole crafting batches. Glass warns that furnace fuel is not yet modeled.

## Survival Planner notes

- The first release supports a small set of common survival items and recipes, including stone bricks, glass, furnace, bread, crafting table, chest, iron pickaxe, bucket, brick block, planks, sticks, and their common ingredients.
- The planner is intentionally conservative: unsupported items are flagged, ambiguous or variable recipes are labeled with warnings, and the app avoids claiming full Minecraft recipe coverage.
- Storage math uses each resource's modeled stack size, 27 slots per shulker box, and counts slots separately for different item types.
- Crafting output batches are modeled for recipes such as planks (4), sticks (4), and stone bricks (4), so targets that do not divide evenly show the extra output.
- For items like glass, the planner labels the recipe as an estimate because the smelting step and fuel are not modeled.

## Important notes

- This is an independent fan project, not affiliated with Mojang or Microsoft.
- The planner is a first version: useful for everyday survival planning, but not a complete recipe database.

## Testing the project locally

1. Open `index.html` in a browser or use **Live Server**.
2. Confirm the stack calculator still updates correctly.
3. Open the resource planner in the Tools section and test a few examples such as:
   - Stone Bricks x 1 → expected: 1 stone
   - Stone Bricks x 5 → expected: 2 stone and 8 output stone bricks from 2 batches
   - Iron Pickaxe x 1 → expected combined checklist: 3 iron ingots + 1 log; the breakdown still shows the 2-stick intermediate and its 4-stick craft batch
   - Furnace x 1 → expected: 8 cobblestone
4. Check the checklist, Copy checklist button, Reset action, and warning states. If clipboard permission is unavailable, the planner reveals a selected manual-copy text field instead of leaving you with only an error message.
5. Confirm the guide filter/search and enchant optimizer still work after the planner is added.

## Known limitations

- Recipe support is intentionally limited to a starter set of common craftables.
- Some recipes vary by version or edition; the planner labels those cases instead of guessing silently.
- The result is a planning estimate, not a full-game recipe lookup or economy calculator.
- The selected Java/Bedrock edition is shown for clarity, but this starter recipe set contains only recipes shared by both editions; broader edition/version differences are not yet modeled.
- The checklist copy feature depends on browser clipboard access. If access is unavailable, BlockWise shows the exact checklist text in a focused, selected read-only field for manual copying.

## Automated checks

Run the dependency-free planner calculation tests with:

```sh
node --test tests/planner-calculations.test.js
```

This test command also covers the clipboard-unavailable fallback and confirms that the empty checklist placeholder is never copied.

Run the complete test suite, including Build Material Estimator geometry and validation tests, with:

```sh
node --test tests/*.test.js
```

## Public beta readiness

The site is buildless and can be served by free static hosts such as GitHub Pages or Cloudflare Pages; no server, package installation, or paid API is required. Before deploying, review [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). It records verified functionality and the release blockers that must not be hidden: incomplete Farm Library verification, unresolved rights to redistribute Minecraft textures, and untested production/device/accessibility conditions.

For a static-host deployment, publish this folder with `index.html` at the public root and no build command. After deployment, test the published HTTPS URL, external video/source links, and the target devices before promoting the beta.

## Java recipe browser

The Recipes section covers the imported **Java Edition 1.21.11** definitions, separately from the cross-edition starter planner. It works by opening `index.html` directly. Search by output name, item ID or recipe ID, filter by station and recipe type, and page through the results. Ingredient alternatives are listed below each grid; shapeless positions are illustrative. Click a crafting grid, or use Enter/Space while it is focused, to open a full-screen recipe view with larger slots and full item names.

The source is [misode/mcmeta](https://github.com/misode/mcmeta), a community-maintained extraction of Minecraft data, tag `1.21.11-data-json`, commit `3926dfaf527cbf692f161ef8f7cdad17a1a06b74`; item registry tag `1.21.11-registries` is commit `208aa83038851414dfe235068fe36650b068384b`; English item names use `1.21.11-assets-json` commit `00cd93a451611a147b99a439e76c74d040407b69`. It is not an official Mojang project. Its code license should not be assumed to license the underlying Minecraft data or graphics. [Minecraft's usage guidelines](https://www.minecraft.net/en-us/usage-guidelines) allow appropriately branded Minecraft-information websites and third-party ads that do not harm the brand, but treat textures as Minecraft assets and prohibit redistributing game files. No game textures are included; text initials provide the item cue while game-derived icons remain unavailable pending clear separate permission or licensing. Review data and asset rights before public or advertising-supported deployment.

### Local texture-pipeline investigation

For Java 1.21.11, item selection starts with `assets/minecraft/items/<item-id>.json`, which points to an item or block model. Simple item models resolve their `layer0` to `assets/minecraft/textures/item/<name>.png`; those files are already transparent PNGs and can be resized with nearest-neighbour scaling without changing their alpha. Block-model items and dynamic/conditional items instead require resolving parent models and rendering their block/item model to a transparent canvas using the version-matched `assets/minecraft/models/**`, `assets/minecraft/textures/**`, and item-definition JSON files. A reliable production renderer therefore needs the complete 1.21.11 model resolver, including parent inheritance, texture references, display transforms, overrides/selectors, block models, and block textures.

The repository includes an audit only; it does not export assets. To inspect a locally installed legal copy without writing artwork into this repository, run:

```sh
node scripts/audit-local-item-icons.js /path/to/1.21.11.jar /tmp/blockwise-item-icon-audit.json
```

This audit creates an ID-to-JAR-path manifest outside the project. It cannot grant a publication license. A screenshot is expressly treated differently in Mojang’s guidance: the guidelines specifically allow sharing gameplay screenshots, while a standalone PNG extracted from a JAR is a copied game texture/content file. For a public, potentially AdSense-supported website, the official materials reviewed do **not** expressly grant permission to redistribute a standalone extracted item-texture library. A third-party repository can only license its own work, not Mojang/Microsoft’s underlying artwork. Written permission or a clearly applicable official asset license is required before shipping those PNGs or generated derivatives.

To reproduce the audit, obtain that exact tag separately and run:

```sh
node scripts/audit-java-recipes.js /path/to/mcmeta/data/minecraft/recipe
node scripts/build-recipe-slice.js /path/to/data/minecraft/recipe /path/to/data/minecraft/tags/item /path/to/registries/item/data.json /path/to/assets/minecraft/lang/en_us.json recipe-data.js recipe-coverage.json
node --test tests/*.test.js
```

The build script regenerates `recipe-data.js` and `recipe-coverage.json`. The report records all 1,470 source definitions: 1,396 standard and 74 special, with zero unresolved static item/tag references and 977 distinct fixed output IDs. Automated structural validation covers all 1,470 imported definitions: shaped dimensions/slots, shapeless inputs, fixed output counts, and station-input layouts. The 74 specials are represented as follows: 32 transmutations show their two defined inputs and fixed item type; 18 smithing trims show their template/base/addition choices and honestly identify their input-dependent outputs; 12 smithing transforms show three inputs and a fixed output; and 12 game-rule recipes are rendered as labeled limitation panels without invented grids. This is not recipe-by-recipe visual or in-game verification.
