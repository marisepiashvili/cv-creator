"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useUI.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
