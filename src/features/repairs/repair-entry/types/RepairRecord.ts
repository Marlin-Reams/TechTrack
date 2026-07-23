import type { RepairHeader } from "../../repair-header/types/RepairHeader";
import type { Operation } from "../../operations/types/Operation";
import type { RepairNote } from "../../notes/types/RepairNote";
import type { RepairAttachment } from "../../attachments/types/RepairAttachment";

export interface RepairRecord {
    header: RepairHeader;
    operations: Operation[];
    notes: RepairNote;
    attachments: RepairAttachment[];
}