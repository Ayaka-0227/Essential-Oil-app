"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

const QUESTIONS = [
  { id: 1, text: "ふとした時に、肩やあごに力が入っていることはありますか？" },
  { id: 2, text: "呼吸が浅いと感じることがありますか？" },
  { id: 3, text: "何もしていなくても、疲れを感じることがありますか？" },
  { id: 4, text: "しっかり休んでも、体が重たいと感じることはありますか？" },
  { id: 5, text: "気持ちが落ち着かず、そわそわすることがありますか？" },
  { id: 6, text: "先のことを考えると少し落ち着かない気持ちになることはありますか？" },
  { id: 7, text: "夜、寝つくまでに時間がかかることがありますか？" },
  { id: 8, text: "夜中や早朝に目が覚めることはありますか？" },
  { id: 9, text: "気持ちを切り替えるのに時間がかかることはありますか？" },
  { id: 10, text: "思っていることを、つい心の中に溜めてしまうことはありますか？" },
  { id: 11, text: "何かを始める前に少し腰が重いと感じることはありますか？" },
  { id: 12, text: "以前よりもやる気が出にくいと感じることはありますか？" },
  { id: 13, text: "楽しいはずのことでも気持ちが動きにくいことはありますか？" },
  { id: 14, text: "気分が沈む時間が少し増えたと感じることはありますか？" },
  { id: 15, text: "目の前のことに集中しづらいと感じることはありますか？" },
  { id: 16, text: "頭がぼーっとする時間が増えたと感じることはありますか？" },
];

const ANSWER_OPTIONS = [
  { label: "当てはまらない",    score: 0 },
  { label: "あまりない",        score: 1 },
  { label: "どちらともいえない", score: 2 },
  { label: "少しある",          score: 3 },
  { label: "よくある",          score: 4 },
];

const PER_PAGE = 4;
const TOTAL_PAGES = QUESTIONS.length / PER_PAGE; // 4

export default function QuestionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const hasMountedRef = useRef(false);

  const pageQuestions = QUESTIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const allAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);
  const isLastPage = page === TOTAL_PAGES - 1;

  const handleAnswer = (id: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [id]: score }));
  };

  const handleNext = () => {
    if (!allAnswered) return;
    if (isLastPage) {
      const params = new URLSearchParams(
        Object.entries(answers).map(([k, v]) => [k, String(v)])
      );
      router.push(`/check/result?${params.toString()}`);
    } else {
      setPage((p) => p + 1);
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage((p) => p - 1);
    }
  };

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-lg">

        {/* プログレスドット */}
        <div className="mb-2 flex justify-center gap-3">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                i <= page ? "bg-teal-800" : "bg-stone-200"
              }`}
            />
          ))}
        </div>
        <p className="mb-8 text-center text-xs text-stone-400">
          {page + 1}&nbsp;/&nbsp;{TOTAL_PAGES}&nbsp;ページ
        </p>

        {/* 質問カード */}
        <div className="space-y-6">
          {pageQuestions.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-semibold leading-relaxed text-stone-700">
                Q{q.id}.&nbsp;{q.text}
              </p>
              <div className="flex flex-col gap-2">
                {ANSWER_OPTIONS.map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => handleAnswer(q.id, opt.score)}
                    className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                      answers[q.id] === opt.score
                        ? "border-teal-800 bg-teal-800 text-white"
                        : "border-stone-100 bg-stone-50 text-stone-700 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ナビゲーション */}
        <div className="mt-8 flex items-center justify-between">
          {page > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-stone-300 px-6 py-3 text-sm text-stone-600 transition-all hover:bg-stone-100"
            >
              ← 戻る
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!allAnswered}
            className={`rounded-full px-8 py-3 text-sm font-semibold shadow transition-all ${
              allAnswered
                ? "bg-teal-800 text-white hover:bg-teal-900 hover:scale-105 active:scale-95"
                : "cursor-not-allowed bg-stone-200 text-stone-400"
            }`}
          >
            {isLastPage ? "結果を見る" : "next →"}
          </button>
        </div>

      </div>
    </main>
  );
}
