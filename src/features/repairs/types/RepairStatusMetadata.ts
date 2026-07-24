import type { RepairStatus } from "./RepairStatus";

export interface RepairStatusMetadata {
    label: string;
    color: string;
}

export const repairStatusMetadata: Record<
    RepairStatus,
    RepairStatusMetadata
> = {
    active: {
        label: "Active",
        color: "#22c55e",
    },
    waiting: {
        label: "Waiting",
        color: "#eab308",
    },
    ready: {
        label: "Ready",
        color: "#3b82f6",
    },
    completed: {
        label: "Completed",
        color: "#6b7280",
    },
};