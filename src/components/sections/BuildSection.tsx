import { useRef } from "react";

export default function BuildSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const buildCards = [
    {
      title: "Modern Product Innovation",
      description:
        "Creating new experiences that respect Rooh Afza's heritage while adapting to evolving consumer needs.",
    },
    {
      title: "Digital First Ecosystem",
      description:
        "Building stronger relationships through technology, community, and direct consumer connections.",
    },
    {
      title: "Global Growth",
      description:
        "Expanding Rooh Afza's cultural identity into new international markets.",
    },
    {
      title: "Future Ready Brand",
      description:
        "A transformation strategy designed for the next generation of consumers.",
    },
  ];

  return (
    <div ref={rootRef}>
      <div>
        <header>
          <p>Build The Future</p>

          <h2>
            From Heritage.
            <br />
            To Tomorrow.
          </h2>

          <p>
            Building a stronger Rooh Afza through innovation, digital
            experiences, and meaningful consumer relationships.
          </p>
        </header>

        <div>
          {buildCards.map((card) => (
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
