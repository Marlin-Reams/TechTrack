import type { Timestamp } from "firebase/firestore";

import type { RepairRecord } from "./RepairRecord";

export interface RepairDocument extends RepairRecord {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}