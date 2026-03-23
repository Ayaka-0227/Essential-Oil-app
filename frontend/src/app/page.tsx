import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fdfcfb] text-[#4a4a4a]">
      {/* ヒーローセクション */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 inline-block rounded-full bg-teal-50 px-4 py-1 text-sm font-medium text-teal-700">
          心と身体を整えるセルフケア
        </div>
        
        <h1 className="mb-6 text-4xl font-serif font-bold tracking-tight text-stone-800 md:text-6xl">
          今のあなたに、<br />
          一番近い香りを。
        </h1>
        
        <p className="mb-10 max-w-lg text-lg text-stone-600 leading-relaxed">
          16問のメンタルチェックから、今のあなたの状態を可視化。<br />
          23種類のエッセンシャルオイルの中から、<br />
          今、最も必要としている1本を提案します。
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/auth"
            className="rounded-full bg-teal-800 px-10 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-teal-900 hover:scale-105 active:scale-95"
          >
            メンタルチェックを始める
          </Link>
          <p className="text-[10px] text-stone-400">
            ※このチェックは医療的な診断を行うものではありません。
          </p>
        </div>
      </section>

    </main>
  );
}