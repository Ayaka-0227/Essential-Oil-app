"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MentalCheckHistoryEntry } from "@/lib/mental-check-storage";
import { API_BASE_URL } from "@/lib/api";

const FEEDBACK_OPTIONS = [
  { value: "good", label: "良かった" },
  { value: "normal", label: "普通" },
  { value: "bad", label: "合わなかった" },
] as const;

const FEEDBACK_LABEL: Record<"good" | "normal" | "bad", string> = {
  good: "良かった",
  normal: "普通",
  bad: "合わなかった",
};

function formatDate(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "日付不明";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function HistorySection() {
  const [history, setHistory] = useState<MentalCheckHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveMessageById, setSaveMessageById] = useState<Record<string, string>>({});

  const fetchHistory = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/mental_check_results`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const converted: MentalCheckHistoryEntry[] = data.map((item: any) => ({
          id: String(item.id),
          createdAt: item.created_at,
          scores: {
            stress: item.stress,
            anxiety: item.anxiety,
            fatigue: item.fatigue,
            sleep: item.sleep,
            emotion: item.emotion,
            vitality: item.vitality,
            mood: item.mood,
            concentration: item.concentration,
          },
          topCategoryLabels: [],
          scentTypeKey: null,
          scentTypeLabel: null,
          scentPrompt: null,
          recommendedOilName: item.recommended_oil?.name || "不明",
          recommendedOilDescription: item.recommended_oil?.description || "",
          recommendedOilEffect: "",
          feedback: item.feedback || undefined,
        }));
        setHistory(converted);
      }
    } catch {
      // エラー時は空のまま
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const hasHistory = useMemo(() => history.length > 0, [history]);

  const handleFeedback = (
    id: string,
    feedback: "good" | "normal" | "bad",
  ) => {
    setSaveMessageById((prev) => ({ ...prev, [id]: "" }));
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, feedback } : entry)),
    );
  };

  const handleRegisterFeedback = async (id: string) => {
    const entry = history.find((item) => item.id === id);
    if (!entry?.feedback) {
      setSaveMessageById((prev) => ({ ...prev, [id]: "感想を選択してください" }));
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      setSaveMessageById((prev) => ({ ...prev, [id]: "ログイン情報がありません" }));
      return;
    }

    setSavingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/mental_check_results/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          mental_check_result: {
            feedback: entry.feedback,
          },
        }),
      });

      if (!res.ok) {
        setSaveMessageById((prev) => ({ ...prev, [id]: "登録に失敗しました" }));
        return;
      }

      const updated = await res.json();
      if (updated.feedback !== entry.feedback) {
        setSaveMessageById((prev) => ({ ...prev, [id]: "保存確認に失敗しました" }));
        return;
      }

      setSaveMessageById((prev) => ({ ...prev, [id]: "登録しました" }));
      await fetchHistory();
    } catch {
      setSaveMessageById((prev) => ({ ...prev, [id]: "登録に失敗しました" }));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="bg-[#f7f6f2] px-4 py-8 text-stone-800 sm:px-6 sm:py-12 md:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-stone-200/50 sm:p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">
            過去の結果
          </h2>

          {loading ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500 sm:px-6 sm:py-8">
              読み込み中...
            </div>
          ) : !hasHistory ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500 sm:px-6 sm:py-8">
              まだ記録がありません。メンタルチェック後の結果がここに表示されます。
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-stone-100 bg-white p-5 sm:p-7"
                >
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-stone-500">
                      {formatDate(entry.createdAt)}
                    </p>
                    <p className="break-words text-base font-bold leading-relaxed sm:text-lg">
                      おすすめ: {entry.recommendedOilName}
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <p className="mb-2 text-sm font-semibold text-stone-700">
                      使用した時の感想を選んでください。
                    </p>
                    <p className="mb-4 text-xs text-stone-500">
                      記録: {entry.feedback ? FEEDBACK_LABEL[entry.feedback] : "未記録"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                      {FEEDBACK_OPTIONS.map((option) => {
                        const selected = entry.feedback === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFeedback(entry.id, option.value)}
                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:px-6 sm:py-2.5 ${
                              selected
                                ? "bg-[#1f635c] text-white"
                                : "bg-[#f7f6f2] text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleRegisterFeedback(entry.id)}
                        disabled={savingId === entry.id}
                        className="ml-[2cm] rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-2.5"
                      >
                        {savingId === entry.id ? "登録中..." : "登録"}
                      </button>
                    </div>

                    {saveMessageById[entry.id] ? (
                      <p className="mt-3 text-xs text-stone-500">{saveMessageById[entry.id]}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}