"use client";

import { useRef } from "react";
import { useCV } from "@/lib/store";
import { parseCV, type CV } from "@/lib/types";

export function downloadJSON(cv: CV) {
  const { id: _id, ...rest } = cv;
  void _id;
  const blob = new Blob([JSON.stringify(rest, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const name = (cv.personal.fullName || "cv").trim().replace(/\s+/g, "-").toLowerCase();
  a.href = url;
  a.download = `${name}-backup.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Hidden file input + trigger button for restoring a JSON backup. */
export function RestoreButton({
  className,
  label,
  onDone,
  onError,
}: {
  className: string;
  label: React.ReactNode;
  onDone?: () => void;
  onError?: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const replace = useCV((s) => s.replace);
  return (
    <>
      <button type="button" className={className} onClick={() => input.current?.click()}>
        {label}
      </button>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file || file.size > 2_000_000) return onError?.();
          try {
            const cv = parseCV(JSON.parse(await file.text()));
            if (!cv) return onError?.();
            replace(cv);
            onDone?.();
          } catch {
            onError?.();
          }
        }}
      />
    </>
  );
}
