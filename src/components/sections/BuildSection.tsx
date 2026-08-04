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

  const buildCards = [
    {
      number: "01",
      title: "Modern Product Innovation",
      description:
        "Creating new experiences that respect Rooh Afza's heritage while adapting to evolving consumer needs.",
    },
    {
      number: "02",
      title: "Digital First Ecosystem",
      description:
        "Building stronger relationships through technology, community, and direct consumer connections.",
    },
    {
      number: "03",
      title: "Global Growth",
      description:
        "Expanding Rooh Afza's cultural identity into new international markets.",
    },
    {
      number: "04",
      title: "Future Ready Brand",
      description:
        "A transformation strategy designed for the next generation of consumers.",
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
            From Heritage.
            <br />
            To Tomorrow.
          </h2>

          <p ref={introRef} className="section-intro">
            Building a stronger Rooh Afza through innovation, digital
            experiences, and meaningful consumer relationships.
          </p>
        </header>

        <div ref={cardsRef} className="card-grid">
          {buildCards.map((card) => (
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
