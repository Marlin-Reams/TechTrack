import type { Timestamp } from "firebase/firestore";

import type { RepairRecord } from "../repair-entry/types/RepairRecord";

export interface StoredRepair extends RepairRecord {
    id: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;

    /**
     * The date the repair was completed/billed.
     * This is the date used for production,
     * payroll verification, reporting,
     * and financial calculations.
     */
    completedDate?: string;
}