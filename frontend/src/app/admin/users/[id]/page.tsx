"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type MentalCheckHistory = {
  id: number;
  created_at: string;
  stress: number | null;
  anxiety: number | null;
  fatigue: number | null;
  sleep: number | null;
  emotion: number | null;
  vitality: number | null;
  mood: number | null;
  concentration: number | null;
  feedback: string | null;
  recommended_oil: {
    id: number;
    name: string;
    description: string;
  } | null;
};

type UserDetail = {
  id: number;
  name: string | null;
  email: string;
  gender: string | null;
  birth_date: string | null;
  admin: boolean;
  created_at: string;
  mental_check_results: MentalCheckHistory[];
};

const FEEDBACK_LABEL: Record<string, string> = {
  good: "良かった",
  normal: "普通",
  bad: "合わなかった",
};

const GENDER_LABEL: Record<string, string> = {
  male: "男性",
  female: "女性",
  other: "その他",
};

function formatDate(value: string | null | undefined) {
  if (!value) return "未登録";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未登録";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (localStorage.getItem("is_admin") !== "true") {
      router.push("/");
      return;
    }

    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 404) throw new Error("ユーザーが見つかりません");
        if (!r.ok) throw new Error("ユーザー詳細の取得に失敗しました");
        return r.json();
      })
      .then((data: UserDetail) => setUser(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-teal-700 hover:text-teal-800"
          >
            一覧に戻る
          </button>
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight">ユーザー詳細</h1>

        {loading && <p className="text-sm text-stone-400">読み込み中...</p>}
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {user && !loading && !error && (
          <>
            <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
              <div className="space-y-1">
                <p className="text-sm"><span className="font-semibold">氏名:</span> {user.name?.trim() || "未登録"}</p>
                <p className="text-sm"><span className="font-semibold">アドレス:</span> {user.email}</p>
                <p className="text-sm"><span className="font-semibold">性別:</span> {user.gender ? (GENDER_LABEL[user.gender] || user.gender) : "未登録"}</p>
                <p className="text-sm"><span className="font-semibold">生年月日:</span> {formatDate(user.birth_date)}</p>
                <p className="text-sm"><span className="font-semibold">登録日:</span> {formatDate(user.created_at)}</p>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold">過去のメンタルチェック結果</h2>

              {user.mental_check_results.length === 0 ? (
                <p className="text-sm text-stone-500">メンタルチェック結果はありません。</p>
              ) : (
                <div className="space-y-3">
                  {user.mental_check_results.map((result) => (
                    <article key={result.id} className="rounded-xl border border-stone-200 p-3">
                      <p className="text-xs text-stone-500">実施日: {formatDate(result.created_at)}</p>
                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        推奨オイル: {result.recommended_oil?.name || "未設定"}
                      </p>
                      <p className="mt-1 text-xs text-stone-600">
                        フィードバック: {result.feedback ? (FEEDBACK_LABEL[result.feedback] || result.feedback) : "未登録"}
                      </p>

                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-stone-600">
                        <span>Stress: {result.stress ?? "-"}</span>
                        <span>Anxiety: {result.anxiety ?? "-"}</span>
                        <span>Fatigue: {result.fatigue ?? "-"}</span>
                        <span>Sleep: {result.sleep ?? "-"}</span>
                        <span>Emotion: {result.emotion ?? "-"}</span>
                        <span>Vitality: {result.vitality ?? "-"}</span>
                        <span>Mood: {result.mood ?? "-"}</span>
                        <span>Concentration: {result.concentration ?? "-"}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
