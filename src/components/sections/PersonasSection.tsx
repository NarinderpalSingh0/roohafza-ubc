import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { PERSONAS_ANIM } from "./personasAnimations";

const PERSONAS_LABEL = "Who We Serve";
const PERSONAS_HEADLINE = "Every Sip Tells a Story";

const PERSONAS = [
  {
    id: "traditional",
    name: "Traditional Families",
    quote: "The people who made Rooh Afza a ritual — serving it at every gathering, every summer, every celebration.",
    size: "small" as const,
  },
  {
    id: "young",
    name: "Gen Z Consumers",
    quote: "The generation that inherited the memory, but wants to create its own rituals.",
    size: "large" as const,
  },
  {
    id: "health",
    name: "Health Conscious",
    quote: "Seeking brands with real ingredients and real heritage — not artificial promises.",
    size: "small" as const,
  },
  {
    id: "global",
    name: "Global Indians",
    quote: "Carrying the taste of home across borders — every sip is a connection to where they come from.",
    size: "large" as const,
  },
] as const;

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
    <div ref={rootRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header ref={headerRef} className="section-header">
          <p ref={labelRef} className="section-label">
            {PERSONAS_LABEL}
          </p>
          <h2 ref={headlineRef} className="section-title">
            {PERSONAS_HEADLINE}
          </h2>
          <p ref={introRef} className="section-intro">
            Rooh Afza connects with four distinct audiences — each finding
            their own meaning in a glass that has bridged generations and
            geographies.
          </p>
        </header>

        <div ref={gridRef} className="persona-grid">
          {PERSONAS.map((persona) => (
            <article
              key={persona.id}
              className={`persona-card persona-card--${persona.size}`}
            >
              <p className="persona-card__name">{persona.name}</p>
              <p className="persona-card__quote">&ldquo;{persona.quote}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
