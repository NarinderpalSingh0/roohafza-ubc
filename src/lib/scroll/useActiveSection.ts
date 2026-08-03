import { useScrollContext } from "./ScrollContext";

export function useActiveSection() {
  const { snapshot } = useScrollContext();
  return snapshot.activeSection;
}
