import { useNavigate } from "react-router-dom";

import styles from "./RepairCard.module.css";

import type { StoredRepair } from "../types/StoredRepair";

import {
    repairStatusMetadata,
} from "../types/RepairStatusMetadata";

interface RepairCardProps {
    repair: StoredRepair;
}

export default function RepairHistoryCard({
    repair,
}: RepairCardProps) {
    const navigate = useNavigate();

    const vehicle = [
        repair.header.year,
        repair.header.make,
        repair.header.model,
    ]
        .filter(Boolean)
        .join(" ");

    function openRepair() {
        navigate(`/repairs/${repair.id}`);
    }

    const status = repair.status ?? "active";

    const statusColor =
        repairStatusMetadata[status].color;

    return (
        <article
            className={styles.repairCard}
            style={{
                borderTop: `6px solid ${statusColor}`,
            }}
            onClick={openRepair}
            onKeyDown={(event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openRepair();
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open repair ${repair.header.repairOrderNumber || repair.id}`}
        >
            <header className={styles.header}>
                <div className={styles.roNumber}>
                    RO #{repair.header.repairOrderNumber || "Unknown"}
                </div>

                <div className={styles.date}>
                    {repair.header.repairDate || "No Date"}
                </div>
            </header>

            <div className={styles.vehicle}>
                {vehicle || "Unknown Vehicle"}
            </div>

            <div className={styles.operations}>
                {repair.operations.length}{" "}
                {repair.operations.length === 1
                    ? "Operation"
                    : "Operations"}
            </div>
        </article>
    );
}