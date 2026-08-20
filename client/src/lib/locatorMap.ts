export function createOpenStreetMapEmbedUrl(lat: number, lng: number, refreshKey = 0, spread = 0.24): string {
  const bbox = `${lng - spread},${lat - spread},${lng + spread},${lat + spread}`;
  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${lat},${lng}`,
    refresh: String(refreshKey),
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
