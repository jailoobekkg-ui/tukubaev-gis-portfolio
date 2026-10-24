import type { FeatureCollection } from "geojson";

// Free, public tile services and illustrative demo data. No restricted or official datasets.
export type Basemap = { id: string; label: string; url: string; attribution: string; maxZoom: number; subdomains?: string };

export const BASEMAPS: Basemap[] = [
  {
    id: "dark",
    label: "Esri Dark Gray",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    maxZoom: 16,
  },
  {
    id: "light",
    label: "Esri Light Gray",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    maxZoom: 16,
  },
  {
    id: "osm",
    label: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: "topo",
    label: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    maxZoom: 17,
    subdomains: "abc",
  },
  {
    id: "imagery",
    label: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19,
  },
];

export const HILLSHADE = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
  attribution: "Hillshade &copy; Esri",
};

export const KG_BOUNDS: [[number, number], [number, number]] = [
  [39.15, 69.2],
  [43.3, 80.3],
];
export const KG_CENTER: [number, number] = [41.3, 74.7];

/** Approximate coordinates of regional centres — illustrative demo layer only. */
export const DEMO_POINTS: { name: string; region: string; lat: number; lng: number }[] = [
  { name: "Bishkek", region: "Capital city", lat: 42.8746, lng: 74.5698 },
  { name: "Osh", region: "City of republican significance", lat: 40.5283, lng: 72.7985 },
  { name: "Karakol", region: "Issyk-Kul Region", lat: 42.4907, lng: 78.3936 },
  { name: "Naryn", region: "Naryn Region", lat: 41.4287, lng: 75.9911 },
  { name: "Talas", region: "Talas Region", lat: 42.5228, lng: 72.2427 },
  { name: "Jalal-Abad", region: "Jalal-Abad Region", lat: 40.9333, lng: 73.0017 },
  { name: "Batken", region: "Batken Region", lat: 40.0625, lng: 70.8194 },
  { name: "Bokonbaev", region: "Ton District, Issyk-Kul Region", lat: 42.1175, lng: 76.9917 },
];

export function demoGeoJSON(): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: DEMO_POINTS.map((p) => ({
      type: "Feature",
      properties: { name: p.name, region: p.region, note: "Illustrative location (approximate)" },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    })),
  };
}

export async function loadKyrgyzstan(): Promise<FeatureCollection | null> {
  try {
    const res = await fetch("/geo/kyrgyzstan.geojson");
    if (!res.ok) return null;
    return (await res.json()) as FeatureCollection;
  } catch {
    return null;
  }
}

export function formatCoord(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(5)}° ${ns}, ${Math.abs(lng).toFixed(5)}° ${ew}`;
}

export function toDMS(value: number, pos: string, neg: string) {
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const mFull = (abs - d) * 60;
  const m = Math.floor(mFull);
  const s = ((mFull - m) * 60).toFixed(1);
  return `${d}°${String(m).padStart(2, "0")}′${s.padStart(4, "0")}″${value >= 0 ? pos : neg}`;
}
