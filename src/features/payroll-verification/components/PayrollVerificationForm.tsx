import "./PayrollVerificationHistory.css";

import { useState } from "react";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

interface PayrollVerificationFormProps {
    repairRecord: RepairRecord;

    onSave: (
        paidHours: number,
        notes: string
    ) => void;

    onCancel: () => void;
}

export default function PayrollVerificationForm({
    repairRecord,
    onSave,
    onCancel,
}: PayrollVerificationFormProps) {

    const expectedHours = repairRecord.operations.reduce(
        (total, operation) => total + operation.hours,
        0
    );

    const [paidHours, setPaidHours] = useState(
        repairRecord.payrollVerification.paidHours ?? expectedHours
    );

    const [notes, setNotes] = useState(
        repairRecord.payrollVerification.issueNotes ?? ""
    );

    const difference = paidHours - expectedHours;

    return (

        <section className="payroll-verification-section">

            <h2>Edit Payroll Verification</h2>

            <div className="payroll-verification-grid">

                <div className="payroll-item">
                    <label>Expected Hours</label>

                    <span>
                        {expectedHours.toFixed(1)}
                    </span>
                </div>

                <div className="payroll-item">

                    <label>Paid Hours</label>

                    <input
                        type="number"
                        step="0.1"
                        value={paidHours}
                        onChange={(event) =>
                            setPaidHours(
                                Number(event.target.value)
                            )
                        }
                    />

                </div>

                <div className="payroll-item">

                    <label>Difference</label>

                    <span>
                        {difference.toFixed(1)}
                    </span>

                </div>

            </div>

            <div className="payroll-item payroll-item-full">

                <label>Issue Notes</label>

                <textarea
                    rows={4}
                    value={notes}
                    onChange={(event) =>
                        setNotes(event.target.value)
                    }
                />

            </div>

            <div className="payroll-verification-actions">

                <button
                    onClick={() =>
                        onSave(
                            paidHours,
                            notes
                        )
                    }
                >
                    Save Changes
                </button>

                <button onClick={onCancel}>
                    Cancel
                </button>

            </div>

        </section>

    );

}