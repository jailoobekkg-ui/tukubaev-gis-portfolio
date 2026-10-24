"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { cn } from "@/lib/utils";
import { BASEMAPS, HILLSHADE, KG_BOUNDS, demoGeoJSON, formatCoord, loadKyrgyzstan, toDMS } from "./layers";
import { formatArea, formatLength, geodesicArea, pathLength } from "./geo";

type UserLayer = { id: string; name: string; data: FeatureCollection; color: string; visible: boolean };
type Mode = "none" | "distance" | "area";
type SearchHit = { label: string; sub: string; lat: number; lng: number; bounds?: L.LatLngBounds };

const COLORS = ["#00D4FF", "#22C55E", "#F59E0B", "#F472B6", "#A78BFA", "#FB7185", "#34D399"];
let seq = 0;
const newId = () => `l${Date.now().toString(36)}${(seq++).toString(36)}`;

function toCollection(input: unknown): FeatureCollection {
  const g = input as { type?: string };
  if (g?.type === "FeatureCollection") return g as FeatureCollection;
  if (g?.type === "Feature") return { type: "FeatureCollection", features: [g as Feature] };
  if (g?.type) return { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: g as Feature["geometry"] }] };
  throw new Error("Not GeoJSON");
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function Panel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line/10 px-4 py-4">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <Icon name={icon} className="h-4 w-4 text-accent" /> {title}
      </h2>
      {children}
    </section>
  );
}

function download(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/geo+json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name.replace(/[^\w.-]+/g, "_") + ".geojson";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function GisLabApp() {
  const { t } = useI18n();
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const baseLayer = useRef<L.TileLayer | null>(null);
  const hillLayer = useRef<L.TileLayer | null>(null);
  const kgLayer = useRef<L.GeoJSON | null>(null);
  const leafletLayers = useRef(new Map<string, L.GeoJSON>());
  const measureGroup = useRef<L.LayerGroup | null>(null);
  const measurePts = useRef<[number, number][]>([]);
  const modeRef = useRef<Mode>("none");
  // Map event handlers are bound once, so they read translated labels through a ref.
  const labels = useRef({ distance: "", area: "" });
  labels.current = { distance: t("lab.distance"), area: t("lab.area") };

  const [basemap, setBasemap] = useState("dark");
  const [hillshade, setHillshade] = useState(false);
  const [boundary, setBoundary] = useState(true);
  const [layers, setLayers] = useState<UserLayer[]>([]);
  const [mode, setMode] = useState<Mode>("none");
  const [measureText, setMeasureText] = useState("");
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const [attrs, setAttrs] = useState<{ layer: string; props: GeoJsonProperties } | null>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<{ layers: SearchHit[]; places: SearchHit[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);

  // ---- map init ----
  useEffect(() => {
    if (!mapEl.current) return;
    const m = L.map(mapEl.current, { zoomControl: true, preferCanvas: false });
    m.fitBounds(KG_BOUNDS);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(m);
    measureGroup.current = L.layerGroup().addTo(m);
    map.current = m;

    const startTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setBasemap(startTheme);

    m.on("mousemove", (e: L.LeafletMouseEvent) => setCursor([e.latlng.lat, e.latlng.lng]));
    m.on("click", (e: L.LeafletMouseEvent) => {
      if (modeRef.current === "none") return;
      const prev = measurePts.current[measurePts.current.length - 1];
      // A double-click also fires two clicks: ignore the repeated point.
      if (prev && Math.abs(prev[0] - e.latlng.lat) < 1e-9 && Math.abs(prev[1] - e.latlng.lng) < 1e-9) return;
      measurePts.current.push([e.latlng.lat, e.latlng.lng]);
      drawMeasure(false);
    });
    m.on("dblclick", () => {
      if (modeRef.current !== "none") finishMeasure();
    });

    let cancelled = false;
    loadKyrgyzstan().then((fc) => {
      if (!fc || cancelled) return;
      kgLayer.current = L.geoJSON(fc, { style: { color: "#00D4FF", weight: 1.6, fillOpacity: 0.03 }, interactive: false }).addTo(m);
    });
    return () => {
      cancelled = true;
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- basemap / overlays ----
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const b = BASEMAPS.find((x) => x.id === basemap) ?? BASEMAPS[0];
    baseLayer.current?.remove();
    baseLayer.current = L.tileLayer(b.url, { attribution: b.attribution, maxZoom: b.maxZoom, subdomains: b.subdomains ?? "abc" }).addTo(m);
    baseLayer.current.bringToBack();
  }, [basemap]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (hillshade && !hillLayer.current) {
      hillLayer.current = L.tileLayer(HILLSHADE.url, { attribution: HILLSHADE.attribution, opacity: 0.45, maxZoom: 16 }).addTo(m);
    } else if (!hillshade && hillLayer.current) {
      hillLayer.current.remove();
      hillLayer.current = null;
    }
  }, [hillshade]);

  useEffect(() => {
    const m = map.current;
    const k = kgLayer.current;
    if (!m || !k) return;
    if (boundary && !m.hasLayer(k)) k.addTo(m);
    if (!boundary && m.hasLayer(k)) k.remove();
  }, [boundary]);

  // ---- user layers ----
  const addLayer = useCallback((name: string, data: FeatureCollection, fit = true) => {
    const m = map.current;
    if (!m) return;
    const id = newId();
    const color = COLORS[leafletLayers.current.size % COLORS.length];
    const gl = L.geoJSON(data, {
      style: { color, weight: 2.2, fillOpacity: 0.18 },
      pointToLayer: (_f, latlng) => L.circleMarker(latlng, { radius: 6, color, weight: 2, fillColor: color, fillOpacity: 0.75 }),
      onEachFeature: (f, l) => {
        const props = f.properties ?? {};
        const label = props.name ?? props.Name ?? props.NAME ?? props.title;
        if (label) l.bindTooltip(esc(String(label)));
        l.on("click", () => setAttrs({ layer: name, props }));
      },
    }).addTo(m);
    leafletLayers.current.set(id, gl);
    setLayers((prev) => [...prev, { id, name, data, color, visible: true }]);
    const bounds = gl.getBounds();
    if (fit && bounds.isValid()) m.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }, []);

  const toggleLayer = (id: string) => {
    const m = map.current;
    const gl = leafletLayers.current.get(id);
    const current = layers.find((l) => l.id === id);
    if (!m || !gl || !current) return;
    if (current.visible) gl.remove();
    else gl.addTo(m);
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !current.visible } : l)));
  };

  const removeLayer = (id: string) => {
    leafletLayers.current.get(id)?.remove();
    leafletLayers.current.delete(id);
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  const zoomLayer = (id: string) => {
    const b = leafletLayers.current.get(id)?.getBounds();
    if (b?.isValid()) map.current?.fitBounds(b, { padding: [30, 30], maxZoom: 15 });
  };

  async function onFiles(files: FileList | null) {
    setError("");
    for (const file of Array.from(files ?? [])) {
      try {
        if (file.size > 25 * 1024 * 1024) throw new Error("too large");
        const text = await file.text();
        const ext = file.name.toLowerCase().split(".").pop();
        let fc: FeatureCollection;
        if (ext === "kml" || ext === "gpx") {
          const { kml, gpx } = await import("@tmcw/togeojson");
          const xml = new DOMParser().parseFromString(text, "text/xml");
          if (xml.getElementsByTagName("parsererror").length) throw new Error("bad xml");
          fc = (ext === "kml" ? kml(xml) : gpx(xml)) as FeatureCollection;
        } else {
          fc = toCollection(JSON.parse(text));
        }
        if (!fc.features.length) throw new Error("empty");
        addLayer(file.name.replace(/\.[^.]+$/, ""), fc);
      } catch {
        setError(`${t("lab.fileError")} (${file.name})`);
      }
    }
  }

  const demoOn = layers.some((l) => l.name === t("lab.demo"));
  const toggleDemo = () => {
    const existing = layers.find((l) => l.name === t("lab.demo"));
    if (existing) removeLayer(existing.id);
    else addLayer(t("lab.demo"), demoGeoJSON());
  };

  // ---- measuring ----
  function drawMeasure(final: boolean) {
    const g = measureGroup.current;
    if (!g) return;
    g.clearLayers();
    const pts = measurePts.current;
    if (!pts.length) return setMeasureText("");
    const style = { color: "#F59E0B", weight: 2.5, dashArray: final ? undefined : "6 6" };
    pts.forEach((p) => L.circleMarker(p, { radius: 4, color: "#F59E0B", fillOpacity: 1 }).addTo(g));
    let text = "";
    if (modeRef.current === "distance") {
      if (pts.length > 1) L.polyline(pts, style).addTo(g);
      text = formatLength(pathLength(pts));
    } else {
      if (pts.length > 2) L.polygon(pts, { ...style, fillOpacity: 0.15 }).addTo(g);
      else if (pts.length === 2) L.polyline(pts, style).addTo(g);
      text = `${formatArea(geodesicArea(pts))} · ${formatLength(pathLength([...pts, pts[0]]))}`;
    }
    const last = pts[pts.length - 1];
    L.marker(last, { icon: L.divIcon({ className: "", html: `<span class="measure-label">${text}</span>`, iconAnchor: [-8, 10] }), interactive: false }).addTo(g);
    setMeasureText(text);
  }

  function startMeasure(next: Mode) {
    const m = map.current;
    measurePts.current = [];
    measureGroup.current?.clearLayers();
    setMeasureText("");
    modeRef.current = next;
    setMode(next);
    if (!m) return;
    if (next === "none") {
      m.doubleClickZoom.enable();
      m.getContainer().style.cursor = "";
    } else {
      m.doubleClickZoom.disable();
      m.getContainer().style.cursor = "crosshair";
    }
  }

  function finishMeasure() {
    const pts = measurePts.current;
    const kind = modeRef.current;
    const valid = kind === "distance" ? pts.length > 1 : pts.length > 2;
    if (valid) {
      const coords = pts.map(([lat, lng]) => [lng, lat]);
      const feature: Feature =
        kind === "distance"
          ? { type: "Feature", properties: { measurement: "distance", length_m: +pathLength(pts).toFixed(2) }, geometry: { type: "LineString", coordinates: coords } }
          : { type: "Feature", properties: { measurement: "area", area_m2: +geodesicArea(pts).toFixed(2), area_ha: +(geodesicArea(pts) / 1e4).toFixed(4) }, geometry: { type: "Polygon", coordinates: [[...coords, coords[0]]] } };
      const label = kind === "distance" ? formatLength(pathLength(pts)) : formatArea(geodesicArea(pts));
      addLayer(`${kind === "distance" ? labels.current.distance : labels.current.area} — ${label}`, { type: "FeatureCollection", features: [feature] }, false);
    }
    startMeasure("none");
  }

  // ---- search ----
  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return setHits(null);
    const layerHits: SearchHit[] = [];
    leafletLayers.current.forEach((gl, id) => {
      const lname = layers.find((l) => l.id === id)?.name ?? "";
      gl.eachLayer((sub) => {
        const f = (sub as L.Layer & { feature?: Feature }).feature;
        const props = f?.properties ?? {};
        const match = Object.values(props).some((v) => v != null && String(v).toLowerCase().includes(q));
        if (!match) return;
        const label = String(props.name ?? props.Name ?? props.title ?? Object.values(props)[0] ?? "Feature");
        const any = sub as unknown as { getLatLng?: () => L.LatLng; getBounds?: () => L.LatLngBounds };
        const ll = any.getLatLng?.() ?? any.getBounds?.().getCenter();
        if (ll) layerHits.push({ label, sub: lname, lat: ll.lat, lng: ll.lng, bounds: any.getBounds?.() });
      });
    });
    setHits({ layers: layerHits.slice(0, 20), places: [] });
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(query.trim())}&viewbox=69.2,43.3,80.3,39.1`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = (await res.json()) as { display_name: string; lat: string; lon: string; type: string; boundingbox?: string[] }[];
      const places = data.map((d) => ({
        label: d.display_name.split(",")[0],
        sub: d.display_name.split(",").slice(1, 3).join(",").trim(),
        lat: +d.lat,
        lng: +d.lon,
        bounds: d.boundingbox ? L.latLngBounds([+d.boundingbox[0], +d.boundingbox[2]], [+d.boundingbox[1], +d.boundingbox[3]]) : undefined,
      }));
      setHits({ layers: layerHits.slice(0, 20), places });
    } catch {
      /* geocoder unavailable: layer results still shown */
    } finally {
      setSearching(false);
    }
  }

  const goTo = (h: SearchHit) => {
    const m = map.current;
    if (!m) return;
    if (h.bounds?.isValid() && !h.bounds.getNorthEast().equals(h.bounds.getSouthWest())) m.fitBounds(h.bounds, { maxZoom: 14 });
    else m.setView([h.lat, h.lng], 13);
    L.popup().setLatLng([h.lat, h.lng]).setContent(`<strong>${h.label.replace(/</g, "&lt;")}</strong>`).openOn(m);
  };

  const exportAll = () => {
    const features = layers.filter((l) => l.visible).flatMap((l) => l.data.features.map((f) => ({ ...f, properties: { ...(f.properties ?? {}), _layer: l.name } })));
    download("gis-lab-export", { type: "FeatureCollection", features });
  };

  return (
    <div className="relative grid h-[calc(100svh-4rem)] lg:grid-cols-[360px_1fr]">
      <aside className={cn("glass z-[600] overflow-y-auto border-y-0 border-l-0 lg:static lg:block", panelOpen ? "absolute inset-y-0 left-0 w-[88%] max-w-[360px]" : "hidden")} aria-label={t("lab.tools")}>
        <div className="flex items-center justify-between px-4 pt-4">
          <h1 className="font-display text-lg font-bold">{t("lab.title")}</h1>
          <button type="button" className="rounded-lg p-1.5 text-muted hover:text-fg lg:hidden" onClick={() => setPanelOpen(false)} aria-label={t("common.close")}>
            <Icon name="x" />
          </button>
        </div>
        <p className="px-4 pb-2 pt-1 text-xs text-muted">{t("lab.privacy")}</p>

        <Panel title={t("lab.search")} icon="search">
          <form onSubmit={runSearch} className="flex gap-2" role="search">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("lab.searchPlaceholder")} className="input py-2" aria-label={t("lab.search")} />
            <button type="submit" className="btn-primary px-3 py-2" aria-label={t("lab.search")}>
              <Icon name="search" className="h-4 w-4" />
            </button>
          </form>
          {hits && (
            <div className="mt-3 space-y-3 text-sm">
              {[
                { title: t("lab.searchLayers"), list: hits.layers },
                { title: t("lab.searchPlaces"), list: hits.places },
              ].map((grp) => (
                <div key={grp.title}>
                  <p className="mb-1 text-xs text-muted">{grp.title}</p>
                  {grp.list.length === 0 ? (
                    <p className="text-xs text-muted/80">{searching && grp.title === t("lab.searchPlaces") ? "…" : t("lab.noResults")}</p>
                  ) : (
                    <ul className="space-y-1">
                      {grp.list.map((h, i) => (
                        <li key={i}>
                          <button type="button" onClick={() => goTo(h)} className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-fg/5">
                            <span className="block font-medium">{h.label}</span>
                            <span className="block truncate text-xs text-muted">{h.sub}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t("lab.basemap")} icon="map">
          <div className="grid grid-cols-2 gap-1.5">
            {BASEMAPS.map((b) => (
              <button key={b.id} type="button" onClick={() => setBasemap(b.id)} aria-pressed={basemap === b.id} className={cn("chip justify-center py-1.5", basemap === b.id && "chip-active")}>
                {b.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={hillshade} onChange={(e) => setHillshade(e.target.checked)} className="accent-[rgb(var(--accent))]" /> {t("lab.hillshade")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={boundary} onChange={(e) => setBoundary(e.target.checked)} className="accent-[rgb(var(--accent))]" /> {t("lab.boundary")}
            </label>
          </div>
        </Panel>

        <Panel title={t("lab.layers")} icon="layers">
          <label className="btn-ghost w-full cursor-pointer">
            <Icon name="upload" className="h-4 w-4" /> {t("lab.upload")}
            <input type="file" accept=".geojson,.json,.kml,.gpx" multiple className="sr-only" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
          </label>
          <p className="mt-1.5 text-center text-[11px] text-muted">{t("lab.uploadHint")}</p>
          {error && <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>}
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={demoOn} onChange={toggleDemo} className="accent-[rgb(var(--accent))]" /> {t("lab.demo")}
          </label>
          <ul className="mt-3 space-y-2">
            {layers.length === 0 && <li className="text-xs text-muted">{t("lab.noLayers")}</li>}
            {layers.map((l) => (
              <li key={l.id} className="rounded-xl border border-line/15 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: l.color }} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium" title={l.name}>{l.name}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-muted">{t("lab.features", { n: l.data.features.length })}</span>
                  <span className="flex gap-0.5">
                    <button type="button" onClick={() => toggleLayer(l.id)} className="rounded p-1 text-muted hover:text-accent" title={l.visible ? "Hide" : "Show"} aria-label={l.visible ? "Hide" : "Show"}>
                      <Icon name={l.visible ? "eye" : "eye-off"} className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => zoomLayer(l.id)} className="rounded p-1 text-muted hover:text-accent" title={t("lab.zoom")} aria-label={t("lab.zoom")}>
                      <Icon name="target" className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => download(l.name, l.data)} className="rounded p-1 text-muted hover:text-accent" title={t("lab.export")} aria-label={t("lab.export")}>
                      <Icon name="download" className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => removeLayer(l.id)} className="rounded p-1 text-muted hover:text-red-400" title={t("lab.remove")} aria-label={t("lab.remove")}>
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {layers.length > 0 && (
            <button type="button" onClick={exportAll} className="btn-ghost mt-3 w-full">
              <Icon name="download" className="h-4 w-4" /> {t("lab.export")}
            </button>
          )}
        </Panel>

        <Panel title={t("lab.tools")} icon="ruler">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => startMeasure(mode === "distance" ? "none" : "distance")} aria-pressed={mode === "distance"} className={cn("chip justify-center gap-1.5 py-2", mode === "distance" && "chip-active")}>
              <Icon name="ruler" className="h-4 w-4" /> {t("lab.distance")}
            </button>
            <button type="button" onClick={() => startMeasure(mode === "area" ? "none" : "area")} aria-pressed={mode === "area"} className={cn("chip justify-center gap-1.5 py-2", mode === "area" && "chip-active")}>
              <Icon name="area" className="h-4 w-4" /> {t("lab.area")}
            </button>
          </div>
          {mode !== "none" && (
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-xs text-muted">{t("lab.measureHint")}</p>
              <p aria-live="polite"><span className="text-muted">{t("lab.result")}: </span><strong className="font-mono">{measureText || "—"}</strong></p>
              <div className="flex gap-2">
                <button type="button" onClick={finishMeasure} className="btn-primary flex-1 py-2">{t("lab.finish")}</button>
                <button type="button" onClick={() => startMeasure(mode)} className="btn-ghost flex-1 py-2">{t("lab.clear")}</button>
              </div>
            </div>
          )}
        </Panel>

        <Panel title={t("lab.attributes")} icon="database">
          {attrs ? (
            <div>
              <p className="mb-2 truncate text-xs text-muted">{attrs.layer}</p>
              <table className="w-full text-left text-xs">
                <tbody>
                  {Object.entries(attrs.props ?? {}).map(([k, v]) => (
                    <tr key={k} className="border-b border-line/10 align-top">
                      <th className="py-1.5 pr-2 font-medium text-muted">{k}</th>
                      <td className="break-all py-1.5">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-muted">{t("lab.clickFeature")}</p>
          )}
        </Panel>
      </aside>

      <div className="relative">
        <div ref={mapEl} className="absolute inset-0" />
        {!panelOpen && (
          <button type="button" onClick={() => setPanelOpen(true)} className="btn-primary absolute left-3 top-3 z-[500] px-3 py-2 lg:hidden">
            <Icon name="layers" className="h-4 w-4" /> {t("lab.tools")}
          </button>
        )}
        <div className="pointer-events-none absolute bottom-6 right-3 z-[500] rounded-lg bg-bg/85 px-3 py-2 font-mono text-[11px] leading-5 backdrop-blur">
          <div className="text-accent">{t("lab.coords")} · WGS 84</div>
          {cursor ? (
            <>
              <div>{formatCoord(cursor[0], cursor[1])}</div>
              <div className="text-muted">{toDMS(cursor[0], "N", "S")} {toDMS(cursor[1], "E", "W")}</div>
            </>
          ) : (
            <div className="text-muted">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
