"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RestoreButton } from "@/components/JsonBackup";
import {
  Blobs,
  FlowSteps,
  HeaderBar,
  IconArrowRight,
  IconCheck,
  IconLink,
  IconUpload,
  Logo,
  Orb,
  TemplateThumb,
  UiLangToggle,
  templateBackdrops,
} from "@/components/ui";
import { startNewCV, useCV, useT, useUI } from "@/lib/store";
import { TEMPLATES, type Lang, type TemplateId } from "@/lib/types";

export default function StartPage() {
  const t = useT();
  const router = useRouter();
  const uiLang = useUI((s) => s.uiLang);
  const { cv, loaded, load } = useCV();
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [lang, setLang] = useState<Lang | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cvLang: Lang = lang ?? uiLang;

  useEffect(() => {
    void load();
  }, [load]);

  const hasDraft = loaded && cv !== null;

  const begin = (tpl: TemplateId = template) => {
    if (hasDraft && !window.confirm(t.startPage.confirmNew)) return;
    startNewCV(cvLang, tpl);
    router.push("/editor");
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Blobs
        items={[
          { top: "-160px", left: "-140px", size: 620, color: "#0B7F72" },
          { top: "200px", right: "-180px", size: 640, color: "#F97316", opacity: 0.75 },
          { top: "760px", left: "20%", size: 560, color: "#2DD4BF", opacity: 0.5 },
          { top: "1100px", right: "-100px", size: 600, color: "#10B981", opacity: 0.8 },
        ]}
      />
      <div className="relative z-[1]">
        <HeaderBar>
          <Logo />
          <UiLangToggle />
        </HeaderBar>

        <main className="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 pt-10 pb-24 sm:px-8">
          <FlowSteps current={1} />

          {hasDraft && cv && (
            <section aria-labelledby="draft-h" className="glass flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-6 py-5">
              <div className="flex flex-col gap-1">
                <h2 id="draft-h" className="m-0 text-xl font-semibold">
                  {t.startPage.draftTitle}
                  {cv.personal.fullName ? `: ${cv.personal.fullName}` : ""}
                </h2>
                <p className="m-0 text-[15px] text-white/85">{t.startPage.draftLead}</p>
              </div>
              <Link href="/editor" className="btn btn-primary">
                {t.startPage.continueDraft}
                <IconArrowRight size={16} />
              </Link>
            </section>
          )}

          {/* Method */}
          <section aria-labelledby="m-h" className="flex flex-col gap-9">
            <h1 id="m-h" className="m-0 text-4xl leading-tight font-bold sm:text-5xl">
              {t.startPage.title}
            </h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
              <a
                href="#templates-h"
                className="glass-warm relative flex min-h-[290px] flex-col gap-4 overflow-hidden rounded-[28px] px-8 py-9"
              >
                <Orb style={{ top: -40, right: -30, width: 150, opacity: 0.9 }} />
                <span className="relative mt-auto flex items-center gap-3 text-[26px] leading-snug font-bold">
                  {t.startPage.newCv}
                  <IconArrowRight size={24} />
                </span>
                <span className="relative text-[15px] leading-relaxed text-white/90">{t.startPage.newCvLead}</span>
              </a>

              <div className="glass flex min-h-[290px] flex-col gap-4 rounded-[28px] px-8 py-9" style={{ background: "rgba(255,255,255,0.1)" }}>
                <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-[14px] border border-white/35 bg-white/15 text-sun">
                  <IconUpload size={22} strokeWidth={1.8} />
                </span>
                <h2 className="m-0 mt-auto flex flex-wrap items-center gap-3 text-[21px] leading-normal font-semibold">
                  {t.startPage.upload} <span className="badge-soon">{t.soon}</span>
                </h2>
                <p className="m-0 text-[15px] leading-relaxed text-white/85">{t.startPage.uploadLead}</p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" disabled className="btn btn-dashed self-start text-sm">
                    {t.startPage.pickFile}
                  </button>
                  <RestoreButton
                    className="btn btn-glass self-start text-sm"
                    label={t.startPage.restoreJson}
                    onDone={() => router.push("/editor")}
                    onError={() => setError(t.startPage.badJson)}
                  />
                </div>
                {error && (
                  <p role="alert" className="m-0 text-sm text-peach">
                    {error}
                  </p>
                )}
              </div>

              <div className="glass flex min-h-[290px] flex-col gap-4 rounded-[28px] px-8 py-9" style={{ background: "rgba(255,255,255,0.1)" }}>
                <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-[14px] border border-white/35 bg-white/15 text-mint">
                  <IconLink size={22} strokeWidth={1.8} />
                </span>
                <h2 className="m-0 mt-auto flex flex-wrap items-center gap-3 text-[21px] leading-normal font-semibold">
                  {t.startPage.linkedin} <span className="badge-soon">{t.later}</span>
                </h2>
                <p className="m-0 text-[15px] leading-relaxed text-white/85">{t.startPage.linkedinLead}</p>
                <button type="button" disabled className="btn btn-dashed self-start text-sm">
                  {t.startPage.pickFile}
                </button>
              </div>
            </div>
          </section>

          {/* Templates */}
          <section aria-labelledby="templates-h" className="flex scroll-mt-8 flex-col gap-9">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
              <div className="flex flex-col gap-3">
                <h2 id="templates-h" className="m-0 text-[32px] leading-snug font-bold sm:text-4xl">
                  {t.startPage.tplTitle}
                </h2>
                <p className="m-0 max-w-[460px] text-base leading-relaxed text-white/85">{t.startPage.tplLead}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span id="lang-l" className="font-display text-xs font-semibold tracking-[0.14em] text-sun">
                  {t.startPage.cvLangLabel}
                </span>
                <div role="group" aria-labelledby="lang-l" className="seg rounded-[14px]">
                  <button type="button" aria-pressed={cvLang === "ka"} onClick={() => setLang("ka")} className="min-h-11! px-6! text-[15px]!">
                    ქართული
                  </button>
                  <button type="button" aria-pressed={cvLang === "en"} onClick={() => setLang("en")} className="min-h-11! px-6! text-[15px]!">
                    English
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-7">
              {TEMPLATES.map((id) => {
                const selected = id === template;
                return (
                  <article
                    key={id}
                    className="relative flex flex-col rounded-[28px] p-4"
                    style={
                      selected
                        ? {
                            background: "rgba(255,255,255,0.16)",
                            backdropFilter: "blur(22px) saturate(160%)",
                            WebkitBackdropFilter: "blur(22px) saturate(160%)",
                            border: "1.5px solid #5EEAD4",
                            boxShadow:
                              "0 0 0 4px rgba(94,234,212,0.18), 0 18px 50px -12px rgba(94,234,212,0.45), inset 0 1px 0 rgba(255,255,255,0.45)",
                          }
                        : {
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(22px) saturate(150%)",
                            WebkitBackdropFilter: "blur(22px) saturate(150%)",
                            border: "1px solid rgba(255,255,255,0.26)",
                            boxShadow: "0 12px 40px -12px rgba(2,16,15,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
                          }
                    }
                  >
                    {selected && (
                      <div className="absolute -top-3.5 left-[22px] z-[2] flex items-center gap-2 rounded-full border border-white/50 bg-[linear-gradient(135deg,#2DD4BF,#0B7F72)] px-3.5 py-[3px] text-sm font-semibold">
                        <IconCheck size={14} strokeWidth={2.6} />
                        {t.startPage.selected}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setTemplate(id)}
                      aria-pressed={selected}
                      aria-label={`${t.tpl.names[id]} — ${t.startPage.choose}`}
                      className="flex cursor-pointer justify-center rounded-[20px] border-0 px-8 pt-10 pb-8"
                      style={{ background: templateBackdrops[id] }}
                    >
                      <TemplateThumb id={id} max={200} />
                    </button>
                    <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-[18px] pb-1.5">
                      <div>
                        <h3 className="m-0 text-[19px] font-semibold">{t.tpl.names[id]}</h3>
                        <p className="m-0 text-sm text-white/85">{t.tpl.meta[id]}</p>
                      </div>
                      {selected ? (
                        <button type="button" className="btn btn-primary" onClick={() => begin(id)}>
                          {t.startPage.go}
                        </button>
                      ) : (
                        <button type="button" className="btn btn-glass" onClick={() => setTemplate(id)}>
                          {t.startPage.choose}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
