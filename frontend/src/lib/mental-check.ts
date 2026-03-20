export const CATEGORIES = [
  { key: "stress", label: "ストレス・緊張", qIds: [1, 2], priority: 2 },
  { key: "anxiety", label: "不安", qIds: [5, 6], priority: 1 },
  { key: "fatigue", label: "疲労", qIds: [3, 4], priority: 4 },
  { key: "sleep", label: "睡眠不足", qIds: [7, 8], priority: 3 },
  {
    key: "vitality",
    label: "活力・モチベーションの低下",
    qIds: [11, 12],
    priority: 8,
  },
  { key: "mood", label: "気分の落ち込み", qIds: [13, 14], priority: 5 },
  { key: "focus", label: "集中力の低下", qIds: [15, 16], priority: 7 },
  { key: "emotion", label: "感情の解放・安定", qIds: [9, 10], priority: 6 },
] as const;

export const CHART_ORDER = [
  "stress",
  "anxiety",
  "fatigue",
  "sleep",
  "emotion",
  "vitality",
  "mood",
  "focus",
] as const;

export const MESSAGES: Record<string, [string, string]> = {
  stress: [
    "気を張る時間が続いているようです。",
    "無意識に力が入りやすい状態かもしれません。",
  ],
  anxiety: [
    "気持ちが落ち着きにくい状態です。",
    "先のことを考えすぎてしまう時間が多いかもしれません。",
  ],
  fatigue: [
    "心や体に疲れが溜まっているようです。",
    "少し休息を求めている状態かもしれません。",
  ],
  sleep: [
    "眠りが浅くなりやすい状態です。",
    "休息が十分に取れていない可能性があります。",
  ],
  emotion: [
    "感情の揺れを感じやすい状態です。",
    "気持ちを整える時間が必要かもしれません。",
  ],
  vitality: [
    "エネルギーが少し下がり気味のようです。",
    "無理をすると消耗しやすい状態かもしれません。",
  ],
  mood: [
    "気分が沈みやすい状態です。",
    "心が少し疲れているのかもしれません。",
  ],
  focus: [
    "集中力が散りやすい状態です。",
    "頭の中が少し忙しいのかもしれません。",
  ],
};

const CATEGORY_INDEX_TO_KEY = [
  "stress",
  "anxiety",
  "fatigue",
  "sleep",
  "vitality",
  "mood",
  "focus",
  "emotion",
] as const;

const OILS = [
  { name: "ラベンダー", weights: [1.0, 1.0, 0.6, 1.0, 0.3, 0.6, 0.3, 0.6] },
  { name: "オレンジ", weights: [0.6, 0.6, 0.3, 0.3, 0.6, 1.0, 0.3, 0.6] },
  { name: "グレープフルーツ", weights: [0.3, 0.3, 0.6, 0.0, 1.0, 0.6, 0.6, 0.3] },
  { name: "タンジェリン", weights: [0.6, 1.0, 0.3, 0.6, 0.3, 1.0, 0.0, 0.6] },
  { name: "レモン", weights: [0.3, 0.3, 0.6, 0.0, 1.0, 0.3, 1.0, 0.0] },
  { name: "ベルガモット", weights: [1.0, 1.0, 0.3, 0.6, 0.3, 1.0, 0.3, 0.6] },
  { name: "プチグレイン", weights: [0.6, 0.6, 0.6, 0.6, 0.3, 0.6, 1.0, 0.6] },
  { name: "カモミールローマン", weights: [1.0, 1.0, 0.3, 1.0, 0.0, 0.6, 0.0, 1.0] },
  { name: "ジャーマンカモミール", weights: [1.0, 1.0, 0.3, 0.6, 0.0, 0.3, 0.0, 1.0] },
  { name: "ジャスミン", weights: [0.3, 1.0, 0.3, 0.6, 0.6, 1.0, 0.0, 0.6] },
  { name: "ゼラニウム", weights: [1.0, 1.0, 0.3, 0.3, 0.6, 1.0, 0.0, 1.0] },
  { name: "バニラ", weights: [0.6, 0.6, 0.3, 0.6, 0.3, 1.0, 0.0, 0.6] },
  { name: "フランキンセンス", weights: [0.6, 0.6, 0.3, 1.0, 0.3, 0.6, 0.6, 1.0] },
  { name: "サンダルウッド", weights: [0.6, 1.0, 0.3, 1.0, 0.0, 0.3, 0.0, 1.0] },
  { name: "シスタス", weights: [0.6, 0.6, 0.3, 0.6, 0.3, 0.6, 0.0, 0.6] },
  { name: "クローブ", weights: [0.3, 0.3, 0.6, 0.6, 1.0, 0.0, 0.3, 0.3] },
  { name: "ジンジャー", weights: [0.3, 0.3, 1.0, 0.0, 1.0, 0.0, 0.3, 0.3] },
  { name: "ブラックペッパー", weights: [0.0, 0.0, 0.6, 0.0, 1.0, 0.0, 1.0, 0.0] },
  { name: "バジル", weights: [0.0, 0.3, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0] },
  { name: "ローズマリー", weights: [0.0, 0.3, 0.6, 0.0, 1.0, 0.0, 1.0, 0.0] },
  { name: "ペパーミント", weights: [0.0, 0.0, 0.6, 0.0, 1.0, 0.0, 1.0, 0.0] },
  { name: "スペアミント", weights: [0.3, 0.3, 0.3, 0.0, 0.6, 0.6, 0.6, 1.0] },
  { name: "ヒノキ", weights: [1.0, 0.6, 0.3, 1.0, 0.0, 0.3, 1.0, 0.6] },
] as const;

export const SCENT_TYPES = [
  {
    key: "floral",
    label: "フローラル系",
    prompt: "花に包まれて、やさしく癒されたい",
    oils: [
      "カモミールローマン",
      "ジャーマンカモミール",
      "ジャスミン",
      "ゼラニウム",
      "ラベンダー",
    ],
  },
  {
    key: "oriental",
    label: "オリエンタル系 / アンバー系",
    prompt: "甘く深い香りで、気持ちを落ち着かせたい",
    oils: ["バニラ", "フランキンセンス", "シスタス"],
  },
  {
    key: "woody",
    label: "ウッディ系",
    prompt: "森や木の中にいるような、安心感がほしい",
    oils: ["サンダルウッド", "ヒノキ"],
  },
  {
    key: "fresh",
    label: "フレッシュ系",
    prompt: "すっきり爽やかに、気分を切り替えたい",
    oils: [
      "オレンジ",
      "グレープフルーツ",
      "タンジェリン",
      "ベルガモット",
      "レモン",
      "プチグレイン",
      "ペパーミント",
      "スペアミント",
      "ローズマリー",
      "バジル",
      "ジンジャー",
      "ブラックペッパー",
      "クローブ",
    ],
  },
] as const;

const OIL_DETAILS: Record<string, { description: string; effect: string }> = {
  ラベンダー: {
    description: "やわらかなフローラル調で、張りつめた気分をゆるめたい時に寄り添う香りです。",
    effect: "不安・ストレス・睡眠・感情の揺れと相性がよいオイルです。",
  },
  オレンジ: {
    description: "親しみやすい甘さで、気持ちをやさしく明るく切り替えたい時に向く香りです。",
    effect: "落ち込み・活力不足・不安のケアに向いています。",
  },
  グレープフルーツ: {
    description: "軽やかな柑橘の香りで、重たさをほどいて前向きさを取り戻したい時に合います。",
    effect: "疲労・活力不足・集中の立て直しに向いています。",
  },
  タンジェリン: {
    description: "やさしい甘みのある柑橘で、緊張をゆるめながら安心感を得たい時におすすめです。",
    effect: "不安・落ち込み・睡眠・ストレスのケアと相性がよいです。",
  },
  レモン: {
    description: "シャープで澄んだ香りが、頭の重たさを軽くして気分を切り替える助けになります。",
    effect: "活力不足・集中力低下・疲労へのアプローチに向いています。",
  },
  ベルガモット: {
    description: "柑橘の爽やかさとやわらかさを併せ持ち、心のこわばりをほどきたい時に合う香りです。",
    effect: "不安・ストレス・落ち込み・感情の揺れのケアに向いています。",
  },
  プチグレイン: {
    description: "すっきり感と落ち着きを両立し、気持ちを整えながら集中したい時に使いやすい香りです。",
    effect: "ストレス・不安・睡眠・集中に幅広く対応します。",
  },
  カモミールローマン: {
    description: "やさしく包み込むような甘さがあり、気持ちを落ち着けて休みたい時に向いています。",
    effect: "不安・ストレス・睡眠・感情のケアに特に相性がよいです。",
  },
  ジャーマンカモミール: {
    description: "深みのある落ち着いた香りで、心のざわつきを静めたい時に寄り添います。",
    effect: "不安・ストレス・感情の揺れ・睡眠に向いています。",
  },
  ジャスミン: {
    description: "華やかさの中に落ち着きがあり、自信ややわらかさを取り戻したい時に合う香りです。",
    effect: "不安・落ち込み・感情のケアに向いています。",
  },
  ゼラニウム: {
    description: "甘さと青さのバランスがよく、気分の波を整えて安定感を得たい時におすすめです。",
    effect: "不安・ストレス・落ち込み・感情のゆらぎに幅広く対応します。",
  },
  バニラ: {
    description: "甘く深い香りで、安心感に包まれながらゆっくり気持ちを鎮めたい時に合います。",
    effect: "落ち込み・不安・感情・睡眠へのケアに向いています。",
  },
  フランキンセンス: {
    description: "静けさを感じる落ち着いた香りで、呼吸を整えながら心を落ち着けたい時に向きます。",
    effect: "睡眠・感情・不安・集中のサポートに相性がよいです。",
  },
  サンダルウッド: {
    description: "深く穏やかな木の香りで、安心感を得ながら落ち着きを取り戻したい時に適しています。",
    effect: "睡眠・不安・感情の安定に向いています。",
  },
  シスタス: {
    description: "重厚で落ち着いた香りが、気持ちを内側から整えたい時に寄り添います。",
    effect: "不安・落ち込み・感情・睡眠のケアに向いています。",
  },
  クローブ: {
    description: "温かみのあるスパイシーさで、停滞感を動かして切り替えたい時に使いやすい香りです。",
    effect: "活力不足・疲労へのアプローチに向いています。",
  },
  ジンジャー: {
    description: "温もりのある刺激で、重たさをはらって前に進む感覚を得たい時に向いています。",
    effect: "疲労・活力不足を立て直したい時に相性がよいです。",
  },
  ブラックペッパー: {
    description: "力強いスパイス感で、気分を切り替えて行動力を後押ししたい時に適しています。",
    effect: "活力不足・集中力低下へのサポートに向いています。",
  },
  バジル: {
    description: "ハーブらしい冴えのある香りで、頭の重たさを払って切り替えたい時に合います。",
    effect: "疲労・活力不足・集中に向いています。",
  },
  ローズマリー: {
    description: "すっきりした刺激があり、ぼんやり感を晴らして気持ちを立て直したい時に役立ちます。",
    effect: "活力不足・集中力低下・疲労に向いています。",
  },
  ペパーミント: {
    description: "強い清涼感で、頭や気分をしゃきっと切り替えたい時に使いやすい香りです。",
    effect: "活力不足・集中力低下のサポートに向いています。",
  },
  スペアミント: {
    description: "やわらかな清涼感があり、軽やかさを保ちながら気分を切り替えたい時に合います。",
    effect: "活力不足・落ち込み・感情のケアに向いています。",
  },
  ヒノキ: {
    description: "森林を思わせる穏やかな香りで、安心感と落ち着きを得ながら整えたい時に向きます。",
    effect: "ストレス・睡眠・集中・不安に相性がよいオイルです。",
  },
};

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function calcScores(params: URLSearchParams): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const raw = cat.qIds.reduce((sum, id) => {
      const value = Number(params.get(String(id)) ?? 0);
      return sum + value;
    }, 0);
    scores[cat.key] = Math.round((raw / 8) * 100);
  }
  return scores;
}

export function extractTopCategories(scores: Record<string, number>) {
  const sorted = [...CATEGORIES].sort((a, b) => {
    const diff = scores[b.key] - scores[a.key];
    return diff !== 0 ? diff : a.priority - b.priority;
  });
  const top = [sorted[0]];
  if (scores[sorted[1].key] >= scores[sorted[0].key] - 10) {
    top.push(sorted[1]);
  }
  return top;
}

export function buildMessage(
  tops: (typeof CATEGORIES)[number][],
  scores: Record<string, number>,
) {
  const mainScore = scores[tops[0].key];
  const mainMsg = MESSAGES[tops[0].key][mainScore >= 70 ? 0 : 1];

  if (tops.length === 1) {
    return `今は「${tops[0].label}」が少し目立っています。${mainMsg}`;
  }

  const subMsg = MESSAGES[tops[1].key][scores[tops[1].key] >= 70 ? 0 : 1];
  return `今は「${tops[0].label}」と「${tops[1].label}」が少し目立っています。${mainMsg}\nその影響で、${subMsg}`;
}

export function getTopOilCandidates(scores: Record<string, number>) {
  const tops = extractTopCategories(scores);
  const activeKeys = tops.map((top) => top.key as CategoryKey);

  return OILS.map((oil) => {
    const score = activeKeys.reduce((sum, key) => {
      const index = CATEGORY_INDEX_TO_KEY.indexOf(key);
      const weight = oil.weights[index];

      if (weight < 0.6) {
        return sum;
      }

      return sum + scores[key] * weight;
    }, 0);

    const matchedCategories = tops
      .filter((top) => oil.weights[CATEGORY_INDEX_TO_KEY.indexOf(top.key as CategoryKey)] >= 0.6)
      .map((top) => top.label);

    const effectCount = oil.weights.filter((weight) => weight >= 0.6).length;

    return {
      name: oil.name,
      score: Math.round(score),
      matchedCategories,
      effectCount,
      description: OIL_DETAILS[oil.name].description,
      effect: OIL_DETAILS[oil.name].effect,
    };
  })
    .filter((oil) => oil.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.matchedCategories.length !== a.matchedCategories.length) {
        return b.matchedCategories.length - a.matchedCategories.length;
      }

      if (b.effectCount !== a.effectCount) {
        return b.effectCount - a.effectCount;
      }

      return a.name.localeCompare(b.name, "ja");
    })
    .slice(0, 5);
}

export function getScentTypeByKey(key: string | null) {
  return SCENT_TYPES.find((type) => type.key === key) ?? null;
}

export function getFinalOilRecommendation(
  scores: Record<string, number>,
  scentTypeKey: string | null,
) {
  const topCandidates = getTopOilCandidates(scores);
  const scentType = getScentTypeByKey(scentTypeKey);

  const matchingCandidates = scentType
    ? topCandidates.filter((candidate) =>
        (scentType.oils as readonly string[]).includes(candidate.name),
      )
    : [];

  const finalOil = matchingCandidates[0] ?? topCandidates[0] ?? null;

  return {
    scentType,
    topCandidates,
    finalOil,
  };
}