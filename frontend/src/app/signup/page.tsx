"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const gender = (form.elements.namedItem('gender') as HTMLInputElement | null)?.value ?? '';
    const birthDate = (form.elements.namedItem('birthDate') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const passwordConfirmation = (form.elements.namedItem('passwordConfirmation') as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
              required
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
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
              placeholder="8文字以上"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="mb-2 block text-sm font-medium">
              パスワード（確認）
            </label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
              placeholder="もう一度入力してください"
            />
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
                  required
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
                  required
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
              required
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
