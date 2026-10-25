"use client";

import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import { loadKyrgyzstan } from "@/components/map/layers";

/*
 * Stylised theodolite on a tripod in front of a globe; the telescope is aimed at Kyrgyzstan.
 * Line-art in the site palette; colours come from Tailwind tokens so it follows light/dark theme.
 */

type View = { cx: number; cy: number; r: number; lon0: number; lat0: number };

// Orthographic globe centred behind the instrument; its rotation puts Kyrgyzstan up-right of the telescope.
const GLOBE: View = { cx: 200, cy: 128, r: 128, lon0: 12, lat0: 20 };
const KG_CENTER = { lon: 74.7, lat: 41.3 };
const PIVOT = { x: 200, y: 166 }; // telescope trunnion axis
const rad = (d: number) => (d * Math.PI) / 180;
const r1 = (n: number) => Math.round(n * 10) / 10;

function project(lon: number, lat: number, v: View = GLOBE) {
  const l = rad(lon - v.lon0);
  const p = rad(lat);
  const p0 = rad(v.lat0);
  return {
    x: v.cx + v.r * Math.cos(p) * Math.sin(l),
    y: v.cy - v.r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
    visible: Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l) >= 0,
  };
}

/** Polyline through lon/lat points, broken where it passes behind the globe. */
function linePath(points: [number, number][], v: View = GLOBE) {
  let d = "";
  let pen = false;
  for (const [lon, lat] of points) {
    const q = project(lon, lat, v);
    if (!q.visible) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${r1(q.x)} ${r1(q.y)}`;
    pen = true;
  }
  return d;
}

const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const GRATICULE = [
  ...range(-180, 165, 15).map((lon) => linePath(range(-90, 90, 3).map((lat) => [lon, lat]))),
  ...range(-75, 75, 15).map((lat) => linePath(range(-180, 180, 3).map((lon) => [lon, lat]))),
].filter(Boolean);

// Aim: the telescope rotates about its axis so the line of sight meets Kyrgyzstan.
const TARGET = project(KG_CENTER.lon, KG_CENTER.lat);
const AIM_DEG = (Math.atan2(TARGET.y - PIVOT.y, TARGET.x - PIVOT.x) * 180) / Math.PI;
const LOUPE_R = 20;
const OBJECTIVE = { x: PIVOT.x + 92 * Math.cos(rad(AIM_DEG)), y: PIVOT.y + 92 * Math.sin(rad(AIM_DEG)) };
// The eyepiece shows Kyrgyzstan face-on (no limb foreshortening), scaled to fill the ring.
const LOUPE_VIEW: View = { cx: TARGET.x, cy: TARGET.y, r: 230, lon0: KG_CENTER.lon, lat0: KG_CENTER.lat };

type Ring = [number, number][];
function countryPath(fc: FeatureCollection, v: View) {
  const rings: Ring[] = [];
  for (const f of fc.features) {
    const g = f.geometry;
    if (g.type === "Polygon") rings.push(...(g.coordinates as Ring[]));
    if (g.type === "MultiPolygon") for (const poly of g.coordinates as Ring[][]) rings.push(...poly);
  }
  return rings.map((ring) => linePath(ring, v) + "Z").join("");
}

export default function TheodoliteArt({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  const [kg, setKg] = useState({ globe: "", loupe: "" });

  useEffect(() => {
    let alive = true;
    loadKyrgyzstan().then((fc) => alive && fc && setKg({ globe: countryPath(fc, GLOBE), loupe: countryPath(fc, LOUPE_VIEW) }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <svg viewBox="0 0 400 480" className={className} role="img" aria-label="Theodolite on a tripod aimed at Kyrgyzstan on a globe">
      <defs>
        <linearGradient id="th-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.06 }} />
        </linearGradient>
        <linearGradient id="th-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--accent2))", stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--accent2))", stopOpacity: 0.04 }} />
        </linearGradient>
        <radialGradient id="th-glow" cx="0.5" cy="0.38" r="0.5">
          <stop offset="0" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="th-globe" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.16 }} />
          <stop offset="0.7" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.05 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--accent))", stopOpacity: 0.12 }} />
        </radialGradient>
        <clipPath id="th-globe-clip">
          <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r} />
        </clipPath>
        <clipPath id="th-loupe-clip">
          <circle cx={r1(TARGET.x)} cy={r1(TARGET.y)} r={LOUPE_R - 1} />
        </clipPath>
      </defs>

      {/* glow + contour rings around the station point */}
      <rect width="400" height="480" fill="url(#th-glow)" />
      <g fill="none" className="stroke-accent" strokeOpacity="0.18">
        {[34, 62, 92, 124, 158].map((r, i) => (
          <ellipse key={r} cx="200" cy="452" rx={r * 1.25} ry={r * 0.32} strokeWidth={i % 2 ? 0.8 : 1.3} />
        ))}
      </g>

      {/* globe with graticule and Kyrgyzstan */}
      <g>
        <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r + 7} className="fill-accent" fillOpacity="0.05" />
        <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r} fill="url(#th-globe)" className="stroke-accent" strokeOpacity="0.55" strokeWidth="1.4" />
        <g clipPath="url(#th-globe-clip)" fill="none" className="stroke-accent" strokeOpacity="0.28" strokeWidth="0.8">
          {GRATICULE.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {kg.globe && <path d={kg.globe} className="fill-accent2 stroke-accent2" fillOpacity="0.75" strokeWidth="1" strokeLinejoin="round" />}
      </g>

      {/* horizontal-angle sweep */}
      <g className="th-sweep" style={{ transformOrigin: "200px 166px" }}>
        <path d="M200 166 L360 120 A166 166 0 0 1 366 176 Z" className="fill-accent" fillOpacity="0.07" />
      </g>
      <g fill="none" className="stroke-accent" strokeOpacity="0.3">
        <circle cx="200" cy="166" r="150" strokeDasharray="2 10" />
        {ticks.map((a) => {
          const outer = 150;
          const inner = a % 90 === 0 ? 138 : 144;
          return (
            <line
              key={a}
              x1={r1(200 + outer * Math.cos(rad(a)))}
              y1={r1(166 + outer * Math.sin(rad(a)))}
              x2={r1(200 + inner * Math.cos(rad(a)))}
              y2={r1(166 + inner * Math.sin(rad(a)))}
              strokeWidth={a % 90 === 0 ? 1.6 : 0.8}
            />
          );
        })}
      </g>

      {/* plumb line to the ground mark */}
      <line x1="200" y1="292" x2="200" y2="452" className="stroke-accent2" strokeWidth="1" strokeDasharray="3 5" />
      <path d="M192 452 L200 440 L208 452 Z" className="fill-accent2" fillOpacity="0.85" />
      <circle cx="200" cy="452" r="3" className="fill-accent2" />

      {/* tripod */}
      <g className="stroke-accent2" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M168 302 L176 304 L104 466 L92 464 Z" fill="url(#th-leg)" />
        <path d="M196 306 L204 306 L206 472 L194 472 Z" fill="url(#th-leg)" />
        <path d="M224 304 L232 302 L308 464 L296 466 Z" fill="url(#th-leg)" />
        <rect x="128" y="370" width="14" height="8" rx="2" transform="rotate(66 135 374)" className="fill-bg2" />
        <rect x="193" y="380" width="14" height="8" rx="2" className="fill-bg2" />
        <rect x="258" y="370" width="14" height="8" rx="2" transform="rotate(-66 265 374)" className="fill-bg2" />
        <path d="M86 466 h22 M188 474 h24 M292 466 h22" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* tripod head + tribrach with levelling screws */}
      <g className="stroke-accent" strokeWidth="1.6">
        <ellipse cx="200" cy="300" rx="62" ry="10" className="fill-bg2" />
        <rect x="150" y="280" width="100" height="14" rx="4" className="fill-bg2" />
        <rect x="150" y="280" width="100" height="14" rx="4" fill="url(#th-body)" />
        <circle cx="160" cy="287" r="5" className="fill-bg2" />
        <circle cx="240" cy="287" r="5" className="fill-bg2" />
        <circle cx="200" cy="294" r="4" className="fill-bg2" />
      </g>

      {/* lower body with display (opaque underlay keeps the globe behind the instrument) */}
      <g className="stroke-accent" strokeWidth="1.6">
        <rect x="160" y="246" width="80" height="36" rx="7" className="fill-bg2" />
        <rect x="160" y="246" width="80" height="36" rx="7" fill="url(#th-body)" />
        <rect x="176" y="254" width="48" height="20" rx="3" className="fill-accent" fillOpacity="0.16" />
        <path d="M181 260 h22 M181 265 h30 M181 270 h16" strokeWidth="1" strokeOpacity="0.8" />
      </g>

      {/* alidade standards + carry handle */}
      <g className="stroke-accent" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M164 248 L170 148 L186 148 L186 248 Z" className="fill-bg2" />
        <path d="M164 248 L170 148 L186 148 L186 248 Z" fill="url(#th-body)" />
        <path d="M214 248 L214 148 L230 148 L236 248 Z" className="fill-bg2" />
        <path d="M214 248 L214 148 L230 148 L236 248 Z" fill="url(#th-body)" />
        <path d="M172 146 C176 112 224 112 228 146" fill="none" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85" />
        <circle cx="178" cy="214" r="6" className="fill-bg2" />
        <circle cx="222" cy="214" r="6" className="fill-bg2" />
      </g>

      {/* vertical circle + telescope, tilted towards Kyrgyzstan */}
      <g className="stroke-accent" strokeWidth="1.6">
        <circle cx="200" cy="166" r="26" className="fill-bg2" />
        <circle cx="200" cy="166" r="26" fill="url(#th-body)" />
        <circle cx="200" cy="166" r="18" fill="none" strokeOpacity="0.6" strokeDasharray="1.5 3" />
        <g transform={`rotate(${r1(AIM_DEG)} ${PIVOT.x} ${PIVOT.y})`}>
          <rect x="118" y="155" width="168" height="22" rx="9" className="fill-bg2" />
          <rect x="118" y="155" width="168" height="22" rx="9" fill="url(#th-body)" />
          <rect x="104" y="158" width="16" height="16" rx="3" className="fill-bg2" />
          <ellipse cx="288" cy="166" rx="7" ry="15" className="fill-accent" fillOpacity="0.35" />
        </g>
        <circle cx="200" cy="166" r="5" className="fill-accent" />
      </g>

      {/* line of sight and crosshair on Kyrgyzstan */}
      <line x1={r1(OBJECTIVE.x)} y1={r1(OBJECTIVE.y)} x2={r1(TARGET.x)} y2={r1(TARGET.y)} className="th-beam stroke-accent" strokeWidth="1.6" />
      {/* reticle as an eyepiece: Kyrgyzstan magnified inside the ring */}
      <circle cx={r1(TARGET.x)} cy={r1(TARGET.y)} r={LOUPE_R} className="fill-bg2" fillOpacity="0.88" />
      {kg.loupe && (
        <g clipPath="url(#th-loupe-clip)">
          <path d={kg.loupe} className="fill-accent2 stroke-accent2" fillOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
      )}
      <g className="stroke-accent" fill="none" strokeWidth="1.3">
        <circle cx={r1(TARGET.x)} cy={r1(TARGET.y)} r={LOUPE_R} strokeWidth="1.6" />
        <circle cx={r1(TARGET.x)} cy={r1(TARGET.y)} r={LOUPE_R} className="th-ping" strokeOpacity="0.6" style={{ transformOrigin: `${r1(TARGET.x)}px ${r1(TARGET.y)}px` }} />
        <path
          d={`M${r1(TARGET.x)} ${r1(TARGET.y - LOUPE_R - 8)} v${LOUPE_R + 4} M${r1(TARGET.x)} ${r1(TARGET.y + 4)} v${LOUPE_R + 4} M${r1(TARGET.x - LOUPE_R - 8)} ${r1(TARGET.y)} h${LOUPE_R + 4} M${r1(TARGET.x + 4)} ${r1(TARGET.y)} h${LOUPE_R + 4}`}
          strokeLinecap="round"
          strokeOpacity="0.8"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}
