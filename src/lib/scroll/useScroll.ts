import { useScrollContext } from "./ScrollContext";

export function useScroll() {
  const { controller, snapshot } = useScrollContext();

  return {
    scrollTo: controller.scrollTo.bind(controller),
    subscribe: controller.subscribe.bind(controller),
    ...snapshot,
  };
}
