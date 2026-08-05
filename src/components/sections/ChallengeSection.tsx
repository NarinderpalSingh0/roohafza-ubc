import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { CHALLENGE_ANIM } from "./challengeAnimations";

const CHALLENGE_LABEL = "The Challenge";
const CHALLENGE_HEADLINE = "Honouring Heritage in a Changing World";
const CHALLENGE_STATEMENT =
  "A century-old icon cannot survive on nostalgia alone. It must transform nostalgia into relevance.";

const PROBLEMS = [
  {
    id: "culture",
    title: "Culture Shift",
    description:
      "Younger consumers seek modern experiences, convenience, and stronger digital connections.",
    icon: "01",
  },
  {
    id: "competition",
    title: "Competition",
    description:
      "The beverage market is crowded with new-age brands competing for attention.",
    icon: "02",
  },
  {
    id: "digital",
    title: "Digital Shift",
    description:
      "Purchase decisions increasingly happen online, through social media and peer influence.",
    icon: "03",
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

function buildStatementReveal(statement: HTMLElement, sectionEl: HTMLDivElement) {
  const s = CHALLENGE_ANIM.statement;

  return gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: CHALLENGE_ANIM.scroll.start,
      toggleActions: "play none none reverse",
    },
  })
    .to(statement, {
      opacity: 1,
      y: 0,
      duration: s.duration,
      delay: s.delay,
      ease: CHALLENGE_ANIM.easing.reveal,
    });
}

export default function ChallengeSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const statement = statementRef.current;
    const problems = problemsRef.current;

    if (!root || !label || !headline || !intro || !statement || !problems) {
      return;
    }

    const cards = Array.from(problems.children) as HTMLElement[];
    const header: HeaderRefs = { label, headline, intro };

    setInitialState(header, cards, reducedMotion);

    if (reducedMotion) {
      gsap.set(statement, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(statement, { opacity: 0, y: CHALLENGE_ANIM.statement.y });

    const ctx = gsap.context(() => {
      const headerTl = buildHeaderTimeline(header);
      animationRegistry.register(root, "challenge-header", headerTl);

      const statementTl = buildStatementReveal(statement, root);
      animationRegistry.register(root, "challenge-statement", statementTl);

      const cardsTl = buildCardsReveal(cards, root);
      animationRegistry.register(root, "challenge-cards", cardsTl);
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
            {CHALLENGE_LABEL}
          </p>
          <h2 ref={headlineRef} className="section-title">
            {CHALLENGE_HEADLINE}
          </h2>
        </header>

        <p ref={statementRef} className="challenge-statement">
          {CHALLENGE_STATEMENT}
        </p>

        <div ref={problemsRef} className="problem-grid">
          {PROBLEMS.map((problem) => (
            <article key={problem.id} className="problem-card">
              <div className="problem-card__icon" aria-hidden="true">
                {problem.icon}
              </div>
              <h3 className="problem-card__title">{problem.title}</h3>
              <p className="problem-card__description">
                {problem.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
