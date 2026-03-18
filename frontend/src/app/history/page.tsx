import Link from "next/link";
import HistorySection from "@/components/HistorySection";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function HistoryPage() {
  return (
    <main className="relative -top-[0.5cm] min-h-screen overflow-x-hidden bg-[#f7f4ef] pb-28 text-stone-800 sm:pb-32">
      <HamburgerMenu />
      <div className="px-4 pt-6 text-center sm:px-6 sm:pt-8" />

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
