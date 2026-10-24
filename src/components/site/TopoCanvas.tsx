"use client";

import { useEffect, useRef } from "react";

/**
 * Animated topographic contour lines: a smooth synthetic "terrain" field traced with
 * marching squares at several elevation levels. Pure canvas, no dependencies.
 */
export default function TopoCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CELL = 16;
    const LEVELS = 11;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const field = (x: number, y: number, t: number) =>
      Math.sin(x * 0.0042 + t * 0.6) * Math.cos(y * 0.0051 - t * 0.4) +
      0.6 * Math.sin((x + y) * 0.0031 + t * 0.3) +
      0.35 * Math.cos(Math.hypot(x - w * 0.62, y - h * 0.45) * 0.0085 - t * 0.5);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;
      const v = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v[j * cols + i] = field(i * CELL, j * CELL, t);

      const dark = document.documentElement.classList.contains("dark");
      for (let l = 0; l < LEVELS; l++) {
        const level = -1.7 + (3.4 * l) / (LEVELS - 1);
        const major = l % 5 === 0;
        ctx.strokeStyle = dark ? `rgba(0,212,255,${major ? 0.32 : 0.14})` : `rgba(2,132,199,${major ? 0.3 : 0.13})`;
        ctx.lineWidth = major ? 1.3 : 0.8;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = v[j * cols + i];
            const b = v[j * cols + i + 1];
            const c = v[(j + 1) * cols + i + 1];
            const d = v[(j + 1) * cols + i];
            const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * CELL;
            const y = j * CELL;
            const lerp = (p: number, q: number) => (level - p) / (q - p || 1e-6);
            const top: [number, number] = [x + CELL * lerp(a, b), y];
            const right: [number, number] = [x + CELL, y + CELL * lerp(b, c)];
            const bottom: [number, number] = [x + CELL * lerp(d, c), y + CELL];
            const left: [number, number] = [x, y + CELL * lerp(a, d)];
            const seg = (p: [number, number], q: [number, number]) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 10: seg(left, bottom); seg(top, right); break;
            }
          }
        }
        ctx.stroke();
      }
    };

    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      frame++;
      if (frame % 2) return; // ~30 fps is plenty for slow drift
      draw(ms / 9000);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now() / 9000);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
