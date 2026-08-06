import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";

export default function IdentitySection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const oldSideRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const newSideRef = useRef<HTMLDivElement>(null);

  const oldIdentity = ["Traditional summer drink", "Family household staple", "Local icon"];
  const newIdentity = ["Cultural lifestyle brand", "Everyday personal ritual", "Global symbol"];

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
          <p className="section-label">Our Identity</p>

          <h2 className="section-title">
            Tradition Built
            <br />
            for Tomorrow
          </h2>

          <p className="section-intro">
            Rooh Afza is not only a product. It is a symbol of heritage,
            trust, and timeless connection across generations.
          </p>
        </header>

        <div className="identity-visual">
          <img
            src="/assets/images/identity/logo-hindi.png"
            alt="Rooh Afza Hindi logo with floral elements"
            className="identity-visual__image"
            loading="lazy"
          />
        </div>

        <div className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="transformation-grid">
            <div ref={oldSideRef} className="transformation-side transformation-side--old">
              <span className="transformation-label">Then</span>
              <ul className="transformation-keywords">
                {oldIdentity.map((keyword) => (
                  <li key={keyword} className="transformation-keyword">
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            <div ref={arrowRef} className="transformation-arrow" aria-hidden="true">
              <span className="transformation-arrow__symbol">&rarr;</span>
            </div>

            <div ref={newSideRef} className="transformation-side transformation-side--new">
              <span className="transformation-label">Now</span>
              <ul className="transformation-keywords">
                {newIdentity.map((keyword) => (
                  <li key={keyword} className="transformation-keyword">
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
