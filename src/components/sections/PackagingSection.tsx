import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PACKAGING_ANIM } from "./packagingAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function PackagingSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const packagingCards = [
    {
      number: "01",
      title: "Heritage Reimagined",
      description:
        "A modern packaging language that respects Rooh Afza's century-old legacy while connecting with new generations.",
    },
    {
      number: "02",
      title: "Premium Experience",
      description:
        "Thoughtful design, refined materials, and visual storytelling transform every bottle into a memorable experience.",
    },
    {
      number: "03",
      title: "Sustainable Future",
      description:
        "Packaging designed with responsible materials and future-focused environmental thinking.",
    },
    {
      number: "04",
      title: "Global Identity",
      description:
        "A distinctive visual system that carries Indian heritage to consumers around the world.",
    },
  ];

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll("*"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: PACKAGING_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...PACKAGING_ANIM.header.label,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...PACKAGING_ANIM.header.headline,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...PACKAGING_ANIM.header.intro,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...PACKAGING_ANIM.cards,
          opacity: 0,
          stagger: PACKAGING_ANIM.cards.stagger,
          ease: PACKAGING_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: PACKAGING_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "packaging-header", timeline);
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header className="section-header">
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

        <div ref={cardsRef} className="card-grid">
          {packagingCards.map((card) => (
            <article key={card.title} className="brand-card brand-card--elevated">
              <span className="card-number">{card.number}</span>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
