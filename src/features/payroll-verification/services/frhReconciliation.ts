import type { StoredRepair } from "../../repairs/types/StoredRepair";
import type { FrhParseResult } from "./frhParser";

export type FrhMatchStatus =
    | "exact-wip" | "already-completed" | "already-verified"
    | "hours-mismatch" | "not-in-techtrack" | "duplicate-techtrack"
    | "duplicate-report" | "review-required";

export interface FrhMatch {
    ro: string;
    frhHours: number;
    techTrackHours: number | null;
    status: FrhMatchStatus;
    repairId: string | null;
}

const cents = (hours: number) => Math.round(hours * 100);

/** Read-only reconciliation. No report row is considered payroll verified. */
export function compareFrhToRepairs(report: FrhParseResult, repairs: StoredRepair[]): FrhMatch[] {
    const byRo = new Map<string, StoredRepair[]>();
    for (const repair of repairs) {
        const ro = String(repair.header.repairOrderNumber ?? "").trim();
        if (!ro) continue;
        byRo.set(ro, [...(byRo.get(ro) ?? []), repair]);
    }
    const counts = new Map<string, number>();
    for (const row of report.rows) counts.set(row.ro, (counts.get(row.ro) ?? 0) + 1);
    return report.rows.map(row => {
        const candidates = byRo.get(row.ro) ?? [];
        const repair = candidates.length === 1 ? candidates[0] : null;
        const techTrackHours = repair
            ? repair.operations.reduce((sum, operation) => sum + (Number(operation.hours) || 0), 0)
            : null;
        let status: FrhMatchStatus;
        if ((counts.get(row.ro) ?? 0) > 1) status = "duplicate-report";
        else if (candidates.length > 1) status = "duplicate-techtrack";
        else if (!repair) status = "not-in-techtrack";
        else if (report.warnings.length > 0 || !report.readyForComparison) status = "review-required";
        else if (cents(techTrackHours ?? 0) !== cents(row.hours)) status = "hours-mismatch";
        else if (repair.payrollVerification?.status === "verified" || repair.payrollVerification?.status === "resolved") status = "already-verified";
        else if (repair.status === "completed") status = "already-completed";
        else status = "exact-wip";
        return { ro: row.ro, frhHours: row.hours, techTrackHours, status, repairId: repair?.id ?? null };
    });
}
