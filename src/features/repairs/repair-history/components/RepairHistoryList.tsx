import styles from "./RepairHistoryList.module.css";

import type { StoredRepair } from "../../types/StoredRepair";

import RepairCard from "../../repair-card/RepairCard";

interface RepairHistoryListProps {
    repairs: StoredRepair[];
}

export default function RepairHistoryList({
    repairs,
}: RepairHistoryListProps) {
    if (repairs.length === 0) {
        return (
            <p>No repairs found.</p>
        );
    }

    return (
        <div className={styles.repairsGrid}>
            {repairs.map((repair) => (
                <RepairCard
                    key={repair.id}
                    repair={repair}
                />
            ))}
        </div>
    );
}