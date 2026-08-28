import {
    getCompletedRepairs,
    getCompletedRepairsPage,
    type RepairPageCursor,
} from "../repository/repairRepository";

import type { StoredRepair } from "../types/StoredRepair";

export interface RepairHistoryFilters {
    payrollStatus?:
        | "all"
        | "pending"
        | "verified"
        | "issue"
        | "resolved";

    timePeriod?:
        | "all"
        | "today"
        | "yesterday"
        | "thisWeek"
        | "lastWeek"
        | "thisMonth"
        | "lastMonth"
        | "older";

    searchText?: string;

    adjustedOnly?: boolean;
}

export async function getRepairHistory(
    filters: RepairHistoryFilters = {}
): Promise<StoredRepair[]> {

    const repairHistory = await getCompletedRepairs();

    return filterRepairHistory(repairHistory, filters);
}

export const REPAIR_HISTORY_PAGE_SIZE = 50;

export function getRepairHistoryPage(cursor: RepairPageCursor | null = null) {
    return getCompletedRepairsPage(REPAIR_HISTORY_PAGE_SIZE, cursor);
}

export function filterRepairHistory(
    repairHistory: StoredRepair[],
    filters: RepairHistoryFilters = {}
): StoredRepair[] {

    let repairs = [...repairHistory];

    if (
        filters.payrollStatus &&
        filters.payrollStatus !== "all"
    ) {
        repairs = repairs.filter(
            (repair) =>
                (
                    repair.payrollVerification?.status ??
                    "pending"
                ) === filters.payrollStatus
        );
    }

    if (filters.searchText?.trim()) {

        const search = filters.searchText
            .trim()
            .toLowerCase();

        const searchTerms = search.split(/\s+/);

        repairs = repairs.filter((repair) => {
            const header = repair.header;
            const searchableText = [
                header.repairOrderNumber,
                header.customerName,
                header.vin,
                header.licensePlate,
                header.year,
                header.make,
                header.model,
                header.engine,
                header.serviceAdvisor,
                header.mileage,
                repair.notes?.content,
                ...repair.operations.flatMap((operation) => [
                    operation.articleNumber,
                    operation.description,
                    operation.workPerformed,
                ]),
            ]
                .filter((value) => value !== null && value !== undefined)
                .join(" ")
                .toLowerCase();

            const compactText = searchableText.replace(/[^a-z0-9]/g, "");

            return searchTerms.every((term) =>
                searchableText.includes(term) ||
                compactText.includes(term.replace(/[^a-z0-9]/g, ""))
            );
        });

    }

    if (filters.timePeriod && filters.timePeriod !== "all") {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const workDate = (repair: StoredRepair) => {
        const date =
            repair.completedDate ??
            repair.header.repairDate;

        const [year, month, day] =
            date.split("-").map(Number);

        return new Date(year, month - 1, day);
    };

    repairs = repairs.filter((repair) => {

        const date = workDate(repair);

        switch (filters.timePeriod) {

            case "today":
                return date.getTime() === today.getTime();

            case "yesterday":
                return date.getTime() === yesterday.getTime();

            case "thisWeek": {
                const start = new Date(today);
                const day = start.getDay();
                start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
                return date >= start;
            }

            case "lastWeek": {
                const end = new Date(today);
                const day = end.getDay();
                end.setDate(end.getDate() - (day === 0 ? 6 : day - 1));
                const start = new Date(end);
                start.setDate(start.getDate() - 7);
                return date >= start && date < end;
            }

            case "thisMonth":
                return (
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth()
                );

            case "lastMonth": {
                const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const end = new Date(today.getFullYear(), today.getMonth(), 1);
                return date >= start && date < end;
            }

            case "older":
                return date < new Date(today.getFullYear(), today.getMonth() - 1, 1);

            default:
                return true;
        }

    });

}

if (filters.adjustedOnly) {

    repairs = repairs.filter((repair) => {

        const payroll =
            repair.payrollVerification;

        if (!payroll) {
            return false;
        }

        return (
            payroll.expectedHours !== payroll.paidHours
        );

    });

}
    return repairs;
}
