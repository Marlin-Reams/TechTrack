import type { StoredRepair } from "../../repairs/types/StoredRepair";

import {
    getOpenRepairs,
    getRecentRepairs,
} from "../../repairs/repository/repairRepository";

import { getProductivitySummary } from "./productivityService";
import { getUserSettings } from "../../settings/services/settingsService";

export interface DashboardSummary {
    openRepairs: number;
    weeklyHours: number;
    weeklyGoal: number;
    repairOrders: number;
    averageHoursPerRepair: number;
    recentRepairs: StoredRepair[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const [
        openRepairs,
        recentRepairs,
        productivity,
        settings,
    ] = await Promise.all([
        getOpenRepairs(),
        getRecentRepairs(5),
        getProductivitySummary(),
        getUserSettings(),
    ]);

    return {
        openRepairs: openRepairs.length,
        weeklyHours: productivity.weeklyHours,
        weeklyGoal: settings.weeklyFlagHourGoal,
        repairOrders: productivity.completedRepairs,
        averageHoursPerRepair: productivity.averageHoursPerRepair,
        recentRepairs,
    };
}