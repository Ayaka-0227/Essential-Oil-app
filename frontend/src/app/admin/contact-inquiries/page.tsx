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
  admin_reply: string | null;
  replied_at: string | null;
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
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

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
      .then((data: ContactInquiry[]) => {
        setInquiries(data);
        setReplyDrafts(
          Object.fromEntries(data.map((inquiry) => [inquiry.id, ""]))
        );
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleReply = async (inquiryId: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const reply = (replyDrafts[inquiryId] ?? "").trim();
    if (!reply) {
      setSaveError("返信内容を入力してください");
      return;
    }

    setSaveError("");
    setSavingId(inquiryId);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/contact_inquiries/${inquiryId}/reply`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_inquiry: {
            admin_reply: reply,
          },
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = Array.isArray(body.errors) ? body.errors[0] : "返信の保存に失敗しました";
        throw new Error(message);
      }

      const updatedInquiry = body as ContactInquiry;
      setInquiries((prev) => prev.map((item) => (item.id === inquiryId ? updatedInquiry : item)));
      setReplyDrafts((prev) => ({ ...prev, [inquiryId]: "" }));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "返信の保存に失敗しました");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">お問い合わせ管理</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        {saveError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</p>}

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
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      inquiry.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {inquiry.status === "done" ? "返信済み" : "未返信"}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-stone-800">{inquiry.subject}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{inquiry.message}</p>
                <p className="mt-3 text-xs text-stone-500">
                  送信者: {inquiry.user.name?.trim() || "未登録"} ({inquiry.user.email})
                </p>

                {inquiry.admin_reply && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <p className="text-xs font-semibold text-emerald-700">
                      管理者返信 {inquiry.replied_at ? `(${formatDate(inquiry.replied_at)})` : ""}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed">{inquiry.admin_reply}</p>
                  </div>
                )}

                <div className="mt-4 border-t border-stone-100 pt-4">
                  <label htmlFor={`reply-${inquiry.id}`} className="block text-xs font-semibold tracking-wide text-stone-600">
                    管理者返信
                  </label>
                  <textarea
                    id={`reply-${inquiry.id}`}
                    value={replyDrafts[inquiry.id] ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [inquiry.id]: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="返信内容を入力してください"
                    className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm leading-relaxed text-stone-800 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleReply(inquiry.id)}
                      disabled={savingId === inquiry.id}
                      className="rounded-full bg-teal-800 px-5 py-2 text-xs font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingId === inquiry.id ? "返信中..." : "返信する"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
