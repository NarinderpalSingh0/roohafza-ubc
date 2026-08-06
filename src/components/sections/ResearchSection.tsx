import { useRef, useEffect } from "react";
import { useInView } from "../../lib/animations/useInView";
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
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Content is always visible - no GSAP opacity animations
    // Scroll-based enhancements can be added later

    return () => {};
  }, []);

  return (
    <div ref={sectionRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header ref={headerRef} className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p ref={labelRef} className="section-label">
            {RESEARCH_LABEL}
          </p>
          <h2 ref={headlineRef} className="section-title">
            {RESEARCH_HEADLINE}
          </h2>
        </header>

        <div ref={ingredientsRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`} aria-hidden="true">
          <div className="ingredient-visuals">
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
        </div>

        <p ref={introRef} className="insight-statement">
          {INSIGHT}
        </p>

        <div ref={contentRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-3' : 'fade-in-up'}`}>
          <div className="stats-row">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-item">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-description">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
