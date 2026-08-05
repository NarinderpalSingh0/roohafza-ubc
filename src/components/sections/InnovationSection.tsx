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

  const evolution = [
    {
      stage: "Today",
      product: "Rooh Afza Syrup",
      description: "The original. A century of trust in every bottle.",
    },
    {
      stage: "Next",
      product: "Ready-to-Drink",
      description: "Convenient, modern formats for on-the-go consumers.",
    },
    {
      stage: "Future",
      product: "Wellness Formats",
      description: "Health-conscious variants rooted in traditional knowledge.",
    },
    {
      stage: "Vision",
      product: "Global Lifestyle Brand",
      description: "Beyond beverage — a cultural identity carried worldwide.",
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
          ...INNOVATION_ANIM.stages,
          opacity: 0,
          stagger: INNOVATION_ANIM.stages.stagger,
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
    <div ref={rootRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header className="section-header">
          <p ref={labelRef} className="section-label">Innovation & Future</p>

          <h2 ref={headlineRef} className="section-title">
            Product Evolution
          </h2>

          <p ref={introRef} className="section-intro">
            From a single iconic product to a portfolio that meets
            every consumer moment.
          </p>
        </header>

        <div ref={cardsRef} className="evolution-map">
          {evolution.map((item, index) => (
            <div key={item.stage} className="evolution-map__stage">
              <div className="evolution-map__marker">
                <span className="evolution-map__stage-label">{item.stage}</span>
                {index < evolution.length - 1 && (
                  <span className="evolution-map__connector" />
                )}
              </div>
              <div className="evolution-map__content">
                <h3 className="evolution-map__product">{item.product}</h3>
                <p className="evolution-map__description">{item.description}</p>
              </div>
            </div>
          ))}
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
