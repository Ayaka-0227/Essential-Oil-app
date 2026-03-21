"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { apiUrl } from "@/lib/api";

type User = { id: number; email: string; admin: boolean; created_at: string };

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }

    fetch(apiUrl("/admin/users"), {
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
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">ユーザー管理</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-center text-sm text-stone-400">読み込み中...</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl bg-white px-5 py-4 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-800">{user.email}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    ID: {user.id} ・ 登録: {new Date(user.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>
                {user.admin && (
                  <span className="shrink-0 rounded-full bg-teal-100 px-3 py-0.5 text-xs font-semibold text-teal-700">
                    管理者
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
