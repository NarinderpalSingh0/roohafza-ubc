import { ExternalLink, LocateFixed, Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import "./store-locator-full-map.css";

const popularAreas = [
  { label: "Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  { label: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
];

function toMapBounds(lat: number, lng: number, spread = 0.24) {
  const west = lng - spread;
  const south = lat - spread;
  const east = lng + spread;
  const north = lat + spread;
  return `${west},${south},${east},${north}`;
}

export function StoreLocator() {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState(popularAreas[0]);
  const [status, setStatus] = useState("Search a city or PIN code to explore retailers nearby.");

  const setPopularArea = (area: (typeof popularAreas)[number]) => {
    setLocation(area.label);
    setMapCenter(area);
    setStatus(`Showing the map around ${area.label}. Open the retailer search to explore nearby stores.`);
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
    setStatus(`We'll use ${query} for the nearby retailer search. Choose a popular city or use your location to update the map view.`);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location services are unavailable. Search by city or PIN code instead.");
      return;
    }

    setStatus("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapCenter({ label: "your current location", lat: coords.latitude, lng: coords.longitude });
        setStatus("Map centred on your current location. Open the retailer search to look nearby.");
      },
      () => setStatus("We could not access your location. Search by city or PIN code instead."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const mapSrc = useMemo(() => {
    const bbox = encodeURIComponent(toMapBounds(mapCenter.lat, mapCenter.lng));
    const marker = encodeURIComponent(`${mapCenter.lat},${mapCenter.lng}`);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
  }, [mapCenter]);
  const mapsQuery = encodeURIComponent(`Roohafza cans near ${location.trim() || mapCenter.label}`);

  return (
    <section className="locator-section section-pad" id="stores" aria-labelledby="locator-title">
      <div className="locator-heading">
        <div>
          <span className="section-kicker"><i />Find the feeling</span>
          <h2 id="locator-title">A can of <em>Roohafza,</em><br />close to you.</h2>
        </div>
        <p>Search your city or use your current location to centre the map, then explore local retailers. Stock can change—please call ahead before visiting.</p>
      </div>

      <div className="locator-layout">
        <div className="map-frame map-frame--full">
          <iframe className="roohafza-map" src={mapSrc} title="Interactive map for the Roohafza store locator" loading="lazy" />
          <div className="map-caption"><span>Roohafza Locator</span><b>Explore {mapCenter.label}</b></div>
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
            <a className="maps-link" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noreferrer">Open nearby retailer search <ExternalLink size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
