import type { UUIDTypes } from "uuid";

export interface MachineStatus {
  id: UUIDTypes;
  name: string;
  status: MachineAvailability;
}

interface MachineAvailability {
  id: UUIDTypes;
  available: boolean;
  startTime: Date;
  endTime: Date;
}

export interface OccupiedTime {
  id: UUIDTypes;
  duration: number;
}