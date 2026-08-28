import {
    updateRepair,
} from "../../repairs/repository/repairRepository";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";
import type { Operation } from "../../repairs/operations/types/Operation";

export async function verifyPayroll(
    repairId: string,
    repairRecord: RepairRecord
) {

    await updateRepair(repairId, {

        ...repairRecord,

        payrollVerification: {

            ...repairRecord.payrollVerification,

            status: "verified",

            verifiedDate: new Date().toISOString(),

        },

    });

}

export async function updatePayrollVerification(
    repairId: string,
    repairRecord: RepairRecord,
    paidHours: number,
    notes: string
) {

    await updateRepair(repairId, {

        ...repairRecord,

        payrollVerification: {

            ...repairRecord.payrollVerification,

            status: "verified",

            paidHours,

            issueNotes: notes,

        },

    });

}

export async function reportPayrollIssue(
    repairId: string,
    repairRecord: RepairRecord,
    issueType: string,
    notes: string
) {

    await updateRepair(repairId, {

        ...repairRecord,

        payrollVerification: {

            ...repairRecord.payrollVerification,

            status: "issue",

            issueType,

            issueNotes: notes,

        },

    });

}

export async function resolvePayrollIssue(
    repairId: string,
    repairRecord: RepairRecord,
    resolutionNotes: string
) {

    await updateRepair(repairId, {

        ...repairRecord,

        payrollVerification: {

            ...repairRecord.payrollVerification,

            status: "resolved",

            resolutionNotes,

            resolvedDate: new Date().toISOString(),

        },

    });

}

export async function savePayrollOperationCorrection(
    repairId: string,
    repairRecord: RepairRecord,
    operations: Operation[],
    reason: string
) {
    const previousExpectedHours = repairRecord.operations.reduce(
        (sum, operation) => sum + (Number(operation.hours) || 0), 0
    );
    const correctedExpectedHours = operations.reduce(
        (sum, operation) => sum + (Number(operation.hours) || 0), 0
    );
    const previousStatus = repairRecord.payrollVerification.status;
    const shouldReopen = previousStatus === "verified" || previousStatus === "resolved";

    const updatedRecord: RepairRecord = {
        ...repairRecord,
        operations,
        payrollVerification: {
            ...repairRecord.payrollVerification,
            expectedHours: correctedExpectedHours,
            status: shouldReopen ? "issue" : previousStatus,
            issueType: shouldReopen
                ? "Labor correction after verification"
                : repairRecord.payrollVerification.issueType,
            issueNotes: shouldReopen
                ? reason
                : repairRecord.payrollVerification.issueNotes,
            operationAdjustments: [
                ...(repairRecord.payrollVerification.operationAdjustments ?? []),
                {
                    date: new Date().toISOString(),
                    reason,
                    previousExpectedHours,
                    correctedExpectedHours,
                    changedBy: "payroll-review",
                },
            ],
        },
    };

    await updateRepair(repairId, updatedRecord);
    return updatedRecord;
}
