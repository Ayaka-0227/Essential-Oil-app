"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// カテゴリ表示ラベル（折り返しのため配列）
const LABELS = [
  "ストレス・緊張",
  "不安",
  "疲労",
  "睡眠不足",
  "感情の\n解放・安定",
  "活力・モチ\nベーションの低下",
  "気分の落ち込み",
  "集中力の低下",
];

interface Props {
  scores: number[]; // 8要素、0〜100
}

export default function MentalRadarChart({ scores }: Props) {
  const data = {
    labels: LABELS,
    datasets: [
      {
        label: "あなたの状態",
        data: scores,
        backgroundColor: "rgba(13, 148, 136, 0.15)",
        borderColor: "rgba(13, 148, 136, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(13, 148, 136, 1)",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          display: false,
        },
        grid: { color: "rgba(0,0,0,0.08)" },
        angleLines: { color: "rgba(0,0,0,0.08)" },
        pointLabels: {
          font: { size: 11 },
          color: "#57534e",
          callback: (label: string) => label.split("\n"),
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `  ${ctx.raw} / 100`,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
