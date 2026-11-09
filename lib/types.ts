export type Lang = "ka" | "en";
export type TemplateId =
  | "classic"
  | "modern"
  | "compact"
  | "elegant"
  | "minimal"
  | "bold"
  | "corporate"
  | "timeline"
  | "academic"
  | "creative"
  | "swiss"
  | "soft"
  | "studio"
  | "zen"
  | "atlas"
  | "sage"
  | "aurora";
export type SectionKey = "summary" | "experience" | "education" | "skills" | "languages";

export interface Personal {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface SectionConfig {
  key: SectionKey;
  visible: boolean;
}

export interface CV {
  id: "current";
  version: 1;
  lang: Lang;
  template: TemplateId;
  updatedAt: number;
  personal: Personal;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: LanguageItem[];
  sections: SectionConfig[];
}

export const TEMPLATES: TemplateId[] = [
  "classic",
  "modern",
  "compact",
  "elegant",
  "minimal",
  "bold",
  "corporate",
  "timeline",
  "academic",
  "creative",
  "swiss",
  "soft",
  "studio",
  "zen",
  "atlas",
  "sage",
  "aurora",
];
export const SECTION_KEYS: SectionKey[] = ["summary", "experience", "education", "skills", "languages"];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function emptyExperience(): Experience {
  return { id: uid(), position: "", company: "", start: "", end: "", current: false, description: "" };
}

export function emptyEducation(): Education {
  return { id: uid(), degree: "", school: "", start: "", end: "" };
}

export function emptyLanguage(): LanguageItem {
  return { id: uid(), name: "", level: "" };
}

export function newCV(lang: Lang = "ka", template: TemplateId = "modern"): CV {
  return {
    id: "current",
    version: 1,
    lang,
    template,
    updatedAt: Date.now(),
    personal: { fullName: "", title: "", email: "", phone: "", location: "", summary: "" },
    experience: [emptyExperience()],
    education: [emptyEducation()],
    skills: [],
    languages: [emptyLanguage()],
    sections: SECTION_KEYS.map((key) => ({ key, visible: true })),
  };
}

/** Validates and normalises an imported JSON backup. Returns null when the shape is not a CV. */
export function parseCV(raw: unknown): CV | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const p = (r.personal ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 5000) : "");
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  if (typeof r.personal !== "object") return null;

  const base = newCV();
  const sections = arr(r.sections)
    .map((s) => s as Record<string, unknown>)
    .filter((s) => SECTION_KEYS.includes(s.key as SectionKey))
    .map((s) => ({ key: s.key as SectionKey, visible: s.visible !== false }));
  for (const key of SECTION_KEYS) {
    if (!sections.some((s) => s.key === key)) sections.push({ key, visible: true });
  }

  return {
    ...base,
    lang: r.lang === "en" ? "en" : "ka",
    template: TEMPLATES.includes(r.template as TemplateId) ? (r.template as TemplateId) : "modern",
    updatedAt: Date.now(),
    personal: {
      fullName: str(p.fullName),
      title: str(p.title),
      email: str(p.email),
      phone: str(p.phone),
      location: str(p.location),
      summary: str(p.summary),
    },
    experience: arr(r.experience).map((e) => {
      const x = e as Record<string, unknown>;
      return {
        id: uid(),
        position: str(x.position),
        company: str(x.company),
        start: str(x.start),
        end: str(x.end),
        current: x.current === true,
        description: str(x.description),
      };
    }),
    education: arr(r.education).map((e) => {
      const x = e as Record<string, unknown>;
      return { id: uid(), degree: str(x.degree), school: str(x.school), start: str(x.start), end: str(x.end) };
    }),
    skills: arr(r.skills).filter((s): s is string => typeof s === "string").map((s) => s.slice(0, 80)),
    languages: arr(r.languages).map((e) => {
      const x = e as Record<string, unknown>;
      return { id: uid(), name: str(x.name), level: str(x.level) };
    }),
    sections,
  };
}
