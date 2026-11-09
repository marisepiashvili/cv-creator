"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loadCV, saveCV } from "./db";
import { dictionaries, type Dict } from "./i18n";
import type { CV, Lang, Personal, SectionKey, TemplateId } from "./types";
import { emptyEducation, emptyExperience, emptyLanguage, newCV } from "./types";

/* ---------------- UI preferences (interface language) ---------------- */

interface UIState {
  uiLang: Lang;
  setUiLang: (l: Lang) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      uiLang: "ka",
      setUiLang: (uiLang) => {
        if (typeof document !== "undefined") document.documentElement.lang = uiLang;
        set({ uiLang });
      },
    }),
    {
      name: "cv-ui",
      storage: createJSONStorage(() => localStorage),
      // Rehydrated after mount (see components/Providers.tsx) so server and first client render match.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") document.documentElement.lang = state.uiLang;
      },
    },
  ),
);

export function useT(): Dict {
  return dictionaries[useUI((s) => s.uiLang)];
}

/* ---------------- CV document (guest mode, IndexedDB autosave) ---------------- */

type SaveState = "idle" | "saving" | "saved" | "error";

interface CVState {
  cv: CV | null;
  loaded: boolean;
  saveState: SaveState;
  load: () => Promise<void>;
  replace: (cv: CV) => void;
  update: (fn: (draft: CV) => CV) => void;
  setPersonal: (patch: Partial<Personal>) => void;
  setLang: (l: Lang) => void;
  setTemplate: (t: TemplateId) => void;
  addEntry: (key: "experience" | "education" | "languages") => void;
  removeEntry: (key: "experience" | "education" | "languages", id: string) => void;
  patchEntry: <K extends "experience" | "education" | "languages">(
    key: K,
    id: string,
    patch: Partial<CV[K][number]>,
  ) => void;
  setSkills: (skills: string[]) => void;
  setSectionOrder: (keys: SectionKey[]) => void;
  toggleSection: (key: SectionKey, visible: boolean) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(get: () => CVState, set: (p: Partial<CVState>) => void) {
  if (saveTimer) clearTimeout(saveTimer);
  set({ saveState: "saving" });
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    const cv = get().cv;
    if (!cv) return;
    const ok = await saveCV(cv);
    set({ saveState: ok ? "saved" : "error" });
  }, 350);
}

export function hasPendingSave() {
  return saveTimer !== null;
}

export const useCV = create<CVState>()((set, get) => {
  const commit = (fn: (cv: CV) => CV) => {
    const cv = get().cv;
    if (!cv) return;
    set({ cv: { ...fn(cv), updatedAt: Date.now() } });
    scheduleSave(get, set);
  };

  return {
    cv: null,
    loaded: false,
    saveState: "idle",

    load: async () => {
      if (get().loaded) return;
      const stored = await loadCV();
      set({ cv: stored, loaded: true, saveState: stored ? "saved" : "idle" });
    },

    replace: (cv) => {
      set({ cv: { ...cv, updatedAt: Date.now() }, loaded: true });
      scheduleSave(get, set);
    },

    update: (fn) => commit(fn),

    setPersonal: (patch) => commit((cv) => ({ ...cv, personal: { ...cv.personal, ...patch } })),
    setLang: (lang) => commit((cv) => ({ ...cv, lang })),
    setTemplate: (template) => commit((cv) => ({ ...cv, template })),

    addEntry: (key) =>
      commit((cv) => {
        if (key === "experience") return { ...cv, experience: [...cv.experience, emptyExperience()] };
        if (key === "education") return { ...cv, education: [...cv.education, emptyEducation()] };
        return { ...cv, languages: [...cv.languages, emptyLanguage()] };
      }),

    removeEntry: (key, id) =>
      commit((cv) => ({ ...cv, [key]: (cv[key] as { id: string }[]).filter((e) => e.id !== id) })),

    patchEntry: (key, id, patch) =>
      commit((cv) => ({
        ...cv,
        [key]: (cv[key] as { id: string }[]).map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),

    setSkills: (skills) => commit((cv) => ({ ...cv, skills })),

    setSectionOrder: (keys) =>
      commit((cv) => ({
        ...cv,
        sections: keys.map((k) => cv.sections.find((s) => s.key === k) ?? { key: k, visible: true }),
      })),

    toggleSection: (key, visible) =>
      commit((cv) => ({ ...cv, sections: cv.sections.map((s) => (s.key === key ? { ...s, visible } : s)) })),
  };
});

export function startNewCV(lang: Lang, template: TemplateId) {
  useCV.getState().replace(newCV(lang, template));
}
