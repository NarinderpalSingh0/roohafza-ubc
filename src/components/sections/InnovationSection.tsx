import { useRef } from "react";

export default function InnovationSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={rootRef}>
      <header ref={headerRef}>
        <p>Innovation & Future</p>

        <h2>
          Tradition Built For
          <br />
          Tomorrow
        </h2>

        <p>
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
