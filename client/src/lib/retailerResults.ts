export function formatRetailerHours(weekdayText?: string[], date = new Date()): string {
  const mondayFirstIndex = (date.getDay() + 6) % 7;
  return weekdayText?.[mondayFirstIndex]?.replace(/^[^:]+:\s*/, "") || "Hours not published";
}

export function createDirectionsUrl(placeId: string | undefined, latitude: number, longitude: number): string {
  const destination = placeId
    ? `destination_place_id=${encodeURIComponent(placeId)}`
    : `destination=${latitude},${longitude}`;
  return `https://www.google.com/maps/dir/?api=1&${destination}`;
}
