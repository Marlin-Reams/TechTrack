import "./RepairSummarySection.css";

import type { RepairHeader } from "../../repairs/repair-header/types/RepairHeader";
import type { Operation } from "../../repairs/operations/types/Operation";

interface RepairSummarySectionProps {
    header: RepairHeader;
    operations: Operation[];
}

export default function RepairSummarySection({
    header,
    operations,
}: RepairSummarySectionProps) {

    const expectedHours = operations.reduce(
        (total, operation) => total + operation.hours,
        0
    );

    return (
        <section className="repair-summary-section">

            <h2 className="repair-summary-title">
                Repair Order #{header.repairOrderNumber}
            </h2>

            <div className="repair-summary-subtitle">
                {header.year} {header.make} {header.model}
                {" • "}
                {header.repairDate}
            </div>

            <table className="repair-summary-table">

                <thead>

                    <tr>
                        <th>Article</th>
                        <th>Description</th>
                        <th>Hours</th>
                    </tr>

                </thead>

                <tbody>

                    {operations.map(operation => (

                        <tr key={operation.id}>

                            <td>{operation.articleNumber}</td>

                            <td>{operation.description}</td>

                            <td>{operation.hours.toFixed(1)}</td>

                        </tr>

                    ))}

                </tbody>

                <tfoot>

                    <tr>

                        <td colSpan={2}>
                            <strong>Expected Hours</strong>
                        </td>

                        <td>
                            <strong>
                                {expectedHours.toFixed(1)}
                            </strong>
                        </td>

                    </tr>

                </tfoot>

            </table>

        </section>
    );
}