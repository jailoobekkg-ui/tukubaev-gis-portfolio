// Extracts the Kyrgyzstan boundary from Natural Earth (world-atlas, 1:50m) into
// public/geo/kyrgyzstan.geojson. Runs automatically before `dev` and `build`.
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "public", "geo", "kyrgyzstan.geojson");

try {
  const { feature } = require("topojson-client");
  const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));
  const all = feature(topo, topo.objects.countries);
  const kg = all.features.find((f) => String(f.id) === "417" || f.properties?.name === "Kyrgyzstan");
  if (!kg) throw new Error("Kyrgyzstan not found in world-atlas");
  const round = (c) => (typeof c[0] === "number" ? [+c[0].toFixed(4), +c[1].toFixed(4)] : c.map(round));
  kg.geometry.coordinates = round(kg.geometry.coordinates);
  const fc = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Kyrgyz Republic", source: "Natural Earth 1:50m (public domain), simplified" },
        geometry: kg.geometry,
      },
    ],
  };
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(fc));
  console.log("[geo] wrote", outFile);
} catch (err) {
  if (existsSync(outFile)) {
    console.log("[geo] using existing", outFile);
  } else {
    console.warn("[geo] could not build Kyrgyzstan boundary:", err.message);
  }
}
