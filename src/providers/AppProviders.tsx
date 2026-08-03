import type { ReactNode } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";

type AppProvidersProps = {
  readonly children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
