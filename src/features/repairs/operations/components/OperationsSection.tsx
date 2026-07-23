import { useMemo, useState } from "react";

import "../styles/OperationsSection.css";

import type { Dispatch, SetStateAction } from "react";

import type { Operation } from "../types/Operation";
import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

import OperationsEditor from "./OperationsEditor";
import OperationsTable from "./OperationsTable";

type OperationsSectionProps = {
    operations: Operation[];
    setRepairRecord: Dispatch<SetStateAction<RepairRecord>>;
};

export default function OperationsSection({
    operations,
    setRepairRecord,
}: OperationsSectionProps) {
    const [selectedOperation, setSelectedOperation] =
        useState<Operation | null>(null);

    const totalHours = useMemo(() => {
        return operations.reduce(
            (total, operation) => total + operation.hours,
            0
        );
    }, [operations]);

    function addOperation(operation: Operation) {
        setRepairRecord((previous) => ({
            ...previous,
            operations: [...previous.operations, operation],
        }));
    }

    function updateOperation(updatedOperation: Operation) {
        setRepairRecord((previous) => ({
            ...previous,
            operations: previous.operations.map((operation) =>
                operation.id === updatedOperation.id
                    ? updatedOperation
                    : operation
            ),
        }));

        setSelectedOperation(null);
    }

    function deleteOperation(id: string) {
        setRepairRecord((previous) => ({
            ...previous,
            operations: previous.operations.filter(
                (operation) => operation.id !== id
            ),
        }));

        if (selectedOperation?.id === id) {
            setSelectedOperation(null);
        }
    }

    function clearSelection() {
        setSelectedOperation(null);
    }

    return (
        <section className="operations-section">
            <h2>Operations</h2>

            <OperationsEditor
                selectedOperation={selectedOperation}
                onAddOperation={addOperation}
                onUpdateOperation={updateOperation}
                onCancelEdit={clearSelection}
            />

            <OperationsTable
                operations={operations}
                totalHours={totalHours}
                onEditOperation={setSelectedOperation}
                onDeleteOperation={deleteOperation}
            />
        </section>
    );
}