import { useRef } from "react";

export default function FinalSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <div>
        <header>
          <p>The Next Chapter</p>

          <h2>
            Rooh Afza.
            <br />
            Ready For Tomorrow.
          </h2>

          <p>
            A century of trust transformed into a future-focused brand built
            for new generations across the world.
          </p>
        </header>

        <div>
          <article>
            <h3>Heritage</h3>
            <p>
              Preserving the emotional connection that has made Rooh Afza a
              household name for generations.
            </p>
          </article>

          <article>
            <h3>Innovation</h3>
            <p>
              Creating modern experiences through products, technology, and
              digital connections.
            </p>
          </article>

          <article>
            <h3>Global Future</h3>
            <p>
              Carrying Indian culture and identity to consumers around the
              world.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
