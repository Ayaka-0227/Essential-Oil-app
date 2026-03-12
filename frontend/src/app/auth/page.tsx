import Link from 'next/link';

export default function AuthSelectPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-14 text-stone-800">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg md:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Mental Check
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">はじめる方法を選択</h1>
        <p className="mb-8 text-sm leading-relaxed text-stone-500">
          メンタルチェック結果を保存するにはログインまたは新規登録が必要です。
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full rounded-xl border border-stone-300 px-5 py-4 text-center text-base font-semibold text-stone-700 transition hover:border-teal-700 hover:text-teal-800"
          >
            ログイン
          </Link>

          <Link
            href="/signup"
            className="block w-full rounded-xl bg-teal-800 px-5 py-4 text-center text-base font-semibold text-white transition hover:bg-teal-900"
          >
            新規登録
          </Link>
        </div>
      </div>
    </main>
  );
}
