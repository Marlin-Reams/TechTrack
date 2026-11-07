import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db, getCurrentUserId } from "../../../firebase/repositoryHelpers";
import type { FrhSnapshot } from "./frhSnapshots";

/**
 * Persist an explicitly reviewed FRH match. This function is deliberately not
 * connected to OCR preview until report format and identity are validated.
 *
 * Transactions are idempotent by report+RO; the repair and audit are committed
 * together. Never set payroll verification to "verified".
 */
export async function confirmFrhRepair(args: {
    snapshot: FrhSnapshot;
    repairId: string;
    ro: string;
    hours: number;
    reviewedByUser: boolean;
}): Promise<"completed" | "already-completed" | "already-confirmed"> {
    if (!args.reviewedByUser) throw new Error("Explicit FRH review is required.");
    const { snapshot, repairId, ro, hours } = args;
    if (!snapshot.id || !snapshot.technicianId || !snapshot.storeId ||
        !snapshot.from || !snapshot.to || !snapshot.printedAt ||
        !/^\d{5,7}$/.test(ro) || !Number.isFinite(hours) || hours < 0) {
        throw new Error("FRH report metadata is incomplete.");
    }
    if (snapshot.rows.filter(row => row.ro === ro && Math.round(row.hours * 100) === Math.round(hours * 100)).length !== 1 ||
        snapshot.rows.filter(row => row.ro === ro).length !== 1) {
        throw new Error("FRH row must be unique and match the reviewed snapshot.");
    }
    const userId = getCurrentUserId();
    const repairRef = doc(db, "users", userId, "repairs", repairId);
    const auditRef = doc(db, "users", userId, "frhConfirmations", `${snapshot.id}_${repairId}`);
    return runTransaction(db, async transaction => {
        const [repairSnap, auditSnap] = await Promise.all([
            transaction.get(repairRef), transaction.get(auditRef),
        ]);
        if (auditSnap.exists()) return "already-confirmed" as const;
        if (!repairSnap.exists()) throw new Error("TechTrack repair no longer exists.");
        const repair = repairSnap.data();
        if (String(repair.header?.repairOrderNumber ?? "").trim() !== ro) {
            throw new Error("RO changed since FRH review.");
        }
        const operations = repair.operations as Array<{ hours: number }> | undefined;
        if (!Array.isArray(operations)) throw new Error("Repair operations are missing.");
        const actual = operations.reduce((sum, operation) => sum + Number(operation.hours || 0), 0);
        if (Math.round(actual * 100) !== Math.round(hours * 100)) {
            throw new Error("Repair hours changed since FRH review.");
        }
        const payrollStatus = repair.payrollVerification?.status ?? "pending";
        if (payrollStatus === "issue") throw new Error("Resolve payroll issue before confirming FRH.");
        const alreadyCompleted = repair.status === "completed";
        if (!alreadyCompleted && !["active", "waiting", "ready"].includes(repair.status)) {
            throw new Error("Unexpected repair status.");
        }
        if (!alreadyCompleted && (payrollStatus === "verified" || payrollStatus === "resolved")) {
            throw new Error("Verified repair cannot be auto-completed.");
        }
        transaction.set(auditRef, {
            snapshotId: snapshot.id, repairId, ro, hours,
            technicianId: snapshot.technicianId, storeId: snapshot.storeId,
            postingFrom: snapshot.from, postingTo: snapshot.to,
            printedAt: snapshot.printedAt, previousStatus: repair.status,
            payrollStatus, confirmedAt: serverTimestamp(),
        });
        if (!alreadyCompleted) {
            // Preserve every other repair field, including the existing payroll state.
            transaction.update(repairRef, {
                status: "completed",
                // Posting window is not the work date. Preserve original repair date.
                completedDate: repair.completedDate || repair.header?.repairDate,
                updatedAt: serverTimestamp(),
            });
        }
        return alreadyCompleted ? "already-completed" as const : "completed" as const;
    });
}
