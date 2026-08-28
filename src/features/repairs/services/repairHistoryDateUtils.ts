import type { StoredRepair } from "../types/StoredRepair";

export interface RepairHistorySection {
    title: string;
    repairs: StoredRepair[];
}

function getWorkDate(repair: StoredRepair): Date {
    const date =
        repair.completedDate ??
        repair.header.repairDate;

    const [year, month, day] =
        date.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function startOfWeek(date: Date) {
    const result = new Date(date);

    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);

    return result;
}

export function groupRepairsByDate(
    repairs: StoredRepair[]
): RepairHistorySection[] {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const thisWeek = startOfWeek(today);

    const lastWeek = new Date(thisWeek);
    lastWeek.setDate(lastWeek.getDate() - 7);

   
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const buckets: Record<string, StoredRepair[]> = {
        Today: [],
        Yesterday: [],
        "This Week": [],
        "Last Week": [],
        "This Month": [],
        "Last Month": [],
        Older: [],
    };

    for (const repair of repairs) {

        const date = getWorkDate(repair);

        if (isSameDay(date, today)) {
            buckets["Today"].push(repair);
        }

        else if (isSameDay(date, yesterday)) {
            buckets["Yesterday"].push(repair);
        }

        else if (date >= thisWeek) {
            buckets["This Week"].push(repair);
        }

        else if (
            date >= lastWeek &&
            date < thisWeek
        ) {
            buckets["Last Week"].push(repair);
        }

        else if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth()
        ) {
            buckets["This Month"].push(repair);
        }

        else if (
            date >= lastMonth &&
            date < new Date(today.getFullYear(), today.getMonth(), 1)
        ) {
            buckets["Last Month"].push(repair);
        }

        else {
            buckets["Older"].push(repair);
        }

    }

    return Object.entries(buckets)
        .filter(([, repairs]) => repairs.length > 0)
        .map(([title, repairs]) => ({
            title,
            repairs,
        }));

}