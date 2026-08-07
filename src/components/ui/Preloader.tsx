import { useState, useEffect } from "react";
import { gsap } from "../../lib/gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    tl.to({}, { duration: 0.8 })
      .call(() => setPhase(1))
      .to({}, { duration: 0.8 })
      .call(() => setPhase(2))
      .to({}, { duration: 0.6 })
      .call(() => setPhase(3))
      .to({}, { duration: 0.5 })
      .call(() => setPhase(4));

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div className="preloader">
      <div className="preloader__content">
        <div className={`preloader__line ${phase >= 1 ? "preloader__line--visible" : ""}`}>
          <span className="preloader__brand">Rooh Afza</span>
        </div>
        <div className={`preloader__line ${phase >= 2 ? "preloader__line--visible" : ""}`}>
          <span className="preloader__year">1907</span>
        </div>
        <div className={`preloader__line ${phase >= 3 ? "preloader__line--visible" : ""}`}>
          <span className="preloader__divider" />
        </div>
        <div className={`preloader__line ${phase >= 3 ? "preloader__line--visible" : ""}`}>
          <span className="preloader__year">2026</span>
        </div>
        <div className={`preloader__line ${phase >= 4 ? "preloader__line--visible" : ""}`}>
          <span className="preloader__tagline">Experience Begins</span>
        </div>
      </div>
    </div>
  );
}
