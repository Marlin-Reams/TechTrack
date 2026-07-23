import "./RepairHeader.css";

import type { Dispatch, SetStateAction } from "react";

import type { RepairHeader as RepairHeaderModel } from "../types/RepairHeader";
import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

type RepairHeaderProps = {
    header: RepairHeaderModel;
    setRepairRecord: Dispatch<SetStateAction<RepairRecord>>;
};

export default function RepairHeader({
    header,
    setRepairRecord,
}: RepairHeaderProps) {
    function updateHeader<K extends keyof RepairHeaderModel>(
        key: K,
        value: RepairHeaderModel[K]
    ) {
        setRepairRecord((previous) => ({
            ...previous,
            header: {
                ...previous.header,
                [key]: value,
            },
        }));
    }

    return (
        <section className="repair-header">
            <h2>Repair Details</h2>

            <div className="repair-header-grid">

                <div className="repair-header-field">
                    <label>Repair Order #</label>

                    <input
                        value={header.repairOrderNumber}
                        onChange={(e) =>
                            updateHeader("repairOrderNumber", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Repair Date</label>

                    <input
                        type="date"
                        value={header.repairDate}
                        onChange={(e) =>
                            updateHeader("repairDate", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field repair-header-field--full">
                    <label>VIN</label>

                    <input
                        value={header.vin}
                        onChange={(e) =>
                            updateHeader("vin", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>License Plate</label>

                    <input
                        value={header.licensePlate}
                        onChange={(e) =>
                            updateHeader("licensePlate", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Mileage</label>

                    <input
                        type="number"
                        value={header.mileage ?? ""}
                        onChange={(e) =>
                            updateHeader(
                                "mileage",
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                            )
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Year</label>

                    <input
                        value={header.year}
                        onChange={(e) =>
                            updateHeader("year", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Make</label>

                    <input
                        value={header.make}
                        onChange={(e) =>
                            updateHeader("make", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Model</label>

                    <input
                        value={header.model}
                        onChange={(e) =>
                            updateHeader("model", e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Engine</label>

                    <input
                        value={header.engine}
                        onChange={(e) =>
                            updateHeader("engine", e.target.value)
                        }
                    />
                </div>

            </div>
        </section>
    );
}