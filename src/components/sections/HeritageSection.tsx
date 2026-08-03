import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { HERITAGE_ANIM } from "./heritageAnimations";

const HERITAGE_LABEL = "Our Story";
const HERITAGE_HEADLINE = "A Century of Tradition";
const HERITAGE_INTRO = "Founded in 1907 by Hakim Abdul Hameed, Rooh Afza began as a simple promise — to bring together the finest herbs and natural ingredients into a single, nourishing elixir. Over a century later, that promise endures.";

const MILESTONES = [
  {
    year: "1907",
    title: "The Beginning",
    description: "Hakim Abdul Hameed creates the original Rooh Afza recipe in Delhi, blending 30+ herbs, fruits, and flowers.",
  },
  {
    year: "1948",
    title: "A Legacy Continues",
    description: "Under Hamdard's stewardship, Rooh Afza becomes a household name across South Asia.",
  },
  {
    year: "1970s",
    title: "Global Reach",
    description: "Rooh Afza expands internationally, bringing its heritage to diaspora communities worldwide.",
  },
  {
    year: "Today",
    title: "Reimagined",
    description: "A new generation discovers Rooh Afza — not just as a drink, but as a cultural experience.",
  },
] as const;

const VALUES = [
  { label: "Heritage", description: "Over 115 years of unbroken tradition" },
  { label: "Natural", description: "30+ herbs, fruits, and flowers" },
  { label: "Community", description: "Beloved across generations and borders" },
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
    margin: "0",
  },
  intro: {
    fontFamily: "var(--font-body)",
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    fontWeight: 400,
    lineHeight: 1.7,
    color: "var(--color-text-secondary)",
    maxWidth: "40rem",
    margin: "0 auto",
    textAlign: "center" as const,
  },
  timeline: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "clamp(2rem, 4vw, 3rem)",
    marginTop: "clamp(3rem, 6vw, 5rem)",
    position: "relative" as const,
  },
  timelineLine: {
    position: "absolute" as const,
    left: "1.5rem",
    top: "0",
    bottom: "0",
    width: "1px",
    backgroundColor: "var(--color-border-subtle)",
    transformOrigin: "top",
  },
  milestone: {
    display: "flex",
    gap: "clamp(1.5rem, 3vw, 2.5rem)",
    paddingLeft: "0",
    position: "relative" as const,
  },
  milestoneDot: {
    width: "3rem",
    minWidth: "3rem",
    height: "3rem",
    borderRadius: "var(--radius-full)",
    backgroundColor: "var(--color-surface-primary)",
    border: "2px solid var(--color-border-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-body)",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--color-text-accent)",
    flexShrink: 0,
    position: "relative" as const,
    zIndex: 1,
  },
  milestoneContent: {
    flex: 1,
    paddingTop: "0.25rem",
  },
  milestoneYear: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-gold)",
    marginBottom: "0.375rem",
  },
  milestoneTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    fontWeight: 600,
    lineHeight: 1.2,
    color: "var(--color-text-primary)",
    margin: "0 0 0.5rem",
  },
  milestoneDescription: {
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "var(--color-text-secondary)",
    margin: 0,
  },
  values: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
    gap: "clamp(1.5rem, 3vw, 2rem)",
    marginTop: "clamp(4rem, 8vw, 6rem)",
    paddingTop: "clamp(3rem, 6vw, 4rem)",
    borderTop: "1px solid var(--color-border-subtle)",
  },
  valueCard: {
    textAlign: "center" as const,
    padding: "clamp(1.5rem, 3vw, 2rem)",
  },
  valueLabel: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
    fontWeight: 600,
    color: "var(--color-text-primary)",
    margin: "0 0 0.5rem",
  },
  valueDescription: {
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "var(--color-text-secondary)",
    margin: 0,
  },
} as const;

type HeaderRefs = {
  label: HTMLParagraphElement;
  headline: HTMLHeadingElement;
  intro: HTMLParagraphElement;
};

type TimelineRefs = {
  line: HTMLDivElement;
  milestones: HTMLElement[];
};

type ValuesRefs = {
  cards: HTMLElement[];
};

function setInitialState(
  header: HeaderRefs,
  timeline: TimelineRefs,
  values: ValuesRefs,
  reduced: boolean,
) {
  if (reduced) {
    gsap.set(header.label, { opacity: 1, y: 0 });
    gsap.set(header.headline, { opacity: 1, y: 0 });
    gsap.set(header.intro, { opacity: 1, y: 0 });
    gsap.set(timeline.line, { scaleY: 1 });
    gsap.set(timeline.milestones, { opacity: 1, y: 0 });
    gsap.set(values.cards, { opacity: 1, y: 0 });
    return;
  }

  const h = HERITAGE_ANIM.header;
  const t = HERITAGE_ANIM.timeline.milestone;
  const v = HERITAGE_ANIM.values.card;

  gsap.set(header.label, { opacity: 0, y: h.label.y });
  gsap.set(header.headline, { opacity: 0, y: h.headline.y });
  gsap.set(header.intro, { opacity: 0, y: h.intro.y });
  gsap.set(timeline.line, { scaleY: 0 });
  gsap.set(timeline.milestones, { opacity: 0, y: t.y });
  gsap.set(values.cards, { opacity: 0, y: v.y });
}

function buildHeaderTimeline(header: HeaderRefs) {
  const h = HERITAGE_ANIM.header;

  return gsap.timeline({
    defaults: { ease: HERITAGE_ANIM.easing.reveal },
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

function buildTimelineReveal(
  timeline: TimelineRefs,
  sectionEl: HTMLDivElement,
) {
  const t = HERITAGE_ANIM.timeline;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: HERITAGE_ANIM.scroll.start,
      end: HERITAGE_ANIM.scroll.end,
      toggleActions: "play none none reverse",
    },
  })
    .to(timeline.line, {
      scaleY: 1,
      duration: t.lineDuration,
      ease: "none",
    })
    .to(timeline.milestones, {
      opacity: 1,
      y: 0,
      duration: t.milestone.duration,
      stagger: t.milestone.stagger,
      ease: HERITAGE_ANIM.easing.reveal,
    }, 0.3);
}

function buildValuesReveal(
  values: ValuesRefs,
  sectionEl: HTMLDivElement,
) {
  const v = HERITAGE_ANIM.values.card;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: "bottom 80%",
      toggleActions: "play none none reverse",
    },
  })
    .to(values.cards, {
      opacity: 1,
      y: 0,
      duration: v.duration,
      stagger: v.stagger,
      ease: HERITAGE_ANIM.easing.reveal,
    });
}

export default function HeritageSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const timelineEl = timelineRef.current;
    const timelineLine = timelineLineRef.current;
    const valuesEl = valuesRef.current;

    if (!root || !label || !headline || !intro || !timelineEl || !timelineLine || !valuesEl) {
      return;
    }

    const milestoneEls = Array.from(
      timelineEl.querySelectorAll<HTMLElement>('[role="listitem"]'),
    );
    const valueCards = Array.from(
      valuesEl.children,
    ) as HTMLElement[];

    const header: HeaderRefs = { label, headline, intro };
    const timeline: TimelineRefs = { line: timelineLine, milestones: milestoneEls };
    const values: ValuesRefs = { cards: valueCards };

    setInitialState(header, timeline, values, reducedMotion);

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const headerTl = buildHeaderTimeline(header);
      animationRegistry.register(root, "heritage-header", headerTl);

      const timelineTl = buildTimelineReveal(timeline, root);
      animationRegistry.register(root, "heritage-timeline", timelineTl);

      const valuesTl = buildValuesReveal(values, root);
      animationRegistry.register(root, "heritage-values", valuesTl);
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
            {HERITAGE_LABEL}
          </p>
          <h2 ref={headlineRef} style={styles.headline}>
            {HERITAGE_HEADLINE}
          </h2>
          <p ref={introRef} style={styles.intro}>
            {HERITAGE_INTRO}
          </p>
        </header>

        <div ref={timelineRef} style={styles.timeline} role="list" aria-label="Brand timeline">
          <div ref={timelineLineRef} style={styles.timelineLine} aria-hidden="true" />
          {MILESTONES.map((milestone) => (
            <article key={milestone.year} style={styles.milestone} role="listitem">
              <div style={styles.milestoneDot} aria-hidden="true">
                {milestone.year === "Today" ? "Now" : milestone.year.slice(0, 2)}
              </div>
              <div style={styles.milestoneContent}>
                <p style={styles.milestoneYear}>
                  <time>{milestone.year}</time>
                </p>
                <h3 style={styles.milestoneTitle}>{milestone.title}</h3>
                <p style={styles.milestoneDescription}>{milestone.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div ref={valuesRef} style={styles.values}>
          {VALUES.map((value) => (
            <div key={value.label} style={styles.valueCard}>
              <h3 style={styles.valueLabel}>{value.label}</h3>
              <p style={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
