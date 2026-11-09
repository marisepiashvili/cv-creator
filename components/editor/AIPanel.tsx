"use client";

import { useState } from "react";
import { AI_LIMIT, useAI } from "@/lib/ai";
import { useCV, useT } from "@/lib/store";

const dotColor: Record<string, string> = { simpler: "#FDE68A", shorter: "#FDBA74", specific: "#5EEAD4" };

export default function AIPanel() {
  const t = useT();
  const [tab, setTab] = useState<"text" | "job" | "ats">("text");
  const { target, variants, loading, error, used, dismiss, clear } = useAI();
  const setPersonal = useCV((s) => s.setPersonal);
  const patchEntry = useCV((s) => s.patchEntry);

  const accept = (text: string) => {
    if (!target) return;
    if (target.field === "summary") setPersonal({ summary: text });
    else if (target.id) patchEntry("experience", target.id, { description: text });
    clear();
  };

  const tabs = [
    ["text", t.ai.tabText],
    ["job", t.ai.tabJob],
    ["ats", t.ai.tabAts],
  ] as const;

  return (
    <aside
      id="ai-panel"
      aria-label={t.ai.label}
      className="glass flex min-w-0 flex-col gap-5 rounded-[28px] px-[22px] py-[26px]"
      style={{ background: "rgba(255,255,255,0.11)" }}
    >
      <div role="tablist" aria-label={t.ai.tabsLabel} className="seg grid grid-cols-3 rounded-[14px]">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`ai-tab-${key}`}
            aria-controls="ai-tabpanel"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className="min-h-11! text-[13px]!"
          >
            {label}
          </button>
        ))}
      </div>

      <div id="ai-tabpanel" role="tabpanel" aria-labelledby={`ai-tab-${tab}`} className="flex flex-col gap-4">
        {tab === "text" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <h2 className="m-0 text-[21px] leading-snug font-bold">{t.ai.title}</h2>
              <p className="m-0 text-[13px] leading-relaxed text-white/80">
                {target ? `${t.ai.forField}: „${t.ai.fieldNames[target.field]}“. ` : ""}
                {t.ai.hint}
              </p>
            </div>

            <div aria-live="polite" className="flex flex-col gap-3.5">
              {loading && (
                <div className="well flex items-center gap-3 rounded-[20px] px-4 py-4 text-sm" role="status">
                  <span aria-hidden="true" className="dot animate-pulse bg-mint shadow-[0_0_8px_#5EEAD4]" />
                  {t.ai.loading}
                </div>
              )}
              {error && (
                <div role="alert" className="rounded-[20px] border border-peach/60 bg-peach/10 px-4 py-3 text-sm">
                  {t.ai.errors[error]}
                </div>
              )}
              {!loading && !error && variants.length === 0 && (
                <p className="well m-0 rounded-[20px] px-4 py-4 text-sm text-white/85">{t.ai.idle}</p>
              )}
              {variants.map((v, i) => (
                <article
                  key={`${v.kind}-${i}`}
                  className="flex flex-col overflow-hidden rounded-[20px]"
                  style={
                    i === 0
                      ? { background: "rgba(94,234,212,0.14)", border: "1px solid rgba(94,234,212,0.55)", boxShadow: "0 0 24px -8px rgba(94,234,212,0.5)" }
                      : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.26)" }
                  }
                >
                  <h3 className="m-0 flex items-center gap-2.5 px-4 pt-3.5 pb-1.5 text-sm font-semibold">
                    <span aria-hidden="true" className="dot size-2!" style={{ background: dotColor[v.kind], boxShadow: `0 0 8px ${dotColor[v.kind]}` }} />
                    {t.ai.kinds[v.kind]}
                  </h3>
                  <p className="m-0 px-4 pb-3.5 text-sm leading-relaxed font-medium whitespace-pre-line">{v.text}</p>
                  <div className="flex border-t border-white/25">
                    <button
                      type="button"
                      onClick={() => accept(v.text)}
                      className="min-h-[46px] flex-1 cursor-pointer border-0 text-sm font-semibold text-white"
                      style={{ background: i === 0 ? "linear-gradient(135deg, #0B7F72, #C2410C)" : "rgba(255,255,255,0.1)" }}
                    >
                      {t.ai.accept}
                      <span className="sr-only">: {t.ai.kinds[v.kind]}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismiss(i)}
                      className="min-h-[46px] flex-1 cursor-pointer border-0 border-l border-white/25 bg-white/[0.08] text-sm font-semibold text-white"
                    >
                      {t.ai.reject}
                      <span className="sr-only">: {t.ai.kinds[v.kind]}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="badge-soon self-start">{t.soon}</span>
            <p className="m-0 text-sm leading-relaxed text-white/85">{tab === "job" ? t.ai.soonJob : t.ai.soonAts}</p>
          </div>
        )}
      </div>

      <div className="well mt-auto flex flex-col gap-2.5 rounded-[18px] p-4 text-[13px] leading-normal font-medium">
        <div className="flex items-baseline justify-between gap-2">
          <span>{t.ai.usage}</span>
          <b className="font-display text-base font-extrabold">
            {used} / {AI_LIMIT}
          </b>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={AI_LIMIT}
          aria-valuenow={used}
          aria-label={t.ai.usageLabel}
          className="h-2.5 overflow-hidden rounded-full bg-white/[0.18]"
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(100, (used / AI_LIMIT) * 100)}%`, background: "linear-gradient(90deg, #5EEAD4, #10B981, #F97316)" }}
          />
        </div>
        <span className="font-normal text-white/80">{t.ai.noPii}</span>
      </div>
    </aside>
  );
}
