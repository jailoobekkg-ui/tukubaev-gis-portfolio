"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASEMAPS, KG_BOUNDS, loadKyrgyzstan } from "./layers";
import type { MapSettings } from "@/lib/types";

/** Small map for project / portfolio pages: Kyrgyzstan outline plus an optional GeoJSON layer. */
export default function ProjectMap({ settings }: { settings: MapSettings }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: false });
    const dark = document.documentElement.classList.contains("dark");
    const b = BASEMAPS.find((x) => x.id === (dark ? "dark" : "light"))!;
    L.tileLayer(b.url, { attribution: b.attribution, subdomains: b.subdomains ?? "abc", maxZoom: b.maxZoom }).addTo(map);
    L.control.scale({ imperial: false }).addTo(map);

    if (settings.center && settings.center.length === 2) {
      map.setView(settings.center, settings.zoom ?? 9);
      L.circleMarker(settings.center, { radius: 7, color: "#22C55E", weight: 2, fillOpacity: 0.6 }).addTo(map);
    } else {
      map.fitBounds(KG_BOUNDS);
    }

    let cancelled = false;
    loadKyrgyzstan().then((fc) => {
      if (fc && !cancelled) L.geoJSON(fc, { style: { color: "#00D4FF", weight: 1.5, fillOpacity: 0.04 }, interactive: false }).addTo(map);
    });

    if (settings.geojsonUrl) {
      fetch(settings.geojsonUrl)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data || cancelled) return;
          const layer = L.geoJSON(data, {
            style: { color: "#22C55E", weight: 2, fillOpacity: 0.15 },
            pointToLayer: (_f, latlng) => L.circleMarker(latlng, { radius: 6, color: "#22C55E", fillOpacity: 0.7 }),
            onEachFeature: (f, l) => {
              const props = f.properties ?? {};
              const name = props.name ?? props.Name ?? props.title;
              if (name) l.bindTooltip(String(name).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`));
            },
          }).addTo(map);
          const bounds = layer.getBounds();
          if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20], maxZoom: 13 });
        })
        .catch(() => undefined);
    }

    return () => {
      cancelled = true;
      map.remove();
    };
  }, [settings]);

  return <div ref={ref} className="h-[360px] w-full rounded-xl" />;
}
