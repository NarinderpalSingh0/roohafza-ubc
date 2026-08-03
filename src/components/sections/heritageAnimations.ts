export const HERITAGE_ANIM = {
  header: {
    label: { duration: 0.6, y: 15 },
    headline: { duration: 0.8, y: 30 },
    intro: { duration: 0.7, y: 20 },
  },
  timeline: {
    lineDuration: 1.5,
    milestone: { duration: 0.6, y: 25, stagger: 0.15 },
  },
  values: {
    card: { duration: 0.5, y: 20, stagger: 0.12 },
  },
  scroll: {
    start: "top 80%",
    end: "bottom 20%",
  },
  easing: {
    reveal: "power3.out",
    scroll: "none",
  },
} as const;
