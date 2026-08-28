import "./PayrollVerificationHistory.css";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

interface PayrollVerificationHistoryProps {
    repairRecord: RepairRecord;
}

export default function PayrollVerificationHistory({
    repairRecord,
}: PayrollVerificationHistoryProps) {

    const payroll = repairRecord.payrollVerification;

    const expectedHours = repairRecord.operations.reduce(
        (total, operation) => total + operation.hours,
        0
    );

    const difference =
        payroll.paidHours === undefined
            ? undefined
            : payroll.paidHours - expectedHours;

    return (

        <section className="payroll-verification-section">

            <h2>Payroll Verification</h2>

            <div className="payroll-verification-grid">

                <div className="payroll-item">
                    <label>Status</label>
                    <span>{payroll.status}</span>
                </div>

                <div className="payroll-item">
                    <label>Expected Hours</label>
                    <span>{expectedHours.toFixed(1)}</span>
                </div>

                <div className="payroll-item">
                    <label>Paid Hours</label>
                    <span>
                        {payroll.paidHours === undefined
                            ? "—"
                            : payroll.paidHours.toFixed(1)}
                    </span>
                </div>

                <div className="payroll-item">
                    <label>Difference</label>
                    <span>
                        {difference === undefined
                            ? "—"
                            : difference.toFixed(1)}
                    </span>
                </div>

                <div className="payroll-item">
                    <label>Verified Date</label>
                    <span>
                        {payroll.verifiedDate
                            ? new Date(
                                payroll.verifiedDate
                            ).toLocaleString()
                            : "—"}
                    </span>
                </div>

                {(payroll.status === "issue" ||
                    payroll.status === "resolved") && (

                    <>
                        {payroll.issueType && (

                            <div className="payroll-item">
                                <label>Issue Type</label>
                                <span>{payroll.issueType}</span>
                            </div>

                        )}

                        {payroll.issueNotes && (

                            <div className="payroll-item payroll-item-full">
                                <label>Issue Notes</label>
                                <span>{payroll.issueNotes}</span>
                            </div>

                        )}

                    </>

                )}

                {payroll.status === "resolved" && (

                    <>

                        {payroll.resolutionNotes && (

                            <div className="payroll-item payroll-item-full">
                                <label>Resolution Notes</label>
                                <span>{payroll.resolutionNotes}</span>
                            </div>

                        )}

                        <div className="payroll-item">
                            <label>Resolved Date</label>
                            <span>
                                {payroll.resolvedDate
                                    ? new Date(
                                        payroll.resolvedDate
                                    ).toLocaleString()
                                    : "—"}
                            </span>
                        </div>

                    </>

                )}

                {(payroll.operationAdjustments?.length ?? 0) > 0 && (
                    <div className="payroll-item payroll-item-full payroll-adjustment-history">
                        <label>Labor correction history</label>
                        {[...(payroll.operationAdjustments ?? [])].reverse().map((adjustment, index) => (
                            <span key={`${adjustment.date}-${index}`}>
                                {adjustment.previousExpectedHours.toFixed(1)} → {adjustment.correctedExpectedHours.toFixed(1)} hours · {adjustment.reason} · {new Date(adjustment.date).toLocaleString()}
                            </span>
                        ))}
                    </div>
                )}

            </div>

        </section>

    );

}
