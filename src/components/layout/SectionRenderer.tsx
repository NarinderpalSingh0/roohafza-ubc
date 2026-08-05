import { Suspense, useRef, useEffect } from "react";
import { sections } from "../../lib/registry";
import { useScrollContext } from "../../lib/scroll/ScrollContext";
import type { SectionId } from "../../types";

function SectionFallback() {
  return (
    <div
      style={{
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    />
  );
}

function SectionSentinel({ id }: { readonly id: SectionId }) {
  const ref = useRef<HTMLDivElement>(null);
  const { controller } = useScrollContext();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    controller.registerSection(id, element);

    return () => {
      controller.unregisterSection(id);
    };
  }, [id, controller]);

  return (
    <div
      ref={ref}
      data-section-id={id}
      style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "1px", pointerEvents: "none" }}
    />
  );
}

export function SectionRenderer() {
  return (
    <>
      {sections.map(({ id, component: Component }) => (
        <section key={id} id={id} style={{ position: "relative" }}>
          <SectionSentinel id={id} />
          <Suspense fallback={<SectionFallback />}>
            <Component />
          </Suspense>
        </section>
      ))}
    </>
  );
}
