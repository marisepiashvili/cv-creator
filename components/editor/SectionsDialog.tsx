"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef } from "react";
import { cvStrings } from "@/lib/i18n";
import { useCV, useT } from "@/lib/store";
import type { SectionConfig } from "@/lib/types";
import { IconClose, IconGrip } from "../ui";

function Row({ s, label }: { s: SectionConfig; label: string }) {
  const t = useT();
  const toggle = useCV((st) => st.toggleSection);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.key });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : undefined }}
      className={`flex items-center gap-3 rounded-2xl border px-2 py-1.5 ${
        isDragging ? "border-mint bg-white/20" : "border-white/25 bg-white/[0.08]"
      }`}
    >
      <button
        type="button"
        aria-label={`${t.editor.dialog.drag}: ${label}`}
        className="flex size-11 flex-none cursor-grab touch-none items-center justify-center rounded-xl text-white/85 hover:bg-white/10"
        {...attributes}
        {...listeners}
      >
        <IconGrip size={20} strokeWidth={3} />
      </button>
      <span className={`flex-1 font-semibold ${s.visible ? "" : "text-white/70 line-through"}`}>{label}</span>
      <label className="flex min-h-11 cursor-pointer items-center gap-2 pr-2 text-sm">
        <input
          type="checkbox"
          checked={s.visible}
          onChange={(e) => toggle(s.key, e.target.checked)}
          className="m-0 size-5 accent-emerald-500"
        />
        {t.editor.dialog.show}
      </label>
    </li>
  );
}

export default function SectionsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const cv = useCV((s) => s.cv);
  const setOrder = useCV((s) => s.setSectionOrder);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (!cv) return null;
  const names = cvStrings[cv.lang].sections;
  const keys = cv.sections.map((s) => s.key);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrder(arrayMove(keys, keys.indexOf(active.id as never), keys.indexOf(over.id as never)));
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="sections-title"
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-[28px] border border-white/30 bg-[#0a2b28]/95 p-0 text-white backdrop:bg-[#02100f]/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="sections-title" className="m-0 text-2xl font-bold">
            {t.editor.dialog.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.editor.dialog.close}
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl hover:bg-white/10"
          >
            <IconClose size={20} />
          </button>
        </div>
        <p className="m-0 text-sm leading-relaxed text-white/85">{t.editor.dialog.lead}</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={keys} strategy={verticalListSortingStrategy}>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {cv.sections.map((s) => (
                <Row key={s.key} s={s} label={names[s.key]} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        <button type="button" className="btn btn-primary self-end" onClick={onClose}>
          {t.editor.dialog.close}
        </button>
      </div>
    </dialog>
  );
}
