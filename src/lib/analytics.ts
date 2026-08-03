type EventProps = Record<string, unknown>;

function trackEvent(name: string, props?: EventProps): void {
  if (import.meta.env.DEV) {
    console.info("[analytics] event:", name, props ?? "");
  }
}

function trackPageView(path: string): void {
  if (import.meta.env.DEV) {
    console.info("[analytics] pageview:", path);
  }
}

export const analytics = {
  trackEvent,
  trackPageView,
} as const;
