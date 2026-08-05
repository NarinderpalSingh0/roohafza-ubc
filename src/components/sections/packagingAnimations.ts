
export const PACKAGING_ANIM = {
  header: {
    label: { duration: 0.8, y: 15 },
    headline: { duration: 1.0, y: 30 },
    intro: { duration: 0.9, y: 20 },
  },
  product: {
    duration: 1.2,
    scale: 0.95,
  },
  caption: {
    duration: 0.8,
    y: 15,
  },
  features: {
    duration: 0.8,
    y: 20,
    stagger: 0.15,
  },
  scroll: {
    start: "top 75%",
  },
  easing: {
    reveal: "power3.out",
  },
} as const;
