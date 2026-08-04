import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IDENTITY_ANIMATION } from "./identityAnimations";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function IdentitySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  const identityCards = [
    {
      title: "Authentic Heritage",
      description:
        "More than a beverage, Rooh Afza represents over a century of Indian tradition, wellness, and cultural connection.",
    },
    {
      title: "Natural Wellness",
      description:
        "A unique blend inspired by traditional knowledge, crafted with carefully selected ingredients.",
    },
    {
      title: "Modern Legacy",
      description:
        "Honouring history while evolving for new generations through innovation and design.",
    },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const headerElements = headerRef.current?.children;
      const cards = cardsRef.current?.children;

      if (headerElements) {
        gsap.from(headerElements, {
          opacity: 0,
          y: IDENTITY_ANIMATION.yOffset,
          duration: IDENTITY_ANIMATION.duration.header,
          stagger: IDENTITY_ANIMATION.delay.headline,
          ease: IDENTITY_ANIMATION.ease,
          scrollTrigger: {
            trigger: headerRef.current,
            ...IDENTITY_ANIMATION.scrollTrigger,
          },
        });
      }

      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: IDENTITY_ANIMATION.yOffset,
          duration: IDENTITY_ANIMATION.duration.cards,
          stagger: IDENTITY_ANIMATION.stagger,
          ease: IDENTITY_ANIMATION.ease,
          scrollTrigger: {
            trigger: cardsRef.current,
            ...IDENTITY_ANIMATION.scrollTrigger,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header ref={headerRef} className="section-header">
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

        <div ref={cardsRef} className="card-grid">
          {identityCards.map((card) => (
            <article key={card.title} className="brand-card brand-card--elevated">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
