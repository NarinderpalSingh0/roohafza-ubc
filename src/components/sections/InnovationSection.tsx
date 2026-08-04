import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { INNOVATION_ANIM } from "./innovationAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function InnovationSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const innovationCards = [
    {
      title: "Modern Consumer Experiences",
      description:
        "Creating new ways for consumers to experience Rooh Afza through contemporary formats and digital engagement.",
    },
    {
      title: "Product Evolution",
      description:
        "Exploring new possibilities while protecting the original taste, trust, and heritage.",
    },
    {
      title: "Technology Integration",
      description:
        "Using technology, data, and innovation to build deeper connections with consumers.",
    },
    {
      title: "Future Ready Brand",
      description:
        "Transforming a legacy brand into a global symbol for future generations.",
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
          start: INNOVATION_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...INNOVATION_ANIM.header.label,
          opacity: 0,
          ease: INNOVATION_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...INNOVATION_ANIM.header.headline,
          opacity: 0,
          ease: INNOVATION_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...INNOVATION_ANIM.header.intro,
          opacity: 0,
          ease: INNOVATION_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...INNOVATION_ANIM.cards,
          opacity: 0,
          stagger: INNOVATION_ANIM.cards.stagger,
          ease: INNOVATION_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: INNOVATION_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(
        root,
        "innovation-header",
        timeline,
      );
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef}>
      <header>
        <p ref={labelRef}>Innovation & Future</p>

        <h2 ref={headlineRef}>
          Tradition Built For
          <br />
          Tomorrow
        </h2>

        <p ref={introRef}>
          Combining heritage, science, creativity, and technology to redefine
          the future of Rooh Afza.
        </p>
      </header>

      <div ref={cardsRef}>
        {innovationCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
