import { getPaystubs } from "../../financial/paystubs/repository/paystubRepository";
import FinancialService from "../../financial/services/FinancialService";
import { getCompletedRepairs } from "../../repairs/repository/repairRepository";
import { getUserSettings } from "../../settings/services/settingsService";

export interface ReportPoint {
    key: string;
    label: string;
    repairs: number;
    hours: number;
    earnings: number;
    netEarnings: number;
}

export interface OperationReportRow {
    description: string;
    count: number;
    hours: number;
    repairs: OperationRepairReference[];
}

export interface OperationRepairReference {
    id: string;
    repairOrderNumber: string;
    date: string;
    vehicle: string;
    hours: number;
}

export interface ReportSlice {
    repairs: number;
    hours: number;
    earnings: number;
    netEarnings: number;
    verifiedRepairs: number;
    issues: number;
    pending: number;
    topOperations: OperationReportRow[];
    paychecks: { label: string; gross: number; net: number; hours: number }[];
}

export interface ReportDay extends ReportSlice {
    key: string;
    label: string;
}

export interface ReportMonth extends ReportSlice {
    key: string;
    label: string;
    days: ReportDay[];
}

export interface ReportsSnapshot {
    months: ReportPoint[];
    monthDetails: Record<string, ReportMonth>;
    paychecks: { label: string; gross: number; net: number; hours: number }[];
    topOperations: OperationReportRow[];
    totalRepairs: number;
    totalHours: number;
    averageHoursPerRepair: number;
    verifiedRepairs: number;
    issues: number;
    pending: number;
    verifiedRate: number;
    averageWeeklyGross: number;
    projectedAnnualIncome: number;
    yearToDateGross: number;
}

export async function getReportsSnapshot(monthCount = 12): Promise<ReportsSnapshot> {
    const [repairs, paystubs, financial, settings] = await Promise.all([
        getCompletedRepairs(),
        getPaystubs(),
        FinancialService.getWeeklySummary(),
        getUserSettings(),
    ]);

    const now = new Date();
    const months = Array.from({ length: monthCount }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - index), 1);
        return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
            label: date.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
            repairs: 0,
            hours: 0,
            earnings: 0,
            netEarnings: 0,
        };
    });
    const monthMap = new Map(months.map(month => [month.key, month]));
    const operationMap = new Map<string, OperationReportRow>();

    let totalRepairs = 0;
    let totalHours = 0;
    let verifiedRepairs = 0;
    let issues = 0;
    let pending = 0;

    for (const repair of repairs) {
        const date = repair.completedDate ?? repair.header.repairDate;
        const month = monthMap.get(date.slice(0, 7));
        if (!month) continue;

        totalRepairs += 1;
        const repairHours = repair.operations.reduce((sum, operation) => sum + (Number(operation.hours) || 0), 0);
        totalHours += repairHours;
        month.repairs += 1;
        month.hours += repairHours;

        const status = repair.payrollVerification?.status ?? "pending";
        if (status === "verified" || status === "resolved") verifiedRepairs += 1;
        else if (status === "issue") issues += 1;
        else pending += 1;

        for (const operation of repair.operations) {
            const description = operation.description.trim() || "Unlabeled operation";
            const key = description.toUpperCase();
            const current = operationMap.get(key) ?? { description, count: 0, hours: 0, repairs: [] };
            current.count += 1;
            current.hours += Number(operation.hours) || 0;
            current.repairs.push({
                id: repair.id,
                repairOrderNumber: repair.header.repairOrderNumber,
                date,
                vehicle: [repair.header.year, repair.header.make, repair.header.model].filter(Boolean).join(" "),
                hours: Number(operation.hours) || 0,
            });
            operationMap.set(key, current);
        }
    }

    const processedPaystubs = paystubs
        .filter(paystub => paystub.status === "processed" && paystub.extraction?.payDate)
        .sort((left, right) => payDateTime(left.extraction?.payDate) - payDateTime(right.extraction?.payDate));

    for (const paystub of processedPaystubs) {
        const extraction = paystub.extraction!;
        const date = parsePayDate(extraction.payDate);
        if (!date) continue;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const month = monthMap.get(key);
        if (month) month.earnings += extraction.grossPay ?? 0;
    }

    const paychecks = processedPaystubs.slice(-12).map(paystub => ({
        label: paystub.extraction!.payDate ?? "",
        gross: paystub.extraction!.grossPay ?? 0,
        net: paystub.extraction!.netPay ?? 0,
        hours: paystub.extraction!.flatRateHours ?? 0,
    }));

    const topOperations = [...operationMap.values()]
        .sort((left, right) => right.hours - left.hours || right.count - left.count)
        .slice(0, 8);

    const buildSlice = (
        selectedRepairs: typeof repairs,
        selectedPaystubs: typeof processedPaystubs,
        estimateForDate?: string
    ): ReportSlice => {
        const operations = new Map<string, OperationReportRow>();
        let hours = 0;
        let verified = 0;
        let sliceIssues = 0;
        let slicePending = 0;

        selectedRepairs.forEach(repair => {
            hours += repair.operations.reduce((sum, operation) => sum + (Number(operation.hours) || 0), 0);
            const status = repair.payrollVerification?.status ?? "pending";
            if (status === "verified" || status === "resolved") verified += 1;
            else if (status === "issue") sliceIssues += 1;
            else slicePending += 1;
            repair.operations.forEach(operation => {
                const description = operation.description.trim() || "Unlabeled operation";
                const key = description.toUpperCase();
                const current = operations.get(key) ?? { description, count: 0, hours: 0, repairs: [] };
                current.count += 1;
                current.hours += Number(operation.hours) || 0;
                current.repairs.push({
                    id: repair.id,
                    repairOrderNumber: repair.header.repairOrderNumber,
                    date: repair.completedDate ?? repair.header.repairDate,
                    vehicle: [repair.header.year, repair.header.make, repair.header.model].filter(Boolean).join(" "),
                    hours: Number(operation.hours) || 0,
                });
                operations.set(key, current);
            });
        });

        const slicePaychecks = selectedPaystubs.map(paystub => ({
            label: paystub.extraction!.payDate ?? "",
            gross: paystub.extraction!.grossPay ?? 0,
            net: paystub.extraction!.netPay ?? 0,
            hours: paystub.extraction!.flatRateHours ?? 0,
        }));

        const importedGross = slicePaychecks.reduce((sum, paycheck) => sum + paycheck.gross, 0);
        const importedNet = slicePaychecks.reduce((sum, paycheck) => sum + paycheck.net, 0);
        const datedPaystubs = estimateForDate
            ? processedPaystubs.filter(paystub => {
                const payDate = parsePayDate(paystub.extraction?.payDate);
                return payDate ? localDateKey(payDate) <= estimateForDate : false;
            })
            : [];
        // Dates before the first imported statement use that first statement as
        // their baseline. Later statements never change an already-dated day.
        const estimatePaystubs = datedPaystubs.length ? datedPaystubs : processedPaystubs.slice(0, 1);
        const historicalGross = estimatePaystubs.reduce((sum, paystub) => sum + (paystub.extraction?.grossPay ?? 0), 0);
        const historicalNet = estimatePaystubs.reduce((sum, paystub) => sum + (paystub.extraction?.netPay ?? 0), 0);
        const netToGrossRate = historicalGross > 0 ? historicalNet / historicalGross : 1;
        const estimatedGross = estimateForDate ? hours * settings.flatRatePay : importedGross;

        return {
            repairs: selectedRepairs.length,
            hours,
            earnings: estimatedGross,
            netEarnings: estimateForDate ? estimatedGross * netToGrossRate : importedNet,
            verifiedRepairs: verified,
            issues: sliceIssues,
            pending: slicePending,
            topOperations: [...operations.values()].sort((left, right) => right.hours - left.hours || right.count - left.count).slice(0, 8),
            paychecks: slicePaychecks,
        };
    };

    const monthDetails = Object.fromEntries(months.map(month => {
        const monthRepairs = repairs.filter(repair => (repair.completedDate ?? repair.header.repairDate).slice(0, 7) === month.key);
        const monthPaystubs = processedPaystubs.filter(paystub => {
            const date = parsePayDate(paystub.extraction?.payDate);
            return date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === month.key : false;
        });
        const [year, monthNumber] = month.key.split("-").map(Number);
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dayKey = `${month.key}-${String(day).padStart(2, "0")}`;
            const dayRepairs = monthRepairs.filter(repair => (repair.completedDate ?? repair.header.repairDate).slice(0, 10) === dayKey);
            const dayPaystubs = monthPaystubs.filter(paystub => {
                const date = parsePayDate(paystub.extraction?.payDate);
                return date?.getDate() === day;
            });
            return { key: dayKey, label: String(day), ...buildSlice(dayRepairs, dayPaystubs, dayKey) };
        });
        return [month.key, { key: month.key, label: month.label, ...buildSlice(monthRepairs, monthPaystubs), days }];
    }));

    return {
        months,
        monthDetails,
        paychecks,
        topOperations,
        totalRepairs,
        totalHours,
        averageHoursPerRepair: totalRepairs ? totalHours / totalRepairs : 0,
        verifiedRepairs,
        issues,
        pending,
        verifiedRate: totalRepairs ? verifiedRepairs / totalRepairs : 0,
        averageWeeklyGross: financial.averageWeeklyGross,
        projectedAnnualIncome: financial.projectedAnnualIncome,
        yearToDateGross: financial.yearToDateGross,
    };
}

function localDateKey(value: Date): string {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function parsePayDate(value?: string): Date | undefined {
    if (!value) return undefined;
    const [month, day, year] = value.split("/").map(Number);
    if (!month || !day || !year) return undefined;
    return new Date(year, month - 1, day);
}

function payDateTime(value?: string): number {
    return parsePayDate(value)?.getTime() ?? 0;
}
