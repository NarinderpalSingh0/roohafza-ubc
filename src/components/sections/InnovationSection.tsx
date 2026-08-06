import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";

export default function InnovationSection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const evolution = [
    {
      stage: "Today",
      product: "Rooh Afza Syrup",
      description: "The original. A century of trust in every bottle.",
      image: "/assets/images/packaging/bottles.jpg",
    },
    {
      stage: "Next",
      product: "Ready-to-Drink",
      description: "Convenient, modern formats for on-the-go consumers.",
      image: "/assets/images/hero/can-floral.png",
    },
    {
      stage: "Future",
      product: "Wellness Formats",
      description: "Health-conscious variants rooted in traditional knowledge.",
      image: "/assets/images/innovation/can-green.png",
    },
    {
      stage: "Vision",
      product: "Global Lifestyle Brand",
      description: "Beyond beverage — a cultural identity carried worldwide.",
      image: "/assets/images/innovation/cafe-collection.png",
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
          <p ref={labelRef} className="section-label">Innovation & Future</p>

          <h2 ref={headlineRef} className="section-title">
            Product Evolution
          </h2>

          <p ref={introRef} className="section-intro">
            From a single iconic product to a portfolio that meets
            every consumer moment.
          </p>
        </header>

        <div ref={cardsRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="evolution-map">
            {evolution.map((item, index) => (
              <div key={item.stage} className="evolution-map__stage">
                <div className="evolution-map__marker">
                  <span className="evolution-map__stage-label">{item.stage}</span>
                  {index < evolution.length - 1 && (
                    <span className="evolution-map__connector" />
                  )}
                </div>
                <div className="evolution-map__content">
                  <div className="evolution-map__image-wrapper">
                    <img
                      src={item.image}
                      alt={item.product}
                      className="evolution-map__image"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="evolution-map__product">{item.product}</h3>
                  <p className="evolution-map__description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-cta">
          <a href="#marketing" className="cta-button">
            See The Future <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
