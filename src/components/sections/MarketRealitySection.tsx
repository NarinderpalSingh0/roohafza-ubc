import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";

export default function MarketRealitySection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const equationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Content is always visible - no GSAP opacity animations
    // Scroll-based enhancements can be added later

    return () => {};
  }, []);

  return (
    <div ref={sectionRef} className="brand-section brand-section--tertiary">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p ref={labelRef} className="section-label">The Opportunity</p>

          <h2 ref={headlineRef} className="section-title">
            Market Reality
          </h2>

          <p ref={introRef} className="section-intro">
            The next generation is not rejecting heritage.
            <br />
            They are rejecting brands that fail to evolve.
          </p>
        </header>

        <div ref={statementRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="market-statement">
            <p className="market-statement__text">
              The opportunity is clear: heritage brands that combine tradition
              with modern experience earn lasting relevance.
            </p>
          </div>
        </div>

        <div ref={equationRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-3' : 'fade-in-up'}`}>
          <div className="market-equation">
            <div className="market-equation__item">
              <p className="market-equation__label">Heritage brands</p>
            </div>
            <div className="market-equation__operator" aria-hidden="true">+</div>
            <div className="market-equation__item">
              <p className="market-equation__label">Modern experiences</p>
            </div>
            <div className="market-equation__operator" aria-hidden="true">=</div>
            <div className="market-equation__item market-equation__item--result">
              <p className="market-equation__label">Future relevance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
