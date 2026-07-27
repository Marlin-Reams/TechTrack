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

function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);
}

export async function getProductivitySummary(): Promise<ProductivitySummary> {

    const repairs = await getCompletedRepairs();

    const todayRepairs = repairs.filter(repair =>
        isToday(parseLocalDate(repair.header.repairDate))
    );

    const weeklyRepairs = repairs.filter(repair =>
        isThisWeek(parseLocalDate(repair.header.repairDate))
    );

    const monthlyRepairs = repairs.filter(repair =>
        isThisMonth(parseLocalDate(repair.header.repairDate))
    );

    const yearlyRepairs = repairs.filter(repair =>
        isThisYear(parseLocalDate(repair.header.repairDate))
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

        completedRepairs: weeklyRepairs.length,

        averageHoursPerRepair:
            weeklyRepairs.length === 0
                ? 0
                : weeklyHours / weeklyRepairs.length,
    };
}