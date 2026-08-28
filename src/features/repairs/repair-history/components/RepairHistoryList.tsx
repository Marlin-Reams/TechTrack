
import type { StoredRepair } from "../../types/StoredRepair";

import {
    groupRepairsByDate,
} from "../../services/repairHistoryDateUtils";

import RepairHistorySection from "./RepairHistorySection";

interface RepairHistoryListProps {
    repairs: StoredRepair[];
    expandAll?: boolean;
}

export default function RepairHistoryList({
    repairs,
    expandAll = false,
}: RepairHistoryListProps) {

    if (repairs.length === 0) {
        return <>No repairs found.</>;
    }

    const sections =
        groupRepairsByDate(repairs);

    return (
        <>
            {sections.map((section) => (
                <RepairHistorySection
                    key={section.title}
                    title={section.title}
                    repairs={section.repairs}
                    expandAll={expandAll}
                />
            ))}
        </>
    );

}
