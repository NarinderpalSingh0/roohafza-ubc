import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { RESEARCH_ANIM } from "./researchAnimations";
import ImageAsset from "../ui/ImageAsset";

const RESEARCH_LABEL = "Research & Craft";
const RESEARCH_HEADLINE = "Where Tradition Meets Science";

const STATS = [
  {
    label: "Gen Z",
    description: "Authenticity matters most when choosing brands",
  },
  {
    label: "Modern Consumers",
    description: "Seek meaningful brands with real heritage",
  },
  {
    label: "Digital Discovery",
    description: "Shapes purchase decisions across generations",
  },
];

const INSIGHT =
  "What consumers want: Heritage combined with modern experience.";

export default function ResearchSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const content = contentRef.current;
    const ingredients = ingredientsRef.current;

    if (!root || !label || !headline || !intro || !content || !ingredients) {
      return;
    }

    const cards = Array.from(content.children) as HTMLElement[];
    const ingredientItems = Array.from(ingredients.children) as HTMLElement[];

    if (reducedMotion) {
      gsap.set([label, headline, intro, ...ingredientItems, ...cards], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const h = RESEARCH_ANIM.header;

    gsap.set(label, { opacity: 0, y: h.label.y });
    gsap.set(headline, { opacity: 0, y: h.headline.y });
    gsap.set(intro, { opacity: 0, y: h.intro.y });
    gsap.set(ingredientItems, { opacity: 0, y: RESEARCH_ANIM.ingredients.y });
    gsap.set(cards, { opacity: 0, y: RESEARCH_ANIM.cards.y });

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        defaults: { ease: RESEARCH_ANIM.easing.reveal },
      })
        .to(label, { opacity: 1, y: 0, duration: h.label.duration })
        .to(headline, { opacity: 1, y: 0, duration: h.headline.duration }, "<0.1");

      animationRegistry.register(root, "research-header", headerTl);

      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: RESEARCH_ANIM.scroll.start,
          toggleActions: "play none none reverse",
        },
      });

      storyTl
        .to(ingredientItems, {
          opacity: 1,
          y: 0,
          duration: RESEARCH_ANIM.ingredients.duration,
          stagger: RESEARCH_ANIM.ingredients.stagger,
          ease: RESEARCH_ANIM.easing.reveal,
        })
        .to(intro, {
          opacity: 1,
          y: 0,
          duration: h.intro.duration,
          ease: RESEARCH_ANIM.easing.reveal,
        }, "+=0.2")
        .to(cards, {
          opacity: 1,
          y: 0,
          duration: RESEARCH_ANIM.cards.duration,
          stagger: RESEARCH_ANIM.cards.stagger,
          ease: RESEARCH_ANIM.easing.reveal,
        }, "+=0.1");

      animationRegistry.register(root, "research-story", storyTl);
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
        </header>

        <div ref={ingredientsRef} className="ingredient-visuals" aria-hidden="true">
          <div className="ingredient-visual">
            <ImageAsset
              src="/assets/images/ingredients/rose-petals.jpg"
              alt="Rose petals — key Rooh Afza ingredient"
              aspect="square"
              animation="fade"
              animationDelay={0}
            />
            <span className="ingredient-visual__label">Rose Petals</span>
          </div>
          <div className="ingredient-visual">
            <ImageAsset
              src="/assets/images/ingredients/herbs.jpg"
              alt="Traditional herbs — botanical blend"
              aspect="square"
              animation="fade"
              animationDelay={0.15}
            />
            <span className="ingredient-visual__label">Herbs</span>
          </div>
          <div className="ingredient-visual">
            <ImageAsset
              src="/assets/images/ingredients/fruits.jpg"
              alt="Fresh fruits — natural sweetness"
              aspect="square"
              animation="fade"
              animationDelay={0.3}
            />
            <span className="ingredient-visual__label">Fruits</span>
          </div>
          <div className="ingredient-visual">
            <ImageAsset
              src="/assets/images/ingredients/spices.jpg"
              alt="Aromatic spices — heritage formula"
              aspect="square"
              animation="fade"
              animationDelay={0.45}
            />
            <span className="ingredient-visual__label">Spices</span>
          </div>
        </div>

        <p ref={introRef} className="insight-statement">
          {INSIGHT}
        </p>

        <div ref={contentRef} className="stats-row">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
