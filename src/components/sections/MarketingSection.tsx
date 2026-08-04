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
      title: "Instagram",
      subtitle: "Brand Universe",
      description:
        "Visual storytelling that blends Rooh Afza's heritage with modern lifestyle, community, and cultural moments.",
    },
    {
      title: "YouTube",
      subtitle: "Story & Trust",
      description:
        "Long-form storytelling through brand films, behind-the-scenes content, and deeper emotional connections.",
    },
    {
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
    <div ref={rootRef}>
      <div>
        <header>
          <p ref={labelRef}>Digital Connection</p>

          <h2 ref={headlineRef}>
            Three Channels.
            <br />
            One Stronger Connection.
          </h2>

          <p ref={introRef}>
            A focused digital ecosystem built around storytelling, community,
            and meaningful relationships with consumers.
          </p>
        </header>

        <div ref={cardsRef}>
          {marketingCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.subtitle}</p>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
