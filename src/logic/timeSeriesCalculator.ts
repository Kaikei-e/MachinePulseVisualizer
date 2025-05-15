// utils/buildOccupancySeries.ts
import type { Task, TimePoint } from "../types/machineStatus";

export const buildOccupancySeries = (
  tasks: readonly Task[],
  machineCount = 2,
  stepMin = 10,                // ← 10 分刻み
): TimePoint[] => {
  const MIN_MS = 60 * 1000;

  // タスク最小開始日の 09:00〜18:00 を勤務帯に
  const firstStart = tasks.map(t => t.taskStartTime).reduce((a, b) => (a < b ? a : b));
  const day = new Date(firstStart);
  const dayStart = new Date(day.setHours(9, 0, 0, 0));
  const dayEnd = new Date(day.setHours(18, 0, 0, 0));

  const series: TimePoint[] = [];
  for (let tMs = dayStart.getTime(); tMs <= dayEnd.getTime(); tMs += stepMin * MIN_MS) {
    const t = new Date(tMs);

    // その時点で動いているタスク数
    const running = tasks.filter(
      task => task.taskStartTime <= t && t < task.taskEndTime,
    ).length;

    series.push({
      t,
      remainingJob: running,      // ← もう使わないがプロパティ保持
      remainingCap: machineCount,
      ratio: running / machineCount, // 0〜1 (超えたら過負荷)
    });
  }
  return series;
};
