// Geodesic helpers for the measuring tools (WGS 84 sphere approximation, as in Leaflet.draw).
const R = 6378137;
const rad = (d: number) => (d * Math.PI) / 180;

export function haversine(a: [number, number], b: [number, number]) {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pathLength(points: [number, number][]) {
  let sum = 0;
  for (let i = 1; i < points.length; i++) sum += haversine(points[i - 1], points[i]);
  return sum;
}

/** Area of a polygon on the sphere, square metres. */
export function geodesicArea(points: [number, number][]) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    area += rad(p2[1] - p1[1]) * (2 + Math.sin(rad(p1[0])) + Math.sin(rad(p2[0])));
  }
  return Math.abs((area * R * R) / 2);
}

export function formatLength(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(m >= 100000 ? 1 : 3)} km` : `${m.toFixed(1)} m`;
}

export function formatArea(m2: number) {
  if (m2 >= 1e6) return `${(m2 / 1e6).toFixed(3)} km² (${(m2 / 1e4).toFixed(1)} ha)`;
  if (m2 >= 1e4) return `${(m2 / 1e4).toFixed(2)} ha`;
  return `${m2.toFixed(1)} m²`;
}
