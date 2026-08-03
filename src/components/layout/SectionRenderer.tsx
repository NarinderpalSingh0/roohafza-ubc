import { Suspense } from "react";
import { sections } from "../../lib/registry";

function SectionFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg-primary)",
      }}
    />
  );
}

export function SectionRenderer() {
  return (
    <>
      {sections.map(({ id, component: Component }) => (
        <Suspense key={id} fallback={<SectionFallback />}>
          <Component />
        </Suspense>
      ))}
    </>
  );
}
