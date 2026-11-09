import { cvStrings } from "@/lib/i18n";
import type { CV, Lang, SectionKey, TemplateId } from "@/lib/types";

/**
 * The CV itself. The same component renders the live preview (scaled) and the
 * print/PDF output (unscaled), so the PDF matches the preview (F-21).
 * Every template is single column, uses standard section headings and real
 * text in reading order, so ATS parsers read it top to bottom.
 */

const SANS = "var(--font-georgian), var(--font-latin), sans-serif";
const SERIF = "var(--font-serif), Georgia, serif";

type HeaderKind = "centered" | "band" | "split" | "elegant" | "left" | "dark" | "corporate" | "academic" | "creative" | "swiss" | "card";
type HeadingKind =
  | "rule"
  | "accent"
  | "label"
  | "flourish"
  | "quiet"
  | "marker"
  | "band"
  | "smallcaps"
  | "numbered"
  | "thick"
  | "pill";

type Theme = {
  header: HeaderKind;
  heading: HeadingKind;
  /** Page padding; templates with a full-bleed header use `inset` for the body. */
  pad: string;
  inset?: string;
  body: number;
  gap: number;
  accent: string;
  muted: string;
  skills: "inline" | "chips" | "outline" | "warm";
  /** Body font; defaults to the sans stack. */
  font?: string;
  /** "grid" puts the heading in a left label column. */
  layout?: "stack" | "grid";
  /** Extra style on every <section>. */
  sectionStyle?: React.CSSProperties;
  /** "timeline" draws experience/education on a vertical line with dates first. */
  entries?: "plain" | "timeline";
};

const themes: Record<TemplateId, Theme> = {
  classic: { header: "centered", heading: "rule", pad: "56px 60px", body: 13.5, gap: 22, accent: "#10302D", muted: "#3F6560", skills: "inline" },
  modern: { header: "band", heading: "accent", pad: "0 0 48px", inset: "0 56px", body: 13.5, gap: 20, accent: "#0B7F72", muted: "#3F6560", skills: "chips" },
  compact: { header: "split", heading: "label", layout: "grid", pad: "40px 44px", body: 12.5, gap: 14, accent: "#0B7F72", muted: "#3F6560", skills: "chips" },
  elegant: {
    header: "elegant",
    heading: "flourish",
    pad: "56px 64px",
    body: 13.5,
    gap: 22,
    accent: "#9A3412",
    muted: "#57534E",
    skills: "inline",
  },
  minimal: { header: "left", heading: "quiet", pad: "64px 68px", body: 13.5, gap: 28, accent: "#1C1917", muted: "#5B6B69", skills: "inline" },
  bold: { header: "dark", heading: "marker", pad: "0 0 48px", inset: "0 56px", body: 13.5, gap: 22, accent: "#0B7F72", muted: "#3F6560", skills: "outline" },
  corporate: { header: "corporate", heading: "band", pad: "48px 56px", body: 13.5, gap: 20, accent: "#1E3A5F", muted: "#4B5563", skills: "inline" },
  timeline: {
    header: "left",
    heading: "accent",
    pad: "56px 60px",
    body: 13.5,
    gap: 24,
    accent: "#0B7F72",
    muted: "#3F6560",
    skills: "chips",
    entries: "timeline",
  },
  academic: { header: "academic", heading: "smallcaps", pad: "60px 64px", body: 13.5, gap: 20, accent: "#1C1917", muted: "#44403C", skills: "inline", font: SERIF },
  creative: { header: "creative", heading: "numbered", pad: "56px 60px", body: 13.5, gap: 24, accent: "#C2410C", muted: "#57534E", skills: "warm" },
  swiss: {
    header: "swiss",
    heading: "thick",
    layout: "grid",
    sectionStyle: { borderTop: "3px solid #111", paddingTop: 10 },
    pad: "52px 56px",
    body: 13,
    gap: 20,
    accent: "#111111",
    muted: "#525252",
    skills: "inline",
  },
  soft: { header: "card", heading: "pill", pad: "40px 48px", body: 13.5, gap: 20, accent: "#0B6B60", muted: "#3F6560", skills: "chips" },
  studio: { header: "band", heading: "label", pad: "0 0 44px", inset: "0 52px", body: 13.5, gap: 20, accent: "#1D4ED8", muted: "#475569", skills: "chips" },
  zen: { header: "centered", heading: "quiet", pad: "56px 60px", body: 13.5, gap: 22, accent: "#0F766E", muted: "#475569", skills: "inline" },
  atlas: { header: "split", heading: "band", pad: "46px 52px", body: 13.5, gap: 20, accent: "#0F172A", muted: "#475569", skills: "chips" },
  sage: { header: "left", heading: "pill", pad: "52px 56px", body: 13.5, gap: 22, accent: "#134E4A", muted: "#52606A", skills: "inline" },
  aurora: { header: "card", heading: "accent", pad: "40px 48px", body: 13.5, gap: 20, accent: "#2563EB", muted: "#475569", skills: "chips" },
};

export function splitLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[•\-–*·]\s*/, "").trim())
    .filter(Boolean);
}

function hasContent(cv: CV, key: SectionKey): boolean {
  switch (key) {
    case "summary":
      return cv.personal.summary.trim().length > 0;
    case "experience":
      return cv.experience.some((e) => e.position || e.company || e.description);
    case "education":
      return cv.education.some((e) => e.degree || e.school);
    case "skills":
      return cv.skills.length > 0;
    case "languages":
      return cv.languages.some((l) => l.name);
  }
}

export function isCVEmpty(cv: CV): boolean {
  const p = cv.personal;
  return !p.fullName && !p.title && !p.email && !p.phone && !p.location && !cv.sections.some((s) => hasContent(cv, s.key));
}

function dates(start: string, end: string, current: boolean, present: string) {
  const e = current ? present : end;
  if (start && e) return `${start} – ${e}`;
  return start || e || "";
}

/** Uppercase only for Latin: CSS uppercase turns Georgian into Mtavruli. */
const caps = (lang: Lang): React.CSSProperties => (lang === "en" ? { textTransform: "uppercase" } : {});

const GEORGIAN = /[\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/;
/** For user-typed text: an English CV may still contain Georgian words. */
const isLatinText = (text: string) => !GEORGIAN.test(text);

/* ---------------- headers ---------------- */

function Header({ cv, th }: { cv: CV; th: Theme }) {
  const p = cv.personal;
  const contacts = [p.location, p.email, p.phone].filter(Boolean);
  const name = p.fullName || " ";

  switch (th.header) {
    case "band":
      return (
        <header style={{ background: "linear-gradient(135deg, #0B7F72, #C2410C)", padding: "44px 56px 36px", color: "#fff" }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.25 }}>{name}</h1>
          {p.title && <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.92)" }}>{p.title}</p>}
          {contacts.length > 0 && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(255,255,255,0.92)" }}>{contacts.join(" · ")}</p>}
        </header>
      );

    case "dark":
      return (
        <header>
          <div style={{ background: "#10302D", padding: "44px 56px 34px", color: "#fff" }}>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{name}</h1>
            {p.title && <p style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 600, color: "#5EEAD4" }}>{p.title}</p>}
            {contacts.length > 0 && (
              <p style={{ margin: "14px 0 0", fontSize: 12.5, color: "rgba(255,255,255,0.88)", display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
                {contacts.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </p>
            )}
          </div>
          <div aria-hidden="true" style={{ height: 5, background: "linear-gradient(90deg, #0B7F72, #C2410C)" }} />
        </header>
      );

    case "split":
      return (
        <header
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid #BCDCD5" }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, lineHeight: 1.25 }}>{name}</h1>
            {p.title && <p style={{ margin: "2px 0 0", fontSize: 13.5, fontWeight: 600, color: th.accent }}>{p.title}</p>}
          </div>
          {contacts.length > 0 && (
            <p style={{ margin: 0, fontSize: 11.5, color: th.muted, textAlign: "right" }}>
              {contacts.map((c) => (
                <span key={c} style={{ display: "block" }}>
                  {c}
                </span>
              ))}
            </p>
          )}
        </header>
      );

    case "elegant":
      return (
        <header style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 34, fontWeight: 600, lineHeight: 1.25, letterSpacing: "0.01em", color: "#1C1917" }}>{name}</h1>
          {p.title && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: th.accent,
                ...(cv.lang === "en" && isLatinText(p.title) ? { letterSpacing: "0.16em", textTransform: "uppercase" } : { letterSpacing: "0.02em", fontSize: 14 }),
              }}
            >
              {p.title}
            </p>
          )}
          {contacts.length > 0 && <p style={{ margin: "4px 0 0", fontSize: 12.5, color: th.muted }}>{contacts.join("   ·   ")}</p>}
          <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginTop: 10 }}>
            <span style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
            <span style={{ width: 7, height: 7, transform: "rotate(45deg)", background: th.accent }} />
            <span style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
          </div>
        </header>
      );

    case "left":
      return (
        <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: th.accent }}>{name}</h1>
          {p.title && <p style={{ margin: 0, fontSize: 16, fontWeight: 400, color: th.muted }}>{p.title}</p>}
          {contacts.length > 0 && (
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: th.muted, display: "flex", flexWrap: "wrap", gap: "2px 20px" }}>
              {contacts.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          )}
        </header>
      );

    case "corporate":
      return (
        <header style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 14, borderBottom: `3px solid ${th.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: th.accent }}>{name}</h1>
              {p.title && <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, color: th.muted }}>{p.title}</p>}
            </div>
            {contacts.length > 0 && (
              <p style={{ margin: 0, fontSize: 12, color: th.muted, textAlign: "right", lineHeight: 1.7 }}>
                {contacts.map((c) => (
                  <span key={c} style={{ display: "block" }}>
                    {c}
                  </span>
                ))}
              </p>
            )}
          </div>
        </header>
      );

    case "academic":
      return (
        <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 4, paddingBottom: 12, borderBottom: "1px solid #1C1917" }}>
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 30, fontWeight: 700, lineHeight: 1.25 }}>{name}</h1>
          {p.title && <p style={{ margin: 0, fontFamily: SERIF, fontSize: 15, fontStyle: "italic", color: th.muted }}>{p.title}</p>}
          {contacts.length > 0 && <p style={{ margin: "4px 0 0", fontSize: 12.5, color: th.muted }}>{contacts.join("  |  ")}</p>}
        </header>
      );

    case "creative":
      return (
        <header style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: th.accent }}>{name}</h1>
          {p.title && <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#0B7F72" }}>{p.title}</p>}
          {contacts.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: th.muted, display: "flex", flexWrap: "wrap", gap: "2px 8px" }}>
              {contacts.map((c, i) => (
                <span key={c}>
                  {i > 0 && (
                    <span aria-hidden="true" style={{ color: th.accent, marginRight: 8 }}>
                      ●
                    </span>
                  )}
                  {c}
                </span>
              ))}
            </p>
          )}
        </header>
      );

    case "swiss":
      return (
        <header style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 18, borderBottom: "6px solid #111" }}>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#111" }}>{name}</h1>
          {p.title && <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#B91C1C" }}>{p.title}</p>}
          {contacts.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: th.muted, display: "flex", flexWrap: "wrap", gap: "2px 24px" }}>
              {contacts.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          )}
        </header>
      );

    case "card":
      return (
        <header style={{ borderRadius: 18, background: "#E3F4F0", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: "#10302D" }}>{name}</h1>
          {p.title && <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: th.accent }}>{p.title}</p>}
          {contacts.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: th.muted, display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
              {contacts.map((c) => (
                <span key={c} style={{ background: "#fff", borderRadius: 999, padding: "1px 12px" }}>
                  {c}
                </span>
              ))}
            </p>
          )}
        </header>
      );

    case "centered":
    default:
      return (
        <header style={{ textAlign: "center", paddingBottom: 6 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.25 }}>{name}</h1>
          {p.title && <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 500, color: th.muted }}>{p.title}</p>}
          {contacts.length > 0 && <p style={{ margin: "8px 0 0", fontSize: 12.5, color: th.muted }}>{contacts.join("  ·  ")}</p>}
        </header>
      );
  }
}

/* ---------------- section headings ---------------- */

function SectionHeading({ text, th, lang, index }: { text: string; th: Theme; lang: Lang; index: number }) {
  const base: React.CSSProperties = { margin: 0, fontWeight: 700, color: th.accent };
  switch (th.heading) {
    case "rule":
      return <h2 style={{ ...base, fontSize: 13, letterSpacing: "0.08em", borderBottom: `1px solid ${th.accent}`, paddingBottom: 4, ...caps(lang) }}>{text}</h2>;
    case "accent":
    case "label":
      return <h2 style={{ ...base, fontSize: th.heading === "label" ? 12 : 13, letterSpacing: "0.07em", ...caps(lang) }}>{text}</h2>;
    case "flourish":
      return (
        <h2 style={{ ...base, display: "flex", alignItems: "center", gap: 14, fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: "#1C1917" }}>
          <span aria-hidden="true" style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
          <span style={{ letterSpacing: lang === "en" ? "0.12em" : "0.02em", ...caps(lang) }}>{text}</span>
          <span aria-hidden="true" style={{ flex: 1, height: 1, background: "#D6D3D1" }} />
        </h2>
      );
    case "quiet":
      // Wide tracking suits Latin caps; Georgian lowercase reads better almost untracked.
      return (
        <h2
          style={{
            ...base,
            fontSize: lang === "en" ? 11.5 : 13,
            fontWeight: 600,
            letterSpacing: lang === "en" ? "0.14em" : "0.02em",
            color: th.muted,
            ...caps(lang),
          }}
        >
          {text}
        </h2>
      );
    case "marker":
      return (
        <h2 style={{ ...base, display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "#10302D", ...caps(lang) }}>
          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, background: "linear-gradient(135deg, #0B7F72, #C2410C)", flex: "none" }} />
          {text}
        </h2>
      );
    case "band":
      return (
        <h2 style={{ ...base, fontSize: 13.5, letterSpacing: "0.05em", background: "#EEF2F7", padding: "4px 12px", borderRadius: 3, ...caps(lang) }}>{text}</h2>
      );
    case "smallcaps":
      return (
        <h2
          style={{
            ...base,
            fontFamily: SERIF,
            fontSize: 15,
            letterSpacing: lang === "en" ? "0.06em" : "0.01em",
            fontVariant: lang === "en" ? "small-caps" : undefined,
            borderBottom: "1px solid #1C1917",
            paddingBottom: 3,
          }}
        >
          {text}
        </h2>
      );
    case "numbered":
      return (
        <h2 style={{ ...base, display: "flex", alignItems: "baseline", gap: 10, fontSize: 16, color: "#10302D" }}>
          <span style={{ fontFamily: "var(--font-latin), sans-serif", fontSize: 13, fontWeight: 800, color: th.accent }}>{String(index + 1).padStart(2, "0")}</span>
          {text}
        </h2>
      );
    case "thick":
      return <h2 style={{ ...base, fontSize: 14.5, color: "#111", lineHeight: 1.3 }}>{text}</h2>;
    case "pill":
      return (
        <h2 style={{ ...base, alignSelf: "flex-start", fontSize: 13.5, background: "#E3F4F0", color: th.accent, padding: "2px 14px", borderRadius: 999 }}>{text}</h2>
      );
  }
}

/* ---------------- document ---------------- */

export default function CVDocument({ cv, highlight }: { cv: CV; highlight?: string | null }) {
  const th = themes[cv.template] ?? themes.modern;
  const s = cvStrings[cv.lang];
  const p = cv.personal;

  const hl = (id: string): React.CSSProperties =>
    highlight === id ? { background: "#E3F4F0", boxShadow: "inset 3px 0 0 #10B981", borderRadius: 6, margin: "-6px -8px", padding: "6px 8px" } : {};

  const visibleKeys = cv.sections.filter((x) => x.visible && hasContent(cv, x.key)).map((x) => x.key);

  const section = (k: SectionKey, children: React.ReactNode) => {
    const heading = <SectionHeading text={s.sections[k]} th={th} lang={cv.lang} index={visibleKeys.indexOf(k)} />;
    if (th.layout === "grid")
      return (
        <section key={k} style={{ display: "grid", gridTemplateColumns: th.heading === "thick" ? "140px 1fr" : "120px 1fr", gap: 16, ...th.sectionStyle }}>
          {heading}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
        </section>
      );
    return (
      <section key={k} style={{ display: "flex", flexDirection: "column", gap: th.heading === "quiet" ? 12 : 10, ...th.sectionStyle }}>
        {heading}
        {children}
      </section>
    );
  };

  const timeline = th.entries === "timeline";
  /** Wraps a list of entries; on the timeline template draws the vertical line. */
  const entryList = (items: React.ReactNode[]) =>
    timeline ? (
      <div style={{ borderLeft: "2px solid #CBE5DF", marginLeft: 5, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 14 }}>{items}</div>
    ) : (
      items
    );
  const dot = timeline ? (
    <span
      aria-hidden="true"
      style={{ position: "absolute", left: -28, top: 5, width: 12, height: 12, borderRadius: "50%", background: th.accent, border: "2px solid #fff", boxSizing: "border-box" }}
    />
  ) : null;
  const dateAbove = (d: string) =>
    timeline && d ? <span style={{ fontSize: th.body - 1.5, fontWeight: 700, color: th.accent, letterSpacing: "0.02em" }}>{d}</span> : null;
  const dateRight = (d: string) => (!timeline && d ? <span style={{ color: th.muted, whiteSpace: "nowrap" }}>{d}</span> : null);

  const render = (key: SectionKey) => {
    if (!hasContent(cv, key)) return null;
    switch (key) {
      case "summary":
        return section(
          key,
          <p className="cv-avoid-break" style={{ margin: 0, whiteSpace: "pre-line", ...hl("summary") }}>
            {p.summary}
          </p>,
        );
      case "experience":
        return section(
          key,
          entryList(
            cv.experience
            .filter((e) => e.position || e.company || e.description)
            .map((e) => {
              const lines = splitLines(e.description);
              const d = dates(e.start, e.end, e.current, s.present);
              return (
                <div key={e.id} className="cv-avoid-break" style={{ position: "relative", display: "flex", flexDirection: "column", gap: 3, ...hl(e.id) }}>
                  {dot}
                  {dateAbove(d)}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>
                      <b>{e.position}</b>
                      {e.position && e.company ? (th.header === "left" ? ", " : " · ") : ""}
                      <span style={{ fontWeight: th.header === "left" ? 400 : 700 }}>{e.company}</span>
                    </span>
                    {dateRight(d)}
                  </div>
                  {lines.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc" }}>
                      {lines.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }),
          ),
        );
      case "education":
        return section(
          key,
          entryList(
            cv.education
            .filter((e) => e.degree || e.school)
            .map((e) => {
              const d = dates(e.start, e.end, false, s.present);
              return (
                <div key={e.id} className="cv-avoid-break" style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
                  {dot}
                  {dateAbove(d)}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>
                      {e.degree && <b>{e.degree}</b>}
                      {e.degree && e.school ? " · " : ""}
                      {e.school}
                    </span>
                    {dateRight(d)}
                  </div>
                </div>
              );
            }),
          ),
        );
      case "skills":
        return section(
          key,
          th.skills === "inline" ? (
            <p style={{ margin: 0 }}>{cv.skills.join(" · ")}</p>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cv.skills.map((sk) => (
                <li
                  key={sk}
                  style={
                    th.skills === "outline"
                      ? { padding: "1px 12px", borderRadius: 6, border: "1px solid #10302D", color: "#10302D", fontWeight: 600, fontSize: th.body - 1.5 }
                      : th.skills === "warm"
                        ? { padding: "1px 12px", borderRadius: 999, background: "#FFEDD5", color: "#9A3412", fontWeight: 600, fontSize: th.body - 1.5 }
                        : { padding: "1px 12px", borderRadius: 999, background: "#E3F4F0", color: "#0B6B60", fontWeight: 600, fontSize: th.body - 1.5 }
                  }
                >
                  {sk}
                </li>
              ))}
            </ul>
          ),
        );
      case "languages":
        return section(
          key,
          <p style={{ margin: 0 }}>
            {cv.languages
              .filter((l) => l.name)
              .map((l) => (l.level ? `${l.name} — ${l.level}` : l.name))
              .join(" · ")}
          </p>,
        );
    }
  };

  return (
    <article
      className="cv-page"
      lang={cv.lang}
      data-template={cv.template}
      style={{ padding: th.pad, fontSize: th.body, fontFamily: th.font ?? SANS, display: "flex", flexDirection: "column", gap: th.gap }}
    >
      <Header cv={cv} th={th} />
      <div style={{ display: "flex", flexDirection: "column", gap: th.gap, padding: th.inset ?? 0 }}>
        {cv.sections.filter((x) => x.visible).map((x) => render(x.key))}
      </div>
    </article>
  );
}
