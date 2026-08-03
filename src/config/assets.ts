import type { ImageManifestEntry } from "../types";

const manifest: readonly ImageManifestEntry[] = [
  {
    id: "bottle",
    category: "products",
    filename: "rooh-afza-bottle.png",
    src: "/assets/images/products/rooh-afza-bottle.png",
    width: 842,
    height: 1620,
    aspectRatio: 0.52,
    orientation: "portrait",
    bytes: 79979,
  },
  {
    id: "can",
    category: "products",
    filename: "rooh-afza-can.png",
    src: "/assets/images/products/rooh-afza-can.png",
    width: 1024,
    height: 1024,
    aspectRatio: 1.0,
    orientation: "square",
    bytes: 1003724,
  },
] as const;

export function getImage(id: string): ImageManifestEntry | undefined {
  return manifest.find((entry) => entry.id === id);
}

export function getImagesByCategory(
  category: string,
): readonly ImageManifestEntry[] {
  return manifest.filter((entry) => entry.category === category);
}

export function getAllImages(): readonly ImageManifestEntry[] {
  return manifest;
}

export { manifest };
