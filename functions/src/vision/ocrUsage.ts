export const OCR_MONTHLY_FREE_LIMIT = 1000;

async function getAdminFirestore() {
    const app = await import("firebase-admin/app");
    const firestore = await import("firebase-admin/firestore");

    if (app.getApps().length === 0) {
        app.initializeApp();
    }

    return firestore.getFirestore();
}

export function getOcrBillingMonth(date = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;

    if (!year || !month) {
        throw new Error("Unable to determine OCR billing month.");
    }

    return `${year}-${month}`;
}

async function getUsageDocument(month: string) {
    return (await getAdminFirestore())
        .collection("systemUsage")
        .doc(`googleVision-${month}`);
}

export async function getOcrUsage() {
    const month = getOcrBillingMonth();
    const snapshot = await (await getUsageDocument(month)).get();

    return {
        month,
        count: Number(snapshot.data()?.count ?? 0),
        monthlyFreeLimit: OCR_MONTHLY_FREE_LIMIT,
    };
}

export async function recordOcrUsage(pageCount: number) {
    const month = getOcrBillingMonth();
    const {FieldValue} = await import("firebase-admin/firestore");

    await (await getUsageDocument(month)).set({
        month,
        count: FieldValue.increment(pageCount),
        updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});

    return getOcrUsage();
}
