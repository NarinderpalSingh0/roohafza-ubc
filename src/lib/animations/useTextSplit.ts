import { useEffect, useRef } from "react";

export function useTextSplit() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = el.textContent;
    if (!text) return;

    el.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="text-split__char">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");
  }, []);

  return ref;
}
