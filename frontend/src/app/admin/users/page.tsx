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
  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchEmailInput, setSearchEmailInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async (token: string, nameValue: string, emailValue: string) => {
    const nameQuery = nameValue.trim();
    const emailQuery = emailValue.trim();
    const searchParams = new URLSearchParams();
    if (nameQuery) searchParams.set("name", nameQuery);
    if (emailQuery) searchParams.set("email", emailQuery);
    // Add a timestamp to avoid stale browser/proxy cache on admin list.
    searchParams.set("_ts", Date.now().toString());
    const endpoint = `${API_BASE_URL}/admin/users?${searchParams.toString()}`;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (response.status === 403) throw new Error("管理者権限が必要です");
      if (!response.ok) throw new Error("取得に失敗しました");

      const data = (await response.json()) as User[];
      setUsers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    if (localStorage.getItem("is_admin") !== "true") { router.push("/"); return; }

    void fetchUsers(token, searchName, searchEmail);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState !== "visible") return;
      void fetchUsers(token, searchName, searchEmail);
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [router, searchName, searchEmail]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchName(searchNameInput.trim());
    setSearchEmail(searchEmailInput.trim());
  };

  const clearSearch = () => {
    setSearchNameInput("");
    setSearchEmailInput("");
    setSearchName("");
    setSearchEmail("");
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">ユーザー管理</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <section className="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
          <h2 className="mb-3 text-lg font-semibold">ユーザー一覧（新規登録順）</h2>
          <p className="mb-4 text-xs text-stone-500">氏名・メールアドレスを別々に指定して検索できます。氏名を選択すると詳細ページへ移動します。</p>

          <form className="mb-4 flex items-end gap-2 overflow-x-auto" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchNameInput}
              onChange={(e) => setSearchNameInput(e.target.value)}
              placeholder="氏名で検索"
              className="w-1/2 min-w-[180px] rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
            />
            <input
              type="text"
              value={searchEmailInput}
              onChange={(e) => setSearchEmailInput(e.target.value)}
              placeholder="メールアドレスで検索"
              className="w-2/3 min-w-[220px] rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900"
            >
              検索
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="shrink-0 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-teal-700 hover:text-teal-800"
            >
              クリア
            </button>
          </form>

          {(searchName || searchEmail) && (
            <p className="mb-4 text-xs text-stone-500">
              検索条件: 氏名={searchName || "(未指定)"} / メール={searchEmail || "(未指定)"}
            </p>
          )}

          {loading ? (
            <p className="text-center text-sm text-stone-400">読み込み中...</p>
          ) : (
            <div className="space-y-3">
              {users.length === 0 && (
                <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
                  該当するユーザーが見つかりませんでした。
                </p>
              )}
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
