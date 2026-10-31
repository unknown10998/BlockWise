# BlockWise UI design review

## Scope

This review refreshed the existing static BlockWise interface without changing recipe data, calculator formulas, farm research, or the plain HTML/CSS/JavaScript architecture.

## Problems found in the first review

- The dark preference depended on many light-only component declarations, leaving cards, controls, notices, and page chrome inconsistent.
- The default system-dark view had weak visual grouping between the page, cards, controls, and navigation.
- At 320px with Extra Large text, the footer links made the Recipe page horizontally scroll.
- At 768px, the full desktop navigation overflowed horizontally.
- High-contrast mode was losing to the more-specific dark-theme token selector, so it did not fully switch to its black-and-white palette.
- The compact mobile Settings control visually hid its text but needed a durable programmatic name.

## UX guidance consulted

- [Laws of UX](https://lawsofux.com/) informed the use of familiar navigation and forms (Jakob's Law), grouped cards/controls (Proximity and Common Region), deliberately limited primary-action emphasis (Von Restorff Effect), and large tap targets (Fitts's Law).
- [Nielsen Norman Group's usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) informed visible selected navigation, immediate calculator/status feedback, clear modal exits, and consistent controls.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) informed the contrast, keyboard-focus, reduced-motion, text-size, and responsive checks.
- [MDN's CSS color reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value) was consulted when choosing stable CSS color values and documenting rendering limits across displays.

## Final palette

| Purpose | Light | Dark |
| --- | --- | --- |
| Page | `#F5F7F3` | `#101A15` |
| Surface | `#FFFFFF` | `#1B2920` |
| Muted surface | `#EAF1EA` | `#24352B` |
| Primary text | `#19251E` | `#EBF5ED` |
| Secondary text | `#53675A` | `#C3D5C8` |
| Border | `#DCE5DD` | `#34483A` |
| Primary action | `#246B45` | `#83D9A5` |
| Warning text/background | `#684A0A` / `#FFF5DD` | `#FFE4A6` / `#3C3017` |
| Error text/background | `#8A2F28` / `#FFF0ED` | `#FFCBC5` / `#481F1B` |

The stylesheet exposes these as semantic tokens (`--page`, `--surface`, `--control`, `--text`, `--text-muted`, `--border`, `--accent`, state colors, and focus color), with legacy aliases only for untouched component logic.

## Contrast results

Contrast was calculated using WCAG relative luminance and is automatically checked in `tests/theme-contrast.test.js`.

| Pair | Result |
| --- | ---: |
| Light primary text on surface | 15.85:1 |
| Light secondary text on page | 5.64:1 |
| Light button/link text on primary green | 6.43:1 |
| Light warning and error text | 7.52:1 / 7.52:1 |
| Dark primary text on surface | 13.59:1 |
| Dark secondary text on page | 11.58:1 |
| Dark button text on primary green | 9.56:1 |
| Dark warning and error text | 10.39:1 / 9.82:1 |
| Light focus ring against page | 3.79:1 |
| Dark focus ring against page | 12.49:1 |

All listed text pairs exceed WCAG AA's 4.5:1 normal-text target; both focus rings exceed the 3:1 non-text target.

## Design decisions

- Neutral page and surface tones carry most of the interface. Green is reserved for brand, primary actions, active navigation, selected recipes, and success-like state cues.
- Cards, inputs, result panels, warning/error panels, filters, recipe slots, and modal surfaces now inherit a common token system in both themes.
- Buttons have a 44px-or-greater practical target size, explicit hover/active contrast, and a consistent focus ring.
- The tablet header changes to the familiar hamburger pattern below 940px; the existing two-column tool layout remains available at tablet width.
- System/Light/Dark, text size, density, high contrast, reduced motion, and Reset remain in the shared Settings dialog. `theme-init.js` applies saved choices before CSS loads to avoid an incorrect-theme flash.
- The mobile settings label is visually hidden rather than removed, and the button also has an explicit `aria-label`.

## Browser review and revisions

Real local-browser screenshots were inspected during the review. They were captured in the browser test session and were not written as workspace image files.

| Viewport | Theme / page reviewed | Outcome |
| --- | --- | --- |
| 320px | Dark Recipe Browser, Extra Large text | Found footer horizontal overflow; fixed by wrapping mobile footer links. Rechecked with `scrollWidth === clientWidth`. |
| 320px | Light Farms | No horizontal overflow; controls and disclosure fit. |
| 375px | Dark Recipe Browser mobile menu | Navigation is touch-sized and Escape closes it. |
| 375px | Light Farms | Heading, warning, filters, and header controls fit. |
| 390px | Light Recipe Browser | Search/filter controls and recipe list fit cleanly. |
| 390px | System-dark Farms | Cards, filters, and warning panel are readable. |
| 768px | Light and dark Tools | Found desktop-nav overflow; switched header to hamburger at tablet width and rechecked with no overflow. |
| 1440px | Light Farms and Guides; dark Home, Recipes/full-screen grid, Optimizer, and About | Navigation, card hierarchy, calculator layout, full-screen recipe layout, footer, and page headings were inspected. |

High-contrast mode was also inspected in the optimizer after its specificity defect was corrected. Extra Large text was reviewed in the Recipe Browser and full-screen crafting-grid view.

## Verification performed

- `node --check script.js`
- `node --check theme-init.js`
- `node --test tests/*.test.js` — 37 passed, 0 failed, including the new palette contrast tests.
- Browser interactions: theme persistence across reload, reset to defaults, high contrast, compact density, reduced motion, keyboard Escape for mobile navigation, Stack Calculator (`1000` → `15` full stacks + `40` leftover), Iron Pickaxe planner checklist, recipe search/selection/full-screen control, Farms search (`gold` → `1 of 10`), and optimizer (`23` total levels).
- Browser console: no error messages in the final Farms and optimizer checks.

## Remaining limitations

- This is a manual visual and interaction audit, not an assistive-technology audit or a test on physical mobile hardware.
- The site still uses system fonts; a font download was deliberately avoided to preserve a no-dependency, no-cost static site.
- Existing historical recipe, farm-video, and planner coverage limitations remain unchanged.

## Motion design update

### Principles and sources

- [Laws of UX](https://lawsofux.com/) informed the short feedback loops (Doherty Threshold), stable hit targets (Fitts's Law), familiar menu/dialog behavior (Jakob's Law), and restrained use of visual distinction (Aesthetic-Usability Effect).
- [web.dev's motion accessibility guidance](https://web.dev/learn/accessibility/motion) informed the explicit Reduced Motion preference, respect for the operating-system preference, and the decision to avoid flashing or continuous animation.
- [Chrome's motion guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/motion) informed the use of opacity and transform for transient movement, plus `@starting-style` / `allow-discrete` where available for top-layer dialogs.
- [MDN's CSS transitions guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions) informed the fallback-friendly entry/exit transition model.

### Motion tokens

`styles.css` now has a shared, dependency-free motion system:

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 140ms | Pressed, hover, and control-color feedback |
| `--motion-normal` | 200ms | Dialog, result, and disclosure feedback |
| `--motion-slow` | 280ms | Mobile navigation panel |
| `--ease-standard` | `cubic-bezier(.4, 0, .2, 1)` | General state changes |
| `--ease-out` | `cubic-bezier(0, 0, .2, 1)` | Entering content |
| `--ease-in` | `cubic-bezier(.4, 0, 1, 1)` | Available for departures |

No rule uses `transition: all`; no continuous, flashing, parallax, auto-playing, or list-wide animation was added.

### Components updated

- Buttons and controls now receive short color/border/shadow transitions and a stable 1px pressed acknowledgement.
- Tool, guide, farm, recipe, and optimizer cards lift 2px only on devices that report a real hover pointer.
- Mobile navigation uses a fading backdrop and a 280ms opacity/transform panel transition. Escape and backdrop clicks close it and return focus to the menu trigger.
- Settings and the full-screen recipe dialog have a 200ms fade/vertical entry and an animated exit while retaining native dialog semantics. Closing a recipe restores focus to its originating grid/button.
- Farm and ingredient disclosures reveal their associated contents with a small 200ms fade/translate; recipe lists themselves do not animate in bulk.
- Stack Calculator, Survival Planner, Build Material Estimator, and the normal Enchantment Optimizer result path apply a one-shot, non-numeric 200ms result-entry cue after an actual user calculation.
- Theme changes temporarily transition only relevant colors, surfaces, borders, and shadows; font-size changes remain immediate.

### Reduced motion

The existing **Reduced Motion** setting disables all added movement, and the same component-level behavior is disabled when the operating-system `prefers-reduced-motion` preference is active. State changes, focus, and feedback remain visible without motion.

### Motion browser checks

- At 390px, mobile navigation opened with an active backdrop and stable expanded state; Escape closed it, hid the backdrop, and returned focus to `#menuToggle`.
- Settings was captured during its entry transition (measured intermediate opacity/transform), then closed with focus returning to its trigger.
- The full-screen recipe modal focused its close control, then removed itself and returned focus to the invoking recipe control.
- A Stack Calculator submission applied `result-updated` and still produced 15 stacks / 40 leftover for 1,000 items.
- A farm disclosure had the `detail-reveal` animation active at 768px with no horizontal overflow.
- During a Light-theme change, `theme-transitioning` and its 200ms component transitions were present; the finished light page was visually inspected.
- At 320px, the light Farms layout retained no horizontal overflow. With Reduced Motion selected, mobile navigation reported `0s` transition duration while remaining fully usable.
- The final browser-console check had no errors.

The local browser captures were inspected during this task but were not written as workspace image files.
