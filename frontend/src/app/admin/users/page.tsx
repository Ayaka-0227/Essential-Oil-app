"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type User = {
  id: number;
  name: string | null;
  email: string;
  gender: string | null;
  birth_date: string | null;
  admin: boolean;
  created_at: string;
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

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    if (localStorage.getItem("is_admin") !== "true") { router.push("/"); return; }

    fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 403) throw new Error("管理者権限が必要です");
        if (!r.ok) throw new Error("取得に失敗しました");
        return r.json();
      })
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">ユーザー管理</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <section className="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
          <h2 className="mb-3 text-lg font-semibold">ユーザー一覧（新規登録順）</h2>
          <p className="mb-4 text-xs text-stone-500">氏名を選択すると詳細ページへ移動します。</p>

          {loading ? (
            <p className="text-center text-sm text-stone-400">読み込み中...</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => {
                return (
                  <div
                    key={user.id}
                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 transition hover:border-teal-300"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      <p className="text-base font-semibold text-stone-800 hover:text-teal-800">
                        {user.name?.trim() || "未登録"}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        ID: {user.id} ・ 登録: {formatDate(user.created_at)}
                      </p>
                    </button>

                    {user.admin && (
                      <span className="mt-2 inline-flex rounded-full bg-teal-100 px-3 py-0.5 text-xs font-semibold text-teal-700">
                        管理者
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
