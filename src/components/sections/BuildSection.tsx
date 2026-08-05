import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BUILD_ANIM } from "./buildAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function BuildSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const phases = [
    {
      number: "01",
      title: "Foundation",
      description: "Modernize product formats, packaging, and visual identity for contemporary consumers.",
    },
    {
      number: "02",
      title: "Expansion",
      description: "Build digital ecosystems, community platforms, and direct consumer relationships.",
    },
    {
      number: "03",
      title: "Global Scale",
      description: "Carry Indian heritage to international markets with cultural authenticity at the core.",
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
          start: BUILD_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...BUILD_ANIM.header.label,
          opacity: 0,
          ease: BUILD_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...BUILD_ANIM.header.headline,
          opacity: 0,
          ease: BUILD_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...BUILD_ANIM.header.intro,
          opacity: 0,
          ease: BUILD_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...BUILD_ANIM.cards,
          opacity: 0,
          stagger: BUILD_ANIM.cards.stagger,
          ease: BUILD_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: BUILD_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "build-main", timeline);
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header className="section-header">
          <p ref={labelRef} className="section-label">Build The Future</p>

          <h2 ref={headlineRef} className="section-title">
            Execution Roadmap
          </h2>

          <p ref={introRef} className="section-intro">
            Three clear phases to transform Rooh Afza from a heritage brand
            into a global lifestyle icon.
          </p>
        </header>

        <div ref={cardsRef} className="phase-blocks">
          {phases.map((phase) => (
            <div key={phase.number} className="phase-block">
              <div className="phase-block__number" aria-hidden="true">
                {phase.number}
              </div>
              <div className="phase-block__content">
                <h3 className="phase-block__title">{phase.title}</h3>
                <p className="phase-block__description">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
