# Codex task: Build BlockWise's all-player Minecraft Survival Planner

You are working on **BlockWise**, a beginner-friendly Minecraft guides and tools website. Read the existing `index.html`, `styles.css`, `script.js`, and `README.md` before editing. Preserve the current visual style and working features, including the stack calculator, guide search/filter, navigation, and any enchantment optimizer already present.

## Goal
Build a genuinely useful **Minecraft Survival Planner** for ordinary Java and Bedrock survival players—not an economy-server-only tool. It should help players figure out what they need before starting a build or crafting project.

## First release scope
Implement one polished, functional **Resource & Crafting Planner** with:
1. A clear target/project input (choose a supported item or material and enter a target quantity).
2. A recipe breakdown that recursively converts the target into ingredient totals where the recipe data is known.
3. A combined resource checklist so repeated ingredients are added together rather than listed separately.
4. Stack and leftover counts, plus a clearly labeled estimate of storage slots / shulker boxes.
5. A checklist users can tick off and a “Copy checklist” action.
6. Helpful warnings when an item is not supported, a recipe is ambiguous, a recipe varies by edition/version, or the calculator is only estimating.
7. Mobile-friendly layout, accessible labels, keyboard operation, and result announcements via `aria-live`.

Start with a **small, accurate set of common recipes** rather than pretending to support every Minecraft recipe. Keep recipe data separate from calculation logic so more recipes can be added later. Label the supported edition/version and limitations clearly. Do not invent recipes or claim complete Minecraft coverage.

## Quality requirements
- Use the project's existing plain HTML, CSS, and JavaScript approach. No frameworks, paid APIs, build tools, or dependencies.
- Keep the code organized and readable; avoid duplicating existing utilities or breaking current features.
- Validate inputs, handle zero/invalid values, and avoid unsafe `innerHTML` when rendering user-controlled text.
- Use accurate stack sizes where known (e.g. 64, 16, or non-stackable); clearly flag anything not modeled.
- Do not mix Java and Bedrock recipes silently. If a recipe differs, label the edition or ask the user to select an edition.
- Include a “Reset” control and sensible empty/error states.
- Update README.md with the new tool, how to test it, and known limitations.
- If practical, add a `CODEX_PROGRESS.md` checklist recording what changed and what remains.

## Work process — follow this order
1. Inspect all current files and summarize the existing structure before changing anything.
2. Make a short plan.
3. Implement the smallest complete version of the planner.
4. Check JavaScript syntax and verify HTML element IDs/event handlers match.
5. Test calculations with hand-checkable examples and report the exact inputs and expected/actual outputs.
6. Check that existing tools still work. Do not claim browser testing unless you actually ran it.
7. Finish with a concise summary of changed files, tests performed, known limitations, and how I can test it locally.

Do not replace the whole website or remove existing features. If a needed design choice is unclear, choose a simple default and explain it instead of stopping for minor questions.
