# BlockWise — image provenance and integrity register

**Record assembled:** November 21, 2026  
**Scope:** Ten published WebP images in `assets/backgrounds/`  
**Repository baseline verified:** `main`, commit `097641b1c78f97612b6801980fb7c0012a309268`  
**Status:** SOURCE LINEAGE RECOVERED; THIRD-PARTY / BRAND-RIGHTS REVIEW STILL OPEN

This is a **public, privacy-safe summary of verifiable facts**, not a commercial-use permission certificate, copyright registration, endorsement, or legal opinion. The detailed original files and their ChatGPT deliverable archive are retained in a separate **owner-held private evidence ZIP**, not uploaded to public GitHub.

## What was recovered

- The original `BlockWise-Minecraft-Backgrounds-and-Codex.zip`, including `ASSET_MANIFEST.json`, `README_IMAGES.md` and `CODEX_INTEGRATION_PROMPT.md`. The delivered documentation expressly describes **eight original AI-generated Minecraft-inspired scene renders**, plus a social-sharing preview, rather than gameplay screenshots, website-scraped pictures or extracted Minecraft textures. This is a contemporaneous source statement, **not an independent generator log**.
- The manifest names original source files for the **eight scene images**. All eight original render files were recovered. Comparing each original resized to its published compressed WebP yielded mean absolute per-channel pixel differences of **2.05–4.88 on a 0–255 scale** (strong visual derivation evidence).
- A ninth original file, `golden_hour_lakeside_village.png`, was recovered for the separate page-wide `blockwise-site-background.webp`. Both files are **byte-for-byte identical**, despite the original file's `.png` name actually holding lossless WebP content.
- The `social-share.webp` image is recorded and present in the original nine-image delivery ZIP; the original manifest **does not identify a separate source render or exact generation prompt for it**.
- All **ten final WebP assets** in the recovered delivery matched the exact Git blob SHA-1 objects found in the published repository. This proves that these are the very same files, not lookalike replacements.
- Git history first added the initial nine WebPs in commit `600969396a19f9dd116787ab4c9948f42735e5ac` (November 15, 2026 UTC), and the separate lakeside backdrop in commit `ebf66ce6a8c4cd1e33dca40063223227861750de` (November 16, 2026 UTC). **Import dates are not generation dates.**

## Individual asset fingerprints

**Published hash = SHA-256 of the deployed/repository WebP file; Source hash = SHA-256 of the recovered original image file.** The comparison column is either per-channel mean absolute difference after resizing the source to final dimensions, or exact byte identity. Small differences corroborate image derivation, **not legal clearance**.

| Public WebP filename | Original render / source evidence | Published SHA-256 | Recovered source SHA-256 | Comparison |
|---|---|---|---|---|
| `home-hero.webp` | `a_highly_detailed_cinematic_minecraft_style_lands.png` | `5ede4b883081c0469f37d68c4fd4c7681e2f99d09b2e142151eda80cd380dec7` | `9862bea49daa1e8721c9c43304a5f73109a3c628ad5069a64435cbccb63738a6` | 4.22 |
| `tools-hero.webp` | `a_highly_detailed_bright_cinematic_minecraft_s.png` | `40ba2185306573242ce29081b5239448e16d9a357389fc62bda7f549ccd8b26b` | `d61ab17ce9ca609bebbe432923e5398c0ebcbc963bf480f39f503bf3aaf27be6` | 4.25 |
| `commands-hero.webp` | `a_highly_detailed_cinematic_minecraft_style_scene.png` | `8a3e2fdc2710cb675e77c5aff3e9c72046b1d3175060b5e5a06373501de97967` | `e8e5cfaad93971338625d29feeed0055eb6bd992e742eac285911d0cee682448` | 3.11 |
| `recipes-hero.webp` | `a_wide_highly_detailed_minecraft_style_render_sh.png` | `ecea473dc636fbeefe7d0a88ffb31d62dffb3202b2944773e34b2d499432ce2c` | `32976b664c3adee5ad8676961061c188fa818885af627a761d0bb8e2a1d143e8` | 2.51 |
| `enchanting-hero.webp` | `a_highly_detailed_atmospheric_minecraft_style_vo.png` | `08ee3ff956e0577a0b51210d373a5014ac7c02ecfd28cc79280c5540bfdff549` | `0672a95a39061aa248a14e83b72e8698ace117a5cfed03db88bd30da97ca82f8` | 2.05 |
| `guides-hero.webp` | `a_bright_highly_detailed_minecraft_style_scenic_l.png` | `08f70bfec65a8bd05d6d0451d8540f7247fbd3b68f2d2ff854a1a1fb56941939` | `16bbd5b520d6f654467eedf075214a0155d99b6e32c55af4ae000b3785af43f5` | 3.74 |
| `farms-hero.webp` | `a_detailed_vibrant_minecraft_style_scene_voxel_b.png` | `65902449393ff534792a18de9e9c745d1ad5ec4b2c7184a9898bd5c70a0ac4d9` | `0a6451692b3adc1546edd2875d7a8d8388f9153456b20200a73bdbea1a3ce4a5` | 4.88 |
| `about-hero.webp` | `a_vivid_detailed_minecraft_style_scene_rendered_w.png` | `b8a0d2159fa5aea7d07288e8f187e55b42ac21c8322bece313f398609ac7822e` | `8db7813a063696b36cc7b3e3cebd7fed4e841895d178a70149339cd6e311c1f7` | 4.05 |
| `social-share.webp` | `No separate original identified` | `7df411442acbe642c81dc6c78ec37cb3cc4b7dacb6ab8be292bb9219424c8973` | `—` | Pack member only |
| `blockwise-site-background.webp` | `golden_hour_lakeside_village.png` | `54f0bc0b24666afc8d9d5461fe22de4fa14f898db030057d71e7fbfbe011cf2a` | `54f0bc0b24666afc8d9d5461fe22de4fa14f898db030057d71e7fbfbe011cf2a` | Exact byte identity |

## Evidence quality and unresolved items

**Proven:** Original pack exists; its manifest identifies eight source renders; eight images closely match; lakeside original is identical to published file; all ten published WebPs match GitHub's blob identities.

**Documented original-pack claim (not independently proven by tool logs):** Those scenes are original AI-generated Minecraft-inspired illustrations. No evidence from the original pack states that official game textures or gameplay screenshot files were intentionally extracted.

**Not established:** Exact image-generation tool/model for every image, complete original prompts, account-specific generation receipts and timestamps, the presence/absence and legal status of input reference images, individual original source for `social-share.webp`, exclusive copyrightability, and permission to reproduce any third-party/IP-protected material that may appear. The first eight originals and the lakeside file are saved privately for future review.

**Current review classification:** Keep the ten WebPs as `NEEDS HUMAN VERIFICATION — provenance traced` until the responsible owner/adult reviews actual original ChatGPT conversations (if accessible), any reference-image inputs, full-size visual content, and commercial/ad-supported use. Do **not** misstate that OpenAI automatically grants rights to third-party Minecraft assets, and do **not** automatically replace the currently used images without identifying a confirmed problem.

## Review of terms (November 21, 2026)

- [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/): effective January 1, 2026; as between the user and OpenAI, and to the extent permitted by applicable law, users own generated Output and OpenAI assigns its rights, if any. Users are responsible for Input rights and avoiding infringement. Output may resemble other users' output; no automatic rights in third-party content.
- [OpenAI Service Terms](https://openai.com/policies/service-terms/): relevant additional product/service provisions.
- [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines): subject to conditions, allow Minecraft-information fan websites and third-party advertising that does not harm the brand, while requiring a prominent unofficial-project disclaimer and clear owner/contact details. Do not redistribute game files or treat the permission for gameplay screenshots as unlimited permission for textures/artwork.
- [Minecraft EULA](https://www.minecraft.net/en-us/eula): review alongside Usage Guidelines; Minecraft's game assets remain subject to their own rights.

These references were reviewed on November 21, 2026. They can change. This record is **not** permission granted by Mojang, Microsoft, OpenAI, or another person.

## Private evidence retention

The user should keep a private `BlockWise-Image-Rights-Evidence-PRIVATE.zip` containing:

- Original recovered source images (`original-images/`);
- the ten published WebPs (`published-webp/`);
- original pack ZIP, original asset manifest, original README and integration prompt (`generation-records/`);
- cryptographic source/final fingerprints (`SHA256_ASSET_MANIFEST.json`);
- the source-chain table (`image-sources.md`);
- the dated review of official public terms (`reference-terms/usage-terms-summary.pdf`).

This ZIP is **not committed** to the repository. It is for the site owner/responsible adult to retain. No source-file path in this repo should be represented as a public, open license.

## Remaining owner review before advertising

1. If possible, save the original **ChatGPT conversations and exact generation prompts** privately, including whether any external photos/screenshots were submitted as references. If they cannot be recovered, leave that evidence limitation documented.
2. Inspect every recovered source image at original resolution to rule out obvious Mojang/Microsoft logos, copied game textures, branded characters or suspicious third-party imagery. A visual review cannot guarantee noninfringement.
3. Confirm that any third-party input images were owned/licensed for the intended use; if there were no input images, record that as an owner-attested fact, not a tool assumption.
4. Have the responsible adult review intended website advertising, independent-fan branding, visible disclaimer and publisher/contact method.
5. Keep the private archive and rights notes as part of the site's records, and refresh this register if an image changes.
6. Mark commercial-use review as complete only after these findings are actually signed off. Until then, see `ADSENSE_PRIVACY_READINESS.md`.

## Provenance verification method

Published output SHA-256 values were computed from the recovered WebP outputs. Each matching Git blob SHA-1 was computed using the actual Git blob encoding (`SHA1("blob <byte length>\\0" + bytes)`) and compared to the GitHub repository tree. Source similarity was measured with original-to-output resizing and mean absolute RGB-channel differences. `social-share.webp` has no separate source similarity claim.

This process establishes reproducible file identity; it does **not** inspect protected input rights or issue a license.
