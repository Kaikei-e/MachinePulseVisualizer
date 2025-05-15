import type { MachineStatus, OccupiedTime } from "../types/machineStatus";

export const timeSeriesCalculator = (
  machineStatus: MachineStatus[],
): OccupiedTime[] => {
  const occupiedTime: OccupiedTime[] = [];

  for (const machine of machineStatus) {
    const { status } = machine;
    const duration =
      (status.endTime.getTime() - status.startTime.getTime()) / 1000; // in seconds

    occupiedTime.push({
      id: machine.id,
      duration,
    });
  }

  return occupiedTime;
}