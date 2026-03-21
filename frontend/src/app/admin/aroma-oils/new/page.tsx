"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHamburgerMenu from "@/components/AdminHamburgerMenu";
import { apiUrl } from "@/lib/api";

const MENTAL_CATEGORIES = [
  { key: "stress", label: "ストレス・緊張" },
  { key: "anxiety", label: "不安" },
  { key: "fatigue", label: "疲労" },
  { key: "sleep", label: "睡眠不足" },
  { key: "emotion", label: "感情の解放・安定" },
  { key: "vitality", label: "活力・モチベーションの低下" },
  { key: "mood", label: "気分の落ち込み" },
  { key: "focus", label: "集中力の低下" },
];

const SCENT_CATEGORIES = [
  { key: "floral", label: "フローラル系（花）" },
  { key: "oriental", label: "オリエンタル系（甘・香木）" },
  { key: "woody", label: "ウッディ系（樹木）" },
  { key: "fresh", label: "フレッシュ系（柑橘・ハーブ）" },
  { key: "spice", label: "スパイス系" },
];

export default function AdminAromaOilNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMentalCategories, setSelectedMentalCategories] = useState<string[]>([]);
  const [scentCategory, setScentCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMentalCategory = (key: string) => {
    setSelectedMentalCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(apiUrl("/admin/aroma_oils"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({ aroma_oil: { name, description, category: selectedMentalCategories.join(","), scent_category: scentCategory } }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.join(", ") ?? "追加に失敗しました");
      }

      router.push("/admin/aroma-oils");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "追加に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-stone-800">
      <AdminHamburgerMenu />
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">アロマオイル追加</h1>

        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white px-6 py-8 shadow-sm space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">名前</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">レーダーチャートカテゴリー</p>
            <div className="grid grid-cols-2 gap-2">
              {MENTAL_CATEGORIES.map((cat) => (
                <label key={cat.key} className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={selectedMentalCategories.includes(cat.key)}
                    onChange={() => toggleMentalCategory(cat.key)}
                    className="h-4 w-4 accent-teal-700"
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="scent_category" className="mb-1.5 block text-sm font-medium">匂いのカテゴリー</label>
            <select
              id="scent_category"
              value={scentCategory}
              onChange={(e) => setScentCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-white"
            >
              <option value="">選択してください</option>
              {SCENT_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">説明</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin/aroma-oils")}
              className="flex-1 rounded-full border border-stone-200 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-teal-800 py-3 text-sm font-semibold text-white shadow transition hover:bg-teal-900 disabled:opacity-60"
            >
              {loading ? "追加中..." : "追加する"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
