// Minimal line icons (24px grid, stroke-based) so the site needs no icon library.
const paths: Record<string, string> = {
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6L6 18",
  sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66l1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14l-1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z",
  moon: "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z",
  globe: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.8 2.7 4 6.2 4 10s-1.2 7.3-4 10m0-20C9.2 4.7 8 8.2 8 12s1.2 7.3 4 10M2.5 9h19M2.5 15h19",
  layers: "M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5",
  satellite: "M13 7l4-4 4 4-4 4m-4-4l-6 6m6-6l4 4m-10 2l-4-4 4-4 4 4m-4 4l4 4m-9 3a4 4 0 004 4m-7-4a7 7 0 007 7",
  drone: "M5 5a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM5 15a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM7 7l3 3m4 0l3-3M7 17l3-3m4 0l3 3M10 10h4v4h-4z",
  code: "M8 8l-4 4 4 4m8-8l4 4-4 4m-2-12l-4 16",
  land: "M3 20l5-9 4 6 3-4 6 7H3zm11-13a2 2 0 100-4 2 2 0 000 4z",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zm0 0v14m6-12v14",
  database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  compass: "M12 2a10 10 0 100 20 10 10 0 000-20zm4 6l-2.5 5.5L8 16l2.5-5.5L16 8z",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  mountain: "M2 20l7-12 4 6 3-4 6 10H2zm7-12l2 3",
  target: "M12 2v4m0 12v4M2 12h4m12 0h4M12 7a5 5 0 100 10 5 5 0 000-10zm0 4a1 1 0 100 2 1 1 0 000-2z",
  mail: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 1l8 7 8-7",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z",
  whatsapp: "M3 21l1.6-4.8A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.2-1.1L3 21zm6-12.5c0 3.3 3.2 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2-1.5 1z",
  telegram: "M21 4L3 11l6 2 2 6 3-4 5 4 2-15zM9 13l9-6-7 8",
  linkedin: "M4 4h16v16H4zM8 10v6m0-8.5v.01M12 16v-3.5a2 2 0 014 0V16m-4-6v6",
  github: "M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6 0C6.8 2.3 5.8 2.6 5.8 2.6a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004.4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2",
  "arrow-right": "M5 12h14m-6-6l6 6-6 6",
  "arrow-left": "M19 12H5m6-6l-6 6 6 6",
  external: "M14 4h6v6m0-6L10 14M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zm0-14a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4",
  briefcase: "M3 8h18v11H3zM8 8V5h8v3M3 13h18",
  graduation: "M2 9l10-5 10 5-10 5L2 9zm4 2v5c3 2 9 2 12 0v-5m4-2v6",
  award: "M12 2a6 6 0 100 12 6 6 0 000-12zM8.5 13L7 22l5-3 5 3-1.5-9",
  ruler: "M3 17L17 3l4 4L7 21l-4-4zm4-4l2 2m1-5l2 2m1-5l2 2",
  area: "M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6",
  upload: "M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zm9 16l-4-4",
  trash: "M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10-3a3 3 0 100 6 3 3 0 000-6z",
  "eye-off": "M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.2M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 005.4-1.6",
  check: "M5 12l5 5L20 7",
  crosshair: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v6m0 8v6M2 12h6m8 0h6",
  file: "M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8l-5-5zm0 0v5h5",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  building: "M4 21V4h10v17M14 9h6v12M8 8h2m-2 4h2m-2 4h2M3 21h18",
  user: "M12 3a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 018 0v4",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11",
  save: "M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7",
  plus: "M12 5v14M5 12h14",
  image: "M4 5h16v14H4zm0 11l5-5 4 4 2-2 5 5M15 9a1 1 0 100-2 1 1 0 000 2z",
  inbox: "M3 13l3-8h12l3 8v6H3zm0 0h5l1 3h6l1-3h5",
  language: "M3 5h10M8 3v2m-3 0c1 4 4 7 8 8M11 5c-1 4-4 7-7 8m9 8l4-10 4 10m-7-3h6",
  arrowUp: "M12 19V5m-6 6l6-6 6 6",
  arrowDown: "M12 5v14m-6-6l6 6 6-6",
};

export type IconName = keyof typeof paths;

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.7 }: { name: string; className?: string; strokeWidth?: number }) {
  const d = paths[name] ?? paths.layers;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
