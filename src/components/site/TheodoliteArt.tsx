/**
 * Stylised theodolite / total station on a tripod over a survey point.
 * Line-art in the site palette; colours come from Tailwind tokens so it follows light/dark theme.
 */
export default function TheodoliteArt({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg viewBox="0 0 400 480" className={className} role="img" aria-label="Theodolite on a tripod">
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
      </defs>

      {/* glow + contour rings around the station point */}
      <rect width="400" height="480" fill="url(#th-glow)" />
      <g fill="none" className="stroke-accent" strokeOpacity="0.18">
        {[34, 62, 92, 124, 158].map((r, i) => (
          <ellipse key={r} cx="200" cy="452" rx={r * 1.25} ry={r * 0.32} strokeWidth={i % 2 ? 0.8 : 1.3} />
        ))}
      </g>

      {/* horizontal-angle sweep */}
      <g className="th-sweep" style={{ transformOrigin: "200px 166px" }}>
        <path d="M200 166 L360 120 A166 166 0 0 1 366 176 Z" className="fill-accent" fillOpacity="0.07" />
      </g>
      <g fill="none" className="stroke-accent" strokeOpacity="0.35">
        <circle cx="200" cy="166" r="150" strokeDasharray="2 10" />
        {ticks.map((a) => {
          const r1 = 150;
          const r2 = a % 90 === 0 ? 138 : 144;
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={200 + r1 * Math.cos(rad)}
              y1={166 + r1 * Math.sin(rad)}
              x2={200 + r2 * Math.cos(rad)}
              y2={166 + r2 * Math.sin(rad)}
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
        {/* leg clamps */}
        <rect x="128" y="370" width="14" height="8" rx="2" transform="rotate(66 135 374)" className="fill-bg2" />
        <rect x="193" y="380" width="14" height="8" rx="2" className="fill-bg2" />
        <rect x="258" y="370" width="14" height="8" rx="2" transform="rotate(-66 265 374)" className="fill-bg2" />
        <path d="M86 466 h22 M188 474 h24 M292 466 h22" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* tripod head + tribrach with levelling screws */}
      <g className="stroke-accent" strokeWidth="1.6">
        <ellipse cx="200" cy="300" rx="62" ry="10" className="fill-bg2" />
        <rect x="150" y="280" width="100" height="14" rx="4" fill="url(#th-body)" />
        <circle cx="160" cy="287" r="5" className="fill-bg2" />
        <circle cx="240" cy="287" r="5" className="fill-bg2" />
        <circle cx="200" cy="294" r="4" className="fill-bg2" />
      </g>

      {/* lower body with display */}
      <g className="stroke-accent" strokeWidth="1.6">
        <rect x="160" y="246" width="80" height="36" rx="7" fill="url(#th-body)" />
        <rect x="176" y="254" width="48" height="20" rx="3" className="fill-accent" fillOpacity="0.16" />
        <path d="M181 260 h22 M181 265 h30 M181 270 h16" strokeWidth="1" strokeOpacity="0.8" />
      </g>

      {/* alidade standards + carry handle */}
      <g className="stroke-accent" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M164 248 L170 148 L186 148 L186 248 Z" fill="url(#th-body)" />
        <path d="M214 248 L214 148 L230 148 L236 248 Z" fill="url(#th-body)" />
        <path d="M172 146 C176 112 224 112 228 146" fill="none" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85" />
        <circle cx="178" cy="214" r="6" className="fill-bg2" />
        <circle cx="222" cy="214" r="6" className="fill-bg2" />
      </g>

      {/* vertical circle + telescope */}
      <g className="stroke-accent" strokeWidth="1.6">
        <circle cx="200" cy="166" r="26" fill="url(#th-body)" />
        <circle cx="200" cy="166" r="18" fill="none" strokeOpacity="0.6" strokeDasharray="1.5 3" />
        <rect x="118" y="155" width="168" height="22" rx="9" fill="url(#th-body)" />
        <rect x="104" y="158" width="16" height="16" rx="3" className="fill-bg2" />
        <ellipse cx="288" cy="166" rx="7" ry="15" className="fill-accent" fillOpacity="0.35" />
        <circle cx="200" cy="166" r="5" className="fill-accent" />
      </g>

      {/* line of sight to a prism target */}
      <line x1="296" y1="166" x2="392" y2="138" className="th-beam stroke-accent" strokeWidth="1.6" />
      <g className="stroke-accent" fill="none" strokeWidth="1.2">
        <circle cx="372" cy="144" r="10" />
        <path d="M372 128 v32 M356 144 h32" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}
