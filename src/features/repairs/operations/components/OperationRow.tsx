import type { Operation } from "../types/Operation";

type OperationRowProps = {
    operation: Operation;
    onEditOperation: (operation: Operation) => void;
    onDeleteOperation: (id: string) => void;
};

export default function OperationRow({
    operation,
    onEditOperation,
    onDeleteOperation,
}: OperationRowProps) {
    return (
        <tr>
            <td>{operation.articleNumber}</td>

            <td>{operation.description}</td>

            <td>{operation.workPerformed || "—"}</td>

            <td>{operation.hours.toFixed(1)}</td>

            <td className="operation-actions">
                <button
                    type="button"
                    title="Edit Operation"
                    onClick={() => onEditOperation(operation)}
                >
                    ✏️
                </button>

                <button
                    type="button"
                    title="Delete Operation"
                    onClick={() => onDeleteOperation(operation.id)}
                >
                    🗑
                </button>
            </td>
        </tr>
    );
}