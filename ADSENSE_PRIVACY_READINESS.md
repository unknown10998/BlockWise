# BlockWise AdSense and privacy readiness

Status date: November 16, 2026. This checklist prepares a future review; it does not enable advertising, create an AdSense account, add a publisher ID, create `ads.txt`, or provide legal advice.

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
| Rights to supplied WebP visuals | Pending human verification | Ten supplied WebPs lack source/license evidence in the repo. See `ASSET_RIGHTS_AUDIT.md`. |
| Minecraft fan-site disclaimer | Partially completed | Footer and About clearly state the project is unofficial. Official guidance also expects owner/contact information; a suitable contact method is still needed. |
| Public owner/contact method | Pending responsible adult | Do not invent an email, address, or company identity. An adult owner must choose an appropriate, monitored public contact method before monetization. |
| Account age / ownership | Pending responsible adult | Google says AdSense applicants must be 18 or older; its guidance says a parent/guardian may sign up with their own account if the applicant is under 18. Existing project documentation notes an age-restricted Google account, so the adult owner must manage any application. |
| Unique, useful content and navigation | Partially completed | The site has original explanatory content, tools, and clear navigation. Continue improving content quality; do not assume this guarantees approval. |
| Live-site verification | Pending after merge/deploy | Check the live GitHub Pages URL, every footer link, policy URL, all ad/consent behavior if added, and browser console/network requests. |

## Before any advertising code is added

1. An eligible responsible adult must own and manage the AdSense account, payment/tax responsibilities, and public contact method.
2. Resolve or replace the ten supplied WebP images whose origin/license is not documented.
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
