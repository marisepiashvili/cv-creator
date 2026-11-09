"use client";

import Link from "next/link";
import { Blobs, HeaderBar, IconArrowRight, IconUpload, LogoMark, Logo, Orb, TemplateThumb, UiLangToggle, templateBackdrops } from "@/components/ui";
import { useT } from "@/lib/store";
import { TEMPLATES } from "@/lib/types";

const stepGradients = [
  "linear-gradient(135deg, #5EEAD4, #0B7F72)",
  "linear-gradient(135deg, #FDE68A, #0B7F72)",
  "linear-gradient(135deg, #10B981, #F97316)",
  "linear-gradient(135deg, #FDBA74, #F97316)",
];
const factDots = ["#5EEAD4", "#FDE68A", "#FDBA74", "#6EE7B7"];

function Glow({ color, size = 9, className = "" }: { color: string; size?: number; className?: string }) {
  return <span aria-hidden="true" className={`dot ${className}`} style={{ width: size, height: size, background: color, boxShadow: `0 0 10px ${color}` }} />;
}

export default function Home() {
  const t = useT();

  return (
    <div className="relative overflow-hidden">
      <Blobs
        items={[
          { top: "-160px", left: "-140px", size: 620, color: "#0B7F72" },
          { top: "120px", right: "-180px", size: 680, color: "#F97316", opacity: 0.8 },
          { top: "760px", left: "30%", size: 560, color: "#2DD4BF", opacity: 0.55 },
          { top: "1500px", left: "-200px", size: 640, color: "#10B981", opacity: 0.8 },
          { top: "1900px", right: "-160px", size: 600, color: "#2DD4BF", opacity: 0.5 },
          { top: "2700px", left: "-120px", size: 600, color: "#F97316", opacity: 0.7 },
          { top: "3100px", right: "-100px", size: 620, color: "#0B7F72" },
        ]}
      />

      <div className="relative z-[1]">
        <HeaderBar>
          <Logo />
          <nav aria-label={t.nav.main} className="flex flex-wrap items-center gap-x-7 text-[15px] font-medium text-white/90 max-md:hidden">
            <a href="#how" className="flex min-h-11 items-center hover:text-white">
              {t.nav.how}
            </a>
            <a href="#features" className="flex min-h-11 items-center hover:text-white">
              {t.nav.features}
            </a>
            <a href="#templates" className="flex min-h-11 items-center hover:text-white">
              {t.nav.templates}
            </a>
            <a href="#faq" className="flex min-h-11 items-center hover:text-white">
              {t.nav.faq}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <UiLangToggle />
            <Link href="/start" className="btn btn-primary px-[22px]">
              {t.start}
            </Link>
          </div>
        </HeaderBar>

        <main>
          {/* HERO */}
          <section>
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-16 px-4 pt-[72px] pb-[104px] sm:px-8">
              <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
                <span className="glass-soft flex items-center gap-2.5 self-start rounded-full px-4 py-1.5 text-sm font-medium">
                  <Glow color="#5EEAD4" size={8} />
                  {t.hero.pill}
                </span>
                <h1 className="m-0 text-[38px] leading-[1.3] font-bold tracking-[-0.01em] text-balance sm:text-[52px]">
                  {t.hero.titleA}{" "}
                  <span
                    className="font-display text-[44px] font-extrabold sm:text-[58px]"
                    style={{
                      background: "linear-gradient(135deg, #5EEAD4, #FDE68A 50%, #FDBA74)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    CV
                  </span>{" "}
                  {t.hero.titleB}
                </h1>
                <p className="m-0 max-w-[520px] text-[19px] leading-[1.8] text-pretty text-white/85">{t.hero.lead}</p>
                <div className="flex flex-wrap gap-3.5">
                  <Link href="/start" className="btn btn-primary min-h-14 px-[30px] text-base">
                    {t.start}
                    <IconArrowRight />
                  </Link>
                  <Link href="/start" className="btn btn-glass min-h-14 px-[26px] text-base">
                    <IconUpload />
                    {t.hero.upload}
                  </Link>
                </div>
              </div>

              {/* glass composition */}
              <div className="flex min-w-0 flex-[1_1_420px] justify-center" aria-hidden="true">
                <div className="relative aspect-[1/1.05] w-full max-w-[480px]">
                  <Orb style={{ top: "2%", right: "4%", width: "46%" }} />
                  <Orb warm style={{ bottom: "30%", left: "-4%", width: "22%" }} />
                  <div
                    className="absolute top-[14%] right-0 h-[70%] w-[78%] rounded-[36px] border border-white/35"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      boxShadow: "0 24px 60px -20px rgba(2,16,15,0.7), inset 0 1px 0 rgba(255,255,255,0.45)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-[4%] flex aspect-[1/1.3] w-[56%] flex-col gap-1.5 overflow-hidden rounded-[18px] border border-white/90 p-[8%] pb-[6%] text-cv-ink"
                    style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 28px 50px -18px rgba(2,16,15,0.8)" }}
                  >
                    <div className="text-[15px] leading-tight font-bold">{t.hero.sampleName}</div>
                    <div className="text-[9.5px] font-semibold text-teal">{t.hero.sampleRole}</div>
                    <div className="my-[3px] h-0.5 w-7 rounded-sm" style={{ background: "linear-gradient(90deg, #0B7F72, #C2410C)" }} />
                    <div className="text-[8.5px] font-bold tracking-[0.08em] text-teal">{t.hero.sampleExp}</div>
                    <div className="h-1 rounded-sm bg-[#DDEFEA]" />
                    <div className="h-1 w-[84%] rounded-sm bg-[#DDEFEA]" />
                    <div className="h-1 w-[92%] rounded-sm bg-[#DDEFEA]" />
                    <div className="mt-[3px] text-[8.5px] font-bold tracking-[0.08em] text-teal">{t.hero.sampleEdu}</div>
                    <div className="h-1 rounded-sm bg-[#DDEFEA]" />
                    <div className="h-1 w-[70%] rounded-sm bg-[#DDEFEA]" />
                  </div>
                  <div
                    className="absolute right-0 bottom-[6%] flex aspect-square w-[34%] items-center justify-center rounded-[26px] border border-white/40"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 18px 36px -14px rgba(2,16,15,0.75), inset 0 1px 0 rgba(255,255,255,0.45)",
                    }}
                  >
                    <div
                      className="flex aspect-square w-[74%] items-center justify-center rounded-full"
                      style={{ background: "conic-gradient(#5EEAD4 0 82%, rgba(255,255,255,0.22) 82% 100%)" }}
                    >
                      <div className="flex aspect-square w-[76%] flex-col items-center justify-center rounded-full bg-[#0A2B28] leading-none">
                        <span className="font-display text-[9px] font-bold tracking-[0.12em] text-sun">ATS</span>
                        <span className="font-display text-2xl font-extrabold">82</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* facts band */}
          <section aria-label={t.facts.label} className="px-4 sm:px-8">
            <ul className="glass-soft mx-auto flex max-w-[1200px] list-none flex-wrap justify-between gap-x-10 gap-y-3 rounded-[22px] px-8 py-[22px] text-base font-medium">
              {t.facts.items.map((f, i) => (
                <li key={f} className="flex items-center gap-3">
                  <Glow color={factDots[i]} />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {/* HOW */}
          <section id="how" className="scroll-mt-6">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 pt-28 pb-24 sm:px-8">
              <div className="flex flex-col items-center gap-3.5 text-center">
                <h2 className="m-0 text-[30px] leading-snug font-bold sm:text-4xl">{t.how.title}</h2>
                <p className="m-0 text-[17px] text-white/80">{t.how.lead}</p>
              </div>
              <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-5 p-0">
                {t.how.steps.map(([title, body], i) => (
                  <li key={title} className="glass flex flex-col gap-3.5 rounded-3xl px-[26px] py-7">
                    <span
                      aria-hidden="true"
                      className="flex size-12 items-center justify-center rounded-2xl border border-white/40 font-display text-xl font-extrabold"
                      style={{ background: stepGradients[i], boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
                    >
                      {i + 1}
                    </span>
                    <h3 className="m-0 text-[19px] leading-normal font-semibold">{title}</h3>
                    <p className="m-0 text-[15px] text-white/80">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" className="scroll-mt-6">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-24 sm:px-8">
              <h2 className="m-0 max-w-[740px] text-[30px] leading-snug font-bold sm:text-4xl">{t.features.title}</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-6">
                <article className="glass flex flex-col gap-6 rounded-[28px] p-6 sm:p-10">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="m-0 text-[23px] leading-normal font-semibold">{t.features.aiTitle}</h3>
                    <p className="m-0 text-base text-white/80">{t.features.aiLead}</p>
                  </div>
                  <div className="well flex flex-col gap-2.5 rounded-[18px] p-5" aria-hidden="true">
                    <div className="text-xs font-semibold tracking-[0.06em] text-sun">{t.features.yourText}</div>
                    <div className="text-[15px] text-white/75 line-through decoration-peach">{t.features.before}</div>
                    <div className="h-px bg-white/20" />
                    <div className="text-xs font-semibold tracking-[0.06em] text-mint">{t.features.suggestion}</div>
                    <div className="text-[15px] font-semibold">{t.features.after}</div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <span className="btn btn-primary cursor-default! text-sm">{t.features.accept}</span>
                      <span className="btn btn-glass cursor-default! text-sm">{t.features.reject}</span>
                    </div>
                  </div>
                </article>

                <article className="glass flex flex-col gap-6 rounded-[28px] p-6 sm:p-10">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="m-0 flex flex-wrap items-center gap-3 text-[23px] leading-normal font-semibold">
                      {t.features.atsTitle} <span className="badge-soon">{t.soon}</span>
                    </h3>
                    <p className="m-0 text-base text-white/80">{t.features.atsLead}</p>
                  </div>
                  <div className="well flex flex-wrap items-center gap-6 rounded-[18px] p-5">
                    <div
                      role="img"
                      aria-label={t.hero.atsSample}
                      className="flex size-[104px] flex-none items-center justify-center rounded-full"
                      style={{ background: "conic-gradient(#5EEAD4 0 82%, rgba(255,255,255,0.2) 82% 100%)", boxShadow: "0 0 30px -6px rgba(94,234,212,0.6)" }}
                    >
                      <div className="flex size-[82px] items-center justify-center rounded-full bg-[#0A2B28] font-display text-[34px] font-extrabold">82</div>
                    </div>
                    <ul className="m-0 flex flex-[1_1_200px] list-none flex-col gap-2 p-0 text-sm">
                      {t.features.atsItems.map((x, i) => (
                        <li key={x} className="flex items-center gap-2.5">
                          <Glow color={i === 2 ? "#FDBA74" : "#6EE7B7"} size={8} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                <article className="glass-warm flex flex-col gap-2 rounded-[28px] p-[34px]">
                  <h3 className="m-0 text-xl leading-normal font-semibold">{t.features.fontTitle}</h3>
                  <p className="m-0 text-[15px] text-white/90">{t.features.fontLead}</p>
                </article>
                <article className="glass-soft flex flex-col gap-2 rounded-[28px] p-[34px]">
                  <h3 className="m-0 flex flex-wrap items-center gap-3 text-xl leading-normal font-semibold">
                    {t.features.importTitle} <span className="badge-soon">{t.soon}</span>
                  </h3>
                  <p className="m-0 text-[15px] text-white/80">{t.features.importLead}</p>
                </article>
              </div>
            </div>
          </section>

          {/* TEMPLATES */}
          <section id="templates" className="scroll-mt-6">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-14 px-4 py-24 sm:px-8">
              <div className="flex flex-col items-center gap-3.5 text-center">
                <h2 className="m-0 text-[30px] leading-snug font-bold sm:text-4xl">{t.tpl.title.replace("{n}", String(TEMPLATES.length))}</h2>
                <p className="m-0 max-w-[520px] text-[17px] text-white/80">{t.tpl.lead}</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-7">
                {TEMPLATES.slice(0, 6).map((id) => (
                  <Link key={id} href="/start" className="glass flex flex-col items-center gap-[18px] rounded-[28px] px-[18px] pt-[18px] pb-6 transition-transform hover:-translate-y-1">
                    <div className="flex w-full justify-center rounded-[20px] p-[30px]" style={{ background: templateBackdrops[id] }}>
                      <TemplateThumb id={id} />
                    </div>
                    <div className="text-center">
                      <div className="text-[19px] font-semibold">{t.tpl.names[id]}</div>
                      <div className="text-sm text-white/80">{t.tpl.descs[id]}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/start#templates-h" className="btn btn-glass self-center px-7">
                {t.tpl.all.replace("{n}", String(TEMPLATES.length))}
                <IconArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* PRIVACY */}
          <section className="px-4 sm:px-8">
            <div
              className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12 overflow-hidden rounded-[36px] border border-white/30 px-6 py-14 sm:px-14 sm:py-[72px]"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                boxShadow: "0 24px 60px -20px rgba(2,16,15,0.7), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <Orb style={{ top: -90, right: -60, width: 280, opacity: 0.85 }} />
              <div className="relative flex flex-[1_1_360px] flex-col gap-[18px]">
                <span className="glass-soft self-start rounded-full px-3.5 py-1 text-[13px] font-medium">{t.privacy.pill}</span>
                <h2 className="m-0 text-[30px] leading-snug font-bold sm:text-4xl">{t.privacy.title}</h2>
                <p className="m-0 max-w-[440px] text-[17px] text-white/85">{t.privacy.lead}</p>
              </div>
              <ul className="relative m-0 flex flex-[1_1_400px] list-none flex-col gap-3 p-0">
                {t.privacy.items.map((x, i) => (
                  <li key={x} className="flex items-start gap-4 rounded-[18px] border border-white/20 bg-[rgba(3,24,22,0.35)] px-5 py-[18px]">
                    <Glow color={factDots[i]} size={10} className="mt-3" />
                    <span className="text-base leading-[1.75]">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto flex max-w-[860px] scroll-mt-6 flex-col gap-9 px-4 pt-28 pb-24 sm:px-8">
            <h2 className="m-0 text-center text-[30px] leading-snug font-bold sm:text-4xl">{t.faq.title}</h2>
            <div className="flex flex-col gap-3">
              {t.faq.items.map(([q, a], i) => (
                <details key={q} open={i === 0} className="glass group rounded-[20px] px-6">
                  <summary className="flex min-h-16 items-center justify-between gap-4 text-[17px] font-semibold">
                    {q}
                    <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="m-0 mb-[22px] text-base text-white/85">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
            <div className="glass-warm relative flex flex-wrap items-center justify-between gap-x-10 gap-y-7 overflow-hidden rounded-[36px] px-6 py-14 sm:px-14 sm:py-16">
              <Orb style={{ right: 60, top: -40, width: 190, opacity: 0.9 }} />
              <Orb warm style={{ right: 200, bottom: -50, width: 120, opacity: 0.9 }} />
              <div className="relative flex max-w-[600px] flex-[1_1_380px] flex-col items-start gap-6">
                <h2 className="m-0 text-[28px] leading-normal font-bold text-balance sm:text-[34px]">{t.cta}</h2>
                <Link href="/start" className="btn btn-white min-h-14 px-[34px] text-base">
                  {t.start}
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="px-4 pb-7 sm:px-8">
          <div className="glass-soft mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[22px] px-7 py-[18px] text-sm text-white/85">
            <div className="flex flex-wrap items-center gap-3 text-base font-semibold text-white">
              <LogoMark size={30} />
              {t.brand}
              <span className="text-sm font-normal text-white/75">{t.footer.name}</span>
            </div>
            <nav aria-label={t.nav.footer} className="flex flex-wrap gap-6">
              <a href="#faq" className="flex min-h-11 items-center hover:text-white">
                {t.footer.privacy}
              </a>
              <a href="#faq" className="flex min-h-11 items-center hover:text-white">
                {t.footer.terms}
              </a>
              <a href="#faq" className="flex min-h-11 items-center hover:text-white">
                {t.footer.cookies}
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
