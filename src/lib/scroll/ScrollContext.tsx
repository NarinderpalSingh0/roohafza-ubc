import { createContext, useContext } from "react";
import type { ScrollController, ScrollSnapshot } from "./ScrollController";

export type ScrollContextValue = {
  controller: ScrollController;
  snapshot: ScrollSnapshot;
};

export const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollContext(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
}
