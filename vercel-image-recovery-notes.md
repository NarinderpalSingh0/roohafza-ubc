# Vercel Image Recovery Notes

## Diagnosis

The deployed Vercel page renders its image elements but requests the brand files from `/manus-storage/*`. Those URLs depend on the Manus server-side storage proxy and its Forge credentials, which are unavailable in the Vercel runtime. The affected request path returns an error instead of an image, leaving visible alt text and empty image regions.

## Recovery inventory

| Source asset | Recovery status | Local republishing source |
| --- | --- | --- |
| `roohafza-wordmark_3d050812.png` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-wordmark.png` |
| `roohafza-berry-bust_52910888.png` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-berry-bust.png` |
| `roohafza-no-chalan_ef606d6d.png` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-straberry.png` |
| `roohafza-nam-rakh-lena_8d4ce84b.png` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-rose.png` |
| `roohafza-rose-hydration_c571f84f.jpg` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-rose-hydration.png` |
| `roohafza-shared-table_910c0fa5.jpg` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-shared-table.png` |
| `roohafza-shared-lounge_7f55cc1b.jpg` | Recovered | `/home/ubuntu/webdev-static-assets/roohafza-vercel/roohafza-shared-lounge.png` |

## Public delivery map

| Asset | Public Vercel-compatible URL |
| --- | --- |
| Wordmark | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/yzILbvhHgFUEUepM.webp` |
| Berry Bust | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/fQtaQMNyonnyBkmT.webp` |
| Straberry | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/uDIDYlaLyOtAOXcA.webp` |
| Rose | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/IefVOhnOZpQczUaY.webp` |
| Rose campaign | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/uxGdYZQlzjRtXacr.webp` |
| Straberry campaign | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/EhUOOUuxFPBlbaDW.webp` |
| Berry Bust campaign | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663859136030/CHgjsPcsxspHOtZy.webp` |

The final repair replaces all `/manus-storage/*` brand asset references with these stable public URLs.

## Verification

The production site was confirmed to be requesting `/manus-storage/*` paths and displaying broken image regions. The republished wordmark URL was then loaded directly from `files.manuscdn.com` and rendered successfully without a project-specific proxy.

The public CDN repair was pushed to `manus/roohafza-latest` as commit `c40ba48`. The production domain was rechecked immediately after the push and is still serving the previous bundle, so it must be redeployed from the updated commit before live verification can be completed.

## Production promotion

The user approved promotion in their Chrome Vercel session. The `c40ba48` preview deployment was promoted on 20 August 2026, creating Production deployment `5Z2XTftVSyE4EKDAm65gTCBZz3cZ` from the same `manus/roohafza-latest` source commit. At the last check, Vercel was rebuilding it with the Production environment and had not yet reassigned the public alias.

The Production build completed successfully and assigned `roohafza-ubc.vercel.app` to deployment `5Z2XTftVSyE4EKDAm65gTCBZz3cZ`. A live Chrome-session check confirmed that the header wordmark, Rose campaign photograph, and Rose can render correctly on the public site. The broken `/manus-storage/*` image path is no longer used for the Roohafza brand assets.

The captured live production DOM contains all seven expected `files.manuscdn.com` WebP URLs for the wordmark, three can renders, and three campaign photographs. A direct DOM scan found zero `/manus-storage/roohafza-*` references.

## API runtime follow-up

Vercel’s Production resource list shows one Node.js function at the literal path `/api/[...path]`. Two correctly formed requests to `/api/trpc/commerce.products.list` returned the Vercel `404: NOT_FOUND` page before reaching tRPC. This establishes that the bracketed filename was emitted as a literal route rather than a usable catch-all API route and must be replaced with explicit Vercel routing.

Vercel’s routing guide documents `:path*` captures in `vercel.json` rewrites, and its Node.js Functions guide confirms that a TypeScript file at `api/index.ts` is a supported function entry point. The replacement will therefore route `/api/:path*` to `api/index.ts`, preserve the captured API subpath, and hand that reconstructed request to the existing Express+tRPC application. Sources: https://vercel.com/docs/routing/rewrites and https://vercel.com/docs/functions/runtimes/node-js.

The rewrite-backed fix was pushed as commit `5acb820` and Vercel completed Preview deployment `BSguCcehY7oGUakyL6p6yRJYshMT` successfully. The next step is to test the new Preview API route before any Production promotion.

The Preview request now reaches `/api` but returns Vercel `FUNCTION_INVOCATION_FAILED` (HTTP 500) rather than the previous route-level 404. This confirms the rewrite is active and narrows the remaining issue to the function’s startup or invocation runtime; Vercel runtime logs are being inspected next.

Vercel’s runtime log identifies `ERR_MODULE_NOT_FOUND`: the function cannot resolve `/var/task/server/_core/app` imported by `api/index.ts`. The rewrite is correct, but the API entry must use a bundled implementation of the shared Express application because Vercel does not package that source-module path into the individual function by default.

The bundled source entry was validated locally and pushed as `489dfc6`; its Preview deployment completed. However, the Preview `/api/trpc/commerce.products.list` request has reverted to Vercel `404: NOT_FOUND`, indicating that a function generated during `buildCommand` is not being recognized as an API route by this deployment configuration. The next diagnostic is to inspect this deployment’s resources and use a source-discoverable entrypoint if needed.

The tracked `api/index.js` entry fixed Vercel source discovery. The latest Preview for commit `e649920` responds from `commerce.products.list` with a typed tRPC error—`Shopify Storefront API is not configured`—rather than a Vercel 404 or function crash. This confirms the API routing and bundle now work. The remaining blocker for live commerce is the absent Vercel environment-variable configuration; the project currently has no Vercel variables configured.

The user approved promotion of `e649920` (`fix: show full Roohafza artwork`) to Production. Vercel created Production deployment `EFoBCpfrHaFU3YwJCS2Rh9B3ouY2` from that commit and is rebuilding it with the Production environment before assigning `roohafza-ubc.vercel.app`.

Production deployment `EFoBCpfrHaFU3YwJCS2Rh9B3ouY2` is now Ready and assigned to `roohafza-ubc.vercel.app`. A live Chrome-session check confirms the campaign photo and full Rose can are visible within the campaign frame without the former object-cover crop.

A final live Production capture also shows the Straberry lifestyle campaign image fully contained inside its blue frame, including both people, the table, and the full central can. The new `object-fit: contain` artwork treatment is live at `https://roohafza-ubc.vercel.app`.

The subsequent solid-colour refinement was verified in Vercel Preview deployment `8Mw8GDrqyWcsJRhLnMjZG7Wks1Go` for commit `5d60381`. The browser preview shows a sharp, complete Rose lifestyle image and can, framed by a deliberate deep-green brand-colour surround rather than a blurred image fill or white empty area. Desktop composition is balanced; the matching mobile view was also verified locally.

The user approved promotion of commit `5d60381` to Production. Vercel created Production deployment `GWBQD74khhbpzqQvHdcKkiceNjoh` from the verified Preview and began its Production rebuild before assigning `roohafza-ubc.vercel.app`.

Production deployment `GWBQD74khhbpzqQvHdcKkiceNjoh` is Ready, Current, and assigned to `roohafza-ubc.vercel.app`. The final live browser view confirms the sharp full Rose photo and can sit within an intentional deep-green solid surround, with no blurred fill or empty white area inside the campaign panel.

The store locator was also refactored from a split panel/map grid to a single full-width map canvas. Its controls now form a dark integrated overlay on desktop and move to a safe bottom overlay on mobile, preserving the locator search, location, city-shortcut, status, and retailer-link interactions.
