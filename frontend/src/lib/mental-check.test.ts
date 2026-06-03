import { describe, expect, it } from "vitest";
import {
  buildMessage,
  calcScores,
  extractTopCategories,
  getFinalOilRecommendation,
  getScentTypeByKey,
  getTopOilCandidates,
} from "./mental-check";

function createParams(values: Record<number, number>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([id, value]) => {
    params.set(id, String(value));
  });
  return params;
}

describe("mental-check algorithm", () => {
  it("calcScores: 回答値をカテゴリごとに0-100へ正規化する", () => {
    const params = createParams({
      1: 4,
      2: 4,
      3: 2,
      4: 0,
      5: 4,
      6: 2,
      7: 1,
      8: 1,
      9: 3,
      10: 1,
      11: 0,
      12: 0,
      13: 4,
      14: 4,
      15: 2,
      16: 2,
    });

    const scores = calcScores(params);

    expect(scores.stress).toBe(100);
    expect(scores.fatigue).toBe(25);
    expect(scores.anxiety).toBe(75);
    expect(scores.sleep).toBe(25);
    expect(scores.emotion).toBe(50);
    expect(scores.vitality).toBe(0);
    expect(scores.mood).toBe(100);
    expect(scores.focus).toBe(50);
  });

  it("extractTopCategories: 1位との差が10以内なら2カテゴリ返す", () => {
    const tops = extractTopCategories({
      stress: 80,
      anxiety: 73,
      fatigue: 20,
      sleep: 10,
      emotion: 5,
      vitality: 0,
      mood: 1,
      focus: 2,
    });

    expect(tops).toHaveLength(2);
    expect(tops[0].key).toBe("stress");
    expect(tops[1].key).toBe("anxiety");
  });

  it("extractTopCategories: 同点時はpriorityで順序が決まる", () => {
    const tops = extractTopCategories({
      stress: 90,
      anxiety: 90,
      fatigue: 10,
      sleep: 10,
      emotion: 10,
      vitality: 10,
      mood: 10,
      focus: 10,
    });

    expect(tops).toHaveLength(2);
    expect(tops[0].key).toBe("anxiety");
    expect(tops[1].key).toBe("stress");
  });

  it("buildMessage: 1カテゴリ時に単独メッセージを返す", () => {
    const message = buildMessage(
      [{ key: "stress", label: "ストレス・緊張", qIds: [1, 2], priority: 2 }],
      {
        stress: 80,
        anxiety: 0,
        fatigue: 0,
        sleep: 0,
        emotion: 0,
        vitality: 0,
        mood: 0,
        focus: 0,
      },
    );

    expect(message).toContain("今は「ストレス・緊張」が少し目立っています。");
    expect(message).toContain("気を張る時間が続いているようです。");
  });

  it("buildMessage: 2カテゴリ時に改行付きメッセージを返す", () => {
    const message = buildMessage(
      [
        { key: "stress", label: "ストレス・緊張", qIds: [1, 2], priority: 2 },
        { key: "anxiety", label: "不安", qIds: [5, 6], priority: 1 },
      ],
      {
        stress: 80,
        anxiety: 60,
        fatigue: 0,
        sleep: 0,
        emotion: 0,
        vitality: 0,
        mood: 0,
        focus: 0,
      },
    );

    expect(message).toContain("今は「ストレス・緊張」と「不安」が少し目立っています。");
    expect(message).toContain("\nその影響で、");
  });

  it("getTopOilCandidates: スコア順で最大5件を返し、0点候補を除外する", () => {
    const candidates = getTopOilCandidates({
      stress: 100,
      anxiety: 90,
      fatigue: 0,
      sleep: 0,
      emotion: 0,
      vitality: 0,
      mood: 0,
      focus: 0,
    });

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.length).toBeLessThanOrEqual(5);
    expect(candidates.every((candidate) => candidate.score > 0)).toBe(true);

    for (let i = 1; i < candidates.length; i += 1) {
      expect(candidates[i - 1].score).toBeGreaterThanOrEqual(candidates[i].score);
    }
  });

  it("getScentTypeByKey: key一致時はタイプを返し、不一致時はnull", () => {
    expect(getScentTypeByKey("floral")?.label).toBe("フローラル系");
    expect(getScentTypeByKey("unknown")).toBeNull();
  });

  it("getFinalOilRecommendation: 香りタイプ一致候補があれば優先する", () => {
    const result = getFinalOilRecommendation(
      {
        stress: 100,
        anxiety: 90,
        fatigue: 0,
        sleep: 0,
        emotion: 0,
        vitality: 0,
        mood: 0,
        focus: 0,
      },
      "floral",
    );

    expect(result.scentType?.key).toBe("floral");
    expect(result.finalOil).not.toBeNull();
    expect(result.scentType?.oils).toContain(result.finalOil?.name);
  });

  it("getFinalOilRecommendation: 香りタイプ無効時はトップ候補を使う", () => {
    const result = getFinalOilRecommendation(
      {
        stress: 100,
        anxiety: 90,
        fatigue: 0,
        sleep: 0,
        emotion: 0,
        vitality: 0,
        mood: 0,
        focus: 0,
      },
      "invalid-key",
    );

    expect(result.scentType).toBeNull();
    expect(result.topCandidates.length).toBeGreaterThan(0);
    expect(result.finalOil?.name).toBe(result.topCandidates[0].name);
  });
});
