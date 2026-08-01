import type { StoredRepair } from "../../repairs/types/StoredRepair";

import {
    getOpenRepairs,
    getRecentRepairs,
    getCompletedRepairsForWeek,
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

    expectedHours: number;
    verifiedHours: number;

    pendingCount: number;
    verifiedCount: number;
    issueCount: number;
    resolvedCount: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const [
    openRepairs,
    recentRepairs,
    completedRepairs,
    productivity,
    settings,
] = await Promise.all([
    getOpenRepairs(),
    getRecentRepairs(5),
    getCompletedRepairsForWeek(),
    getProductivitySummary(),
    getUserSettings(),
]);

const pendingRepairs = completedRepairs.filter(
    repair =>
        (repair.payrollVerification?.status ?? "pending") ===
        "pending"
);

const verifiedRepairs = completedRepairs.filter(
    repair =>
        repair.payrollVerification?.status ===
        "verified"
);

const issueRepairs = completedRepairs.filter(
    repair =>
        repair.payrollVerification?.status ===
        "issue"
);

const resolvedRepairs = completedRepairs.filter(
    repair =>
        repair.payrollVerification?.status ===
        "resolved"
);

const expectedHours = completedRepairs.reduce(
    (total, repair) =>
        total +
        repair.operations.reduce(
            (hours, operation) =>
                hours + operation.hours,
            0
        ),
    0
);

const verifiedHours = completedRepairs.reduce(
    (total, repair) => {

        if (
            repair.payrollVerification?.status !== "verified" &&
            repair.payrollVerification?.status !== "resolved"
        ) {
            return total;
        }

        const expectedHours = repair.operations.reduce(
            (hours, operation) =>
                hours + operation.hours,
            0
        );

        return (
            total +
            (
                repair.payrollVerification.paidHours ??
                expectedHours
            )
        );

    },
    0
);

    return {
        openRepairs: openRepairs.length,
        weeklyHours: productivity.weeklyHours,
        weeklyGoal: settings.weeklyFlagHourGoal,
        repairOrders: productivity.completedRepairs,
        averageHoursPerRepair: productivity.averageHoursPerRepair,
        recentRepairs,
        expectedHours,

verifiedHours,

pendingCount: pendingRepairs.length,

verifiedCount: verifiedRepairs.length,

issueCount: issueRepairs.length,

resolvedCount: resolvedRepairs.length,
    };
}