import type { ImportSession } from "../types/ImportSession";

let currentSession: ImportSession | null = null;

export function setImportSession(
    session: ImportSession,
) {
    if (currentSession) {
        for (const imageUrl of currentSession.imageUrls ?? []) {
            URL.revokeObjectURL(imageUrl);
        }
    }

    currentSession = session;
}

export function getImportSession() {
    return currentSession;
}

export function clearImportSession() {
    if (currentSession) {
        for (const imageUrl of currentSession.imageUrls ?? []) {
            URL.revokeObjectURL(imageUrl);
        }
    }

    currentSession = null;
}
