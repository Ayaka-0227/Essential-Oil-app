"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import HamburgerMenu from "@/components/HamburgerMenu";
import {
  buildMessage,
  calcScores,
  CHART_ORDER,
  extractTopCategories,
} from "@/lib/mental-check";

const MentalRadarChart = dynamic(() => import("@/components/MentalRadarChart"), {
  ssr: false,
});

// ─────────────────────────────────────────────
// ページ本体
// ─────────────────────────────────────────────
function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const scores = calcScores(params);
  const tops = extractTopCategories(scores);
  const message = buildMessage(tops, scores);

  // レーダーチャート用スコア（軸順に並べ替え）
  const chartScores = CHART_ORDER.map((k) => scores[k]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-lg">

        {/* 見出し */}
        <h1 className="mb-1 text-center text-2xl font-semibold tracking-tight">
          あなたの今の状態
        </h1>
        <p className="mb-6 text-center text-xs text-stone-400">
          過去7日間を基準にしたメンタルチェックの結果です
        </p>

        {/* レーダーチャート */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <MentalRadarChart scores={chartScores} />
        </div>

        {/* チャート説明 */}
        <p className="mt-4 text-center text-xs leading-relaxed text-stone-500">
          このチャートは今の心と身体のバランスを表しています。<br />
          外側に広がるほど、今は出やすい状態です。
        </p>

        {/* 状態メッセージ */}
        <div className="mt-6 rounded-2xl bg-white px-6 py-5 shadow-sm">
          {message.split("\n").map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-stone-700">
              {line}
            </p>
          ))}
        </div>

        {/* 香りへの繋ぎ */}
        <div className="mt-6 rounded-2xl bg-teal-50 px-6 py-5">
          <p className="text-sm leading-relaxed text-teal-900">
            この状態を整える香りはいくつか考えられます。<br />
            今日はどんな香りに包まれたいですか？
          </p>
        </div>

        {/* next → ボタン */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const sp = params.toString();
              router.push(`/check/scent?${sp}`);
            }}
            className="rounded-full bg-teal-800 px-8 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-teal-900 hover:scale-105 active:scale-95"
          >
            次へ →
          </button>
        </div>

      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
