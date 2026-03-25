"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import HamburgerMenu from "@/components/HamburgerMenu";
import { API_BASE_URL } from "@/lib/api";
import {
  buildMessage,
  calcScores,
  CHART_ORDER,
  extractTopCategories,
  getFinalOilRecommendation,
} from "@/lib/mental-check";

const MentalRadarChart = dynamic(() => import("@/components/MentalRadarChart"), {
  ssr: false,
});

// オイル名からIDを取得するマッピング
const OIL_NAME_TO_ID: Record<string, number> = {
  "ラベンダー": 1,
  "オレンジ": 2,
  "グレープフルーツ": 3,
  "タンジェリン": 4,
  "レモン": 5,
  "ベルガモット": 6,
  "プチグレイン": 7,
  "カモミールローマン": 8,
  "ジャーマンカモミール": 9,
  "ジャスミン": 10,
  "ゼラニウム": 11,
  "バニラ": 12,
  "フランキンセンス": 13,
  "サンダルウッド": 14,
  "シスタス": 15,
  "クローブ": 16,
  "ジンジャー": 17,
  "ブラックペッパー": 18,
  "バジル": 19,
  "ローズマリー": 20,
  "ペパーミント": 21,
  "スペアミント": 22,
  "ヒノキ": 23,
};

function RecommendationContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [saveMessage, setSaveMessage] = useState("保存準備中");
  const savedRef = useRef(false);
  const queryString = useMemo(() => params.toString(), [params]);
  const scentKey = params.get("scent");
  const hasScoreParams = useMemo(
    () => Array.from({ length: 16 }, (_, index) => params.has(String(index + 1))),
    [params],
  );
  const hasRequiredParams = hasScoreParams.every(Boolean) && Boolean(scentKey);

  const scores = useMemo(() => calcScores(params), [queryString, params]);
  const chartScores = useMemo(() => CHART_ORDER.map((key) => scores[key]), [scores]);
  const tops = useMemo(() => extractTopCategories(scores), [scores]);
  const message = useMemo(() => buildMessage(tops, scores), [tops, scores]);
  const recommendation = useMemo(
    () => getFinalOilRecommendation(scores, scentKey),
    [scores, scentKey],
  );
  const { scentType, topCandidates, finalOil } = recommendation;

  useEffect(() => {
    if (!finalOil) {
      return;
    }

    if (savedRef.current) return;
    savedRef.current = true;

    // サーバーに保存
    const saveToServer = async () => {
      const errorMsg = "サーバー保存に失敗しました";
      try {
        const oilId = OIL_NAME_TO_ID[finalOil.name] || null;
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        const res = await fetch(`${API_BASE_URL}/api/mental_check_results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({
            mental_check_result: {
              stress: scores.stress,
              anxiety: scores.anxiety,
              fatigue: scores.fatigue,
              sleep: scores.sleep,
              emotion: scores.emotion,
              vitality: scores.vitality,
              mood: scores.mood,
              concentration: scores.concentration,
              recommended_oil_id: oilId,
            },
          }),
        });
        setSaveMessage(res.ok ? "結果をサーバーに保存しました" : errorMsg);
      } catch {
        setSaveMessage(errorMsg);
      }
    };

    // サーバーにのみ保存
    saveToServer();
  }, [finalOil, queryString, scores, scentType, tops]);

  if (!finalOil || !hasRequiredParams) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
        <HamburgerMenu />
        <div className="mx-auto w-full max-w-lg rounded-2xl bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            おすすめ表示に必要なデータが不足しています。質問と香りの選択から進んでください。
          </p>
          <button
            type="button"
            onClick={() => router.push(`/check/scent?${queryString}`)}
            className="mt-6 rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white"
          >
            香り選択へ戻る
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          おすすめの香り
        </h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-stone-600">
          今の状態と選んでいただいた香りのタイプをもとに、最も合うおすすめを1つ選びました。
        </p>
        <p className="mb-6 text-center text-xs text-stone-400">{saveMessage}</p>

        <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-xs font-semibold tracking-[0.24em] text-teal-700">RECOMMENDATION</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-800">{finalOil.name}</h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-700">
            {finalOil.description}
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <MentalRadarChart scores={chartScores} />
        </div>

        <div className="mt-6 rounded-2xl bg-white px-6 py-5 shadow-sm">
          {message.split("\n").map((line, index) => (
            <p key={index} className="text-sm leading-relaxed text-stone-700">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-teal-50 px-6 py-5">
          <p className="text-sm leading-relaxed text-teal-900">
            今日選んだ、
            {scentType ? `「${scentType.prompt}」` : "選択した香りタイプ"}
            という好みともよく一致しています。
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-800">候補一覧</h2>
            <span className="text-xs text-stone-400">比較用</span>
          </div>
          <div className="space-y-3">
            {topCandidates
              .filter((candidate) => candidate.name !== finalOil.name)
              .slice(0, 3)
              .map((candidate, index) => (
              <div
                key={candidate.name}
                className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-stone-800">
                  {index + 1}. {candidate.name}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  {candidate.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="rounded-full bg-teal-800 px-8 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-teal-900 hover:scale-105 active:scale-95"
          >
            過去の結果を見る
          </button>
        </div>
      </div>
    </main>
  );
}

export default function RecommendationPage() {
  return (
    <Suspense>
      <RecommendationContent />
    </Suspense>
  );
}
