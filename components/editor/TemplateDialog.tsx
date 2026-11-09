"use client";

import { useEffect, useRef } from "react";
import { useCV, useT } from "@/lib/store";
import { TEMPLATES } from "@/lib/types";
import { IconCheck, IconClose, TemplateThumb, templateBackdrops } from "../ui";

/** Visual template switcher. Switching only changes the look; the CV data is untouched. */
export default function TemplateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const current = useCV((s) => s.cv?.template);
  const setTemplate = useCV((s) => s.setTemplate);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="tpl-title"
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(1040px,calc(100vw-32px))] overflow-y-auto rounded-[28px] border border-white/30 bg-[#0a2b28]/95 p-0 text-white backdrop:bg-[#02100f]/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="tpl-title" className="m-0 text-2xl font-bold">
              {t.startPage.tplTitle}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-white/85">{t.startPage.tplLead}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.editor.dialog.close}
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl hover:bg-white/10"
          >
            <IconClose size={20} />
          </button>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {TEMPLATES.map((id) => {
            const selected = id === current;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setTemplate(id);
                    onClose();
                  }}
                  className="flex w-full cursor-pointer flex-col gap-2.5 rounded-[20px] p-2.5 text-left transition-colors"
                  style={
                    selected
                      ? { border: "1.5px solid #5EEAD4", background: "rgba(255,255,255,0.14)", boxShadow: "0 0 0 4px rgba(94,234,212,0.18)" }
                      : { border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.06)" }
                  }
                >
                  <span className="flex justify-center rounded-[14px] px-4 py-4" style={{ background: templateBackdrops[id] }}>
                    <TemplateThumb id={id} max={120} />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-1">
                    <span className="flex flex-col">
                      <span className="text-[15px] font-semibold">{t.tpl.names[id]}</span>
                      <span className="text-[12.5px] leading-snug text-white/80">{t.tpl.descs[id]}</span>
                    </span>
                    {selected && (
                      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-mint text-ink">
                        <IconCheck size={14} strokeWidth={3} />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
