import { getCompletedRepairs } from "../../repairs/repository/repairRepository";

import type { StoredRepair } from "../../repairs/types/StoredRepair";

import {
    isToday,
    isThisWeek,
    isThisMonth,
    isThisYear,
} from "./dateUtils";

export interface ProductivitySummary {
    todayHours: number;
    weeklyHours: number;
    monthlyHours: number;
    yearlyHours: number;

    completedRepairs: number;
    averageHoursPerRepair: number;
}

function calculateHours(
    repairs: StoredRepair[]
): number {
    return repairs.reduce((repairTotal, repair) => {
        const repairHours = repair.operations.reduce(
            (operationTotal, operation) =>
                operationTotal + operation.hours,
            0
        );

        return repairTotal + repairHours;
    }, 0);
}

export async function getProductivitySummary(): Promise<ProductivitySummary> {

    const repairs = await getCompletedRepairs();

    const todayRepairs = repairs.filter(repair =>
        isToday(new Date(repair.header.repairDate))
    );

    const weeklyRepairs = repairs.filter(repair =>
        isThisWeek(new Date(repair.header.repairDate))
    );

    const monthlyRepairs = repairs.filter(repair =>
        isThisMonth(new Date(repair.header.repairDate))
    );

    const yearlyRepairs = repairs.filter(repair =>
        isThisYear(new Date(repair.header.repairDate))
    );

    const todayHours = calculateHours(todayRepairs);
    const weeklyHours = calculateHours(weeklyRepairs);
    const monthlyHours = calculateHours(monthlyRepairs);
    const yearlyHours = calculateHours(yearlyRepairs);

    return {
        todayHours,
        weeklyHours,
        monthlyHours,
        yearlyHours,

        completedRepairs: repairs.length,

        averageHoursPerRepair:
            repairs.length === 0
                ? 0
                : weeklyHours / repairs.length,
    };
}