import { useRef, useEffect } from "react";
import { useInView } from "../../lib/animations/useInView";

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

export default function PersonasSection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Content is always visible - no GSAP opacity animations
    // Scroll-based enhancements can be added later

    return () => {};
  }, []);

  return (
    <div ref={sectionRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header ref={headerRef} className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
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

        <div ref={gridRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="persona-grid">
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
    </div>
  );
}
