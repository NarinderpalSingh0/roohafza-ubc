import { useState, useEffect } from "react";
import { SECTION_ORDER } from "../../constants";

const SECTION_LABELS: Record<string, string> = {
  hero: "Intro",
  marquee: "",
  heritage: "Story",
  "bridge-1": "",
  challenge: "Challenge",
  research: "Research",
  "market-reality": "Market",
  personas: "Audience",
  identity: "Identity",
  "bridge-2": "",
  packaging: "Product",
  innovation: "Innovation",
  marketing: "Marketing",
  build: "Build",
  vision: "Vision",
  "social-proof": "Trust",
  final: "Close",
};

export default function ProgressIndicator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);

      const sections = SECTION_ORDER.filter(id => SECTION_LABELS[id]);
      let current = 0;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = i;
          }
        }
      });
      setActiveIndex(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleSections = SECTION_ORDER.filter(id => SECTION_LABELS[id]);

  return (
    <nav className="progress-indicator" aria-label="Page progress">
      <div className="progress-indicator__track">
        <div
          className="progress-indicator__fill"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
      <div className="progress-indicator__dots">
        {visibleSections.map((id, i) => (
          <div
            key={id}
            className={`progress-indicator__dot ${i === activeIndex ? "progress-indicator__dot--active" : ""} ${i < activeIndex ? "progress-indicator__dot--passed" : ""}`}
            title={SECTION_LABELS[id]}
          >
            <span className="progress-indicator__label">{SECTION_LABELS[id]}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
