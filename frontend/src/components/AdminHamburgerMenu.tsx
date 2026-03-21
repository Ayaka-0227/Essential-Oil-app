"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

export default function AdminHamburgerMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(apiUrl("/users/sign_out"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // エラーでもローカルをクリアしてTop画面へ
    } finally {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="メニューを開く"
        className="fixed right-4 top-4 z-40 flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full bg-white shadow-md transition hover:bg-stone-50"
      >
        <span className="block h-[2px] w-5 bg-stone-700" />
        <span className="block h-[2px] w-5 bg-stone-700" />
        <span className="block h-[2px] w-5 bg-stone-700" />
      </button>

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* スライドパネル */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-60 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-5">
          <span className="text-sm font-bold tracking-wide text-teal-700">管理者</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="メニューを閉じる"
            className="text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 pt-4 space-y-1">
          {/* アロマオイルセクション */}
          <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
            アロマオイル
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/aroma-oils")}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
          >
            一覧
          </button>

          {/* ユーザー管理 */}
          <div className="pt-3 border-t border-stone-100 mt-3" />

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            ユーザー管理
          </button>

          {/* ログアウト */}
          <div className="pt-3 border-t border-stone-100 mt-3" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            ログアウト
          </button>
        </nav>
      </aside>
    </>
  );
}
