import fs from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("Vercel deployment configuration", () => {
  it("uses pnpm and publishes the Vite client build", () => {
    const config = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8")
    );

    expect(config.installCommand).toBe("pnpm install --frozen-lockfile");
    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBe("dist/public");
  });

  it("provides a catch-all API function for the Express+tRPC application", () => {
    const functionPath = path.join(projectRoot, "api", "[...path].ts");
    const functionSource = fs.readFileSync(functionPath, "utf8");

    expect(functionSource).toContain('import { createApp } from "../server/_core/app"');
    expect(functionSource).toContain("export default createApp()");
  });

  it("uses public CDN URLs for supplied brand assets instead of the Manus-only storage proxy", () => {
    const clientFiles = [
      "client/src/data/brandAssets.ts",
      "client/src/data/campaignSlides.tsx",
      "client/src/pages/Home.tsx",
      "client/src/components/ShopSection.tsx",
    ];

    for (const file of clientFiles) {
      const source = fs.readFileSync(path.join(projectRoot, file), "utf8");
      expect(source).not.toContain("/manus-storage/roohafza-");
    }

    const assets = fs.readFileSync(path.join(projectRoot, "client/src/data/brandAssets.ts"), "utf8");
    expect(assets.match(/https:\/\/files\.manuscdn\.com/g)).toHaveLength(7);
  });
});
