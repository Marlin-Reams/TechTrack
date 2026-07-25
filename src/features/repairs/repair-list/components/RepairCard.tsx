import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

type RepairCardProps = {
    repair: RepairRecord;
};

export default function RepairCard({
    repair,
}: RepairCardProps) {

    const totalHours = repair.operations.reduce(
        (total, operation) => total + operation.hours,
        0
    );

    return (
        <article className="repair-card">

            <h3>
                RO #{repair.header.repairOrderNumber}
            </h3>

            <p>
                <strong>Date:</strong>{" "}
                {repair.header.repairDate}
            </p>

            <p>
                <strong>Mileage:</strong>{" "}
                {repair.header.mileage}
            </p>

            <p>
                <strong>Operations:</strong>{" "}
                {repair.operations.length}
            </p>

            <p>
                <strong>Total Hours:</strong>{" "}
                {totalHours.toFixed(1)}
            </p>

        </article>
    );
}