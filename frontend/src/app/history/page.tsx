import Link from "next/link";
import HistorySection from "@/components/HistorySection";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function HistoryPage() {
  return (
    <main className="relative -top-[0.5cm] min-h-screen overflow-x-hidden bg-[#f7f4ef] pb-28 text-stone-800 sm:pb-32">
      <HamburgerMenu />
      <div className="px-4 pt-6 text-center sm:px-6 sm:pt-8" />

      <section className="mx-auto mb-6 w-full max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-sm">
          <h1 className="text-lg font-bold text-stone-800">アプリの使用方法について</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            初めての方は以下の順番でお試しください。
          </p>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-stone-700">
            <li>1. 「質問に答える」をクリックし、メンタルチェックを開始します。</li>
            <li>2. 全ての質問に答えた後、あなたの今のコンディションの結果が表示されます。また、その後、その状態におすすめな香りを提案してくれます。</li>
            <li>3. おすすめのアロマオイルを試した後はこの履歴画面にて使用した感想を記録してみてください。</li>
          </ol>
        </div>
      </section>

      <HistorySection />

      <div className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:bottom-6 sm:w-[calc(100%-3rem)]">
        <Link
          href="/check/questions"
          className="block w-full rounded-full bg-teal-800 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900"
        >
          質問に答える
        </Link>
      </div>
    </main>
  );
}
