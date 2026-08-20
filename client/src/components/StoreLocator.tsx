import { Clock3, ExternalLink, Heart, HeartOff, List, LocateFixed, Map as MapIcon, Navigation, Phone, RefreshCw, Search, Store, LoaderCircle } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { createDirectionsUrl, formatRetailerHours } from "@/lib/retailerResults";
import { createOpenStreetMapEmbedUrl } from "@/lib/locatorMap";
import { persistSavedRetailers, readSavedRetailers, SavedRetailer, toggleSavedRetailer } from "@/lib/savedRetailers";
import "./store-locator-full-map.css";
import "./saved-retailer.css";

type MapCenter = { label: string; lat: number; lng: number };

type RetailerResult = SavedRetailer;

const popularAreas: MapCenter[] = [
  { label: "Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  { label: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

function toRetailerResult(place: google.maps.places.PlaceResult): RetailerResult | null {
  if (!place.name || !place.geometry?.location) return null;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  return {
    id: place.place_id || `${place.name}-${latitude}-${longitude}`,
    name: place.name,
    address: place.formatted_address || place.vicinity || "Address not published",
    phone: place.formatted_phone_number || undefined,
    todayHours: formatRetailerHours(place.opening_hours?.weekday_text),
    directionsUrl: createDirectionsUrl(place.place_id, latitude, longitude),
  };
}

export function StoreLocator() {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState<MapCenter>(popularAreas[0]);
  const [status, setStatus] = useState("Search a city or PIN code to explore nearby retailers.");
  const [retailers, setRetailers] = useState<RetailerResult[]>([]);
  const [savedRetailers, setSavedRetailers] = useState<SavedRetailer[]>([]);
  const [retailerLoading, setRetailerLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [mapsSdkReady, setMapsSdkReady] = useState(false);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isRefreshingMap, setIsRefreshingMap] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    setSavedRetailers(readSavedRetailers(window.localStorage));
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const lookupRetailers = useCallback(async (center: MapCenter, suppliedMap?: google.maps.Map | null) => {
    const map = suppliedMap ?? mapRef.current;
    if (!map || !window.google?.maps?.places) return;

    map.panTo({ lat: center.lat, lng: center.lng });
    clearMarkers();
    setRetailerLoading(true);
    setRetailers([]);
    setStatus(`Finding nearby retailers around ${center.label}…`);

    const placeService = new window.google.maps.places.PlacesService(map);
    placeService.nearbySearch(
      {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: 5000,
        type: "supermarket",
      },
      async (places, placesStatus) => {
        if (placesStatus !== window.google.maps.places.PlacesServiceStatus.OK || !places?.length) {
          setRetailerLoading(false);
          setStatus(`No nearby retailer details were returned for ${center.label}. Try another city or open the broader retailer search.`);
          return;
        }

        const details = await Promise.all(
          places.slice(0, 5).map((place) => new Promise<google.maps.places.PlaceResult>((resolve) => {
            if (!place.place_id) {
              resolve(place);
              return;
            }
            placeService.getDetails(
              {
                placeId: place.place_id,
                fields: ["name", "formatted_address", "formatted_phone_number", "opening_hours", "geometry", "place_id", "vicinity"],
              },
              (detail, detailStatus) => resolve(detailStatus === window.google.maps.places.PlacesServiceStatus.OK && detail ? detail : place)
            );
          }))
        );

        const normalized = details.map(toRetailerResult).filter((retailer): retailer is RetailerResult => Boolean(retailer));
        details.forEach((place) => {
          if (!place.geometry?.location) return;
          markersRef.current.push(new window.google.maps.Marker({ map, position: place.geometry.location, title: place.name }));
        });
        setRetailers(normalized);
        setRetailerLoading(false);
        setStatus(normalized.length ? `Showing ${normalized.length} nearby retailers around ${center.label}. Please call ahead to confirm Roohafza availability.` : `No nearby retailer details were returned for ${center.label}.`);
      }
    );
  }, [clearMarkers]);

  const setPopularArea = (area: MapCenter) => {
    setLocation(area.label);
    setHasSearched(true);
    setMobileView("map");
    setMapCenter(area);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = location.trim();
    if (!query) {
      setStatus("Enter a city, landmark, or PIN code to update the retailer search.");
      return;
    }

    const matchedCity = popularAreas.find((area) => area.label.toLowerCase() === query.toLowerCase());
    if (matchedCity) {
      setPopularArea(matchedCity);
      return;
    }

    if (!window.google?.maps) {
      setStatus("The map is still preparing. Please try the search again in a moment.");
      return;
    }

    setStatus(`Locating ${query}…`);
    new window.google.maps.Geocoder().geocode({ address: query }, (results, geocodeStatus) => {
      const result = results?.[0];
      if (geocodeStatus !== "OK" || !result?.geometry?.location) {
        setStatus(`We could not find ${query}. Try a city, landmark, or PIN code.`);
        return;
      }
      setHasSearched(true);
      setMobileView("map");
      setMapCenter({ label: result.formatted_address || query, lat: result.geometry.location.lat(), lng: result.geometry.location.lng() });
    });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location services are unavailable. Search by city or PIN code instead.");
      return;
    }

    setStatus("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setHasSearched(true);
        setMobileView("map");
        setMapCenter({ label: "your current location", lat: coords.latitude, lng: coords.longitude });
      },
      () => setStatus("We could not access your location. Search by city or PIN code instead."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapsSdkReady(true);
    if (hasSearched) lookupRetailers(mapCenter, map);
  }, [hasSearched, lookupRetailers, mapCenter]);

  useEffect(() => {
    if (hasSearched && mapRef.current) lookupRetailers(mapCenter);
  }, [hasSearched, lookupRetailers, mapCenter]);

  const toggleRetailerSave = (retailer: SavedRetailer) => {
    const wasSaved = savedRetailers.some((saved) => saved.id === retailer.id);
    const updated = toggleSavedRetailer(savedRetailers, retailer);
    setSavedRetailers(updated);
    persistSavedRetailers(window.localStorage, updated);
    setStatus(wasSaved ? `${retailer.name} was removed from your saved retailers.` : `${retailer.name} is saved for your next visit.`);
  };

  const mapsQuery = useMemo(() => encodeURIComponent(`Roohafza cans near ${location.trim() || mapCenter.label}`), [location, mapCenter.label]);
  const fallbackMapSrc = useMemo(() => createOpenStreetMapEmbedUrl(mapCenter.lat, mapCenter.lng, mapRefreshKey), [mapCenter, mapRefreshKey]);

  const refreshCurrentMap = () => {
    mapRef.current = null;
    setMapsSdkReady(false);
    setIsRefreshingMap(true);
    setMapRefreshKey((key) => key + 1);
    setStatus(`Refreshing the map around ${mapCenter.label}…`);
    window.setTimeout(() => setIsRefreshingMap(false), 700);
  };

  return (
    <section className="locator-section section-pad" id="stores" aria-labelledby="locator-title">
      <div className="locator-heading">
        <div>
          <span className="section-kicker"><i />Find the feeling</span>
          <h2 id="locator-title">A can of <em>Roohafza,</em><br />close to you.</h2>
        </div>
        <p>Search your city or use your current location to find nearby retailers. Store availability can change—please call ahead before visiting.</p>
      </div>

      <div className="locator-layout">
        <div className={`map-frame map-frame--full${mobileView === "list" ? " is-list-view" : ""}`}>
          <iframe key={`fallback-${mapRefreshKey}`} className={`roohafza-map-fallback${mapsSdkReady ? " is-covered" : ""}`} src={fallbackMapSrc} title="Map for the Roohafza store locator" loading="lazy" />
          <MapView key={`map-${mapRefreshKey}`} className={`roohafza-map${mapsSdkReady ? " is-ready" : ""}`} initialCenter={{ lat: mapCenter.lat, lng: mapCenter.lng }} initialZoom={12} onMapReady={handleMapReady} />
          <div className="map-caption"><span>Roohafza Locator</span><b>Explore {mapCenter.label}</b></div>
          <button className="map-refresh" type="button" onClick={refreshCurrentMap} aria-label={`Refresh map around ${mapCenter.label}`} aria-busy={isRefreshingMap}>
            <RefreshCw size={14} className={isRefreshingMap ? "is-spinning" : ""} />{isRefreshingMap ? "Refreshing" : "Refresh map"}
          </button>
          <div className="mobile-locator-toggle" role="group" aria-label="Choose store locator view">
            <button type="button" className={mobileView === "map" ? "is-active" : ""} aria-pressed={mobileView === "map"} onClick={() => setMobileView("map")}><MapIcon size={14} />Map</button>
            <button type="button" className={mobileView === "list" ? "is-active" : ""} aria-pressed={mobileView === "list"} onClick={() => setMobileView("list")}><List size={14} />List</button>
          </div>
          <div className="locator-panel locator-panel--overlay">
            <span className="panel-number">01 / LOCATE</span>
            <h3>Where should we look?</h3>
            <form className="locator-form" onSubmit={handleSearch}>
              <label htmlFor="location-search">City or PIN code</label>
              <div className="field-row">
                <input id="location-search" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Delhi or 110001" />
                <button type="submit" aria-label="Search location"><Search size={18} /></button>
              </div>
            </form>
            <button className="locator-secondary" type="button" onClick={useMyLocation}><LocateFixed size={16} />Use my location</button>
            <div className="popular-areas" aria-label="Popular cities">
              <span>Popular cities</span>
              <div>{popularAreas.map((area) => <button key={area.label} type="button" onClick={() => setPopularArea(area)}>{area.label}</button>)}</div>
            </div>
            <p className="locator-status" aria-live="polite">{status}</p>
            {savedRetailers.length > 0 && <section className="saved-retailers" aria-label="Saved retailers">
              <div className="saved-retailers-heading"><Heart size={14} fill="currentColor" /><span>Saved for later</span></div>
              <div className="saved-retailer-list">
                {savedRetailers.map((retailer) => <article className="saved-retailer-card" key={retailer.id}>
                  <h4>{retailer.name}</h4>
                  <button className="retailer-save is-saved" type="button" onClick={() => toggleRetailerSave(retailer)} aria-label={`Remove ${retailer.name} from saved retailers`}><HeartOff size={13} />Remove</button>
                  <p>{retailer.address}</p>
                  <div className="saved-retailer-actions"><a className="saved-retailer-directions" href={retailer.directionsUrl} target="_blank" rel="noreferrer"><Navigation size={13} />Directions <ExternalLink size={12} /></a></div>
                </article>)}
              </div>
            </section>}
            {retailerLoading && <div className="retailer-loading" role="status"><LoaderCircle size={16} />Finding nearby retailers…</div>}
            {!retailerLoading && retailers.length > 0 && <section className="retailer-results" aria-label={`Nearby retailers around ${mapCenter.label}`}>
              <div className="retailer-results-heading"><span>Nearby retailers</span><b>{retailers.length}</b></div>
              <div className="retailer-card-list">
                {retailers.map((retailer) => {
                  const isSaved = savedRetailers.some((saved) => saved.id === retailer.id);
                  return <article className="retailer-card" key={retailer.id}>
                  <div className="retailer-card-title"><Store size={15} /><h4>{retailer.name}</h4><button className={`retailer-save${isSaved ? " is-saved" : ""}`} type="button" onClick={() => toggleRetailerSave(retailer)} aria-pressed={isSaved} aria-label={`${isSaved ? "Remove" : "Save"} ${retailer.name} ${isSaved ? "from" : "to"} saved retailers`}><Heart size={13} fill={isSaved ? "currentColor" : "none"} />{isSaved ? "Saved" : "Save"}</button></div>
                  <p>{retailer.address}</p>
                  <div className="retailer-meta"><span><Clock3 size={13} />{retailer.todayHours}</span>{retailer.phone ? <a href={`tel:${retailer.phone.replace(/\s+/g, "")}`}><Phone size={13} />{retailer.phone}</a> : <span><Phone size={13} />Contact not published</span>}</div>
                  <a className="retailer-directions" href={retailer.directionsUrl} target="_blank" rel="noreferrer"><Navigation size={14} />Directions <ExternalLink size={13} /></a>
                </article>;
                })}
              </div>
            </section>}
            <a className="maps-link" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noreferrer">Open broader retailer search <ExternalLink size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
