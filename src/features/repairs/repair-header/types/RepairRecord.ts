import type { Operation } from "../../operations/types/Operation";
import type { RepairHeader } from "../../repair-header/types/RepairHeader";

export interface RepairRecord {
    header: RepairHeader;
    operations: Operation[];
}