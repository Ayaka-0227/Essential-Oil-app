"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import { API_BASE_URL } from "@/lib/api";

type AccountUser = {
  id: number;
  name: string | null;
  email: string;
  gender: string | null;
  birth_date: string | null;
  admin: boolean;
};

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
] as const;

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("other");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/account`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("アカウント情報の取得に失敗しました。");
        return res.json();
      })
      .then((user: AccountUser) => {
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        if (user.gender === "male" || user.gender === "female" || user.gender === "other") {
          setGender(user.gender);
        }
        setBirthDate(user.birth_date ?? "");
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "アカウント情報の取得に失敗しました。");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== passwordConfirmation) {
      setError("パスワード確認が一致しません。");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/account`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            name,
            email,
            gender,
            birth_date: birthDate,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.errors?.[0] || "更新に失敗しました。";
        throw new Error(message);
      }

      setPassword("");
      setPasswordConfirmation("");
      setSuccess(data.message || "アカウント情報を更新しました。");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <HamburgerMenu />
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">アカウント設定</h1>
        <p className="mb-6 text-sm text-stone-500">氏名、メールアドレス、パスワード、性別、生年月日を変更できます。</p>

        {loading ? (
          <p className="text-sm text-stone-500">読み込み中...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            {success && <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700">{success}</p>}

            <div>
              <label className="mb-1 block text-sm font-medium">氏名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">生年月日</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">新しいパスワード（変更時のみ）</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
                placeholder="8文字以上"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">新しいパスワード（確認）</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
                placeholder="8文字以上"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
              >
                {saving ? "更新中..." : "更新する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
