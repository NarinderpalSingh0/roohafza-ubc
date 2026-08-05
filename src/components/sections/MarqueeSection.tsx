export default function MarqueeSection() {
  const items = [
    "100+ Years of Trust",
    "30+ Botanical Ingredients",
    "4 Generations Connected",
    "One Timeless Legacy",
  ];

  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {repeatedItems.map((item, index) => (
          <span key={index} className="marquee__item">
            {item}
            <span className="marquee__separator">&nbsp;&nbsp;&nbsp;&#10022;&nbsp;&nbsp;&nbsp;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
