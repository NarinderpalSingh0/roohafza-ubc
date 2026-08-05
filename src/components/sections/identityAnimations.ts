export const IDENTITY_ANIM = {
  header: {
    y: 25,
    duration: 1.0,
    stagger: 0.15,
  },
  side: {
    x: 40,
    duration: 0.9,
  },
  arrow: {
    scale: 0.8,
    duration: 0.6,
  },
  ease: "power3.out",
  scrollTrigger: {
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
} as const;
