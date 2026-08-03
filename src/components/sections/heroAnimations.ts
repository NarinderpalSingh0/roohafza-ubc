export const HERO_ANIM = {
  entrance: {
    background: { duration: 1.2, delay: 0 },
    brandMark: { duration: 0.8, delay: 0.3, y: 20 },
    headline: { duration: 1.0, delay: 0.5, y: 40 },
    subtitle: { duration: 0.8, delay: 0.8, y: 20 },
    cta: { duration: 0.6, delay: 1.1, scale: 0.9 },
    scrollIndicator: { duration: 0.6, delay: 1.5 },
  },
  scroll: {
    pinDuration: 1,
    backgroundY: "-20%",
    headlineScale: 0.85,
    subtitleOpacity: 0,
    ctaOpacity: 0,
    scrollIndicatorOpacity: 0,
  },
  easing: {
    entrance: "power3.out",
    scroll: "none",
  },
} as const;
