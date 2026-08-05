export const VISION_ANIM = {
  header: {
    label: { duration: 0.8, y: 15 },
    headline: { duration: 1.2, y: 30 },
    intro: { duration: 1.0, y: 20 },
  },

  cards: {
    duration: 0.8,
    y: 25,
    stagger: 0.15,
  },

  scroll: {
    start: "top 75%",
  },

  easing: {
    reveal: "power3.out",
  },
} as const;
