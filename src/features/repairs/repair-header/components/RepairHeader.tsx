import "./RepairHeader.css";

import useRepairHeader from "../hooks/useRepairHeader";

export default function RepairHeader() {
    const {
        header,
        updateRepairOrderNumber,
        updateVin,
        updateLicensePlate,
        updateYear,
        updateMake,
        updateModel,
        updateEngine,
        updateMileage,
        updateRepairDate,
    } = useRepairHeader();

    return (
        <section className="repair-header">
            <h2>Repair Details</h2>

            <div className="repair-header-grid">

                <div className="repair-header-field">
                    <label>Repair Order #</label>

                    <input
                        value={header.repairOrderNumber}
                        onChange={(e) =>
                            updateRepairOrderNumber(e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Repair Date</label>

                    <input
                        type="date"
                        value={header.repairDate}
                        onChange={(e) =>
                            updateRepairDate(e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field repair-header-field--full">
                    <label>VIN</label>

                    <input
                        value={header.vin}
                        onChange={(e) => updateVin(e.target.value)}
                    />
                </div>

                <div className="repair-header-field">
                    <label>License Plate</label>

                    <input
                        value={header.licensePlate}
                        onChange={(e) =>
                            updateLicensePlate(e.target.value)
                        }
                    />
                </div>

                <div className="repair-header-field">
                    <label>Mileage</label>

                    <input
                        type="number"
                        value={header.mileage ?? ""}
                        onChange={(e) =>
                            updateMileage(
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
                        onChange={(e) => updateYear(e.target.value)}
                    />
                </div>

                <div className="repair-header-field">
                    <label>Make</label>

                    <input
                        value={header.make}
                        onChange={(e) => updateMake(e.target.value)}
                    />
                </div>

                <div className="repair-header-field">
                    <label>Model</label>

                    <input
                        value={header.model}
                        onChange={(e) => updateModel(e.target.value)}
                    />
                </div>

                <div className="repair-header-field">
                    <label>Engine</label>

                    <input
                        value={header.engine}
                        onChange={(e) => updateEngine(e.target.value)}
                    />
                </div>

            </div>
        </section>
    );
}