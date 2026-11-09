import Dexie, { type Table } from "dexie";
import type { CV } from "./types";

class CVDatabase extends Dexie {
  cvs!: Table<CV, string>;

  constructor() {
    super("cv-builder");
    this.version(1).stores({ cvs: "id" });
  }
}

let db: CVDatabase | null = null;

function getDb(): CVDatabase | null {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") return null;
  if (!db) db = new CVDatabase();
  return db;
}

export async function loadCV(): Promise<CV | null> {
  try {
    return (await getDb()?.cvs.get("current")) ?? null;
  } catch {
    return null;
  }
}

export async function saveCV(cv: CV): Promise<boolean> {
  try {
    const d = getDb();
    if (!d) return false;
    await d.cvs.put(cv);
    return true;
  } catch {
    return false;
  }
}
