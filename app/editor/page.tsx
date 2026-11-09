"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AIPanel from "@/components/editor/AIPanel";
import SectionsDialog from "@/components/editor/SectionsDialog";
import TemplateDialog from "@/components/editor/TemplateDialog";
import { STEPS, StepBody, isStepFilled, type StepKey } from "@/components/editor/Steps";
import { isCVEmpty } from "@/components/CVDocument";
import ScaledPreview from "@/components/ScaledPreview";
import { Blobs, IconCheck, IconChevronDown, IconDownload, IconList, LogoMark, Orb, UiLangToggle } from "@/components/ui";
import { initAIUsage, useAI } from "@/lib/ai";
import { hasPendingSave, useCV, useT } from "@/lib/store";

export default function EditorPage() {
  const t = useT();
  const router = useRouter();
  const { cv, loaded, saveState, load, setLang } = useCV();
  const aiTarget = useAI((s) => s.target);
  const [step, setStep] = useState<StepKey>("personal");
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [pages, setPages] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstStepRender = useRef(true);

  useEffect(() => {
    void load();
    initAIUsage();
  }, [load]);

  useEffect(() => {
    if (loaded && !cv) router.replace("/start");
  }, [loaded, cv, router]);

  // Guest-mode safety net: warn only if a save is still in flight.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingSave()) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const onPages = useCallback((n: number) => setPages(n), []);

  if (!cv) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }

  const idx = STEPS.indexOf(step);
  const prev = idx > 0 ? STEPS[idx - 1] : null;
  const next = idx < STEPS.length - 1 ? STEPS[idx + 1] : null;
  const docTitle = cv.personal.fullName ? `${cv.personal.fullName} — CV` : t.editor.untitled;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Blobs
        items={[
          { top: "-200px", left: "-120px", size: 620, color: "#0B7F72" },
          { top: "80px", right: "-160px", size: 640, color: "#F97316", opacity: 0.7 },
          { bottom: "-220px", left: "30%", size: 640, color: "#2DD4BF", opacity: 0.5 },
        ]}
      />

      <div className="relative z-[1] flex min-h-dvh flex-col">
        {/* Top bar */}
        <header className="px-2.5 pt-2.5 sm:px-4 sm:pt-4">
          <div className="glass flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-[22px] py-2 pr-2 pl-3 sm:pr-3.5 sm:pl-[18px]">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Link href="/" aria-label={t.home} className="flex min-h-11 items-center">
                <LogoMark size={36} />
              </Link>
              <div className="flex min-w-0 flex-col leading-snug">
                <span className="truncate text-[15px] font-semibold sm:text-base">{docTitle}</span>
                <span role="status" className="flex items-center gap-2 text-[13px] font-medium text-leaf">
                  <span aria-hidden="true" className="size-[7px] rounded-full bg-leaf shadow-[0_0_8px_#6EE7B7]" />
                  {saveState === "saving" ? t.editor.saving : t.editor.saved}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button type="button" id="tpl-button" className="btn btn-glass px-4 text-sm" aria-haspopup="dialog" onClick={() => setTemplateOpen(true)}>
                {t.editor.template}: {t.tpl.names[cv.template]}
                <IconChevronDown size={14} />
              </button>

              <button type="button" className="btn btn-glass px-4 text-sm" onClick={() => setSectionsOpen(true)}>
                <IconList size={16} />
                {t.editor.sections}
              </button>

              <div role="group" aria-label={t.editor.cvLang} className="seg">
                <button type="button" aria-pressed={cv.lang === "ka"} onClick={() => setLang("ka")}>
                  CV: ქარ
                </button>
                <button type="button" aria-pressed={cv.lang === "en"} onClick={() => setLang("en")}>
                  EN
                </button>
              </div>

              <UiLangToggle />

              <Link href="/export" className="btn btn-primary">
                <IconDownload size={16} />
                {t.editor.download}
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile tabs */}
        <div role="tablist" aria-label={t.editor.view} className="seg mx-4 mt-3 grid grid-cols-2 rounded-2xl lg:hidden">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "form"}
            aria-controls="form-panel"
            onClick={() => setMobileTab("form")}
            className="min-h-11!"
          >
            {t.editor.tabForm}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "preview"}
            aria-controls="preview-panel"
            onClick={() => setMobileTab("preview")}
            className="min-h-11!"
          >
            {t.editor.tabPreview}
          </button>
        </div>

        {/* Workspace */}
        <div className="grid flex-1 grid-cols-1 items-start gap-4 p-2.5 sm:p-4 lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] xl:grid-cols-[minmax(380px,460px)_minmax(0,1fr)_minmax(300px,380px)]">
          {/* LEFT: form + (on smaller screens) AI */}
          <div id="form-panel" className={`flex min-w-0 flex-col gap-4 ${mobileTab === "form" ? "" : "max-lg:hidden"}`}>
            <section
              aria-label={t.editor.formLabel}
              className="glass flex min-w-0 flex-col gap-[22px] rounded-[28px] px-4 py-6 sm:px-[22px]"
              style={{ background: "rgba(255,255,255,0.11)" }}
            >
              <nav aria-label={t.editor.sectionsNav}>
                <ol className="m-0 grid list-none grid-cols-5 gap-1.5 p-0">
                  {STEPS.map((k, i) => {
                    const active = k === step;
                    const filled = isStepFilled(k, cv) && !active;
                    return (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => setStep(k)}
                          aria-current={active ? "step" : undefined}
                          aria-label={`${i + 1}. ${t.editor.stepShort[k]}${filled ? `, ${t.editor.done}` : active ? `, ${t.editor.current}` : ""}`}
                          title={t.editor.stepShort[k]}
                          className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl font-display text-base font-extrabold"
                          style={
                            active
                              ? {
                                  background: "linear-gradient(135deg, #0B7F72, #C2410C)",
                                  border: "1px solid rgba(255,255,255,0.4)",
                                  boxShadow: "0 8px 20px -8px rgba(194,65,12,0.7)",
                                  color: "#fff",
                                }
                              : filled
                                ? { background: "rgba(110,231,183,0.25)", border: "1px solid rgba(110,231,183,0.6)", color: "#6EE7B7" }
                                : { background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }
                          }
                        >
                          {filled ? <IconCheck size={16} strokeWidth={2.4} /> : i + 1}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="flex flex-col gap-2">
                <h1 ref={headingRef} tabIndex={-1} className="m-0 text-[26px] leading-tight font-bold outline-none sm:text-[30px]">
                  {t.editor.stepTitles[step]}
                </h1>
                <p className="m-0 text-sm leading-relaxed text-white/80">{t.editor.stepLeads[step]}</p>
              </div>

              <StepBody step={step} cv={cv} />

              <div className="mt-auto flex flex-wrap justify-between gap-3">
                {prev ? (
                  <button type="button" className="btn btn-glass min-h-12 px-[22px]" onClick={() => setStep(prev)}>
                    {t.editor.back}
                  </button>
                ) : (
                  <span />
                )}
                {next ? (
                  <button type="button" className="btn btn-primary min-h-12 px-6" onClick={() => setStep(next)}>
                    {t.editor.next}: {t.editor.stepShort[next]}
                  </button>
                ) : (
                  <Link href="/export" className="btn btn-primary min-h-12 px-6">
                    {t.editor.finish}
                  </Link>
                )}
              </div>
            </section>
          </div>

          {/* CENTER: live preview */}
          <section
            id="preview-panel"
            aria-label={t.editor.previewLabel}
            className={`glass-soft relative flex min-w-0 flex-col items-center gap-5 overflow-hidden rounded-[28px] px-3 py-6 sm:px-6 lg:sticky lg:top-4 lg:row-span-2 ${
              mobileTab === "preview" ? "" : "max-lg:hidden"
            }`}
          >
            <Orb style={{ top: 40, right: 40, width: 120, opacity: 0.9 }} />
            <Orb warm style={{ bottom: 50, left: 36, width: 70, opacity: 0.9 }} />
            <div className="relative flex w-full max-w-[560px] flex-wrap items-center justify-between gap-3">
              <span className="font-display text-[13px] font-bold tracking-[0.16em] text-sun">{t.editor.livePreview}</span>
              <span className="text-sm font-medium text-white/85">
                {t.editor.page} 1 {t.editor.of} {pages} · {t.editor.a4}
              </span>
            </div>
            {pages > 2 && (
              <p role="status" className="relative m-0 w-full max-w-[560px] rounded-xl border border-peach/60 bg-peach/10 px-3 py-2 text-sm">
                {t.editor.overTwo}
              </p>
            )}
            <div className="relative w-full max-w-[560px]">
              <ScaledPreview cv={cv} highlight={aiTarget?.field === "summary" ? "summary" : aiTarget?.id ?? null} onPages={onPages} />
              {isCVEmpty(cv) && (
                <p className="absolute inset-x-0 top-1/3 m-0 px-8 text-center text-base font-medium text-cv-muted">{t.editor.empty}</p>
              )}
            </div>
          </section>

          {/* RIGHT on wide screens; under the form on medium screens; inside the "Form" tab on phones */}
          <div className={`min-w-0 xl:sticky xl:top-4 ${mobileTab === "form" ? "" : "max-lg:hidden"}`}>
            <AIPanel />
          </div>
        </div>
      </div>

      <SectionsDialog open={sectionsOpen} onClose={() => setSectionsOpen(false)} />
      <TemplateDialog open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </div>
  );
}
