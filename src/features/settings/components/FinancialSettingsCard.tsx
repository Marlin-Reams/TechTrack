import { useEffect, useState } from "react";

import "./SettingsCard.css";

import SettingsField from "./SettingsField";

import {
    getUserSettings,
    updateUserSettings,
} from "../services/settingsService";

type SaveStatus =
    | "idle"
    | "saving"
    | "saved"
    | "error";

export default function FinancialSettingsCard() {

    const [weeklyGoal, setWeeklyGoal] =
        useState<number | null>(null);

    const [flatRatePay, setFlatRatePay] =
        useState<number | null>(null);

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

        if (
            weeklyGoal === null ||
            flatRatePay === null
        ) {
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

        } catch {

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

    if (
        weeklyGoal === null ||
        flatRatePay === null
    ) {
        return <p>Loading settings...</p>;
    }

    return (
        <section className="settings-card">

            <h2>Financial</h2>

            <SettingsField
                label="Weekly Flag Hour Goal"
                value={weeklyGoal}
                onChange={setWeeklyGoal}
            />

            <SettingsField
                label="Flat Rate Pay"
                value={flatRatePay}
                onChange={setFlatRatePay}
            />

            <div className="settings-actions">

                <button
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                >
                    {buttonText}
                </button>

            </div>

        </section>
    );
}