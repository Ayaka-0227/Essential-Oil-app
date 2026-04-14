"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true");
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(`${API_BASE_URL}/users/sign_out`, {
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
        className={`fixed right-0 top-0 z-50 h-full w-56 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-stone-100">
          <span className="text-sm font-semibold text-stone-700">メニュー</span>
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
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/admin");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              管理者
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/account");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            アカウント
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/contact");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            お問い合わせ
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            ログアウト
          </button>
        </nav>
      </aside>
    </>
  );
}
