import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";

export default function BuildSection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const phases = [
    {
      number: "01",
      title: "Foundation",
      description: "Modernize product formats, packaging, and visual identity for contemporary consumers.",
    },
    {
      number: "02",
      title: "Expansion",
      description: "Build digital ecosystems, community platforms, and direct consumer relationships.",
    },
    {
      number: "03",
      title: "Global Scale",
      description: "Carry Indian heritage to international markets with cultural authenticity at the core.",
    },
  ];

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
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p ref={labelRef} className="section-label">Build The Future</p>

          <h2 ref={headlineRef} className="section-title">
            Execution Roadmap
          </h2>

          <p ref={introRef} className="section-intro">
            Three clear phases to transform Rooh Afza from a heritage brand
            into a global lifestyle icon.
          </p>
        </header>

        <div ref={cardsRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="phase-blocks">
            {phases.map((phase) => (
              <div key={phase.number} className="phase-block">
                <div className="phase-block__number" aria-hidden="true">
                  {phase.number}
                </div>
                <div className="phase-block__content">
                  <h3 className="phase-block__title">{phase.title}</h3>
                  <p className="phase-block__description">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
