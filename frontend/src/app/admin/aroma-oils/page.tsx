"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type AromaOil = { id: number; name: string; description: string };

export default function AdminAromaOilsPage() {
  const router = useRouter();
  const [oils, setOils] = useState<AromaOil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    if (localStorage.getItem("is_admin") !== "true") { router.push("/"); return; }

    fetch(`${API_BASE_URL}/admin/aroma_oils`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 403) throw new Error("管理者権限が必要です");
        if (!r.ok) throw new Error("取得に失敗しました");
        return r.json();
      })
      .then(setOils)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    setDeleteError("");
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`${API_BASE_URL}/admin/aroma_oils/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token ?? ""}` },
    });
    if (res.ok) {
      setOils((prev) => prev.filter((o) => o.id !== id));
    } else {
      setDeleteError("削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">アロマオイル一覧</h1>

        <button
          type="button"
          onClick={() => router.push("/admin/aroma-oils/new")}
          className="mb-6 rounded-full bg-teal-800 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teal-900"
        >
          ＋ 追加
        </button>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        {deleteError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{deleteError}</p>}

        {loading ? (
          <p className="text-center text-sm text-stone-400">読み込み中...</p>
        ) : (
          <div className="space-y-3">
            {oils.map((oil) => (
              <div
                key={oil.id}
                className="rounded-2xl bg-white px-5 py-4 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800">{oil.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500 line-clamp-2">{oil.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/aroma-oils/${oil.id}/edit`)}
                    className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200 transition"
                  >
                    更新
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(oil.id, oil.name)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
