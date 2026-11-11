# Product research — Smart Commands 2.0

Research recorded 2026-11-09. This is a pattern review, not a reuse of any product's branding, content, or visual assets.

## Patterns reviewed

- [Perplexity Pro Search](https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search) describes a visible research approach and follow-up refinement. BlockWise applies the useful part locally: a result appears immediately, explains what the command does, identifies its edition/version and permissions, and links to a supporting command or official change reference.
- [Goblin Tools](https://goblin.tools/) is organized as small, purpose-specific tools. Its [Formalizer](https://ios.goblin.tools/Formalizer) exposes a single understandable adjustment rather than a dense configuration screen. BlockWise mirrors that with only the fields relevant to the recognized intent, while retaining the original request box for a fresh task.
- Poe-like customizable tool platforms are a useful benchmark for reusable presets, but no third-party account or server is needed here. BlockWise implements private browser-local favorites, recent commands, deletion/clear controls, and validated shareable configuration URLs. It does not send histories to a service.
- [One in a Krillion's FAQ](https://www.onekrillion.com/faq) shows the appeal of a very small, browser-local daily interaction: one shared prompt, one attempt, and local progress. A daily Minecraft command challenge could encourage return visits, but command accuracy and useful editing are the higher priority. It is deliberately postponed; no gamification system was added.

## Product decisions in this increment

1. Put the generated result directly below the Smart Finder instead of sending users into the catalog.
2. Show executable-command warnings, edition/version, permissions, and a relevant source link with each supported result.
3. Keep follow-up fields intent-specific and bounded so unsupported prose does not turn into a guessed command.
4. Store favorites and recent configurations only in `localStorage`; malformed saved or shared data is validated before it is rendered.
5. Keep the Smart Finder and the Browse Commands search independent.

## Deferred

- A daily challenge, streaks, leaderboards, accounts, cloud sync, AI APIs, and broad free-text command generation.
- In-game execution verification for every generated command. Browser/unit checks validate the implementation and documented syntax patterns; they do not substitute for Minecraft world testing.
