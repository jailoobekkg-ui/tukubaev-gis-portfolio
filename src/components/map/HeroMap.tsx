"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASEMAPS, DEMO_POINTS, KG_BOUNDS, loadKyrgyzstan } from "./layers";

/** Background map of Kyrgyzstan for the hero section. Reports cursor coordinates to the parent. */
export default function HeroMap({ onMove }: { onMove?: (lat: number, lng: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const moveRef = useRef(onMove);
  moveRef.current = onMove;

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomSnap: 0.25,
    });
    map.fitBounds(KG_BOUNDS, { padding: [10, 10] });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const isDark = () => document.documentElement.classList.contains("dark");
    const pick = () => BASEMAPS.find((b) => b.id === (isDark() ? "dark" : "light"))!;
    let base = L.tileLayer(pick().url, { attribution: pick().attribution, subdomains: pick().subdomains ?? "abc", maxZoom: pick().maxZoom }).addTo(map);

    // Re-skin the base map when the theme changes.
    const observer = new MutationObserver(() => {
      const b = pick();
      map.removeLayer(base);
      base = L.tileLayer(b.url, { attribution: b.attribution, subdomains: b.subdomains ?? "abc", maxZoom: b.maxZoom }).addTo(map);
      base.bringToBack();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let cancelled = false;
    loadKyrgyzstan().then((fc) => {
      if (!fc || cancelled) return;
      L.geoJSON(fc, { style: { color: "#00D4FF", weight: 6, opacity: 0.18, fill: false }, interactive: false }).addTo(map);
      L.geoJSON(fc, { style: { color: "#00D4FF", weight: 1.6, opacity: 0.95, fillColor: "#00D4FF", fillOpacity: 0.06 }, interactive: false }).addTo(map);
    });

    for (const p of DEMO_POINTS) {
      L.circleMarker([p.lat, p.lng], { radius: 4, color: "#22C55E", weight: 1.5, fillColor: "#22C55E", fillOpacity: 0.8 })
        .bindTooltip(p.name, { direction: "top", offset: [0, -4] })
        .addTo(map);
    }

    map.on("mousemove", (e: L.LeafletMouseEvent) => moveRef.current?.(e.latlng.lat, e.latlng.lng));
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      map.remove();
    };
  }, []);

  return <div ref={ref} className="h-full w-full" role="img" aria-label="Map of the Kyrgyz Republic" />;
}
