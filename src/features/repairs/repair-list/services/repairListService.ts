import {
    collection,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";

import { db } from "../../../../firebase";

import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

export async function getRepairList(): Promise<RepairRecord[]> {

    const repairsRef = collection(db, "repairs");

    const snapshot = await getDocs(
        query(
            repairsRef,
            orderBy("header.repairDate", "desc")
        )
    );

    return snapshot.docs.map(
        doc => doc.data() as RepairRecord
    );
}