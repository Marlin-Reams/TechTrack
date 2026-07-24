import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../../../firebase";

import type {
    Paystub,
    PayrollExtraction,
    PaystubStatus,
} from "../types/Paystub";

function getCurrentUserId(): string {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    return user.uid;
}

function getPaystubCollection() {

    return collection(
        db,
        "users",
        getCurrentUserId(),
        "paystubs"
    );
}

function getPaystubDocument(
    paystubId: string
) {

    return doc(
        db,
        "users",
        getCurrentUserId(),
        "paystubs",
        paystubId
    );
}

export async function createPaystub(
    paystub: Omit<Paystub, "id">
): Promise<string> {

    const document = await addDoc(
        getPaystubCollection(),
        paystub
    );

    return document.id;
}

export async function getPaystubs(): Promise<Paystub[]> {

    const paystubQuery = query(
        getPaystubCollection(),
        orderBy("uploadDate", "desc")
    );

    const snapshot =
        await getDocs(paystubQuery);

    return snapshot.docs.map((document) => ({

        id: document.id,

        ...(document.data() as Omit<Paystub, "id">),

    }));
}

export async function updatePaystubStatus(
    paystubId: string,
    status: PaystubStatus
): Promise<void> {

    await updateDoc(
        getPaystubDocument(paystubId),
        {
            status,
        }
    );
}

export async function updatePaystubExtraction(
    paystubId: string,
    extraction: PayrollExtraction,
    parserVersion: string,
    parserConfidence: number
): Promise<void> {

    await updateDoc(
        getPaystubDocument(paystubId),
        {
            status: "processed",
            extraction,
            parserVersion,
            parserConfidence,
            processingError: null,
        }
    );
}

export async function markPaystubFailed(
    paystubId: string,
    error: string
): Promise<void> {

    await updateDoc(
        getPaystubDocument(paystubId),
        {
            status: "failed",
            processingError: error,
        }
    );
}

export async function deletePaystub(
    paystubId: string
): Promise<void> {

    await deleteDoc(
        getPaystubDocument(paystubId)
    );
}