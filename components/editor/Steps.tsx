"use client";

import { useId, useState } from "react";
import { useAI, type AIField } from "@/lib/ai";
import { useCV, useT } from "@/lib/store";
import type { CV, SectionKey } from "@/lib/types";
import { IconClose, IconPlus, IconSparkle } from "../ui";

export const STEPS = ["personal", "education", "experience", "skills", "languages"] as const;
export type StepKey = (typeof STEPS)[number];

/* ---------- small building blocks ---------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AIButton({ field, id, text }: { field: AIField; id?: string; text: string }) {
  const t = useT();
  const lang = useCV((s) => s.cv?.lang ?? "ka");
  const request = useAI((s) => s.request);
  const loading = useAI((s) => s.loading);
  const target = useAI((s) => s.target);
  const busy = loading && target?.field === field && target?.id === id;
  const [hint, setHint] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn btn-ai self-start px-4"
        aria-busy={busy}
        disabled={loading}
        onClick={() => {
          if (!text.trim()) {
            setHint(true);
            return;
          }
          setHint(false);
          void request({ field, id, original: text }, lang);
          document.getElementById("ai-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }}
      >
        <IconSparkle />
        {busy ? t.ai.loading : t.editor.improve}
      </button>
      {hint && (
        <span role="status" className="text-[13px] text-white/80">
          {t.ai.empty}
        </span>
      )}
    </div>
  );
}

function Textarea({
  label,
  hint,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {hint && (
        <p id={`${id}-h`} className="field-hint">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        className="input"
        rows={rows}
        value={value}
        aria-describedby={hint ? `${id}-h` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EntryCard({ index, onRemove, children }: { index: number; onRemove?: () => void; children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-white/25 bg-white/[0.08]">
      <div className="flex items-center justify-between gap-3 border-b border-white/20 bg-white/[0.12] py-1 pr-1 pl-[18px]">
        <span className="font-display text-xs font-bold tracking-[0.14em] text-sun">
          {t.editor.entry} {String(index + 1).padStart(2, "0")}
        </span>
        {onRemove ? (
          <button
            type="button"
            aria-label={`${t.editor.removeEntry} ${index + 1}`}
            onClick={onRemove}
            className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/10"
          >
            <IconClose size={20} strokeWidth={1.8} />
          </button>
        ) : (
          <span className="h-11" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-5">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-dashed min-h-12 w-full">
      <IconPlus size={16} />
      {label}
    </button>
  );
}

function HiddenNotice({ k }: { k: SectionKey }) {
  const t = useT();
  const visible = useCV((s) => s.cv?.sections.find((x) => x.key === k)?.visible ?? true);
  const toggle = useCV((s) => s.toggleSection);
  if (visible) return null;
  return (
    <div role="status" className="well flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm">
      <span>{t.editor.sectionHidden}</span>
      <button type="button" className="btn btn-glass min-h-10 px-4 text-sm" onClick={() => toggle(k, true)}>
        {t.editor.showSection}
      </button>
    </div>
  );
}

/* ---------- steps ---------- */

function PersonalStep({ cv }: { cv: CV }) {
  const t = useT();
  const set = useCV((s) => s.setPersonal);
  const p = cv.personal;
  return (
    <div className="flex flex-col gap-4">
      <Field label={t.editor.f.fullName} value={p.fullName} onChange={(v) => set({ fullName: v })} autoComplete="name" />
      <Field label={t.editor.f.title} value={p.title} onChange={(v) => set({ title: v })} autoComplete="organization-title" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-3">
        <Field label={t.editor.f.email} type="email" value={p.email} onChange={(v) => set({ email: v })} autoComplete="email" />
        <Field label={t.editor.f.phone} type="tel" value={p.phone} onChange={(v) => set({ phone: v })} autoComplete="tel" />
      </div>
      <Field label={t.editor.f.location} value={p.location} onChange={(v) => set({ location: v })} autoComplete="address-level2" />
      <Textarea label={t.editor.f.summary} hint={t.editor.f.summaryHint} value={p.summary} onChange={(v) => set({ summary: v })} />
      <AIButton field="summary" text={p.summary} />
      <HiddenNotice k="summary" />
    </div>
  );
}

function ExperienceStep({ cv }: { cv: CV }) {
  const t = useT();
  const patch = useCV((s) => s.patchEntry);
  const add = useCV((s) => s.addEntry);
  const remove = useCV((s) => s.removeEntry);
  return (
    <div className="flex flex-col gap-4">
      <HiddenNotice k="experience" />
      {cv.experience.map((e, i) => (
        <EntryCard key={e.id} index={i} onRemove={() => remove("experience", e.id)}>
          <Field label={t.editor.f.position} value={e.position} onChange={(v) => patch("experience", e.id, { position: v })} />
          <Field label={t.editor.f.company} value={e.company} onChange={(v) => patch("experience", e.id, { company: v })} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3">
            <Field
              label={t.editor.f.start}
              value={e.start}
              placeholder={t.editor.f.datePlaceholder}
              onChange={(v) => patch("experience", e.id, { start: v })}
            />
            <Field
              label={t.editor.f.end}
              value={e.current ? t.editor.f.present : e.end}
              placeholder={t.editor.f.datePlaceholder}
              disabled={e.current}
              onChange={(v) => patch("experience", e.id, { end: v })}
            />
          </div>
          <div className="flex min-h-11 items-center gap-2.5">
            <input
              id={`now-${e.id}`}
              type="checkbox"
              checked={e.current}
              onChange={(ev) => patch("experience", e.id, { current: ev.target.checked })}
              className="m-0 size-[22px] accent-emerald-500"
            />
            <label htmlFor={`now-${e.id}`} className="text-[15px] font-medium">
              {t.editor.f.current}
            </label>
          </div>
          <Textarea
            label={t.editor.f.description}
            hint={t.editor.f.descriptionHint}
            value={e.description}
            onChange={(v) => patch("experience", e.id, { description: v })}
          />
          <AIButton field="experience" id={e.id} text={e.description} />
        </EntryCard>
      ))}
      <AddButton label={t.editor.addExperience} onClick={() => add("experience")} />
    </div>
  );
}

function EducationStep({ cv }: { cv: CV }) {
  const t = useT();
  const patch = useCV((s) => s.patchEntry);
  const add = useCV((s) => s.addEntry);
  const remove = useCV((s) => s.removeEntry);
  return (
    <div className="flex flex-col gap-4">
      <HiddenNotice k="education" />
      {cv.education.map((e, i) => (
        <EntryCard key={e.id} index={i} onRemove={() => remove("education", e.id)}>
          <Field label={t.editor.f.degree} value={e.degree} onChange={(v) => patch("education", e.id, { degree: v })} />
          <Field label={t.editor.f.school} value={e.school} onChange={(v) => patch("education", e.id, { school: v })} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3">
            <Field
              label={t.editor.f.start}
              value={e.start}
              placeholder={t.editor.f.datePlaceholder}
              onChange={(v) => patch("education", e.id, { start: v })}
            />
            <Field
              label={t.editor.f.end}
              value={e.end}
              placeholder={t.editor.f.datePlaceholder}
              onChange={(v) => patch("education", e.id, { end: v })}
            />
          </div>
        </EntryCard>
      ))}
      <AddButton label={t.editor.addEducation} onClick={() => add("education")} />
    </div>
  );
}

function SkillsStep({ cv }: { cv: CV }) {
  const t = useT();
  const setSkills = useCV((s) => s.setSkills);
  const [draft, setDraft] = useState("");
  const id = useId();
  const add = () => {
    const parts = draft
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((x) => !cv.skills.some((s) => s.toLowerCase() === x.toLowerCase()));
    if (parts.length) setSkills([...cv.skills, ...parts]);
    setDraft("");
  };
  return (
    <div className="flex flex-col gap-4">
      <HiddenNotice k="skills" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="field-label">
          {t.editor.f.skill}
        </label>
        <div className="flex gap-2">
          <input
            id={id}
            className="input"
            value={draft}
            placeholder={t.editor.f.skillPlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <button type="button" className="btn btn-glass flex-none" onClick={add}>
            <IconPlus size={16} />
            {t.editor.f.addSkill}
          </button>
        </div>
      </div>
      {cv.skills.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {cv.skills.map((s) => (
            <li key={s} className="flex items-center gap-1 rounded-full border border-white/35 bg-white/[0.14] py-1 pr-1 pl-4 text-sm font-semibold">
              {s}
              <button
                type="button"
                aria-label={`${t.editor.f.removeSkill}: ${s}`}
                onClick={() => setSkills(cv.skills.filter((x) => x !== s))}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-white/15"
              >
                <IconClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguagesStep({ cv }: { cv: CV }) {
  const t = useT();
  const patch = useCV((s) => s.patchEntry);
  const add = useCV((s) => s.addEntry);
  const remove = useCV((s) => s.removeEntry);
  return (
    <div className="flex flex-col gap-4">
      <HiddenNotice k="languages" />
      {cv.languages.map((l, i) => (
        <EntryCard key={l.id} index={i} onRemove={() => remove("languages", l.id)}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3">
            <Field label={t.editor.f.language} value={l.name} onChange={(v) => patch("languages", l.id, { name: v })} />
            <Field label={t.editor.f.level} value={l.level} placeholder="B2" onChange={(v) => patch("languages", l.id, { level: v })} />
          </div>
        </EntryCard>
      ))}
      <AddButton label={t.editor.addLanguage} onClick={() => add("languages")} />
    </div>
  );
}

export function StepBody({ step, cv }: { step: StepKey; cv: CV }) {
  switch (step) {
    case "personal":
      return <PersonalStep cv={cv} />;
    case "education":
      return <EducationStep cv={cv} />;
    case "experience":
      return <ExperienceStep cv={cv} />;
    case "skills":
      return <SkillsStep cv={cv} />;
    case "languages":
      return <LanguagesStep cv={cv} />;
  }
}

export function isStepFilled(step: StepKey, cv: CV): boolean {
  switch (step) {
    case "personal":
      return Boolean(cv.personal.fullName && (cv.personal.email || cv.personal.phone));
    case "education":
      return cv.education.some((e) => e.degree || e.school);
    case "experience":
      return cv.experience.some((e) => e.position || e.company);
    case "skills":
      return cv.skills.length > 0;
    case "languages":
      return cv.languages.some((l) => l.name);
  }
}
