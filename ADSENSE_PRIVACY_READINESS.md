# BlockWise AdSense and privacy readiness

Status updated: November 24, 2026. This checklist prepares a future review; it does not enable advertising, create an AdSense account, add a publisher ID, create `ads.txt`, or provide legal advice.

## Current state

| Requirement | Status | Evidence / next action |
| --- | --- | --- |
| Separate Privacy Policy | Completed in branch | `privacy.html` describes current browser-local storage, GitHub Pages, YouTube embeds, and that ads are not active. Publish only after review/merge. |
| Easy Privacy access | Completed in branch | Footer Privacy link appears on all public HTML pages; About links prominently to the policy. |
| Current AdSense / analytics scripts | Not active | Source scan found no `ca-pub-`, Google ad endpoint, AdSense tag, or analytics tag. Keep it that way until the owner approves activation. |
| Current cookie consent banner | Not active | Correct for the current no-ad/static site. Do not add a fake consent control before a real consent implementation is selected. |
| AdSense privacy notice | Pending before activation | Google says publishers using AdSense must clearly display a privacy policy about cookies. Update the policy for the actual providers, cookies, choices, and data flows before adding code. |
| EEA, UK, Switzerland consent | Pending before activation | Google documents a certified CMP/TCF requirement for relevant personalized-ad traffic. Choose a current supported solution and obtain adult-owner/legal review; requirements can change. |
| Child-directed / children's privacy review | Pending before activation | Minecraft has a broad-age audience. A responsible adult must assess applicable child-privacy rules, traffic, targeting, and any accounts/forms/analytics before advertising. |
| Rights to current WebP visuals | Replacement complete; final rights review pending | Ten current WebPs were replaced in `bac4227` on November 23, 2026 and have SHA-256/Git-identity records in `IMAGE_PROVENANCE_REGISTER.md`. The owner reports ChatGPT text-directed generation without external website references, but prompts, receipts, and the named private source ZIP were not independently inspected. |
| Minecraft fan-site disclaimer | Partially completed | Footer and About clearly state the project is unofficial. Official guidance also expects owner/contact information; a suitable contact method is still needed. |
| Public owner/contact method | Pending responsible adult | Do not invent an email, address, or company identity. An adult owner must choose an appropriate, monitored public contact method before monetization. |
| Account age / ownership | Pending responsible adult | Google says AdSense applicants must be 18 or older; its guidance says a parent/guardian may sign up with their own account if the applicant is under 18. Existing project documentation notes an age-restricted Google account, so the adult owner must manage any application. |
| Unique, useful content and navigation | Partially completed | The site has original explanatory content, tools, and clear navigation. Continue improving content quality; do not assume this guarantees approval. |
| Live-site verification | Pending after merge/deploy | Check the live GitHub Pages URL, every footer link, policy URL, all ad/consent behavior if added, and browser console/network requests. |

## Before any advertising code is added

1. An eligible responsible adult must own and manage the AdSense account, payment/tax responsibilities, and public contact method.
2. Use `IMAGE_PROVENANCE_REGISTER.md` to review all ten replacement WebPs, confirm any available generation context and reference-image history, visually inspect possible protected elements, and document an adult-owner commercial-use decision. The named private source ZIP was not available in this workspace; do not claim it was verified or backed up unless the owner can confirm that separately. Replace only assets whose rights cannot be supported after review.
3. Re-read the current [AdSense site-readiness guidance](https://support.google.com/adsense/answer/7299563), [cookie guidance](https://support.google.com/adsense/answer/7549925), [eligibility guidance](https://support.google.com/adsense/answer/9724), and [EEA/UK/Switzerland consent requirements](https://support.google.com/adsense/answer/13554116).
4. Re-read the current [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines) and [EULA](https://www.minecraft.net/en-us/eula), including the rules on unofficial presentation, advertising, assets, and contact responsibility.
5. Determine applicable privacy, consumer, tax, and children's-privacy rules with a qualified adult/legal adviser. Google certification does not itself determine legal compliance.
6. Select and configure a real consent-management approach if it is required for the traffic and ad configuration. Do not implement a cosmetic banner that does not control the actual tags.
7. Update `privacy.html` with the exact ad provider, publisher configuration, vendor/cookie disclosures, user choices, retention details, and contact method that are actually in use.
8. Add only real publisher verification values and `ads.txt` entries supplied by the approved account. Never invent `ca-pub-` IDs, tokens, or ads.txt values.
9. Review ad placement so it does not obstruct calculators, recipe grids, controls, or content and does not harm the Minecraft brand.
10. Test the deployed site at desktop and mobile widths with consent accepted/rejected where applicable, then document the result before submitting an application.

## Official requirements reviewed

- [How AdSense uses cookies](https://support.google.com/adsense/answer/7549925): describes cookie use and says publishers must display a privacy policy informing visitors about cookies.
- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563): calls for unique, relevant content, clear navigation, and care with external/copyrighted content.
- [Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724): states the applicant must be at least 18, with parent/guardian sign-up guidance for under-18 applicants.
- [Google consent management requirements](https://support.google.com/adsense/answer/13554116): describes certified CMP/TCF requirements for relevant EEA, UK, and Swiss traffic.
- [Minecraft Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines): permits Minecraft-information websites under stated conditions, including brand/disclaimer requirements and ad constraints.

## Decision record

Advertising is intentionally **not enabled** by this work. BlockWise is not AdSense-approved and this checklist does not imply legal, privacy, copyright, tax, or platform compliance.

## November 23 image-replacement update

The old scenic WebPs were replaced with ten new current files in `bac4227`, merged into `main` as `142fb06`. Their current SHA-256 checksums and Git blob identities are publicly recorded and regression-tested. This confirms which bytes are deployed; it does **not** resolve third-party/IP rights, Minecraft brand questions, commercial-use rights, or the final owner monetization decision. The owner-provided statement that the replacements were generated in ChatGPT from text without external website references remains unverified by local prompts, receipts, or a source archive. Do not label BlockWise AdSense-ready based on the replacement alone.

The site has no active advertising or tracking. A responsible adult must still complete consent, contact, account-ownership, privacy, rights, and deployed-site review before activation.
