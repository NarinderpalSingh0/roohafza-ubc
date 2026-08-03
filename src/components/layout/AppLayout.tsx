import type { ReactNode } from "react";

type AppLayoutProps = {
  readonly children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <main id="main-content" role="main" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
