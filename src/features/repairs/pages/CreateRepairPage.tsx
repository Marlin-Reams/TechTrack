import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "./CreateRepairPage.css";
import RepairStatusSection from "../repair-status/components/RepairStatusSection";
import RepairHeader from "../repair-header/components/RepairHeader";
import OperationsSection from "../operations/components/OperationsSection";
import NotesSection from "../notes/components/NotesSection";
import AttachmentsSection from "../attachments/components/AttachmentsSection";

import {
    createRepair,
    getRepair,
    updateRepair,
} from "../repository/repairRepository";

import { createRepairRecord } from "../repair-entry/services/repairFactory";

import type { RepairRecord } from "../repair-entry/types/RepairRecord";

type SaveStatus =
    | "idle"
    | "saving"
    | "saved"
    | "error";

export default function CreateRepairPage() {
    const { repairId } = useParams();

    const isEditing = repairId !== undefined;

    const [repairRecord, setRepairRecord] =
        useState<RepairRecord>(createRepairRecord());

    const [originalRepair, setOriginalRepair] =
        useState<RepairRecord | null>(null);

    const [isDirty, setIsDirty] =
        useState(false);

    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>("idle");

    const [lastSaved, setLastSaved] =
        useState<Date | null>(null);

        const [isLoading, setIsLoading] =
    useState(isEditing);

    const saveTimer = useRef<number | null>(null);

    useEffect(() => {

    if (!repairId) {

        setRepairRecord(createRepairRecord());
        setOriginalRepair(null);
        setIsDirty(false);
        setSaveStatus("idle");
        setLastSaved(null);
        setIsLoading(false);

        return;
    }

    const id = repairId;

    async function loadRepair() {

        try {

            setIsLoading(true);

            const repair = await getRepair(id);

            const normalizedRepair: RepairRecord = {
                ...repair,
                status: repair.status ?? "active",
            };

            setRepairRecord(normalizedRepair);
            setOriginalRepair(normalizedRepair);
            setIsDirty(false);
        }
        catch (error) {

            console.error(error);

        }
        finally {

            setIsLoading(false);

        }

    }

    loadRepair();

}, [repairId]);

    useEffect(() => {
        if (!isEditing || !originalRepair) {
            return;
        }

        setIsDirty(
            JSON.stringify(originalRepair) !==
            JSON.stringify(repairRecord)
        );
    }, [isEditing, originalRepair, repairRecord]);

    useEffect(() => {
        return () => {
            if (saveTimer.current) {
                window.clearTimeout(saveTimer.current);
            }
        };
    }, []);

    async function handleSaveRepair() {
        setSaveStatus("saving");

        if (saveTimer.current) {
            window.clearTimeout(saveTimer.current);
        }

        try {
            if (isEditing && repairId) {
                await updateRepair(repairId, repairRecord);

                setOriginalRepair(repairRecord);
                setIsDirty(false);
            }
            else {
                await createRepair(repairRecord);

                setRepairRecord(createRepairRecord());
            }

            setLastSaved(new Date());
            setSaveStatus("saved");

            saveTimer.current = window.setTimeout(() => {
                setSaveStatus("idle");
            }, 2000);
        }
        catch (error) {
            console.error(error);

            setSaveStatus("error");
        }
    }

    let buttonText = isEditing
        ? "Update Repair"
        : "Save Repair";

    if (isEditing && !isDirty && saveStatus === "idle") {
        buttonText = "No Changes";
    }

    if (saveStatus === "saving") {
        buttonText = "Saving...";
    }

    if (saveStatus === "saved") {
        buttonText = "✓ Saved";
    }

    if (saveStatus === "error") {
        buttonText = "Save Failed";
    }

    if (isLoading) {
    return (
        <main className="create-repair-page">
            <h2>Loading Repair...</h2>
        </main>
    );
}

    return (
        <main className="create-repair-page">

            <RepairStatusSection
                status={repairRecord.status}
                setRepairRecord={setRepairRecord}
            />



            <RepairHeader
                header={repairRecord.header}
                setRepairRecord={setRepairRecord}
            />

            <OperationsSection
                operations={repairRecord.operations}
                setRepairRecord={setRepairRecord}
            />

            <NotesSection
                note={repairRecord.notes}
                setRepairRecord={setRepairRecord}
            />

            <AttachmentsSection
                attachments={repairRecord.attachments}
                setRepairRecord={setRepairRecord}
            />

            <div className="repair-actions">
                <button
                    className="save-repair-button"
                    onClick={handleSaveRepair}
                    disabled={
                        saveStatus === "saving" ||
                        (isEditing && !isDirty)
                    }
                >
                    {buttonText}
                </button>

                {lastSaved && (
                    <div className="save-status">
                        Last saved:{" "}
                        {lastSaved.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </div>
                )}
            </div>

        </main>
    );
}