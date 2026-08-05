import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MARKET_REALITY_ANIM } from "./marketRealityAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function MarketRealitySection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const equationRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

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
          start: MARKET_REALITY_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...MARKET_REALITY_ANIM.header.label,
          opacity: 0,
          ease: MARKET_REALITY_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...MARKET_REALITY_ANIM.header.headline,
          opacity: 0,
          ease: MARKET_REALITY_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...MARKET_REALITY_ANIM.header.intro,
          opacity: 0,
          ease: MARKET_REALITY_ANIM.easing.reveal,
        })
        .from(statementRef.current, {
          opacity: 0,
          y: MARKET_REALITY_ANIM.statement.y,
          duration: MARKET_REALITY_ANIM.statement.duration,
          ease: MARKET_REALITY_ANIM.easing.reveal,
        });

      const equationItems = equationRef.current?.children;

      if (equationItems) {
        gsap.from(equationItems, {
          opacity: 0,
          y: MARKET_REALITY_ANIM.equation.y,
          duration: MARKET_REALITY_ANIM.equation.duration,
          stagger: MARKET_REALITY_ANIM.equation.stagger,
          ease: MARKET_REALITY_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: equationRef.current,
            start: MARKET_REALITY_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "market-reality-main", timeline);
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--tertiary">
      <div className="section-container">
        <header className="section-header">
          <p ref={labelRef} className="section-label">The Opportunity</p>

          <h2 ref={headlineRef} className="section-title">
            Market Reality
          </h2>

          <p ref={introRef} className="section-intro">
            The next generation is not rejecting heritage.
            <br />
            They are rejecting brands that fail to evolve.
          </p>
        </header>

        <div ref={statementRef} className="market-statement">
          <p className="market-statement__text">
            The opportunity is clear: heritage brands that combine tradition
            with modern experience earn lasting relevance.
          </p>
        </div>

        <div ref={equationRef} className="market-equation">
          <div className="market-equation__item">
            <p className="market-equation__label">Heritage brands</p>
          </div>
          <div className="market-equation__operator" aria-hidden="true">+</div>
          <div className="market-equation__item">
            <p className="market-equation__label">Modern experiences</p>
          </div>
          <div className="market-equation__operator" aria-hidden="true">=</div>
          <div className="market-equation__item market-equation__item--result">
            <p className="market-equation__label">Future relevance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
