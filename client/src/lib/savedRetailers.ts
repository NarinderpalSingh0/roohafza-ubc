export type SavedRetailer = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  todayHours?: string;
  directionsUrl: string;
};

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export const SAVED_RETAILERS_STORAGE_KEY = "roohafza.saved-retailers.v1";

export function parseSavedRetailers(value: string | null): SavedRetailer[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((retailer): retailer is SavedRetailer => (
      typeof retailer?.id === "string" &&
      typeof retailer?.name === "string" &&
      typeof retailer?.address === "string" &&
      typeof retailer?.directionsUrl === "string"
    ));
  } catch {
    return [];
  }
}

export function readSavedRetailers(storage: StorageLike): SavedRetailer[] {
  try {
    return parseSavedRetailers(storage.getItem(SAVED_RETAILERS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function toggleSavedRetailer(current: SavedRetailer[], retailer: SavedRetailer): SavedRetailer[] {
  const isSaved = current.some((saved) => saved.id === retailer.id);
  return isSaved ? current.filter((saved) => saved.id !== retailer.id) : [retailer, ...current].slice(0, 12);
}

export function persistSavedRetailers(storage: StorageLike, retailers: SavedRetailer[]): void {
  try {
    storage.setItem(SAVED_RETAILERS_STORAGE_KEY, JSON.stringify(retailers));
  } catch {
    // Favourites remain available for the current session when browser storage is unavailable.
  }
}
