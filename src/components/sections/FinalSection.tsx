import { useInView } from "../../lib/animations/useInView";

export default function FinalSection() {
  const { ref: sectionRef, isInView } = useInView();

  const handleExploreAgain = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="brand-section brand-section--dark">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p className="section-label">The Next Chapter</p>
        </header>

        <div className={`${isInView ? 'scale-in is-visible animate-delay-2' : 'scale-in'}`}>
          <div className="final-closing pulse-glow" style={{ borderRadius: "var(--radius-xl)", padding: "clamp(3rem, 6vw, 5rem)" }}>
            <h2
              className="final-closing__headline"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            >
              Imagine the next
              <br />
              100 years.
            </h2>
            <p className="final-closing__statement">
              Rooh Afza isn&rsquo;t changing who it is.
              <br />
              It&rsquo;s changing how the next generation experiences it.
            </p>
            <button
              className="final-cta-btn"
              onClick={handleExploreAgain}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(212, 175, 55, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Explore Again
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
