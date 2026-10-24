"use client";

import dynamic from "next/dynamic";

// Leaflet needs `window`, so the lab is rendered only in the browser.
const GisLabApp = dynamic(() => import("./GisLabApp"), {
  ssr: false,
  loading: () => <div className="h-[calc(100svh-4rem)] w-full animate-pulse bg-bg2" />,
});

export default function GisLab() {
  return <GisLabApp />;
}
