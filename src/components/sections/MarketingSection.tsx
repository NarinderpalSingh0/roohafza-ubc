import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";

export default function MarketingSection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const ecosystem = [
    {
      channel: "Instagram",
      role: "Discovery",
      description: "Visual storytelling that blends heritage with modern lifestyle and cultural moments.",
    },
    {
      channel: "YouTube",
      role: "Storytelling",
      description: "Long-form narratives through brand films, behind-the-scenes, and emotional connections.",
    },
    {
      channel: "App",
      role: "Loyalty",
      description: "Direct relationships through rewards, personalization, and exclusive experiences.",
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
    <div ref={sectionRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p ref={labelRef} className="section-label">Digital Connection</p>

          <h2 ref={headlineRef} className="section-title">
            Rooh Afza Digital World
          </h2>

          <p ref={introRef} className="section-intro">
            A focused digital ecosystem built around storytelling, community,
            and meaningful relationships with consumers.
          </p>
        </header>

        <div ref={cardsRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="ecosystem">
            <div className="ecosystem__center" aria-hidden="true">
              <span className="ecosystem__core">Community</span>
            </div>

            <div className="ecosystem__channels">
              {ecosystem.map((item) => (
                <article key={item.channel} className="ecosystem__channel">
                  <p className="ecosystem__channel-name">{item.channel}</p>
                  <p className="ecosystem__channel-role">{item.role}</p>
                  <p className="ecosystem__channel-description">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
