"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type ReplyNotification = {
  id: number;
  subject: string;
  admin_reply: string;
  replied_at: string | null;
  admin_reply_read_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "日時不明";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<ReplyNotification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/contact_inquiries/replies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("通知の取得に失敗しました");
        const data = (await res.json()) as {
          unread_count: number;
          inquiries: ReplyNotification[];
        };

        setNotifications(data.inquiries);

        if (data.unread_count > 0) {
          await fetch(`${API_BASE_URL}/api/contact_inquiries/mark_replies_as_read`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          window.dispatchEvent(new Event("contact-replies-read"));
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "通知の取得に失敗しました");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">通知</h1>
        <p className="mb-6 text-sm text-stone-500">お問い合わせへの管理者返信を表示します。</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-stone-500">読み込み中...</p>
        ) : notifications.length === 0 ? (
          <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
            新しい通知はありません。
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <article key={item.id} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-xs text-stone-500">{formatDate(item.replied_at)}</p>
                <h2 className="mt-1 text-sm font-semibold text-stone-800">{item.subject}</h2>
                <div className="mt-3 rounded-lg bg-white px-3 py-3 text-sm leading-relaxed text-stone-700">
                  {item.admin_reply}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
