import { useState } from "react";

import "./PayrollVerificationHistory.css";

interface PayrollIssueFormProps {
    initialIssueType?: string;

    initialNotes?: string;

    onSave: (
        issueType: string,
        notes: string
    ) => void;

    onCancel: () => void;
}

export default function PayrollIssueForm({
    initialIssueType = "",
    initialNotes = "",
    onSave,
    onCancel,
}: PayrollIssueFormProps) {

    const [issueType, setIssueType] =
        useState(initialIssueType);

    const [notes, setNotes] =
        useState(initialNotes);

    const canSave =
        issueType.trim().length > 0 &&
        notes.trim().length > 0;

    const isEditing =
        initialIssueType !== "" ||
        initialNotes !== "";

    return (

        <section className="payroll-verification-section">

            <h2>
                {isEditing
                    ? "Edit Payroll Issue"
                    : "Report Payroll Issue"}
            </h2>

            <div className="payroll-verification-grid">

                <div className="payroll-item">

                    <label>Issue Type</label>

                    <select
                        value={issueType}
                        onChange={(event) =>
                            setIssueType(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select Issue
                        </option>

                        <option value="Hours Incorrect">
                            Hours Incorrect
                        </option>

                        <option value="Operation Missing">
                            Operation Missing
                        </option>

                        <option value="Incorrect Pay Rate">
                            Incorrect Pay Rate
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>

                <div className="payroll-item payroll-item-full">

                    <label>Notes</label>

                    <textarea
                        rows={5}
                        value={notes}
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                    />

                </div>

            </div>

            <div className="payroll-verification-actions">

                <button
                    disabled={!canSave}
                    onClick={() =>
                        onSave(
                            issueType.trim(),
                            notes.trim()
                        )
                    }
                >
                    {isEditing
                        ? "Save Changes"
                        : "Report Issue"}
                </button>

                <button onClick={onCancel}>
                    Cancel
                </button>

            </div>

        </section>

    );

}