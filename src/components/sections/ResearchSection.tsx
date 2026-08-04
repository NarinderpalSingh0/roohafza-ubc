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
    <div ref={rootRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header ref={headerRef} className="section-header">
          <p ref={labelRef} className="section-label">
            {RESEARCH_LABEL}
          </p>
          <h2 ref={headlineRef} className="section-title">
            {RESEARCH_HEADLINE}
          </h2>
          <p ref={introRef} className="section-intro">
            {RESEARCH_INTRO}
          </p>
        </header>

        <div ref={contentRef} className="card-grid">
          {PILLARS.map((pillar) => (
            <article key={pillar.id} className="brand-card brand-card--elevated">
              <div className="card-number" aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 className="card-title">{pillar.title}</h3>
              <p className="card-description">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
