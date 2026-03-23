"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name,
            gender,
            birth_date: birthDate || null,
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        const messages: string[] = data?.errors ?? [];
        setError(messages.length > 0 ? messages.join('、') : '登録に失敗しました。入力内容をご確認ください。');
      }
    } catch {
      setError('サーバーに接続できませんでした。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-12 text-stone-800">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">新規登録</h1>
        <p className="mb-8 text-sm text-stone-500">
          アカウントを作成をお願いします。
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              氏名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
              placeholder="例: 山田 花子"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div>
            <label htmlFor="passwordConfirmation" className="mb-2 block text-sm font-medium">
              パスワード（確認）
            </label>
            <div className="relative">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 pr-10 outline-none transition focus:border-teal-700"
                placeholder="もう一度入力してください"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
                aria-label={showPasswordConfirmation ? 'パスワードを隠す' : 'パスワードを表示する'}
              >
                {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium">性別</legend>
            <div className="flex gap-6">
              <label htmlFor="gender-male" className="inline-flex items-center gap-2 text-sm text-stone-700">
                <input
                  id="gender-male"
                  name="gender"
                  type="radio"
                  value="male"
                  autoComplete="sex"
                  required
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-4 w-4 border-stone-300 text-teal-700 focus:ring-teal-700"
                />
                男性
              </label>
              <label htmlFor="gender-female" className="inline-flex items-center gap-2 text-sm text-stone-700">
                <input
                  id="gender-female"
                  name="gender"
                  type="radio"
                  value="female"
                  autoComplete="sex"
                  required
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-4 w-4 border-stone-300 text-teal-700 focus:ring-teal-700"
                />
                女性
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="birthDate" className="mb-2 block text-sm font-medium">
              生年月日
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              autoComplete="bday"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal-800 px-5 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
          >
            {loading ? '登録中...' : 'アカウントを作成'}
          </button>
        </form>
      </div>
    </main>
  );
}
