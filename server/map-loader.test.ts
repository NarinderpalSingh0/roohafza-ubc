import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mapComponentPath = new URL("../client/src/components/Map.tsx", import.meta.url);

describe("Google Maps SDK loader", () => {
  it("shares one loader promise and retains the tagged script instead of injecting it per map mount", () => {
    const source = readFileSync(mapComponentPath, "utf8");

    expect(source).toContain('const MAPS_SCRIPT_ID = "roohafza-google-maps-sdk"');
    expect(source).toContain("let mapsScriptPromise: Promise<void> | null = null");
    expect(source).toContain("if (mapsScriptPromise) return mapsScriptPromise");
    expect(source).toContain("document.getElementById(MAPS_SCRIPT_ID)");
    expect(source).toContain("loading=async");
    expect(source).toContain("function waitForMapsSdk()");
    expect(source).not.toContain("script.remove()");
  });
});
