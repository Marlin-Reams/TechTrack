import "./PayrollVerificationActions.css";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

interface PayrollVerificationActionsProps {
    repairRecord: RepairRecord;

    onVerify: () => void;

    onReportIssue: () => void;

    onEditVerification: () => void;

    onEditIssue: () => void;

    onResolveIssue: () => void;

    onViewResolution: () => void;
    onCorrectLabor: () => void;
}

export default function PayrollVerificationActions({
    repairRecord,
    onVerify,
    onReportIssue,
    onEditVerification,
    onEditIssue,
    onResolveIssue,
    onViewResolution,
    onCorrectLabor,
}: PayrollVerificationActionsProps) {

    const status = repairRecord.payrollVerification.status;

    return (

        <section className="payroll-verification-actions-section">

            <h2>Actions</h2>

            <p className="payroll-action-help">Correct labor articles or hours whenever the completed repair does not match payroll.</p>

            {status === "pending" && (

                <div className="payroll-verification-actions">

                    <button onClick={onVerify}>
                        Verify Payroll
                    </button>

                    <button onClick={onReportIssue}>
                        Report Issue
                    </button>

                    <button onClick={onCorrectLabor}>Correct Labor</button>

                </div>

            )}

            {status === "verified" && (

                <div className="payroll-verification-actions">

                    <button onClick={onEditVerification}>
                        Edit Verification
                    </button>

                    <button onClick={onCorrectLabor}>Correct Labor</button>

                </div>

            )}

            {status === "issue" && (

                <div className="payroll-verification-actions">

                    <button onClick={onEditIssue}>
                        Edit Issue
                    </button>

                    <button onClick={onResolveIssue}>
                        Resolve Issue
                    </button>

                    <button onClick={onCorrectLabor}>Correct Labor</button>

                </div>

            )}

            {status === "resolved" && (

                <div className="payroll-verification-actions">

                    <button onClick={onViewResolution}>
                        View Resolution
                    </button>

                    <button onClick={onCorrectLabor}>Correct Labor</button>

                </div>

            )}

        </section>

    );

}
