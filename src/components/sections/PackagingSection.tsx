import { useRef } from "react";

export default function PackagingSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={rootRef}>
      <div>
        <header ref={headerRef}>
          <p>Packaging Evolution</p>

          <h2>
            A Century of
            <br />
            Heritage, Redesigned
          </h2>

          <p>
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
    </div>
  );
}

