import { describe, expect, it } from "vitest";
import { createOpenStreetMapEmbedUrl } from "../client/src/lib/locatorMap";

describe("locator map refresh URL", () => {
  it("preserves the selected map centre while changing the refresh cache key", () => {
    const first = new URL(createOpenStreetMapEmbedUrl(28.6139, 77.209, 0));
    const refreshed = new URL(createOpenStreetMapEmbedUrl(28.6139, 77.209, 1));

    expect(first.searchParams.get("marker")).toBe("28.6139,77.209");
    expect(refreshed.searchParams.get("marker")).toBe("28.6139,77.209");
    expect(first.searchParams.get("bbox")).toBe(refreshed.searchParams.get("bbox"));
    expect(refreshed.searchParams.get("refresh")).toBe("1");
  });
});
