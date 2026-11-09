"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CVDocument from "@/components/CVDocument";
import { RestoreButton, downloadJSON } from "@/components/JsonBackup";
import ScaledPreview from "@/components/ScaledPreview";
import { Blobs, FlowSteps, HeaderBar, IconArrowLeft, IconDownload, IconLink, Logo, Orb, UiLangToggle } from "@/components/ui";
import { useCV, useT } from "@/lib/store";

export default function ExportPage() {
  const t = useT();
  const router = useRouter();
  const { cv, loaded, load } = useCV();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (loaded && !cv) router.replace("/start");
  }, [loaded, cv, router]);

  if (!cv) return <div className="min-h-dvh" aria-busy="true" />;

  const printPDF = () => {
    const prev = document.title;
    // Browsers use the document title as the default PDF file name.
    document.title = `${(cv.personal.fullName || "CV").trim()} — CV`;
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

  return (
    <>
    <div className="screen-only relative min-h-dvh overflow-hidden">
      <Blobs
        items={[
          { top: "-180px", left: "-140px", size: 620, color: "#0B7F72" },
          { top: "160px", right: "-160px", size: 660, color: "#F97316", opacity: 0.75 },
          { top: "520px", left: "25%", size: 560, color: "#2DD4BF", opacity: 0.5 },
        ]}
      />
      <div className="relative z-[1]">
        <HeaderBar>
          <Logo />
          <div className="flex flex-wrap items-center gap-3">
            <UiLangToggle />
            <Link href="/editor" className="btn btn-glass">
              <IconArrowLeft size={16} />
              {t.exportPage.back}
            </Link>
          </div>
        </HeaderBar>

        <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 pt-10 pb-22 sm:px-8">
          <FlowSteps current={3} />

          <div className="flex flex-wrap items-start gap-12">
            <section aria-labelledby="ex-h" className="flex min-w-0 flex-[1_1_520px] flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h1 id="ex-h" className="m-0 text-4xl leading-tight font-bold sm:text-5xl">
                  {t.exportPage.title}
                </h1>
                <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-white/85">{t.exportPage.lead}</p>
              </div>

              <div className="flex flex-col gap-3.5">
                {/* PDF */}
                <article className="glass-warm relative flex flex-wrap items-center justify-between gap-x-6 gap-y-4 overflow-hidden rounded-[26px] p-7">
                  <div className="flex flex-[1_1_280px] items-start gap-[18px]">
                    <span className="flex size-14 flex-none items-center justify-center rounded-[18px] border border-white/50 bg-white/20 font-display text-[15px] font-extrabold">
                      PDF
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="m-0 text-[22px] leading-normal font-bold">{t.exportPage.pdf}</h2>
                      <p className="m-0 text-[15px] leading-relaxed text-white/90">{t.exportPage.pdfLead}</p>
                      <p id="pdf-how" className="m-0 text-[13px] leading-relaxed text-white/85">
                        {t.exportPage.pdfHow}
                      </p>
                    </div>
                  </div>
                  <button type="button" className="btn btn-white min-h-[54px] px-7 text-base" aria-describedby="pdf-how" onClick={printPDF}>
                    <IconDownload size={18} strokeWidth={2.2} />
                    {t.exportPage.downloadBtn}
                  </button>
                </article>

                {/* JSON */}
                <article className="glass flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[26px] px-7 py-[26px]" style={{ background: "rgba(255,255,255,0.11)" }}>
                  <div className="flex flex-[1_1_280px] items-start gap-[18px]">
                    <span className="flex size-14 flex-none items-center justify-center rounded-[18px] border border-mint/55 bg-mint/[0.18] font-display text-xs font-extrabold text-mint">
                      JSON
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="m-0 text-[21px] leading-normal font-semibold">{t.exportPage.json}</h2>
                      <p className="m-0 text-[15px] leading-relaxed text-white/85">{t.exportPage.jsonLead}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button type="button" className="btn btn-glass min-h-[50px] px-6" onClick={() => downloadJSON(cv)}>
                      {t.exportPage.save}
                    </button>
                    <RestoreButton
                      className="btn btn-glass min-h-[50px] px-6"
                      label={t.exportPage.restore}
                      onDone={() => setMsg({ kind: "ok", text: t.exportPage.restored })}
                      onError={() => setMsg({ kind: "err", text: t.startPage.badJson })}
                    />
                  </div>
                  {msg && (
                    <p role={msg.kind === "err" ? "alert" : "status"} className={`m-0 w-full text-sm ${msg.kind === "err" ? "text-peach" : "text-leaf"}`}>
                      {msg.text}
                    </p>
                  )}
                </article>

                {/* DOCX — phase 2 */}
                <article className="glass-soft flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[26px] px-7 py-[26px]">
                  <div className="flex flex-[1_1_280px] items-start gap-[18px]">
                    <span className="flex size-14 flex-none items-center justify-center rounded-[18px] border border-dashed border-white/45 font-display text-xs font-bold text-white/80">
                      DOCX
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="m-0 flex flex-wrap items-center gap-3 text-[21px] leading-normal font-semibold">
                        {t.exportPage.docx} <span className="badge-soon">{t.soon}</span>
                      </h2>
                      <p className="m-0 text-[15px] leading-relaxed text-white/80">{t.exportPage.docxLead}</p>
                    </div>
                  </div>
                  <button type="button" disabled className="btn btn-dashed min-h-[50px] px-6">
                    {t.exportPage.downloadBtn}
                  </button>
                </article>

                {/* Named link — phase 4 */}
                <article className="glass-soft flex flex-col gap-5 rounded-[26px] px-7 py-[26px]">
                  <div className="flex items-start gap-[18px]">
                    <span className="flex size-14 flex-none items-center justify-center rounded-[18px] border border-dashed border-white/45 text-white/80">
                      <IconLink size={24} strokeWidth={1.8} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="m-0 flex flex-wrap items-center gap-3 text-[21px] leading-normal font-semibold">
                        {t.exportPage.link} <span className="badge-soon">{t.soon}</span>
                      </h2>
                      <p className="m-0 text-[15px] leading-relaxed text-white/80">{t.exportPage.linkLead}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-[1_1_260px] flex-col gap-1.5">
                      <label htmlFor="slug" className="field-label">
                        {t.exportPage.slug}
                      </label>
                      <div className="flex items-stretch overflow-hidden rounded-xl border border-dashed border-white/40 bg-white/5">
                        <span className="flex items-center border-r border-dashed border-white/40 px-3 text-sm font-medium text-white/75">
                          {t.exportPage.domain}
                        </span>
                        <input
                          id="slug"
                          type="text"
                          disabled
                          value={(cv.personal.fullName || "my-cv").trim().toLowerCase().replace(/\s+/g, "-")}
                          readOnly
                          className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-white/75"
                        />
                      </div>
                    </div>
                    <button type="button" disabled className="btn btn-dashed min-h-[52px] px-[22px]">
                      {t.exportPage.publish}
                    </button>
                  </div>
                </article>
              </div>
            </section>

            {/* Thumbnail */}
            <aside aria-label={t.exportPage.thumb} className="flex min-w-0 max-w-[420px] flex-[1_1_320px] justify-center">
              <div className="relative w-full pt-8">
                <Orb style={{ top: 0, right: "2%", width: "46%" }} />
                <Orb warm style={{ bottom: "6%", right: 0, width: "22%" }} />
                <div className="relative mr-[8%] ml-[4%]">
                  <ScaledPreview cv={cv} maxWidth={380} />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>

    {/* Unscaled copy used only when printing / saving as PDF */}
    <div id="print-root">
      <CVDocument cv={cv} />
    </div>
    </>
  );
}
