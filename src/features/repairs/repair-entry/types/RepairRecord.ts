import type { RepairHeader } from "../../repair-header/types/RepairHeader";
import type { Operation } from "../../operations/types/Operation";
import type { RepairNote } from "../../notes/types/RepairNote";
import type { RepairAttachment } from "../../attachments/types/RepairAttachment";
import type { RepairStatus } from "../../types/RepairStatus";
import type { PayrollVerification } from "../../../payroll-verification/types/PayrollVerification";

export interface RepairRecord {
    status: RepairStatus;

    header: RepairHeader;
    operations: Operation[];
    notes: RepairNote;
    attachments: RepairAttachment[];
    payrollVerification: PayrollVerification;
}