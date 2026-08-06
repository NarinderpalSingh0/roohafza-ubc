import { useEffect, useRef } from "react";
import { useInView } from "../../lib/animations/useInView";
import ImageAsset from "../ui/ImageAsset";

export default function PackagingSection() {
  const { ref: sectionRef, isInView } = useInView();
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Heritage Reimagined",
      description:
        "A modern packaging language that respects Rooh Afza's century-old legacy while connecting with new generations.",
    },
    {
      title: "Premium Experience",
      description:
        "Thoughtful design, refined materials, and visual storytelling transform every bottle into a memorable experience.",
    },
    {
      title: "Sustainable Future",
      description:
        "Packaging designed with responsible materials and future-focused environmental thinking.",
    },
    {
      title: "Global Identity",
      description:
        "A distinctive visual system that carries Indian heritage to consumers around the world.",
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
          <p ref={labelRef} className="section-label">Packaging Evolution</p>

          <h2 ref={headlineRef} className="section-title">
            A Century of
            <br />
            Heritage, Redesigned
          </h2>

          <p ref={introRef} className="section-intro">
            Reimagining Rooh Afza packaging for modern consumers while
            preserving the emotional connection built across generations.
          </p>
        </header>

        <div className="product-hero">
          <div className="product-hero__visual">
            <ImageAsset
              src="/assets/images/packaging/bottles.jpg"
              alt="Three redesigned Rooh Afza bottles — mango, rose, and pineapple — on dark background"
              aspect="video"
              animation="scale"
              className="product-hero__image"
            />
          </div>
          <p className="product-hero__caption">
            Heritage preserved. Design reinvented.
          </p>
        </div>

        <div ref={cardsRef} className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="product-features">
            {features.map((feature) => (
              <div key={feature.title} className="product-feature">
                <h3 className="product-feature__title">{feature.title}</h3>
                <p className="product-feature__description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-cta">
          <a href="#innovation" className="cta-button">
            Experience The Redesign <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
