import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { Box, Heading, Flex, Text, ListItem, ListRoot } from "@chakra-ui/react";
import { buildOccupancySeries } from "../logic/timeSeriesCalculator";
import tasks from "../mock/taskMocks.json";
import { FiAlertOctagon } from "react-icons/fi";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

const series = buildOccupancySeries(
  tasks.map(t => ({
    ...t,
    taskStartTime: new Date(t.taskStartTime),
    taskEndTime: new Date(t.taskEndTime),
    taskName: t.taskName,
    taskId: t.taskId,
  })),
  2,      // machineCount
);

/* ---------- 2) 過負荷区間を抽出 ---------------------------------------- */
type Period = { start: Date; end: Date };

const overload: Period[] = (() => {
  const out: Period[] = [];
  let current: Period | null = null;

  for (const p of series) {
    const isOver = p.ratio > 1;
    if (isOver && !current) {
      current = { start: p.t, end: p.t };
    } else if (isOver && current) {
      current.end = p.t; // 連続区間を伸ばす
    } else if (!isOver && current) {
      out.push(current);
      current = null;
    }
  }
  if (current) out.push(current);
  return out;
})();

/* ---------- 3) Chart.js データ ---------------------------------------- */
const data = {
  labels: series.map(p => p.t),
  datasets: [
    {
      label: "Occupancy",
      data: series.map(p => p.ratio),
      tension: 0,
      borderWidth: 3,
      pointRadius: 4,
      borderColor: context => {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        return value > 1 ? "#E53E3E" : "#4A5568";
      },
      pointBackgroundColor: context => {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        return value > 1 ? "#E53E3E" : "#4A5568";
      },
    },
    /* ★ 100% 基準破線 -------------------------- */
    {
      label: "100 % Capacity",
      data: [
        { x: series[0].t, y: 1 },
        { x: series.at(-1)!.t, y: 1 },
      ],
      borderDash: [5, 5],
      borderWidth: 2,
      borderColor: "#2B6CB0",
      pointRadius: 0,
      fill: false,
      order: 0,              // 折れ線の背面に
    },
  ],
};

const overBg: Plugin<"line"> = {
  id: "over-background",
  beforeDraw: chart => {
    const { ctx, chartArea, scales } = chart;
    const { left, right, top } = chartArea;
    const yScale = scales.y;

    const y100 = yScale.getPixelForValue(1);

    ctx.save();
    ctx.fillStyle = "rgba(229, 62, 62, 0.10)";       // 赤 (E53E3E) 10 % α
    ctx.fillRect(left, top, right - left, y100 - top);
    ctx.restore();
  },
};

/* ---------- 4) ヘルパー：時間フォーマット ----------------------------- */
const fmt = (d: Date) =>
  d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

const options: ChartOptions<"line"> = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 1.6,
      ticks: { callback: v => `${(v as number) * 100}%` },
    },
    x: {
      type: "time",
      time: { unit: "hour", displayFormats: { hour: "HH:mm" } },
    },
  },
  plugins: {
    legend: { position: "top" },
  },
};
export function GraphViewer() {
  return (
    <Box px={6} py={4}>
      <Heading size="md" mb={4}>MachinePulse – Utilization Dashboard</Heading>

      <Flex justify="center" gap={6}>
        {/* グラフ */}
        <Box w="60vw" h="70vh">
          <Line options={options} data={data} plugins={[overBg]} />
        </Box>

        {/* 過負荷リスト */}
        <Box w="20vw" h="70vh" overflowY="auto">
          <Heading size="sm" mb={2} color="red.600">
            Over-capacity Periods
          </Heading>

          {overload.length === 0 ? (
            <Text>No overload detected 🎉</Text>
          ) : (
            <ListRoot ml={0}>
              {overload.map(({ start, end }) => (
                <ListItem key={start.toISOString()} display="flex" gap={2}>
                  <FiAlertOctagon color="#E53E3E" />
                  {fmt(start)} – {fmt(new Date(end.getTime() + 60_000))}
                </ListItem>
              ))}
            </ListRoot>
          )}
        </Box>
      </Flex>
    </Box>
  );
}