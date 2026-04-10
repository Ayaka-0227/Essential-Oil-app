"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

function translateAuthError(message: string): string {
  const normalized = message.trim();

  if (/invalid\s+email\s+or\s+password/i.test(normalized)) {
    return 'メールアドレスまたはパスワードが正しくありません。';
  }

  if (/you\s+need\s+to\s+sign\s+in\s+or\s+sign\s+up\s+before\s+continuing/i.test(normalized)) {
    return '続行するにはログインまたは新規登録してください。';
  }

  return normalized;
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ user: { email: loginEmail, password: loginPassword } }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const backendMessage = data.error ?? data.errors?.[0] ?? 'ログインに失敗しました。';
        throw new Error(translateAuthError(backendMessage));
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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 pr-10 outline-none transition focus:border-teal-700"
                placeholder="8文字以上"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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

