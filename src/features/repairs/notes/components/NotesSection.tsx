import "./NotesSection.css";

import type { Dispatch, SetStateAction } from "react";

import type { RepairNote } from "../types/RepairNote";
import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

type NotesSectionProps = {
    note: RepairNote;
    setRepairRecord: Dispatch<SetStateAction<RepairRecord>>;
};

export default function NotesSection({
    note,
    setRepairRecord,
}: NotesSectionProps) {

    function updateNote(content: string) {
        setRepairRecord((previous) => ({
            ...previous,
            notes: {
                content,
            },
        }));
    }

    return (
        <section className="notes-section">
            <h2>Repair Notes</h2>

            <textarea
                placeholder="Document diagnostics, repairs performed, observations, recommendations, measurements, test results..."
                value={note.content}
                onChange={(e) => updateNote(e.target.value)}
                rows={12}
            />

            <div className="notes-footer">
                <span>{note.content.length} characters</span>
            </div>
        </section>
    );
}