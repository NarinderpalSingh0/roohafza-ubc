export const HERITAGE_ANIM = {
  header: {
    label: { duration: 0.8, y: 15 },
    headline: { duration: 1.0, y: 30 },
    intro: { duration: 0.9, y: 20 },
  },
  timeline: {
    lineDuration: 2.0,
    milestone: { duration: 0.8, y: 25, stagger: 0.25 },
  },
  values: {
    card: { duration: 0.7, y: 20, stagger: 0.15 },
  },
  scroll: {
    start: "top 70%",
    end: "bottom 20%",
  },
  easing: {
    reveal: "power3.out",
    scroll: "none",
  },
} as const;
