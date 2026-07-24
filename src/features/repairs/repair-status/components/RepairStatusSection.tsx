import "./RepairStatusSection.css";

import type { Dispatch, SetStateAction } from "react";

import type { RepairRecord } from "../../repair-entry/types/RepairRecord";
import type { RepairStatus } from "../../types/RepairStatus";

import { repairStatusMetadata } from "../../types/RepairStatusMetadata";

interface RepairStatusSectionProps {
    status?: RepairStatus;
    setRepairRecord: Dispatch<SetStateAction<RepairRecord>>;
}

const repairStatuses: RepairStatus[] = [
    "active",
    "waiting",
    "ready",
    "completed",
];

export default function RepairStatusSection({
    status,
    setRepairRecord,
}: RepairStatusSectionProps) {

    const currentStatus = status ?? "active";
    const metadata = repairStatusMetadata[currentStatus];

    return (
        <section className="repair-status-section">
            <div
                className="repair-status-accent"
                style={{
                    backgroundColor: metadata.color,
                }}
            />

            <div className="repair-status-content">
                <div className="repair-status-label">
                    Status
                </div>

                <div className="repair-status-buttons">
                    {repairStatuses.map((repairStatus) => (
                        <button
                            key={repairStatus}
                            type="button"
                            className={
                                repairStatus === currentStatus
                                    ? "status-button active"
                                    : "status-button"
                            }
                            onClick={() =>
                                setRepairRecord((previous) => ({
                                    ...previous,
                                    status: repairStatus,
                                }))
                            }
                        >
                            {repairStatusMetadata[repairStatus].label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}