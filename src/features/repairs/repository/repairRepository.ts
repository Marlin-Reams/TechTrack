import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    updateDoc,
    where,
    type DocumentData,
    type QuerySnapshot,
    type QueryDocumentSnapshot,
} from "firebase/firestore";
import {FirebaseError} from "firebase/app";

import {
    db,
    getCurrentUserId,
} from "../../../firebase/repositoryHelpers.ts";

import type { RepairRecord } from "../repair-entry/types/RepairRecord";
import type { StoredRepair } from "../types/StoredRepair";

/* -------------------------------------------------------------------------- */
/*                               Private Helpers                              */
/* -------------------------------------------------------------------------- */
import {
    isThisWeek,
} from "../../dashboard/services/dateUtils";

function parseLocalDate(dateString: string): Date {

    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day);

}

export async function getCompletedRepairsForWeek(): Promise<StoredRepair[]> {

    const repairs = await getCompletedRepairs();

    return repairs.filter(repair => {

        const workDate =
            repair.completedDate ??
            repair.header.repairDate;

        return isThisWeek(
            parseLocalDate(workDate)
        );

    });

}


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

export async function getCompletedRepairsForMonth(
    year: number,
    monthIndex: number
): Promise<StoredRepair[]> {
    const start = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
    const nextMonth = new Date(year, monthIndex + 1, 1);
    const end = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

    try {
        const snapshot = await getDocs(query(
            getRepairCollection(),
            where("status", "==", "completed"),
            where("completedDate", ">=", start),
            where("completedDate", "<", end),
            orderBy("completedDate", "asc")
        ));

        return snapshot.docs.map(mapRepair);
    }
    catch (error) {
        // Keep the calendar usable while its new composite index builds.
        if (error instanceof FirebaseError &&
            error.code === "failed-precondition") {
            const repairs = await getCompletedRepairs();
            return repairs.filter((repair) => {
                const date = repair.completedDate ?? repair.header.repairDate;
                return date >= start && date < end;
            });
        }

        throw error;
    }
}

export type RepairPageCursor = QueryDocumentSnapshot<DocumentData>;

export interface CompletedRepairPage {
    repairs: StoredRepair[];
    cursor: RepairPageCursor | null;
    hasMore: boolean;
}

export async function getCompletedRepairsPage(
    pageSize: number,
    cursor: RepairPageCursor | null = null
): Promise<CompletedRepairPage> {
    const constraints = [
        where("status", "==", "completed"),
        orderBy("createdAt", "desc"),
        ...(cursor ? [startAfter(cursor)] : []),
        limit(pageSize + 1),
    ];

    let snapshot: QuerySnapshot<DocumentData>;

    try {
        snapshot = await getDocs(query(
            getRepairCollection(),
            ...constraints
        ));
    }
    catch (error) {
        // Keep history usable while a newly deployed composite index builds.
        if (error instanceof FirebaseError &&
            error.code === "failed-precondition") {
            return {
                repairs: await getCompletedRepairs(),
                cursor: null,
                hasMore: false,
            };
        }

        throw error;
    }
    const hasMore = snapshot.docs.length > pageSize;
    const pageDocuments = snapshot.docs.slice(0, pageSize);

    return {
        repairs: pageDocuments.map(mapRepair),
        cursor: pageDocuments.at(-1) ?? null,
        hasMore,
    };
}
