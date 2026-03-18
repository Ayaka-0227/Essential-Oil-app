"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/users/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email: loginEmail, password: loginPassword } }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "ログインに失敗しました。");
      }

      const data = await res.json();
      // JWTトークンをローカルストレージに保存
      let isAdmin = false;
      if (data.auth_token) {
        // 新しいユーザーでログインするため、前のデータをクリア
        localStorage.clear();
        localStorage.setItem("auth_token", data.auth_token);
        if (data.user?.admin) {
          isAdmin = true;
          localStorage.setItem("is_admin", "true");
        }
      }

      router.push(isAdmin ? "/admin" : "/history");
    } catch (e: unknown) {
      setLoginError(e instanceof Error ? e.message : "ログインに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-12 text-stone-800">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">ログイン</h1>
        <p className="mb-8 text-sm text-stone-500">
          登録済みのメールアドレスとパスワードを入力してください。
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
              placeholder="8文字以上"
            />
          </div>

          {loginError && (
            <p className="text-sm text-red-500">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal-800 px-5 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
          >
            {loading ? "ログイン中..." : "ログインする"}
          </button>
        </form>
      </div>
    </main>
  );
}

