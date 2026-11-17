# BlockWise asset and content-rights audit

Audit date: November 16, 2026. This is a project-record review, not legal advice or a certification of rights. “Verified” means the repository provides enough evidence for the narrow classification stated below; it does not certify commercial, advertising, trademark, privacy, or platform compliance.

## Official sources reviewed

- [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines) — fan information websites may use the Minecraft name fairly as a secondary descriptor, must avoid official-looking branding, must display an independent-project disclaimer, and must not redistribute game files. The guidelines say third-party website ads must not harm the Minecraft brand.
- [Minecraft EULA](https://www.minecraft.net/en-us/eula) — Minecraft content is not generally available for redistribution or commercial use except where the guidelines or another permission allows it.
- [Google AdSense: preparing pages](https://support.google.com/adsense/answer/7299563) — emphasizes unique, useful content, clear navigation, and care with copyrighted/embedded material.
- [Google AdSense: cookie use](https://support.google.com/adsense/answer/7549925) — states publishers must clearly display a privacy policy addressing cookie use when AdSense is used.

## Visual assets

| Asset | Current source evidence | Origin / AI status | Minecraft-owned material? | Classification | Required action before advertising |
| --- | --- | --- | --- | --- | --- |
| `assets/backgrounds/home-hero.webp` | Supplied to this workspace; no creator, source URL, prompt, license, or release is in Git history/docs. | Unknown. Do not assume AI-generated or cleared. | Unknown from repository record; visual similarity alone cannot establish origin. | NEEDS HUMAN VERIFICATION | Retain original source, creator/owner confirmation, and written permission/license covering public, ad-supported web use; replace if that cannot be obtained. |
| `assets/backgrounds/tools-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/commands-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/recipes-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/enchanting-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/guides-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/farms-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/about-hero.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above. |
| `assets/backgrounds/blockwise-site-background.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above; this 1.65 MB shared background also needs performance review. |
| `assets/backgrounds/social-share.webp` | Same supplied-pack record. | Unknown. | Unknown. | NEEDS HUMAN VERIFICATION | Same as above; do not rely on the social-card use as proof of a license. |
| `assets/backgrounds/overworld-landscape.svg` | Inline source is in this repository and its accessibility label identifies it as original blocky scenery. | Repository-authored vector illustration; no external asset import is referenced. | No extracted game file is present. | VERIFIED (repository provenance only) | Retain authorship record; do not market it as official Minecraft artwork or use Minecraft logos/textures in a later variant. |
| `assets/backgrounds/enchanting-cavern.svg` | Inline source is in this repository and its accessibility label identifies it as original blocky scenery. | Repository-authored vector illustration; no external asset import is referenced. | No extracted game file is present. | VERIFIED (repository provenance only) | Same as above. |
| `favicon.svg` and CSS `brand-mark` | Inline geometric artwork in this repository. | Repository-authored geometric mark. | No Minecraft logo or extracted texture is present. | VERIFIED (repository provenance only) | Keep it distinct from official Minecraft logos/fonts and avoid brand-confusing changes. |

### Image conclusion

There are **12 tracked scenic background assets** and one tracked favicon. Ten supplied WebP files are not cleared for advertising from the evidence in this repository. They are preserved because no confirmed infringement was found from source inspection alone, but they should be replaced with documented original/owned artwork if the owner cannot produce permission. The two SVG illustrations and favicon have repository-source evidence only; this is not a trademark clearance.

## Minecraft and third-party content

| Resource | Evidence / current behavior | Classification | Required action |
| --- | --- | --- | --- |
| Minecraft name and gameplay terminology | Used to describe game-related tools and content; footer and About page carry an independent-project disclaimer. | NEEDS HUMAN VERIFICATION | Keep the disclaimer prominent and recheck the current Usage Guidelines before monetization. The public owner/contact requirement is still open. |
| Minecraft textures / game files | Recipe Browser uses text initials; source audit and README state no extracted JAR textures are bundled. | VERIFIED (repository scan) | Keep game textures and JAR-derived icon exports out unless a separate written permission/license is obtained. |
| Minecraft recipe data and English item names | Version-pinned data was imported from community `misode/mcmeta` source material; repository documentation already says its code license does not grant underlying Minecraft asset rights. | NEEDS HUMAN VERIFICATION | Retain source commits/attribution; obtain legal advice or permission if a commercial/ad-supported use creates uncertainty. Do not represent the data source as official Mojang documentation. |
| YouTube embeds and links | Six Farm Library entries use `youtube-nocookie.com` iframes; other cards use external links. Videos are not downloaded or reuploaded. | NEEDS HUMAN VERIFICATION | Keep creator/title/link attribution; recheck availability and platform terms. Privacy-enhanced embedding is not a no-data guarantee. |
| Minecraft Wiki and other external documentation links | Outbound references only; no imported article text found in the project review. | VERIFIED (link-only behavior) | Keep links attributed; do not copy material lists/articles without permission. |
| GitHub Pages | Static hosting only; no first-party backend/database found. | VERIFIED (current integration) | Review GitHub's current terms/privacy statement before publishing policy claims that depend on it. |
| Google AdSense / analytics | Repository scan found no ad tags, publisher IDs, analytics tags, or ad endpoints. | VERIFIED (current source only) | Do not add code until adult-owner, privacy, consent, rights, and live-site review items in `ADSENSE_PRIVACY_READINESS.md` are complete. |

## Minecraft fan-site compliance concerns

1. The current disclaimer is present in the footer and now prominent on About, but the official guidelines also call for clear owner and contact information. No public operator/contact method is currently published. This is an owner decision, not a code-only fix.
2. “BlockWise” does not use the Minecraft name as its primary brand, and the repository's logo is original geometry. Continue to use “Minecraft” descriptively rather than as the dominant brand or logo.
3. The usage rules distinguish gameplay screenshots from standalone game assets. Do not infer that permission for screenshots grants permission to distribute extracted textures or item icons.
4. A Minecraft-information website can have third-party advertising only under the official guideline conditions. This audit does not determine whether any particular ad, provider, or placement satisfies them.

## Record the owner should retain

- Original download/source location, creator identity, and license or permission for each supplied WebP.
- Any AI-generation prompt/platform terms if a supplied image was generated by an AI tool.
- A dated review of Minecraft's Usage Guidelines and EULA before monetization.
- Creator/title/URL records for YouTube references and a process for removing unavailable or disputed embeds.
- A responsible adult's approved public contact method and ownership record before advertising.
