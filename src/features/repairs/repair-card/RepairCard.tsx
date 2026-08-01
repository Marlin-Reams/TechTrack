import { useNavigate } from "react-router-dom";

import styles from "./RepairCard.module.css";

import type { StoredRepair } from "../types/StoredRepair";

import {
    repairStatusMetadata,
} from "../types/RepairStatusMetadata";

interface RepairCardProps {
    repair: StoredRepair;
}

export default function RepairCard({
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

    const expectedHours =
        repair.operations.reduce(
            (total, operation) =>
                total + operation.hours,
            0
        );

    const payroll =
    repair.payrollVerification ?? {
        status: "pending",
        paidHours: undefined,
    };

    const status =
        repair.status ?? "active";

    const statusColor =
        repairStatusMetadata[status].color;

    function openRepair() {

        if (status === "completed") {

            navigate(
                `/payroll-verification/${repair.id}`
            );

            return;

        }

        navigate(`/repairs/${repair.id}`);

    }

    return (

        <article
            className={styles.repairCard}
            style={{
                borderTop:
                    `6px solid ${statusColor}`,
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
            aria-label={
                `Open repair ${
                    repair.header.repairOrderNumber ||
                    repair.id
                }`
            }
        >

            <header className={styles.header}>

                <div className={styles.roNumber}>
                    RO #
                    {repair.header.repairOrderNumber ??
                        "Unknown"}
                </div>

                <div className={styles.date}>
                    {repair.header.repairDate ??
                        "No Date"}
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

            {status === "completed" && (

                <>

                    <hr />

                    <div className={styles.payrollSection}>

                        <strong>

                            {payroll.status ===
                                "pending" &&
                                "🟡 Payroll Pending"}

                            {payroll.status ===
                                "verified" &&
                                "🟢 Payroll Verified"}

                            {payroll.status ===
                                "issue" &&
                                "🔴 Payroll Issue"}

                            {payroll.status ===
                                "resolved" &&
                                "🔵 Payroll Resolved"}

                        </strong>

                        <div>

                            Expected Hours:{" "}

                            {expectedHours.toFixed(1)}

                        </div>

                        {payroll.paidHours !==
                            undefined && (

                                <div>

                                    Paid Hours:{" "}

                                    {payroll.paidHours.toFixed(
                                        1
                                    )}

                                </div>

                            )}

                    </div>

                </>

            )}

        </article>

    );

}