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
    expect(config.buildCommand).toBe("pnpm build:vercel");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites).toEqual([
      {
        source: "/api/:path*",
        destination: "/api?path=:path*",
      },
    ]);
  });

  it("bundles a rewrite-backed API function for the Express+tRPC application", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")
    );
    const functionPath = path.join(projectRoot, "server", "vercel-api.ts");
    const bundledEntryPath = path.join(projectRoot, "api", "index.js");
    const functionSource = fs.readFileSync(functionPath, "utf8");

    expect(packageJson.scripts["build:vercel"]).toContain("esbuild server/vercel-api.ts");
    expect(packageJson.scripts["build:vercel"]).toContain("--outfile=api/index.js");
    expect(fs.existsSync(bundledEntryPath)).toBe(true);
    expect(functionSource).toContain('import { createApp } from "./_core/app"');
    expect(functionSource).toContain("export default function handler");
    expect(functionSource).toContain('requestUrl.searchParams.get("path")');
    expect(functionSource).toContain("return app(req, res)");
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
