import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MARKETING_ANIM } from "./marketingAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function MarketingSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const marketingCards = [
    {
      number: "01",
      title: "Instagram",
      subtitle: "Brand Universe",
      description:
        "Visual storytelling that blends Rooh Afza's heritage with modern lifestyle, community, and cultural moments.",
    },
    {
      number: "02",
      title: "YouTube",
      subtitle: "Story & Trust",
      description:
        "Long-form storytelling through brand films, behind-the-scenes content, and deeper emotional connections.",
    },
    {
      number: "03",
      title: "Email",
      subtitle: "Personal Connection",
      description:
        "Direct relationships through loyalty updates, product launches, and exclusive consumer experiences.",
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
          start: MARKETING_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...MARKETING_ANIM.header.label,
          opacity: 0,
          ease: MARKETING_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...MARKETING_ANIM.header.headline,
          opacity: 0,
          ease: MARKETING_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...MARKETING_ANIM.header.intro,
          opacity: 0,
          ease: MARKETING_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...MARKETING_ANIM.cards,
          opacity: 0,
          stagger: MARKETING_ANIM.cards.stagger,
          ease: MARKETING_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: MARKETING_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "marketing-main", timeline);
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
          <p ref={labelRef} className="section-label">Digital Connection</p>

          <h2 ref={headlineRef} className="section-title">
            Three Channels.
            <br />
            One Stronger Connection.
          </h2>

          <p ref={introRef} className="section-intro">
            A focused digital ecosystem built around storytelling, community,
            and meaningful relationships with consumers.
          </p>
        </header>

        <div ref={cardsRef} className="card-grid card-grid--2">
          {marketingCards.map((card) => (
            <article key={card.title} className="brand-card brand-card--accent">
              <span className="card-number">{card.number}</span>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-subtitle">{card.subtitle}</p>
              <p className="card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
