import { updateRepair } from "../../repairs/repository/repairRepository";

import type { RepairRecord } from "../../repairs/repair-entry/types/RepairRecord";

export async function savePayrollVerification(
    repairId: string,
    repairRecord: RepairRecord,
) {
    await updateRepair(repairId, repairRecord);
}