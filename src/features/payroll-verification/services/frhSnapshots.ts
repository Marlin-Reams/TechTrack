import type { FrhRow } from "./frhParser";

export interface FrhSnapshot {
    id: string;
    technicianId: string;
    storeId: string;
    from: string;
    to: string;
    printedAt: string;
    rows: FrhRow[];
}
export interface FrhSnapshotChange {
    ro: string;
    previousHours: number | null;
    currentHours: number | null;
    kind: "new" | "changed" | "removed";
}

/**
 * WTD reports are cumulative snapshots, never additive transactions.
 * A prior snapshot must be for the same technician, store and posting window.
 */
export function diffFrhSnapshots(previous: FrhSnapshot | null, current: FrhSnapshot): FrhSnapshotChange[] {
    if (previous && (previous.technicianId !== current.technicianId ||
        previous.storeId !== current.storeId ||
        previous.from !== current.from || previous.to > current.to)) {
        throw new Error("FRH snapshots have different technician, store or posting windows.");
    }
    const previousRows = new Map((previous?.rows ?? []).map(row => [row.ro, row.hours]));
    const currentRows = new Map(current.rows.map(row => [row.ro, row.hours]));
    if (previousRows.size !== (previous?.rows.length ?? 0) || currentRows.size !== current.rows.length) {
        throw new Error("Duplicate RO in FRH snapshot; review before comparing.");
    }
    const changes: FrhSnapshotChange[] = [];
    for (const [ro, hours] of currentRows) {
        const old = previousRows.get(ro);
        if (old === undefined) changes.push({ ro, previousHours: null, currentHours: hours, kind: "new" });
        else if (Math.round(old * 100) !== Math.round(hours * 100)) {
            changes.push({ ro, previousHours: old, currentHours: hours, kind: "changed" });
        }
    }
    for (const [ro, hours] of previousRows) {
        if (!currentRows.has(ro)) changes.push({ ro, previousHours: hours, currentHours: null, kind: "removed" });
    }
    return changes;
}
