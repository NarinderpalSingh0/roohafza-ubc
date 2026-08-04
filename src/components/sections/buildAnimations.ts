export const BUILD_ANIM = {
  header: {
    label: { duration: 0.6, y: 15 },
    headline: { duration: 0.8, y: 30 },
    intro: { duration: 0.7, y: 20 },
  },

  cards: {
    duration: 0.6,
    y: 25,
    stagger: 0.12,
  },

  scroll: {
    start: "top 80%",
  },

  easing: {
    reveal: "power3.out",
  },
} as const;
