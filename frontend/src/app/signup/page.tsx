"use client";

import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-12 text-stone-800">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">新規登録</h1>
        <p className="mb-8 text-sm text-stone-500">
          アカウントを作成をお願いします。
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              氏名
            </label>
            <input
              id="name"
              name="name"
              type="text"
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
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none transition focus:border-teal-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-teal-800 px-5 py-3 font-semibold text-white transition hover:bg-teal-900"
          >
            アカウントを作成
          </button>
        </form>
      </div>
    </main>
  );
}
