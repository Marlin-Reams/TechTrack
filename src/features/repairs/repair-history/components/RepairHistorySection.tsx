import { useEffect, useState } from "react";

import type { StoredRepair } from "../../types/StoredRepair";

import RepairCard from "../../repair-card/RepairCard";

import styles from "./RepairHistoryList.module.css";

type RepairHistorySectionProps = {
    title: string;
    repairs: StoredRepair[];
    expandAll?: boolean;
};

export default function RepairHistorySection({
    title,
    repairs,
    expandAll = false,
}: RepairHistorySectionProps) {

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (expandAll) {
            setExpanded(true);
        }
    }, [expandAll]);

    return (
        <section className={styles.historySection}>

            <button
                className={styles.sectionToggle}
                onClick={() =>
                    setExpanded(!expanded)
                }
            >
                <span>
                    <span className={styles.sectionChevron}>{expanded ? "−" : "+"}</span>
                    {title}
                </span>

                <span className={styles.sectionCount}>
                    {repairs.length}
                </span>

            </button>

            {expanded && (

                <div className={styles.repairsGrid}>

                    {repairs.map((repair) => (

                        <RepairCard
                            key={repair.id}
                            repair={repair}
                        />

                    ))}

                </div>

            )}

        </section>
    );

}
