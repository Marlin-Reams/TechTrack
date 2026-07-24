import type { Timestamp } from "firebase/firestore";

import type { RepairRecord } from "../repair-entry/types/RepairRecord";

export interface StoredRepair extends RepairRecord {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}