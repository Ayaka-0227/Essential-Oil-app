"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact_inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contact_inquiry: {
            subject,
            message,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data.errors?.[0] || "お問い合わせの送信に失敗しました。";
        throw new Error(err);
      }

      setSubject("");
      setMessage("");
      setSuccess(data.message || "お問い合わせを送信しました。");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "お問い合わせの送信に失敗しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">お問い合わせ</h1>
        <p className="mb-6 text-sm text-stone-500">ご不明点やご要望をお送りください。</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          {success && <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700">{success}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium">件名</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
              placeholder="例: ログインについて"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">本文</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={5000}
              required
              rows={8}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
              placeholder="お問い合わせ内容をご記入ください"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
          >
            {sending ? "送信中..." : "送信する"}
          </button>
        </form>
      </div>
    </main>
  );
}
