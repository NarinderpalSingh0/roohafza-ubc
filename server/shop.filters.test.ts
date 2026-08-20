import { describe, expect, it } from "vitest";
import type { Product } from "../shared/commerce/types";
import { filterShopProducts, getCanSize, getFlavorName, getVariantCanSize } from "../client/src/lib/shopFilters";

const makeProduct = (title: string, size: string): Product => ({
  id: title,
  handle: title.toLowerCase().replaceAll(" ", "-"),
  title,
  description: "",
  descriptionHtml: "",
  productType: null,
  vendor: null,
  tags: [],
  images: [],
  priceRange: { min: { amount: "99", currencyCode: "INR" }, max: { amount: "99", currencyCode: "INR" } },
  options: [{ name: "Size", values: [size] }],
  variants: [{ id: `${title}-variant`, title: size, price: { amount: "99", currencyCode: "INR" }, compareAtPrice: null, availableForSale: true, selectedOptions: [{ name: "Size", value: size }] }],
});

describe("shop filters", () => {
  const rose = makeProduct("Roohafza Rose — 330 ml", "330 ml");
  const berry = makeProduct("Roohafza Berry Bust — 500 ml", "500 ml");

  it("derives flavor and size labels from catalog data", () => {
    expect(getFlavorName(rose)).toBe("Rose");
    expect(getCanSize(berry)).toBe("500 ml");
    expect(getVariantCanSize(rose.variants[0]!, rose)).toBe("330 ml");
  });

  it("filters the catalog by flavor and can size", () => {
    expect(filterShopProducts([rose, berry], "Rose", "All sizes")).toEqual([rose]);
    expect(filterShopProducts([rose, berry], "All", "500 ml")).toEqual([berry]);
  });
});
