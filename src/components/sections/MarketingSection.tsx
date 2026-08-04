import { useRef } from "react";

export default function MarketingSection() {
  const rootRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={rootRef}>
      <div>
        <header>
          <p>Digital Connection</p>

          <h2>
            Three Channels.
            <br />
            One Stronger Connection.
          </h2>

          <p>
            A focused digital ecosystem built around storytelling, community,
            and meaningful relationships with consumers.
          </p>
        </header>

        <div>
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
