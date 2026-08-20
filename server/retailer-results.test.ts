import { describe, expect, it } from "vitest";
import { createDirectionsUrl, formatRetailerHours } from "../client/src/lib/retailerResults";

describe("live retailer result helpers", () => {
  it("shows the current day’s opening period without duplicating the weekday", () => {
    const hours = [
      "Monday: 10:00 AM – 8:00 PM",
      "Tuesday: 10:00 AM – 8:00 PM",
      "Wednesday: 10:00 AM – 8:00 PM",
      "Thursday: 10:00 AM – 8:00 PM",
      "Friday: 10:00 AM – 9:00 PM",
      "Saturday: 11:00 AM – 7:00 PM",
      "Sunday: Closed",
    ];
    expect(formatRetailerHours(hours, new Date("2026-08-21T12:00:00Z"))).toBe("10:00 AM – 9:00 PM");
  });

  it("uses an honest fallback when a directory has no published hours", () => {
    expect(formatRetailerHours(undefined, new Date("2026-08-21T12:00:00Z"))).toBe("Hours not published");
  });

  it("creates a place-specific Google Maps directions URL when a place id is available", () => {
    expect(createDirectionsUrl("ChIJ-test/place", 28.6139, 77.209)).toContain("destination_place_id=ChIJ-test%2Fplace");
  });
});
