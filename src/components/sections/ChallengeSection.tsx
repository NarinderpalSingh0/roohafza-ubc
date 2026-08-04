import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { CHALLENGE_ANIM } from "./challengeAnimations";

const CHALLENGE_LABEL = "The Challenge";
const CHALLENGE_HEADLINE = "Honouring Heritage in a Changing World";
const CHALLENGE_INTRO = "Rooh Afza has immense cultural trust, but changing consumer behaviour requires the brand to evolve while protecting its authenticity.";

const CHALLENGES = [
  {
    id: "preferences",
    title: "Changing Consumer Preferences",
    description: "Younger consumers seek modern experiences, convenience, and stronger digital connections.",
    icon: "01",
  },
  {
    id: "competition",
    title: "Category Competition",
    description: "The beverage market is crowded with new-age brands competing for attention.",
    icon: "02",
  },
  {
    id: "heritage",
    title: "Heritage Perception",
    description: "A century-old legacy must remain relevant without feeling outdated.",
    icon: "03",
  },
  {
    id: "global",
    title: "Global Expansion",
    description: "Building stronger international relevance while preserving cultural identity.",
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
    backgroundColor: "var(--color-surface-secondary)",
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

  const h = CHALLENGE_ANIM.header;
  const c = CHALLENGE_ANIM.cards;

  gsap.set(header.label, { opacity: 0, y: h.label.y });
  gsap.set(header.headline, { opacity: 0, y: h.headline.y });
  gsap.set(header.intro, { opacity: 0, y: h.intro.y });
  gsap.set(cards, { opacity: 0, y: c.y });
}

function buildHeaderTimeline(header: HeaderRefs) {
  const h = CHALLENGE_ANIM.header;

  return gsap.timeline({
    defaults: { ease: CHALLENGE_ANIM.easing.reveal },
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
  const c = CHALLENGE_ANIM.cards;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: CHALLENGE_ANIM.scroll.start,
      toggleActions: "play none none reverse",
    },
  })
    .to(cards, {
      opacity: 1,
      y: 0,
      duration: c.duration,
      stagger: c.stagger,
      ease: CHALLENGE_ANIM.easing.reveal,
    });
}

export default function ChallengeSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const problems = problemsRef.current;

    if (!root || !label || !headline || !intro || !problems) {
      return;
    }

    const cards = Array.from(problems.children) as HTMLElement[];
    const header: HeaderRefs = { label, headline, intro };

    setInitialState(header, cards, reducedMotion);

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const headerTl = buildHeaderTimeline(header);
      animationRegistry.register(root, "challenge-header", headerTl);

      const cardsTl = buildCardsReveal(cards, root);
      animationRegistry.register(root, "challenge-cards", cardsTl);
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
            {CHALLENGE_LABEL}
          </p>
          <h2 ref={headlineRef} style={styles.headline}>
            {CHALLENGE_HEADLINE}
          </h2>
          <p ref={introRef} style={styles.intro}>
            {CHALLENGE_INTRO}
          </p>
        </header>

        <div ref={problemsRef} style={styles.grid}>
          {CHALLENGES.map((challenge) => (
            <article key={challenge.id} style={styles.card}>
              <div style={styles.cardIcon} aria-hidden="true">
                {challenge.icon}
              </div>
              <h3 style={styles.cardTitle}>{challenge.title}</h3>
              <p style={styles.cardDescription}>{challenge.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
