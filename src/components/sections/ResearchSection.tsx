import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { RESEARCH_ANIM } from "./researchAnimations";

const RESEARCH_LABEL = "Research & Craft";
const RESEARCH_HEADLINE = "Where Tradition Meets Science";
const RESEARCH_INTRO = "Rooh Afza is the product of over a century of refinement — a careful balance between time-honoured herbal knowledge and rigorous modern quality standards. Every ingredient is chosen with purpose, every batch prepared with precision.";

const PILLARS = [
  {
    id: "herbal",
    title: "Herbal Knowledge",
    description: "Over a century of traditional expertise informs every recipe — knowledge passed through generations of herbalists and perfected over time.",
    icon: "01",
  },
  {
    id: "ingredients",
    title: "Ingredient Selection",
    description: "Each of the 30+ herbs, fruits, and flowers is carefully chosen for its unique flavour profile and natural nourishing properties.",
    icon: "02",
  },
  {
    id: "quality",
    title: "Quality Standards",
    description: "From source to bottle, consistent taste and trusted preparation ensure every glass of Rooh Afza meets the highest standards.",
    icon: "03",
  },
  {
    id: "innovation",
    title: "Continuous Innovation",
    description: "Evolving with changing consumer needs while staying true to the original vision — tradition and progress in every sip.",
    icon: "04",
  },
] as const;

const styles = {
  root: {
    position: "relative" as const,
    width: "100%",
    backgroundColor: "var(--color-bg-secondary)",
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
    maxWidth: "42rem",
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
  },
  cardIcon: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2rem, 4vw, 2.5rem)",
    fontWeight: 700,
    color: "var(--color-text-gold)",
    marginBottom: "1.25rem",
    lineHeight: 1,
  },
  cardTitle: {
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
    margin: 0,
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

  const h = RESEARCH_ANIM.header;
  const c = RESEARCH_ANIM.cards;

  gsap.set(header.label, { opacity: 0, y: h.label.y });
  gsap.set(header.headline, { opacity: 0, y: h.headline.y });
  gsap.set(header.intro, { opacity: 0, y: h.intro.y });
  gsap.set(cards, { opacity: 0, y: c.y });
}

function buildHeaderTimeline(header: HeaderRefs) {
  const h = RESEARCH_ANIM.header;

  return gsap.timeline({
    defaults: { ease: RESEARCH_ANIM.easing.reveal },
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
  const c = RESEARCH_ANIM.cards;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: RESEARCH_ANIM.scroll.start,
      toggleActions: "play none none reverse",
    },
  })
    .to(cards, {
      opacity: 1,
      y: 0,
      duration: c.duration,
      stagger: c.stagger,
      ease: RESEARCH_ANIM.easing.reveal,
    });
}

export default function ResearchSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const content = contentRef.current;

    if (!root || !label || !headline || !intro || !content) {
      return;
    }

    const cards = Array.from(content.children) as HTMLElement[];
    const header: HeaderRefs = { label, headline, intro };

    setInitialState(header, cards, reducedMotion);

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const headerTl = buildHeaderTimeline(header);
      animationRegistry.register(root, "research-header", headerTl);

      const cardsTl = buildCardsReveal(cards, root);
      animationRegistry.register(root, "research-cards", cardsTl);
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
            {RESEARCH_LABEL}
          </p>
          <h2 ref={headlineRef} style={styles.headline}>
            {RESEARCH_HEADLINE}
          </h2>
          <p ref={introRef} style={styles.intro}>
            {RESEARCH_INTRO}
          </p>
        </header>

        <div ref={contentRef} style={styles.grid}>
          {PILLARS.map((pillar) => (
            <article key={pillar.id} style={styles.card}>
              <div style={styles.cardIcon} aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 style={styles.cardTitle}>{pillar.title}</h3>
              <p style={styles.cardDescription}>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
