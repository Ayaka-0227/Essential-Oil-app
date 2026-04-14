"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type ContactInquiry = {
  id: number;
  subject: string;
  message: string;
  status: "new" | "done";
  created_at: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
};

function formatDate(value: string) {
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

export default function AdminContactInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
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

    fetch(`${API_BASE_URL}/admin/contact_inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 403) throw new Error("管理者権限が必要です");
        if (!r.ok) throw new Error("取得に失敗しました");
        return r.json();
      })
      .then(setInquiries)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">お問い合わせ管理</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-center text-sm text-stone-400">読み込み中...</p>
        ) : inquiries.length === 0 ? (
          <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
            お問い合わせはまだありません。
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span>ID: {inquiry.id}</span>
                  <span>・</span>
                  <span>{formatDate(inquiry.created_at)}</span>
                </div>
                <h2 className="text-base font-semibold text-stone-800">{inquiry.subject}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{inquiry.message}</p>
                <p className="mt-3 text-xs text-stone-500">
                  送信者: {inquiry.user.name?.trim() || "未登録"} ({inquiry.user.email})
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
