"use client";

import { useEffect, useRef, useState } from "react";
import CVDocument from "./CVDocument";
import type { CV } from "@/lib/types";

const PAGE_W = 794;
const PAGE_H = 1123;

/** Renders the CV at true A4 size and scales it to the available width. */
export default function ScaledPreview({
  cv,
  highlight,
  maxWidth = 560,
  onPages,
}: {
  cv: CV;
  highlight?: string | null;
  maxWidth?: number;
  onPages?: (n: number) => void;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [height, setHeight] = useState(PAGE_H);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(o.clientWidth, maxWidth) / PAGE_W);
      const h = i.offsetHeight;
      setHeight(h);
    });
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [maxWidth]);

  useEffect(() => {
    onPages?.(Math.max(1, Math.ceil((height - 4) / PAGE_H)));
  }, [height, onPages]);

  return (
    <div ref={outer} className="w-full" style={{ maxWidth }}>
      <div
        style={{
          width: PAGE_W * scale,
          height: height * scale,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 30px 60px -20px rgba(2,16,15,0.8)",
          margin: "0 auto",
          background: "#fff",
          position: "relative",
        }}
      >
        <div ref={inner} style={{ width: PAGE_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CVDocument cv={cv} highlight={highlight} />
        </div>
        {Array.from({ length: Math.max(0, Math.ceil(height / PAGE_H) - 1) }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (i + 1) * PAGE_H * scale,
              borderTop: "2px dashed rgba(11,127,114,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
