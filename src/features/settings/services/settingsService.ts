import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "../../../firebase";

import type { UserSettings } from "../types/UserSettings";

const defaultSettings: UserSettings = {
    weeklyFlagHourGoal: 50,
    flatRatePay: 38,
};

function getCurrentUserId(): string {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    return user.uid;
}

function getSettingsDocument() {
    return doc(
        db,
        "users",
        getCurrentUserId(),
        "settings",
        "preferences"
    );
}

export async function getUserSettings(): Promise<UserSettings> {
    const settingsSnapshot =
        await getDoc(getSettingsDocument());

    if (!settingsSnapshot.exists()) {
        await setDoc(
            getSettingsDocument(),
            defaultSettings
        );

        return defaultSettings;
    }

    return settingsSnapshot.data() as UserSettings;
}

export async function updateUserSettings(
    settings: UserSettings
): Promise<void> {
    await setDoc(
        getSettingsDocument(),
        settings
    );
}