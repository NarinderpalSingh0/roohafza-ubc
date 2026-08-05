export default function MarqueeSection() {
  const items = [
    "100+ Years of Trust",
    "30+ Botanical Ingredients",
    "4 Generations Connected",
    "One Timeless Legacy",
  ];

  const group = (
    <>
      {items.map((item, i) => (
        <span key={i} className="marquee__item">
          {item}
          <span className="marquee__separator">&nbsp;&nbsp;&nbsp;&#10022;&nbsp;&nbsp;&nbsp;</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  );
}
