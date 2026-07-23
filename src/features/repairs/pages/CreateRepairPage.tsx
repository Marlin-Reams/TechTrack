import { useState } from "react";

import "./CreateRepairPage.css";

import RepairHeader from "../repair-header/components/RepairHeader";
import OperationsSection from "../operations/components/OperationsSection";
import NotesSection from "../notes/components/NotesSection";
import AttachmentsSection from "../attachments/components/AttachmentsSection";

import { createRepairRecord } from "../repair-entry/services/repairFactory";
import type { RepairRecord } from "../repair-entry/types/RepairRecord";

export default function CreateRepairPage() {
    const [repairRecord, setRepairRecord] =
        useState<RepairRecord>(createRepairRecord());

    function handleSaveRepair() {
        console.log(repairRecord);
    }

    return (
        <main className="create-repair-page">

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
                >
                    Save Repair
                </button>
            </div>

        </main>
    );
}