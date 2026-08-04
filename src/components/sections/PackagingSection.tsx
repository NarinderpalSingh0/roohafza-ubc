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
    <div ref={rootRef}>
      <header>
        <p ref={labelRef}>Packaging Evolution</p>

        <h2 ref={headlineRef}>
          A Century of
          <br />
          Heritage, Redesigned
        </h2>

        <p ref={introRef}>
          Reimagining Rooh Afza packaging for modern consumers while
          preserving the emotional connection built across generations.
        </p>
      </header>

      <div ref={cardsRef}>
        {packagingCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

