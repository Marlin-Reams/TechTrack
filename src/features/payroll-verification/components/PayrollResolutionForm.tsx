import "./PayrollVerificationHistory.css";

import { useState } from "react";

interface PayrollResolutionFormProps {
    issueType?: string;

    issueNotes?: string;

    resolutionNotes?: string;

    readOnly?: boolean;

    onResolve: (
        resolutionNotes: string
    ) => void;

    onCancel: () => void;
}

export default function PayrollResolutionForm({
    issueType,
    issueNotes,
    resolutionNotes = "",
    readOnly = false,
    onResolve,
    onCancel,
}: PayrollResolutionFormProps) {

    const [resolution, setResolution] =
        useState(resolutionNotes);

    const canResolve =
        readOnly || resolution.trim().length > 0;

    return (

        <section className="payroll-verification-section">

            <h2>
                {readOnly
                    ? "Payroll Issue Resolution"
                    : "Resolve Payroll Issue"}
            </h2>

            <div className="payroll-verification-grid">

                <div className="payroll-item">

                    <label>Issue Type</label>

                    <span>
                        {issueType ?? "—"}
                    </span>

                </div>

                <div className="payroll-item payroll-item-full">

                    <label>Issue Notes</label>

                    <span>
                        {issueNotes || "—"}
                    </span>

                </div>

                <div className="payroll-item payroll-item-full">

                    <label>Resolution Notes</label>

                    {readOnly ? (

                        <span>
                            {resolution || "—"}
                        </span>

                    ) : (

                        <textarea
                            rows={5}
                            value={resolution}
                            onChange={(event) =>
                                setResolution(
                                    event.target.value
                                )
                            }
                        />

                    )}

                </div>

            </div>

            <div className="payroll-verification-actions">

                {!readOnly && (

                    <button
                        disabled={!canResolve}
                        onClick={() =>
                            onResolve(
                                resolution.trim()
                            )
                        }
                    >
                        Resolve Issue
                    </button>

                )}

                <button onClick={onCancel}>
                    {readOnly ? "Close" : "Cancel"}
                </button>

            </div>

        </section>

    );

}