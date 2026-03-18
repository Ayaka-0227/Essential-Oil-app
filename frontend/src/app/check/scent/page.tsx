"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SCENT_TYPES } from "@/lib/mental-check";

function ScentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedType) {
      return;
    }

    const nextParams = new URLSearchParams(params.toString());
    nextParams.set("scent", selectedType);
    router.push(`/check/recommendation?${nextParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          今日の気分に一番近い香りを選んでください。
        </h1>


        <div className="space-y-4">
          {SCENT_TYPES.map((type, index) => {
            const selected = selectedType === type.key;
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setSelectedType(type.key)}
                className={`block w-full rounded-2xl border px-5 py-5 text-left transition-all ${
                  selected
                    ? "border-teal-800 bg-teal-800 text-white shadow"
                    : "border-stone-200 bg-white text-stone-800 shadow-sm hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                <p className={`text-xs font-semibold ${selected ? "text-teal-100" : "text-teal-700"}`}>
                  {index + 1}. {type.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{type.prompt}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedType}
            className={`rounded-full px-8 py-3 text-sm font-semibold shadow transition-all ${
              selectedType
                ? "bg-teal-800 text-white hover:bg-teal-900 hover:scale-105 active:scale-95"
                : "cursor-not-allowed bg-stone-200 text-stone-400"
            }`}
          >
            next →
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ScentPage() {
  return (
    <Suspense>
      <ScentContent />
    </Suspense>
  );
}
