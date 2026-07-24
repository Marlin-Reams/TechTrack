import { useEffect, useState } from "react";

import {
    getUserSettings,
    updateUserSettings,
} from "../services/settingsService";

type SaveStatus =
    | "idle"
    | "saving"
    | "saved"
    | "error";

export default function SettingsPage() {

    const [weeklyGoal, setWeeklyGoal] = useState<number | null>(null);
const [flatRatePay, setFlatRatePay] = useState<number | null>(null);

    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>("idle");

    useEffect(() => {
        async function loadSettings() {
            const settings =
                await getUserSettings();

            setWeeklyGoal(
                settings.weeklyFlagHourGoal
            );

            setFlatRatePay(
                settings.flatRatePay
            );
        }

        loadSettings();
    }, []);

    async function handleSave() {

    if (weeklyGoal === null || flatRatePay === null) {
        return;
    }

    setSaveStatus("saving");

    try {

        await updateUserSettings({
            weeklyFlagHourGoal: weeklyGoal,
            flatRatePay: flatRatePay,
        });

        setSaveStatus("saved");

        setTimeout(() => {
            setSaveStatus("idle");
        }, 2000);

    }
    catch {

        setSaveStatus("error");

    }

}

    let buttonText = "Save Settings";

    if (saveStatus === "saving") {
        buttonText = "Saving...";
    }

    if (saveStatus === "saved") {
        buttonText = "✓ Saved";
    }

    if (saveStatus === "error") {
        buttonText = "Save Failed";
    }

    if (weeklyGoal === null || flatRatePay === null) {
    return <p>Loading settings...</p>;
}

    return (
        <main>

            <h1>Settings</h1>

            <div>

                <label>
                    Weekly Flag Hour Goal
                </label>

                <input
                    type="number"
                    value={weeklyGoal}
                    onChange={(e) =>
                        setWeeklyGoal(
                            Number(e.target.value)
                        )
                    }
                />

            </div>

            <br />

            <div>

                <label>
                    Flat Rate Pay
                </label>

                <input
                    type="number"
                    value={flatRatePay}
                    onChange={(e) =>
                        setFlatRatePay(
                            Number(e.target.value)
                        )
                    }
                />

            </div>

            <br />

            <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
            >
                {buttonText}
            </button>

        </main>
    );
}