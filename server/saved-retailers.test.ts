import { describe, expect, it } from "vitest";
import { parseSavedRetailers, toggleSavedRetailer } from "../client/src/lib/savedRetailers";

const retailer = {
  id: "place-1",
  name: "Roohafza Market",
  address: "12 Bright Lane, Delhi",
  directionsUrl: "https://maps.example/directions/place-1",
};

describe("saved retailer favourites", () => {
  it("accepts only complete persisted retailer records", () => {
    expect(parseSavedRetailers(JSON.stringify([retailer, { id: "incomplete" }]))).toEqual([retailer]);
    expect(parseSavedRetailers("not-json")).toEqual([]);
  });

  it("adds a favourite and removes it when selected again", () => {
    const saved = toggleSavedRetailer([], retailer);
    expect(saved).toEqual([retailer]);
    expect(toggleSavedRetailer(saved, retailer)).toEqual([]);
  });

  it("keeps the most recent twelve saved retailers for a compact quick-access list", () => {
    const existing = Array.from({ length: 12 }, (_, index) => ({ ...retailer, id: `place-${index + 2}` }));
    const updated = toggleSavedRetailer(existing, retailer);
    expect(updated).toHaveLength(12);
    expect(updated[0]).toEqual(retailer);
  });
});
