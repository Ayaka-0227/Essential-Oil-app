"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/history');
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

          <button
            type="submit"
            className="w-full rounded-full bg-teal-800 px-5 py-3 font-semibold text-white transition hover:bg-teal-900"
          >
            ログインする
          </button>

          <p className="text-center text-sm text-stone-500">
            ※パスワードをお忘れの方は
            <Link href="/forgot-password" className="ml-1 font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
              こちら
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
