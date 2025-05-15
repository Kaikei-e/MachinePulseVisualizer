import type { UUIDTypes } from "uuid";

/* 既存 ---------------------- */
export interface MachineStatus {
  id: UUIDTypes;
  name: string;
  status: MachineAvailability;
}

export interface MachineAvailability {
  id: UUIDTypes;
  available: boolean;
  startTime: Date;
  endTime: Date;
}

/* グラフ用 ------------------- */
export interface TimePoint {
  t: Date;
  remainingJob: number;
  remainingCap: number;
  ratio: number;               // 0–1(目標), 1↑ = オーバーブッキング
}

/* 追加：タスク型 -------------- */
export interface Task {
  taskName: string;
  taskId: UUIDTypes;
  taskStartTime: Date;
  taskEndTime: Date;
}
