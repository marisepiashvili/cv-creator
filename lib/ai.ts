"use client";

import { create } from "zustand";
import type { Lang } from "./types";

export type AIField = "summary" | "experience";
export type AITarget = { field: AIField; id?: string; original: string };
export type Variant = { kind: "simpler" | "shorter" | "specific"; text: string };
export type AIError = "limit" | "config" | "generic" | "tooLong";

export const AI_LIMIT = 20;

interface AIState {
  target: AITarget | null;
  variants: Variant[];
  loading: boolean;
  error: AIError | null;
  used: number;
  request: (target: AITarget, lang: Lang) => Promise<void>;
  dismiss: (index: number) => void;
  clear: () => void;
}

function readUsed(): number {
  try {
    return Number(sessionStorage.getItem("cv-ai-used") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function writeUsed(n: number) {
  try {
    sessionStorage.setItem("cv-ai-used", String(n));
  } catch {
    /* storage unavailable: counter just won't survive reloads */
  }
}

export const useAI = create<AIState>()((set, get) => ({
  target: null,
  variants: [],
  loading: false,
  error: null,
  used: 0,

  request: async (target, lang) => {
    if (get().loading) return;
    if (target.original.length > 2000) {
      set({ target, variants: [], error: "tooLong" });
      return;
    }
    set({ target, variants: [], loading: true, error: null, used: Math.max(get().used, readUsed()) });
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: target.original, field: target.field, lang }),
      });
      const data = (await res.json().catch(() => ({}))) as { variants?: Variant[]; used?: number; error?: AIError };
      if (typeof data.used === "number") {
        writeUsed(data.used);
        set({ used: data.used });
      }
      if (!res.ok || !data.variants) {
        set({ loading: false, error: data.error ?? "generic" });
        return;
      }
      set({ loading: false, variants: data.variants });
    } catch {
      set({ loading: false, error: "generic" });
    }
  },

  dismiss: (index) => set({ variants: get().variants.filter((_, i) => i !== index) }),
  clear: () => set({ target: null, variants: [], error: null, loading: false }),
}));

export function initAIUsage() {
  useAI.setState({ used: readUsed() });
}
