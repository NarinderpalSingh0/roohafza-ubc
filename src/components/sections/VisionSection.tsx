import { useInView } from "../../lib/animations/useInView";

export default function VisionSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <div ref={sectionRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p className="section-label">Future Vision</p>
        </header>

        <div className={`${isInView ? 'scale-in is-visible animate-delay-2' : 'scale-in'}`}>
          <div className="vision-statement shimmer">
            <h2 className="vision-statement__text">
              From a drink loved by generations,
              <br />
              to a culture carried worldwide.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
