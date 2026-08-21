# Google Maps Loader Fix Notes

The store locator mounted a `MapView` that injected the Google Maps JavaScript API on every mount and removed the script after it loaded. Remounts triggered by development rendering or the locator refresh control could therefore load the SDK again and produce Google’s duplicate-load warning.

The map component now reuses a module-level loading promise, retains one tagged script element, uses Google’s asynchronous loading parameter, and returns immediately when the Maps SDK is already available. The final fresh development session, started at 15:46:12 UTC, produced no new duplicate-loader, direct-load, or SDK-readiness console record.

The homepage locator navigation remains available in the same fresh session. The automated browser’s smooth-scroll behavior did not expose the locator controls inside its viewport, but the full page text still includes the locator search, city shortcuts, and refresh action.

A direct `#stores` navigation followed by an End-key attempt reached the locator canvas position in the automated browser, but the locator’s visual overlay did not render text in that browser capture. No new Maps console record was emitted during these navigation attempts.
