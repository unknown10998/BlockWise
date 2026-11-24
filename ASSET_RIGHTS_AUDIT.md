# BlockWise asset and content-rights audit

Audit updated: November 24, 2026. This is a project-record review, not legal advice or a certification of rights. “Verified” only describes the specific repository evidence named below; it does not certify commercial, advertising, trademark, privacy, platform, or copyright compliance.

## Official sources reviewed

- [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines) — fan information websites may use the Minecraft name fairly as a secondary descriptor, must avoid official-looking branding, must display an independent-project disclaimer, and must not redistribute game files. The guidelines say third-party website ads must not harm the Minecraft brand.
- [Minecraft EULA](https://www.minecraft.net/en-us/eula) — Minecraft content is not generally available for redistribution or commercial use except where the guidelines or another permission allows it.
- [Google AdSense: preparing pages](https://support.google.com/adsense/answer/7299563) — emphasizes unique, useful content, clear navigation, and care with copyrighted/embedded material.
- [Google AdSense: cookie use](https://support.google.com/adsense/answer/7549925) — states publishers must clearly display a privacy policy addressing cookie use when AdSense is used.

## November 23, 2026 — current image replacement

The active WebP backgrounds were replaced in `bac42270cb8f45f944f8aa5d00c04458d1d92ca1`, then merged into `main` as `142fb06324eb0f6710e457eb83b7811bdfcb9b42`. The current files, dimensions, SHA-256 checksums, and Git blob SHA-1 values are listed in [IMAGE_PROVENANCE_REGISTER.md](IMAGE_PROVENANCE_REGISTER.md). The Git change and present-file integrity are verified; a Git blob SHA-1 is not represented as a SHA-256 checksum.

The task owner reports that the replacement scenes were newly generated in ChatGPT from text directions, with no external website images supplied as generation references. The workspace has no prompts, generation receipts, conversation export, or inspectable private source package to independently verify that statement. `BlockWise-New-Image-Sources-PRIVATE.zip` was not found locally during this audit. The original-generation claim therefore remains owner-provided evidence, not a completed rights clearance.

## Visual assets

| Asset | Verified repository evidence | Origin / reference-image status | Minecraft / third-party concern | Classification | Required action before advertising |
| --- | --- | --- | --- | --- | --- |
| `assets/backgrounds/home-hero.webp` | Current bytes, SHA-256, Git blob SHA-1, dimensions, and replacement commit are recorded and regression-tested. | Owner reports a new ChatGPT text-directed image with no external reference image; not independently verified. | No extracted game file was found in the repository; visual/IP review remains necessary. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Responsible adult reviews full image and available generation context before commercial use. |
| `assets/backgrounds/tools-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/commands-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/recipes-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/enchanting-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/guides-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/farms-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/about-hero.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/blockwise-site-background.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| `assets/backgrounds/social-share.webp` | Same current-image integrity evidence. | Same owner-reported origin; not independently verified. | Same unresolved review. | NEEDS HUMAN VERIFICATION — replacement provenance recorded | Same review requirement. |
| Previous WebP versions | Previous SHA-256 and Git identities are preserved in the public history section of the register. | Historical Vecteezy Pro connection is recorded without a license claim. | Do not treat the old reference as evidence about current assets. | HISTORICAL — SUPERSEDED | Keep separate from the current-assets review. |
| `favicon.svg` and CSS `brand-mark` | Inline geometric artwork in this repository. | Repository-authored geometric mark. | No Minecraft logo or extracted texture is present. | VERIFIED (repository provenance only) | Keep it distinct from official Minecraft logos/fonts and avoid brand-confusing changes. |

### Image conclusion

The ten current scenic WebPs have verified replacement and integrity records, but not final commercial-use or advertising clearance. The superseded files remain recoverable in Git history. The previous Vecteezy reference is historical only, and this repository does not claim a purchase or license for it. Neither current ChatGPT generation nor Git-based integrity verification grants rights in third-party or Minecraft intellectual property.

## Minecraft and third-party content

| Resource | Evidence / current behavior | Classification | Required action |
| --- | --- | --- | --- |
| Minecraft name and gameplay terminology | Used to describe game-related tools and content; footer and About page carry an independent-project disclaimer. | NEEDS HUMAN VERIFICATION | Keep the disclaimer prominent and recheck the current Usage Guidelines before monetization. The public owner/contact requirement is still open. |
| Minecraft textures / game files | Recipe Browser uses text initials; source audit and README state no extracted JAR textures are bundled. | VERIFIED (repository scan) | Keep game textures and JAR-derived icon exports out unless a separate written permission/license is obtained. |
| Current scenic WebPs | Owner reports text-directed ChatGPT generation with no external references; Git replacement and hashes are verified. | NEEDS HUMAN VERIFICATION | Review actual available generation context, full images, current policies, and commercial-use risk before advertising. |
| YouTube embeds and links | Farm Library entries use `youtube-nocookie.com` iframes where present; videos are not downloaded or reuploaded. | NEEDS HUMAN VERIFICATION | Keep creator/title/link attribution; recheck availability and platform terms. Privacy-enhanced embedding is not a no-data guarantee. |
| Minecraft Wiki and other external documentation links | Outbound references only; no imported article text found in the project review. | VERIFIED (link-only behavior) | Keep links attributed; do not copy material lists/articles without permission. |
| GitHub Pages | Static hosting only; no first-party backend/database found. | VERIFIED (current integration) | Review GitHub's current terms/privacy statement before publishing policy claims that depend on it. |
| Google AdSense / analytics | Repository scan found no ad tags, publisher IDs, analytics tags, or ad endpoints. | VERIFIED (current source only) | Do not add code until adult-owner, privacy, consent, rights, and live-site review items in `ADSENSE_PRIVACY_READINESS.md` are complete. |

## Remaining responsible-adult review

1. Retain any available original ChatGPT conversation, prompts, receipts, and reference-input history privately; do not fabricate unavailable evidence.
2. Inspect current full-resolution assets for potential protected imagery, branded elements, copied textures, or other issues. This cannot guarantee noninfringement.
3. Re-read current Minecraft Usage Guidelines and EULA before advertising; do not equate permitted fan-site naming with a license to use every image.
4. Review advertising, public contact method, account ownership, privacy, consent, and monetization decisions with a responsible adult before activation.
5. Keep private records excluded from Git. Public documentation may state only non-sensitive evidence and unresolved limits.
