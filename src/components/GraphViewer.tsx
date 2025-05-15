import type { MachineStatus } from "../types/machineStatus";
import { v4 as uuidv4 } from 'uuid';

export const GraphViewer = () => {
  return (
    <div>
      <h1>Graph Viewer</h1>
      
    </div>
  );
}


const GraphDataSet: MachineStatus[] =
  [
    {
      id: uuidv4(),
      name: "Machine 1",
      status: {
        id: uuidv4(),
        available: true,
        startTime: new Date("2023-10-01T08:00:00Z"),
        endTime: new Date("2023-10-01T17:00:00Z"),
      },
    },
    {
      id: uuidv4(),
      name: "Machine 2",
      status: {
        id: uuidv4(),
        available: true,
        startTime: new Date("2023-10-01T08:00:00Z"),
        endTime: new Date("2023-10-01T17:00:00Z"),
      },
    },
  ];