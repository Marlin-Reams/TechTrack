import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    type QueryDocumentSnapshot,
} from "firebase/firestore";

import {
    db,
    getCurrentUserId,
} from "../../../firebase/repositoryHelpers.ts";

import type { RepairRecord } from "../repair-entry/types/RepairRecord";
import type { StoredRepair } from "../types/StoredRepair";

/* -------------------------------------------------------------------------- */
/*                               Private Helpers                              */
/* -------------------------------------------------------------------------- */



function getRepairCollection() {
    return collection(
        db,
        "users",
        getCurrentUserId(),
        "repairs"
    );
}

function getRepairDocument(repairId: string) {
    return doc(
        db,
        "users",
        getCurrentUserId(),
        "repairs",
        repairId
    );
}

function mapRepair(
    snapshot: QueryDocumentSnapshot
): StoredRepair {
    return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<StoredRepair, "id">),
    };
}

/* -------------------------------------------------------------------------- */
/*                              Public Repository                             */
/* -------------------------------------------------------------------------- */

export async function createRepair(
    repairRecord: RepairRecord
): Promise<string> {
    const documentReference = await addDoc(
        getRepairCollection(),
        {
            ...repairRecord,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );

    return documentReference.id;
}

export async function getRepair(
    repairId: string
): Promise<StoredRepair> {
    const repairSnapshot = await getDoc(
        getRepairDocument(repairId)
    );

    if (!repairSnapshot.exists()) {
        throw new Error("Repair not found.");
    }

    return {
        id: repairSnapshot.id,
        ...(repairSnapshot.data() as Omit<StoredRepair, "id">),
    };
}

export async function getRepairs(): Promise<StoredRepair[]> {
    const repairQuery = query(
        getRepairCollection(),
        orderBy("createdAt", "desc")
    );

    const repairSnapshots = await getDocs(repairQuery);

    return repairSnapshots.docs.map(mapRepair);
}
export async function getRecentRepairs(
    limitCount: number
): Promise<StoredRepair[]> {
    const repairs = await getRepairs();

    return repairs.slice(0, limitCount);
}
export async function getOpenRepairs(): Promise<StoredRepair[]> {
    const repairs = await getRepairs();

    return repairs.filter(
        (repair) => repair.status !== "completed"
    );
}

export async function getCompletedRepairs(): Promise<StoredRepair[]> {
    const repairs = await getRepairs();

    return repairs.filter(
        (repair) => repair.status === "completed"
    );
}

export async function updateRepair(
    repairId: string,
    repairRecord: RepairRecord
): Promise<void> {
    await updateDoc(
        getRepairDocument(repairId),
        {
            ...repairRecord,
            updatedAt: serverTimestamp(),
        }
    );
}

export async function deleteRepair(
    repairId: string
): Promise<void> {
    await deleteDoc(
        getRepairDocument(repairId)
    );
}