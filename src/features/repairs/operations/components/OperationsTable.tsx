import type { Operation } from "../types/Operation";
import OperationRow from "./OperationRow";
import "../styles/OperationsTable.css";

type OperationsTableProps = {
    operations: Operation[];
    totalHours: number;
    onDeleteOperation: (id: string) => void;
    onEditOperation: (operation: Operation) => void;
};

export default function OperationsTable({
    operations,
    totalHours,
    onEditOperation,
    onDeleteOperation,
}: OperationsTableProps) {
    return (
        <table className="operations-table">
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Labor Article</th>
                    <th>Work Performed</th>
                    <th>Hours</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {operations.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="operations-empty">
                            No operations added.
                        </td>
                    </tr>
                ) : (
                    operations.map((operation) => (
                        <OperationRow
                            key={operation.id}
                            operation={operation}
                            onEditOperation={onEditOperation}
                            onDeleteOperation={onDeleteOperation}
                        />
                    ))
                )}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={4}>Total Flag Hours</td>
                    <td>{totalHours.toFixed(1)}</td>
                </tr>
            </tfoot>
        </table>
    );
}