import {
    updateRepair,
} from "../../repairs/repository/repairRepository";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

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