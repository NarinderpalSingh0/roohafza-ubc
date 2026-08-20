import { describe, expect, it } from "vitest";
import { getShoppingBagLabel } from "../client/src/lib/cartLabel";

describe("header shopping bag label", () => {
  it("uses a concise empty-cart label", () => {
    expect(getShoppingBagLabel(0)).toBe("Open shopping bag");
  });

  it("reports the cart count with correct singular and plural grammar", () => {
    expect(getShoppingBagLabel(1)).toBe("Open shopping bag, 1 item");
    expect(getShoppingBagLabel(3)).toBe("Open shopping bag, 3 items");
  });
});
