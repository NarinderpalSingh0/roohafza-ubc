export function getShoppingBagLabel(itemCount: number): string {
  if (itemCount <= 0) return "Open shopping bag";
  return `Open shopping bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`;
}
