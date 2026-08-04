import { useRef } from "react";

export default function IdentitySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const identityCards = [
    {
      title: "Authentic Heritage",
      description:
        "More than a beverage, Rooh Afza represents over a century of Indian tradition, wellness, and cultural connection.",
    },
    {
      title: "Natural Wellness",
      description:
        "A unique blend inspired by traditional knowledge, crafted with carefully selected ingredients.",
    },
    {
      title: "Modern Legacy",
      description:
        "Honouring history while evolving for new generations through innovation and design.",
    },
  ];

  return (
    <div ref={rootRef}>
      <div ref={headerRef}>
        <p>Our Identity</p>

        <h2>
          Tradition Built
          <br />
          for Tomorrow
        </h2>

        <p>
          Rooh Afza is not only a product. It is a symbol of heritage,
          trust, and timeless connection across generations.
        </p>
      </div>

      <div ref={cardsRef}>
        {identityCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

