import { type ReactNode, useEffect } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ScrollProvider } from "../lib/scroll/ScrollProvider";
import { initGsap } from "../lib/gsap";
import { initLenis, destroyLenis } from "../lib/lenis";

type AppProvidersProps = {
  readonly children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    initGsap();
    initLenis();

    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ScrollProvider>{children}</ScrollProvider>
    </ErrorBoundary>
  );
}
