export type MentalCheckHistoryEntry = {
  id: string;
  createdAt: string;
  scores: Record<string, number>;
  topCategoryLabels: string[];
  scentTypeKey: string | null;
  scentTypeLabel: string | null;
  scentPrompt: string | null;
  recommendedOilName: string;
  recommendedOilDescription: string;
  recommendedOilEffect: string;
  feedback?: "good" | "normal" | "bad";
};

const STORAGE_KEY = "essential-oil-history";
const SESSION_KEY_PREFIX = "essential-oil-history-saved:";

export function saveMentalCheckHistory(
  entry: MentalCheckHistoryEntry,
  dedupeKey: string,
) {
  if (typeof window === "undefined") {
    return { saved: false };
  }

  const sessionKey = `${SESSION_KEY_PREFIX}${dedupeKey}`;
  if (window.sessionStorage.getItem(sessionKey)) {
    return { saved: true };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const history = raw ? (JSON.parse(raw) as MentalCheckHistoryEntry[]) : [];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([entry, ...history].slice(0, 50)),
  );
  window.sessionStorage.setItem(sessionKey, "1");

  return { saved: true };
}

export function getMentalCheckHistory(): MentalCheckHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as MentalCheckHistoryEntry[];
  } catch {
    return [];
  }
}

export function updateMentalCheckFeedback(
  id: string,
  feedback: "good" | "normal" | "bad",
) {
  if (typeof window === "undefined") {
    return { updated: false };
  }

  const history = getMentalCheckHistory();
  const updated = history.map((entry) =>
    entry.id === id ? { ...entry, feedback } : entry,
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { updated: true };
}