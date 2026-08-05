export const MARKET_REALITY_ANIM = {
  header: {
    label: { duration: 0.8, y: 15 },
    headline: { duration: 1.0, y: 30 },
    intro: { duration: 0.9, y: 20 },
  },
  statement: {
    duration: 1.0,
    y: 25,
  },
  equation: {
    duration: 0.8,
    y: 20,
    stagger: 0.3,
  },
  scroll: {
    start: "top 75%",
  },
  easing: {
    reveal: "power3.out",
  },
} as const;
