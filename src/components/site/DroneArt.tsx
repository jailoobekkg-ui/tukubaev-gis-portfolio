/**
 * Stylised survey quadcopter: spinning rotors, a gentle hover and the camera's
 * ground footprint with a photogrammetry grid underneath.
 */
const ROTORS: [number, number][] = [
  [22, 22],
  [98, 22],
  [22, 58],
  [98, 58],
];

export default function DroneArt({ className = "", label }: { className?: string; label: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={label}>
      <g className="dr-hover">
        {/* arms */}
        <g className="stroke-accent" strokeWidth="3" strokeLinecap="round">
          <path d="M44 34 L22 22 M76 34 L98 22 M44 46 L22 58 M76 46 L98 58" />
        </g>

        {/* rotors with motor hubs */}
        {ROTORS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="15" className="fill-accent stroke-accent" fillOpacity="0.06" strokeOpacity="0.35" strokeWidth="1" />
            <g className="dr-rotor" style={{ transformOrigin: `${x}px ${y}px`, animationDuration: `${0.32 + i * 0.03}s` }}>
              <path d={`M${x - 14} ${y} L${x + 14} ${y}`} className="stroke-accent" strokeWidth="2.2" strokeLinecap="round" />
              <path d={`M${x} ${y - 14} L${x} ${y + 14}`} className="stroke-accent" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round" />
            </g>
            <circle cx={x} cy={y} r="3.4" className="fill-bg2 stroke-accent" strokeWidth="1.4" />
          </g>
        ))}

        {/* body + status light + camera gimbal */}
        <rect x="42" y="28" width="36" height="24" rx="8" className="fill-bg2 stroke-accent" strokeWidth="1.8" />
        <rect x="42" y="28" width="36" height="24" rx="8" className="fill-accent" fillOpacity="0.2" />
        <path d="M50 36 h20" className="stroke-accent" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="60" cy="44" r="2.2" className="dr-blink fill-accent2" />
        <rect x="54" y="52" width="12" height="7" rx="2" className="fill-bg2 stroke-accent" strokeWidth="1.4" />
        <circle cx="60" cy="58" r="2" className="fill-accent" />
      </g>

      {/* camera view cone and ground footprint */}
      <path d="M58 62 L30 106 M62 62 L90 106" className="stroke-accent2" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.8" />
      <path d="M30 106 L90 106 L84 116 L36 116 Z" className="fill-accent2 stroke-accent2" fillOpacity="0.12" strokeWidth="1" />
      <path d="M45 106 L42 116 M60 106 L60 116 M75 106 L78 116 M33 111 H87" className="stroke-accent2" strokeWidth="0.7" strokeOpacity="0.6" />
    </svg>
  );
}
