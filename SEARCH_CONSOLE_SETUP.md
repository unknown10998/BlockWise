# Google Search Console setup for BlockWise

This document describes manual account verification. Do not add an invented verification token or a GitHub access token.

## Site details

- Website URL: https://unknown10998.github.io/BlockWise/
- Search Console property type: **URL prefix** (not Domain)
- Exact property URL: `https://unknown10998.github.io/BlockWise/`
- Public sitemap URL (after this branch is merged and Pages deploys): `https://unknown10998.github.io/BlockWise/sitemap.xml`
- The eight public pages are listed in `sitemap.xml` using absolute canonical URLs; `lastmod` is omitted rather than guessed.

## Verify ownership

1. Open https://search.google.com/search-console with the Google account that should own the site.
2. Select **Add property** and choose **URL prefix**, entering the exact property URL above including the trailing slash.
3. Choose **HTML file upload** (recommended for GitHub Pages), then download Google's *actual* verification file named like `googleXXXXXXXX.html`. Do not change its filename or content.
4. Add that file to the root of the BlockWise repository (beside `index.html`), commit and push to `main`, and let GitHub Pages finish deploying. The file should be reachable as `https://unknown10998.github.io/BlockWise/googleXXXXXXXX.html`, using the exact name Google provided.
5. In Search Console click **Verify**. Keep the verification file in the published site so verification remains active.

Alternative: choose the **HTML tag** verification method and insert Google's actual `<meta name="google-site-verification" content="...">` into `index.html` inside `<head>`, then deploy and verify. Never invent the token.

## Submit sitemap and inspect indexing

1. After this branch is merged and GitHub Pages deployment succeeds, open `https://unknown10998.github.io/BlockWise/sitemap.xml` in a browser to confirm an XML document appears.
2. In the verified property open **Sitemaps**; submit `sitemap.xml` (or the full sitemap URL as the UI requests).
3. Use **URL inspection** on the homepage and key tool pages to request indexing when appropriate.
4. Check the **Pages/indexing** and **Search results/Performance** reports over time. Submitting the sitemap does not guarantee indexing or ranking.

## Cautions

- GitHub Pages project URL includes the case-sensitive `/BlockWise/` path.
- Do not use the **Domain** property type for `github.io`; DNS control of github.io belongs to GitHub.
- Do not put a `robots.txt` in the project folder assuming it controls `https://unknown10998.github.io/robots.txt`; robots.txt is scoped to the hostname root.
- Search Console ownership verification requires a real Google account and a Google-provided verification file or meta tag. This repository cannot create that token.
- Search Console reports may take time to populate. Indexing and search rankings are not guaranteed.
