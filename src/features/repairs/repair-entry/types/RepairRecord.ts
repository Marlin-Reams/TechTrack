import type { RepairHeader } from "../../repair-header/types/RepairHeader";
import type { Operation } from "../../operations/types/Operation";
import type { RepairNote } from "../../notes/types/RepairNote";
import type { RepairAttachment } from "../../attachments/types/RepairAttachment";
import type { RepairStatus } from "../../types/RepairStatus";

export interface RepairRecord {
    status: RepairStatus;

    header: RepairHeader;
    operations: Operation[];
    notes: RepairNote;
    attachments: RepairAttachment[];
}