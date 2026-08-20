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
