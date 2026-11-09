"use client";

import Link from "next/link";
import { useT, useUI } from "@/lib/store";
import type { TemplateId } from "@/lib/types";

/* ---------- Icons (inline stroke SVG, decorative) ---------- */

type IconProps = { size?: number; className?: string; strokeWidth?: number };

const svg = (d: string) =>
  function Icon({ size = 18, className, strokeWidth = 2 }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d={d} />
      </svg>
    );
  };

export const IconArrowRight = svg("M4 12h16M14 6l6 6-6 6");
export const IconArrowLeft = svg("M21 12H4M10 5l-7 7 7 7");
export const IconUpload = svg("M12 16V4M7 9l5-5 5 5M5 20h14");
export const IconDownload = svg("M12 3v13M6 10l6 6 6-6M4 21h16");
export const IconCheck = svg("M4 13l5 5L20 6");
export const IconClose = svg("M5 5l14 14M19 5L5 19");
export const IconPlus = svg("M12 4v16M4 12h16");
export const IconChevronDown = svg("M5 9l7 7 7-7");
export const IconLink = svg("M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1");
export const IconGrip = svg("M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01");
export const IconList = svg("M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01");

export function IconSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#5EEAD4">
      <path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z" />
    </svg>
  );
}

/* ---------- Background light blobs ---------- */

export type Blob = { top?: string; bottom?: string; left?: string; right?: string; size: number; color: string; opacity?: number };

const rgba: Record<string, string> = {
  "#0B7F72": "11,127,114",
  "#F97316": "249,115,22",
  "#2DD4BF": "45,212,191",
  "#10B981": "16,185,129",
};

export function Blobs({ items }: { items: Blob[] }) {
  return (
    <>
      {items.map((b, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="blob"
          style={{
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            opacity: b.opacity ?? 1,
            background: `radial-gradient(circle, ${b.color} 0%, rgba(${rgba[b.color] ?? "255,255,255"},0) 66%)`,
          }}
        />
      ))}
    </>
  );
}

/** Glossy sphere used as decoration. */
export function Orb({ style, warm = false }: { style: React.CSSProperties; warm?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="orb"
      style={{
        aspectRatio: "1",
        background: warm
          ? "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0) 28%), linear-gradient(135deg, #FDBA74, #F97316)"
          : "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0) 26%), linear-gradient(135deg, #5EEAD4, #0B7F72 60%, #C2410C)",
        boxShadow: warm ? "0 16px 30px -12px rgba(249,115,22,0.8)" : "0 24px 50px -16px rgba(11,127,114,0.8)",
        ...style,
      }}
    />
  );
}

/* ---------- Brand ---------- */

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex flex-none items-center justify-center font-display font-extrabold"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.39),
        borderRadius: Math.round(size * 0.32),
        background: "linear-gradient(135deg, #0B7F72, #C2410C)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      CV
    </span>
  );
}

export function Logo() {
  const t = useT();
  return (
    <Link href="/" className="flex min-h-11 items-center gap-3">
      <LogoMark />
      <span className="text-lg font-semibold">{t.brand}</span>
    </Link>
  );
}

/* ---------- Toggles ---------- */

export function UiLangToggle() {
  const t = useT();
  const uiLang = useUI((s) => s.uiLang);
  const setUiLang = useUI((s) => s.setUiLang);
  return (
    <div role="group" aria-label={t.uiLang} className="seg">
      <button type="button" aria-pressed={uiLang === "ka"} onClick={() => setUiLang("ka")} lang="ka">
        ქარ
      </button>
      <button type="button" aria-pressed={uiLang === "en"} onClick={() => setUiLang("en")} lang="en">
        EN
      </button>
    </div>
  );
}

/* ---------- Header shell ---------- */

export function HeaderBar({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <header className={wide ? "px-4 pt-4" : "px-4 pt-5 sm:px-8"}>
      <div
        className={`glass mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-[22px] py-2.5 pr-3.5 pl-5 ${
          wide ? "" : "max-w-[1200px]"
        }`}
      >
        {children}
      </div>
    </header>
  );
}

/* ---------- Progress steps (start → editor → export) ---------- */

export function FlowSteps({ current }: { current: 1 | 2 | 3 }) {
  const t = useT();
  const labels = [t.steps.start, t.steps.editor, t.steps.export];
  return (
    <nav aria-label={t.steps.label} className="glass-soft grid grid-cols-3 gap-2 rounded-[22px] p-2">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = n < current;
        const active = n === current;
        return (
          <div
            key={label}
            aria-current={active ? "step" : undefined}
            className="flex min-w-0 items-center gap-3.5 rounded-2xl px-3 py-3 sm:px-5"
            style={
              active
                ? {
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                  }
                : undefined
            }
          >
            <span
              className="flex size-9 flex-none items-center justify-center rounded-xl font-display text-base font-extrabold"
              style={
                active
                  ? { background: "linear-gradient(135deg, #0B7F72, #C2410C)" }
                  : done
                    ? { background: "rgba(110,231,183,0.25)", border: "1px solid rgba(110,231,183,0.6)", color: "#6EE7B7" }
                    : { border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.85)" }
              }
            >
              {done ? <IconCheck size={16} strokeWidth={2.4} /> : n}
            </span>
            <span className={`truncate text-[15px] ${active ? "font-semibold" : "font-medium text-white/85"}`}>{label}</span>
          </div>
        );
      })}
    </nav>
  );
}

/* ---------- Mini template thumbnails ---------- */

export function TemplateThumb({ id, max = 190 }: { id: TemplateId; max?: number }) {
  const bar = (w: string, h: number, bg: string, extra: React.CSSProperties = {}) => (
    <div style={{ height: h, width: w, borderRadius: 3, background: bg, ...extra }} />
  );
  const line = "#DDEFEA";
  const sheet: React.CSSProperties = {
    width: "100%",
    maxWidth: max,
    aspectRatio: "1 / 1.414",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 18px 30px -14px rgba(2,16,15,0.7)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };
  if (id === "classic")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "16px 14px", gap: 9 }}>
        {bar("55%", 10, "#10302D")}
        {bar("35%", 5, "#7FA39C")}
        {bar("100%", 1, "#10302D", { margin: "4px 0" })}
        {bar("22%", 5, "#10302D")}
        {bar("100%", 3, line)}
        {bar("90%", 3, line)}
        {bar("28%", 5, "#10302D", { marginTop: 4 })}
        {bar("100%", 3, line)}
        {bar("85%", 3, line)}
        {bar("92%", 3, line)}
      </div>
    );
  if (id === "modern")
    return (
      <div aria-hidden="true" style={{ ...sheet, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #0B7F72, #C2410C)", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {bar("55%", 10, "#fff")}
          {bar("38%", 5, "rgba(255,255,255,0.65)")}
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
          {bar("24%", 5, "#0B7F72")}
          {bar("100%", 3, line)}
          {bar("88%", 3, line)}
          {bar("30%", 5, "#0B7F72", { marginTop: 4 })}
          {bar("100%", 3, line)}
          {bar("80%", 3, line)}
          {bar("92%", 3, line)}
        </div>
      </div>
    );
  if (id === "elegant") {
    const flourish = (w: string) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
        <div style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
        {bar(w, 5, "#1C1917", { flex: "none" })}
        <div style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
      </div>
    );
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "18px 16px", gap: 8, alignItems: "center" }}>
        {bar("58%", 11, "#1C1917")}
        {bar("34%", 4, "#9A3412")}
        <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
          <div style={{ width: 5, height: 5, transform: "rotate(45deg)", background: "#9A3412" }} />
          <div style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
        </div>
        {flourish("26%")}
        {bar("100%", 3, line)}
        {bar("88%", 3, line)}
        {flourish("30%")}
        {bar("100%", 3, line)}
        {bar("82%", 3, line)}
        {bar("94%", 3, line)}
      </div>
    );
  }
  if (id === "minimal")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "22px 20px", gap: 8 }}>
        {bar("62%", 12, "#1C1917")}
        {bar("38%", 5, "#A8B5B3")}
        {bar("20%", 4, "#A8B5B3", { marginTop: 12 })}
        {bar("100%", 3, line)}
        {bar("86%", 3, line)}
        {bar("24%", 4, "#A8B5B3", { marginTop: 10 })}
        {bar("100%", 3, line)}
        {bar("78%", 3, line)}
      </div>
    );
  if (id === "bold") {
    const marked = (w: string) => (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: 1, background: "linear-gradient(135deg, #0B7F72, #C2410C)" }} />
        {bar(w, 5, "#10302D")}
      </div>
    );
    return (
      <div aria-hidden="true" style={{ ...sheet, overflow: "hidden" }}>
        <div style={{ background: "#10302D", padding: "18px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {bar("60%", 11, "#fff")}
          {bar("36%", 5, "#5EEAD4")}
        </div>
        <div style={{ height: 3, background: "linear-gradient(90deg, #0B7F72, #C2410C)" }} />
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
          {marked("26%")}
          {bar("100%", 3, line)}
          {bar("86%", 3, line)}
          {marked("32%")}
          {bar("100%", 3, line)}
          {bar("78%", 3, line)}
        </div>
      </div>
    );
  }
  if (id === "corporate")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "16px 14px", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 7, borderBottom: "2px solid #1E3A5F" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "55%" }}>
            {bar("100%", 9, "#1E3A5F")}
            {bar("60%", 4, "#9CA3AF")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "26%", alignItems: "flex-end" }}>
            {bar("100%", 3, "#9CA3AF")}
            {bar("80%", 3, "#9CA3AF")}
          </div>
        </div>
        <div style={{ background: "#EEF2F7", padding: "3px 5px", borderRadius: 2 }}>{bar("30%", 5, "#1E3A5F")}</div>
        {bar("100%", 3, line)}
        {bar("88%", 3, line)}
        <div style={{ background: "#EEF2F7", padding: "3px 5px", borderRadius: 2, marginTop: 2 }}>{bar("36%", 5, "#1E3A5F")}</div>
        {bar("100%", 3, line)}
        {bar("80%", 3, line)}
      </div>
    );
  if (id === "timeline") {
    const item = (w: string) => (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ position: "absolute", left: -13, top: 0, width: 6, height: 6, borderRadius: "50%", background: "#0B7F72" }} />
        {bar("26%", 3, "#0B7F72")}
        {bar(w, 4, "#10302D")}
        {bar("100%", 3, line)}
      </div>
    );
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "18px 16px", gap: 8 }}>
        {bar("58%", 11, "#10302D")}
        {bar("34%", 4, "#7FA39C")}
        {bar("24%", 5, "#0B7F72", { marginTop: 8 })}
        <div style={{ borderLeft: "1.5px solid #CBE5DF", marginLeft: 3, paddingLeft: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {item("70%")}
          {item("56%")}
          {item("64%")}
        </div>
      </div>
    );
  }
  if (id === "academic")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "18px 16px", gap: 8, alignItems: "center" }}>
        {bar("56%", 10, "#1C1917")}
        {bar("36%", 4, "#78716C")}
        {bar("100%", 1, "#1C1917", { margin: "3px 0" })}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
          {bar("28%", 5, "#1C1917")}
          {bar("100%", 1, "#1C1917")}
          {bar("100%", 3, "#E7E5E4")}
          {bar("90%", 3, "#E7E5E4")}
          {bar("34%", 5, "#1C1917", { marginTop: 3 })}
          {bar("100%", 1, "#1C1917")}
          {bar("100%", 3, "#E7E5E4")}
          {bar("84%", 3, "#E7E5E4")}
        </div>
      </div>
    );
  if (id === "creative") {
    const num = (w: string) => (
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 4 }}>
        {bar("10%", 5, "#C2410C", { flex: "none" })}
        {bar(w, 5, "#10302D")}
      </div>
    );
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "18px 16px", gap: 7 }}>
        {bar("74%", 14, "#C2410C")}
        {bar("40%", 5, "#0B7F72")}
        {num("30%")}
        {bar("100%", 3, line)}
        {bar("86%", 3, line)}
        {num("38%")}
        {bar("100%", 3, line)}
        <div style={{ display: "flex", gap: 4 }}>
          {bar("22%", 7, "#FFEDD5", { borderRadius: 4 })}
          {bar("18%", 7, "#FFEDD5", { borderRadius: 4 })}
          {bar("24%", 7, "#FFEDD5", { borderRadius: 4 })}
        </div>
      </div>
    );
  }
  if (id === "swiss") {
    const block = (w: string[]) => (
      <div style={{ display: "flex", gap: 8, borderTop: "2px solid #111", paddingTop: 5 }}>
        {bar("24%", 5, "#111", { flex: "none" })}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>{w.map((x, i) => <div key={i}>{bar(x, 3, "#E5E5E5")}</div>)}</div>
      </div>
    );
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "16px 14px", gap: 8 }}>
        {bar("70%", 13, "#111")}
        {bar("36%", 5, "#B91C1C")}
        {bar("100%", 4, "#111", { margin: "3px 0" })}
        {block(["100%", "80%"])}
        {block(["100%", "90%", "70%"])}
        {block(["100%", "60%"])}
      </div>
    );
  }
  if (id === "soft")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: 12, gap: 8 }}>
        <div style={{ background: "#E3F4F0", borderRadius: 8, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {bar("60%", 10, "#10302D")}
          {bar("38%", 4, "#0B6B60")}
        </div>
        {bar("26%", 7, "#E3F4F0", { borderRadius: 999, marginTop: 4 })}
        {bar("100%", 3, line)}
        {bar("86%", 3, line)}
        {bar("30%", 7, "#E3F4F0", { borderRadius: 999, marginTop: 4 })}
        {bar("100%", 3, line)}
        {bar("78%", 3, line)}
      </div>
    );
  if (id === "studio")
    return (
      <div aria-hidden="true" style={{ ...sheet, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #1D4ED8, #0F172A)", padding: "18px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
          {bar("62%", 10, "#fff")}
          {bar("42%", 4, "rgba(255,255,255,0.75)")}
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {bar("28%", 5, "#1D4ED8")}
          {bar("100%", 3, line)}
          {bar("82%", 3, line)}
          {bar("32%", 5, "#1D4ED8", { marginTop: 4 })}
          {bar("100%", 3, line)}
          {bar("76%", 3, line)}
        </div>
      </div>
    );
  if (id === "zen")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "18px 16px", gap: 8, alignItems: "center" }}>
        {bar("56%", 11, "#1C1917")}
        {bar("32%", 4, "#0F766E")}
        {bar("100%", 1, "#D1D5DB", { margin: "6px 0 2px" })}
        {bar("28%", 5, "#0F766E")}
        {bar("100%", 3, line)}
        {bar("88%", 3, line)}
        {bar("30%", 5, "#0F766E", { marginTop: 4 })}
        {bar("100%", 3, line)}
        {bar("80%", 3, line)}
      </div>
    );
  if (id === "atlas")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "16px 14px", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 7, borderBottom: "2px solid #0F172A" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "58%" }}>
            {bar("100%", 10, "#0F172A")}
            {bar("65%", 4, "#94A3B8")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "24%", alignItems: "flex-end" }}>
            {bar("100%", 3, "#94A3B8")}
            {bar("80%", 3, "#94A3B8")}
          </div>
        </div>
        <div style={{ background: "#EEF2F7", padding: "4px 6px", borderRadius: 3 }}>{bar("34%", 5, "#0F172A")}</div>
        {bar("100%", 3, line)}
        {bar("88%", 3, line)}
        <div style={{ background: "#EEF2F7", padding: "4px 6px", borderRadius: 3, marginTop: 2 }}>{bar("38%", 5, "#0F172A")}</div>
        {bar("100%", 3, line)}
        {bar("80%", 3, line)}
      </div>
    );
  if (id === "sage")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: "20px 18px", gap: 8 }}>
        {bar("63%", 11, "#134E4A")}
        {bar("38%", 4, "#A7F3D0")}
        {bar("22%", 6, "#D1FAE5", { borderRadius: 999, marginTop: 8 })}
        {bar("100%", 3, line)}
        {bar("86%", 3, line)}
        {bar("30%", 6, "#D1FAE5", { borderRadius: 999, marginTop: 6 })}
        {bar("100%", 3, line)}
        {bar("78%", 3, line)}
      </div>
    );
  if (id === "aurora")
    return (
      <div aria-hidden="true" style={{ ...sheet, padding: 12, gap: 8 }}>
        <div style={{ background: "linear-gradient(135deg, #2563EB, #7DD3FC)", borderRadius: 10, padding: "14px 12px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {bar("60%", 10, "#fff")}
          {bar("40%", 4, "rgba(255,255,255,0.8)")}
        </div>
        {bar("28%", 7, "#DBEAFE", { borderRadius: 999, marginTop: 4 })}
        {bar("100%", 3, line)}
        {bar("88%", 3, line)}
        {bar("32%", 7, "#DBEAFE", { borderRadius: 999, marginTop: 5 })}
        {bar("100%", 3, line)}
        {bar("80%", 3, line)}
      </div>
    );
  const row = (widths: string[]) => (
    <div style={{ display: "flex", gap: 8 }}>
      {bar("18%", 5, "#0B7F72", { flex: "none" })}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>{widths.map((w, i) => <div key={i}>{bar(w, 3, line)}</div>)}</div>
    </div>
  );
  return (
    <div aria-hidden="true" style={{ ...sheet, padding: 14, gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 8, borderBottom: "1px solid #BCDCD5" }}>
        {bar("45%", 10, "#10302D")}
        {bar("25%", 4, "#7FA39C")}
      </div>
      {row(["100%", "85%"])}
      {row(["100%", "80%", "92%"])}
      {row(["100%", "70%"])}
    </div>
  );
}

export const templateBackdrops: Record<TemplateId, string> = {
  classic: "linear-gradient(135deg, rgba(94,234,212,0.35), rgba(11,127,114,0.35))",
  modern: "linear-gradient(135deg, rgba(16,185,129,0.45), rgba(249,115,22,0.4))",
  compact: "linear-gradient(135deg, rgba(253,186,116,0.45), rgba(94,234,212,0.35))",
  elegant: "linear-gradient(135deg, rgba(253,230,138,0.35), rgba(194,65,12,0.4))",
  minimal: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(94,234,212,0.25))",
  bold: "linear-gradient(135deg, rgba(11,127,114,0.55), rgba(16,48,45,0.6))",
  corporate: "linear-gradient(135deg, rgba(30,58,95,0.55), rgba(94,234,212,0.25))",
  timeline: "linear-gradient(135deg, rgba(45,212,191,0.4), rgba(16,185,129,0.3))",
  academic: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(253,230,138,0.25))",
  creative: "linear-gradient(135deg, rgba(249,115,22,0.5), rgba(253,186,116,0.35))",
  swiss: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(185,28,28,0.35))",
  soft: "linear-gradient(135deg, rgba(110,231,183,0.35), rgba(94,234,212,0.3))",
  studio: "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(15,23,42,0.45))",
  zen: "linear-gradient(135deg, rgba(226,232,240,0.35), rgba(16,185,129,0.28))",
  atlas: "linear-gradient(135deg, rgba(148,163,184,0.38), rgba(15,23,42,0.4))",
  sage: "linear-gradient(135deg, rgba(167,243,208,0.35), rgba(20,78,74,0.38))",
  aurora: "linear-gradient(135deg, rgba(96,165,250,0.5), rgba(125,211,252,0.35))",
};
