# Vercel Locator Release Notes

The verified locator release was pushed to `manus/roohafza-latest` at commit `f59c693`. Vercel detected it as a new Preview deployment, completed the build successfully, and promoted it to Production as deployment `6HvR9shQZ`. The public `roohafza-ubc.vercel.app` domain now aliases this Production release.

The public Production bundle was inspected after promotion and includes the live `nearbySearch` lookup, retailer-card copy, broader retailer-search link, and mobile locator-toggle implementation.

After the map-canvas regression report, commit `61b6d1d` was pushed to `manus/roohafza-latest`. Vercel created a new Preview deployment for the OpenStreetMap fallback repair and began its build; the candidate must be promoted after it reaches Ready.

The map-fallback Preview completed successfully and was promoted to Vercel Production as deployment `5gKC4VKmv`, which reached Ready using the Production environment.

The public Production JavaScript bundle was verified to contain the `openstreetmap.org/export/embed.html` fallback, and the centred Delhi embed endpoint returned HTTP 200. This ensures a visible map canvas even when the enhanced client Maps SDK does not initialise.

The later map-refresh release from commit `0458742` was built and promoted to Vercel Production deployment `43TDmS8JQ`. The public site’s rendered locator content includes the `Refresh map` control beside the existing `Explore Delhi` caption.
