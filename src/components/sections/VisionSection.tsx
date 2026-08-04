import { useRef } from "react";

export default function VisionSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const visionPoints = [
    {
      title: "Preserve Heritage",
      description:
        "Protecting the emotional connection and cultural identity that made Rooh Afza iconic.",
    },
    {
      title: "Create Relevance",
      description:
        "Building experiences that connect with new generations of consumers.",
    },
    {
      title: "Lead Tomorrow",
      description:
        "Transforming a century-old brand into a future-ready global identity.",
    },
  ];

  return (
    <div ref={rootRef}>
      <div>
        <header>
          <p>Future Vision</p>

          <h2>
            A Legacy That
            <br />
            Continues Forward.
          </h2>

          <p>
            Reimagining Rooh Afza as a global cultural brand while keeping its
            timeless emotional connection alive.
          </p>
        </header>

        <div>
          {visionPoints.map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
