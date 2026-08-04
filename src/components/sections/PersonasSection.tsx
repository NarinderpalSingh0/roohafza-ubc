import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { PERSONAS_ANIM } from "./personasAnimations";

const PERSONAS_LABEL = "Who We Serve";
const PERSONAS_HEADLINE = "Every Sip Tells a Story";
const PERSONAS_INTRO = "Rooh Afza connects with four distinct audiences — each finding their own meaning in a glass that has bridged generations and geographies.";

const PERSONAS = [
  {
    id: "traditional",
    name: "Traditional Families",
    headline: "Generational Trust",
    description: "For families who have served Rooh Afza for decades, it represents continuity — a taste passed from grandparents to grandchildren, unchanged and uncompromised.",
    detail: "Daily household staple",
    icon: "01",
  },
  {
    id: "young",
    name: "Young Generation",
    headline: "Cultural Identity, Modern Life",
    description: "For a new generation navigating tradition and modernity, Rooh Afza is a bridge — a way to carry heritage forward while making it their own.",
    detail: "Contemporary relevance",
    icon: "02",
  },
  {
    id: "health",
    name: "Health-Conscious Consumers",
    headline: "Natural Ingredients, Wellness Choices",
    description: "In a world of artificial ingredients, Rooh Afza stands apart — 30+ herbs, fruits, and flowers chosen for both flavour and nourishment.",
    detail: "Wellness-focused",
    icon: "03",
  },
  {
    id: "global",
    name: "Global Indians",
    headline: "Nostalgia and Connection",
    description: "For those who live far from home, Rooh Afza is more than a drink — it's a sensory link to heritage, memory, and the comfort of tradition.",
    detail: "Heritage connection",
    icon: "04",
  },
] as const;

const styles = {
  root: {
    position: "relative" as const,
    width: "100%",
    backgroundColor: "var(--color-bg-primary)",
    overflow: "hidden",
  },
  container: {
    maxWidth: "var(--spacing-container-max)",
    margin: "0 auto",
    padding: "var(--spacing-section-lg) var(--spacing-container-padding)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "clamp(3rem, 6vw, 5rem)",
  },
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-gold)",
    marginBottom: "1rem",
  },
  headline: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: "var(--color-text-primary)",
    margin: "0 0 1.5rem",
  },
  intro: {
    fontFamily: "var(--font-body)",
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    fontWeight: 400,
    lineHeight: 1.7,
    color: "var(--color-text-secondary)",
    maxWidth: "40rem",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: "clamp(1.5rem, 3vw, 2rem)",
  },
  card: {
    position: "relative" as const,
    padding: "clamp(1.75rem, 3vw, 2.5rem)",
    backgroundColor: "var(--color-surface-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    cursor: "default",
  },
  cardIcon: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2rem, 4vw, 2.5rem)",
    fontWeight: 700,
    color: "var(--color-text-gold)",
    marginBottom: "1.25rem",
    lineHeight: 1,
  },
  cardName: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-accent)",
    marginBottom: "0.5rem",
  },
  cardHeadline: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
    fontWeight: 600,
    lineHeight: 1.2,
    color: "var(--color-text-primary)",
    margin: "0 0 0.75rem",
  },
  cardDescription: {
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "var(--color-text-secondary)",
    margin: "0 0 1.25rem",
  },
  cardDetail: {
    fontFamily: "var(--font-body)",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-gold)",
    paddingTop: "1rem",
    borderTop: "1px solid var(--color-border-subtle)",
  },
} as const;

type HeaderRefs = {
  label: HTMLParagraphElement;
  headline: HTMLHeadingElement;
  intro: HTMLParagraphElement;
};

function setInitialState(header: HeaderRefs, cards: HTMLElement[], reduced: boolean) {
  if (reduced) {
    gsap.set(header.label, { opacity: 1, y: 0 });
    gsap.set(header.headline, { opacity: 1, y: 0 });
    gsap.set(header.intro, { opacity: 1, y: 0 });
    gsap.set(cards, { opacity: 1, y: 0 });
    return;
  }

  const h = PERSONAS_ANIM.header;
  const c = PERSONAS_ANIM.cards;

  gsap.set(header.label, { opacity: 0, y: h.label.y });
  gsap.set(header.headline, { opacity: 0, y: h.headline.y });
  gsap.set(header.intro, { opacity: 0, y: h.intro.y });
  gsap.set(cards, { opacity: 0, y: c.y });
}

function buildHeaderTimeline(header: HeaderRefs) {
  const h = PERSONAS_ANIM.header;

  return gsap.timeline({
    defaults: { ease: PERSONAS_ANIM.easing.reveal },
  })
    .to(header.label, {
      opacity: 1,
      y: 0,
      duration: h.label.duration,
    })
    .to(header.headline, {
      opacity: 1,
      y: 0,
      duration: h.headline.duration,
    }, "<0.1")
    .to(header.intro, {
      opacity: 1,
      y: 0,
      duration: h.intro.duration,
    }, "<0.15");
}

function buildCardsReveal(cards: HTMLElement[], sectionEl: HTMLDivElement) {
  const c = PERSONAS_ANIM.cards;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: PERSONAS_ANIM.scroll.start,
      toggleActions: "play none none reverse",
    },
  })
    .to(cards, {
      opacity: 1,
      y: 0,
      duration: c.duration,
      stagger: c.stagger,
      ease: PERSONAS_ANIM.easing.reveal,
    });
}

export default function PersonasSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const grid = gridRef.current;

    if (!root || !label || !headline || !intro || !grid) {
      return;
    }

    const cards = Array.from(grid.children) as HTMLElement[];
    const header: HeaderRefs = { label, headline, intro };

    setInitialState(header, cards, reducedMotion);

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const headerTl = buildHeaderTimeline(header);
      animationRegistry.register(root, "personas-header", headerTl);

      const cardsTl = buildCardsReveal(cards, root);
      animationRegistry.register(root, "personas-cards", cardsTl);
    });

    return () => {
      animationRegistry.killAll(root);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} style={styles.root}>
      <div style={styles.container}>
        <header ref={headerRef} style={styles.header}>
          <p ref={labelRef} style={styles.label}>
            {PERSONAS_LABEL}
          </p>
          <h2 ref={headlineRef} style={styles.headline}>
            {PERSONAS_HEADLINE}
          </h2>
          <p ref={introRef} style={styles.intro}>
            {PERSONAS_INTRO}
          </p>
        </header>

        <div ref={gridRef} style={styles.grid}>
          {PERSONAS.map((persona) => (
            <article key={persona.id} style={styles.card}>
              <div style={styles.cardIcon} aria-hidden="true">
                {persona.icon}
              </div>
              <p style={styles.cardName}>{persona.name}</p>
              <h3 style={styles.cardHeadline}>{persona.headline}</h3>
              <p style={styles.cardDescription}>{persona.description}</p>
              <p style={styles.cardDetail}>{persona.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
