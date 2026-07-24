import { auth, db } from ".";

export { db };

export function getCurrentUserId(): string {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    return user.uid;
}