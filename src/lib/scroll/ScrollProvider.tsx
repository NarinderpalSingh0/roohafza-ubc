import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  createScrollController,
  type ScrollSnapshot,
} from "./ScrollController";
import { ScrollContext, type ScrollContextValue } from "./ScrollContext";

type ScrollProviderProps = {
  readonly children: ReactNode;
};

export function ScrollProvider({ children }: ScrollProviderProps) {
  const controller = useMemo(() => createScrollController(), []);

  const [snapshot, setSnapshot] = useState<ScrollSnapshot>(
    () => controller.getSnapshot(),
  );

  useEffect(() => {
    controller.attachScrollListener();

    const unsubscribe = controller.subscribe((s) => {
      setSnapshot(s);
    });

    return () => {
      unsubscribe();
      controller.detachScrollListener();
      controller.destroy();
    };
  }, [controller]);

  const value: ScrollContextValue = useMemo(
    () => ({ controller, snapshot }),
    [controller, snapshot],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
