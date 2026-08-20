import type { Product, ProductVariant } from "@shared/commerce/types";

export function getFlavorName(product: Product) {
  const source = `${product.title} ${product.tags.join(" ")}`.toLowerCase();
  if (source.includes("berry bust")) return "Berry Bust";
  if (source.includes("straberry")) return "Straberry";
  if (source.includes("rose")) return "Rose";
  return "Other";
}

function normalizeSize(value: string) {
  const match = value.match(/(\d+)\s*ml/i);
  return match ? `${match[1]} ml` : undefined;
}

export function getCanSize(product: Product) {
  const option = product.options.find(option => option.name.toLowerCase() === "size")?.values.find(normalizeSize);
  const variantSize = product.variants.flatMap(variant => variant.selectedOptions.map(option => option.value)).find(normalizeSize);
  return normalizeSize(option ?? variantSize ?? product.title) ?? "330 ml";
}

export function getVariantCanSize(variant: ProductVariant, product: Product) {
  const selected = variant.selectedOptions.find(option => option.name.toLowerCase() === "size")?.value;
  return normalizeSize(selected ?? variant.title) ?? getCanSize(product);
}

export function filterShopProducts(products: Product[], flavor: string, size: string) {
  return products.filter(product => (flavor === "All" || getFlavorName(product) === flavor) && (size === "All sizes" || getCanSize(product) === size));
}
