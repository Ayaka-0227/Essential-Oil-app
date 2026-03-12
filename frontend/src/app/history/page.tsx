import Link from 'next/link';

const aromaHistory: Array<{ id: number; date: string; oilName: string; note: string }> = [];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-12 text-stone-800">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        {aromaHistory.length > 0 && (
          <>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight">過去のおすすめアロマオイル</h1>

            <div className="space-y-4">
              {aromaHistory.map((item) => (
                <article key={item.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-medium text-stone-500">{item.date}</p>
                  <h2 className="mt-1 text-lg font-semibold text-teal-800">{item.oilName}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.note}</p>
                </article>
              ))}
            </div>
          </>
        )}

        <Link
          href="/check"
          className="mt-8 block w-full rounded-full bg-teal-800 px-5 py-3 text-center font-semibold text-white transition hover:bg-teal-900"
        >
          メンタルチェックを始める
        </Link>
      </div>
    </main>
  );
}
