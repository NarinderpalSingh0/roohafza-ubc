# Roohafza Beverage Landing Page

An original, responsive product landing page for **Roohafza**. The experience pairs editorial campaign storytelling with a Shopify-powered can shop, a map-based store locator, and newsletter capture.

> **Brand line:** _make your health worth enjoying_

## What is included

| Area | Implementation |
| --- | --- |
| Campaign storytelling | Three-slide auto-playing carousel with a countdown progress bar, swipe controls, desktop arrows, keyboard shortcuts, and accessible flavour-detail modals. |
| Product showcase | Berry Bust, Straberry, and Rose cans, each listed as **330 ml** at **₹99**, with interactive 3D hover treatment. |
| Shop | Shopify Storefront API product loading, flavour/size filters, cart actions, checkout handoff, and success notifications. |
| Store locator | City shortcuts, current-location support, and an OpenStreetMap-based locator section. |
| Community | Newsletter email capture with persistent database storage and the official Roohafza Instagram link. |

## Technology

The application uses **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, **Express 4**, **tRPC 11**, **Drizzle ORM**, and **MySQL/TiDB**. Shopify product and cart actions are served through the Storefront API.

## Run locally

Use Node.js 20 or newer and pnpm 10. The lockfile is authoritative, so install with frozen dependencies before starting development.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The development server starts the Express application and Vite integration. The usual validation commands are:

```bash
pnpm test
pnpm check
pnpm build
```

`pnpm build` produces the client bundle in `dist/public` and the standalone local-server bundle in `dist/index.js`.

## Project map

| Path | Purpose |
| --- | --- |
| `client/src/pages/Home.tsx` | Main Roohafza landing-page composition and campaign interactions. |
| `client/src/components/ShopSection.tsx` | Shopify catalog, product filters, cart actions, toast feedback, and can-card interactions. |
| `client/src/components/StoreLocator.tsx` | Interactive store-locator interface. |
| `server/routers/commerce.ts` | Shopify Storefront API product, cart, and checkout procedures. |
| `server/newsletter.ts` | Newsletter subscription persistence. |
| `server/_core/app.ts` | Reusable Express+tRPC API factory. |
| `server/vercel-api.ts` | Source entry bundled into Vercel’s generated `api/index.js` function. |
| `vercel.json` | pnpm install/build configuration and static output directory. |

## Required environment variables

Do not commit `.env` files or any credentials. Local development and the Manus-managed environment supply these values automatically. For an external Vercel deployment, add the relevant values in **Project Settings → Environment Variables** for both Preview and Production.

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Newsletter persistence | MySQL/TiDB connection string. |
| `JWT_SECRET` | Authenticated session cookies | Use a strong, private production secret. |
| `SHOPIFY_STORE_DOMAIN` | Shop catalog, cart, and checkout | Store domain without protocol. |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | Shop catalog, cart, and checkout | Storefront API access token. |
| `VITE_APP_ID` | Manus OAuth client configuration | Build-time public configuration. |
| `OAUTH_SERVER_URL` | OAuth callback handling | Server-side OAuth endpoint. |
| `VITE_OAUTH_PORTAL_URL` | Login portal links | Build-time public configuration. |
| `OWNER_OPEN_ID` | Manus owner-aware backend features | Required if using Manus-managed owner features. |
| `OWNER_NAME` | Owner-aware frontend copy and features | Required if using owner metadata. |
| `BUILT_IN_FORGE_API_URL` | Optional Manus backend integrations | Not required for the page’s static brand imagery on Vercel. |
| `BUILT_IN_FORGE_API_KEY` | Optional Manus backend integrations | Keep server-only; not required for the page’s static brand imagery on Vercel. |
| `VITE_FRONTEND_FORGE_API_URL` | Manus frontend services | Build-time public configuration. |
| `VITE_FRONTEND_FORGE_API_KEY` | Manus frontend services | Build-time public configuration. |

> **Important:** The supplied wordmark, can renders, and campaign photographs now use stable public CDN URLs. They no longer depend on the Manus `/manus-storage/*` proxy or Forge credentials when deployed to Vercel.

## Deploy to Vercel

The recommended deployment source is the repository’s current default branch: **`manus/roohafza-latest`**. The deployment configuration uses `pnpm install --frozen-lockfile`, runs `pnpm build:vercel`, serves `dist/public` as the Vite client output, and rewrites `/api/:path*` requests to the bundled Express+tRPC function at `api/index.js`. The bundle is tracked so Vercel can discover the function before its build command executes, and is refreshed by `pnpm build:vercel`.

1. Import `NarinderpalSingh0/roohafza-ubc` into Vercel.
2. Set the Production Branch to `manus/roohafza-latest`.
3. Add the required variables above for Preview and Production.
4. Deploy a preview, then verify a product listing, cart/checkout handoff, newsletter submission, and campaign images.
5. Promote the verified deployment to production.

Vercel supports TypeScript functions inside an `/api` directory, and its `vercel.json` settings can override install, build, and output behavior.[1] [2]

## Branch note

`develop` and `manus/roohafza-latest` do **not** share a common Git ancestor. GitHub therefore cannot safely calculate a merge base or fast-forward one into the other. The deployment branch is already set as the repository default; retaining it avoids mixing an unrelated history into this application.

> Replacing or force-updating `develop` to match the Roohafza branch is intentionally not performed here, because it would overwrite history. Do that only after explicitly deciding that the existing `develop` contents are no longer needed.

## Reference links

[1]: https://vercel.com/docs/functions/runtimes/node-js "Vercel Node.js Functions"
[2]: https://vercel.com/docs/project-configuration/vercel-json "Vercel project configuration"
