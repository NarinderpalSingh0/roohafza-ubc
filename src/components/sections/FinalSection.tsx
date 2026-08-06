import { useInView } from "../../lib/animations/useInView";

export default function FinalSection() {
  const { ref: sectionRef, isInView } = useInView();

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
              style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
            >
              Rooh Afza.
            </h2>
            <p className="final-closing__statement">
              A century of trust.
              <br />
              The next century of imagination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
