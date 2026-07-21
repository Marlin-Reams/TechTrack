import { useMemo, useState } from "react";
import type { Operation } from "../types/Operation";

export default function useOperations() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [selectedOperation, setSelectedOperation] =
        useState<Operation | null>(null);

    const totalHours = useMemo(() => {
        return operations.reduce(
            (total, operation) => total + operation.hours,
            0
        );
    }, [operations]);

    function addOperation(operation: Operation) {
        setOperations((previous) => [...previous, operation]);
    }

    function updateOperation(updatedOperation: Operation) {
        setOperations((previous) =>
            previous.map((operation) =>
                operation.id === updatedOperation.id
                    ? updatedOperation
                    : operation
            )
        );

        setSelectedOperation(null);
    }

    function deleteOperation(id: string) {
        setOperations((previous) =>
            previous.filter((operation) => operation.id !== id)
        );

        if (selectedOperation?.id === id) {
            setSelectedOperation(null);
        }
    }

    function selectOperation(operation: Operation) {
        setSelectedOperation(operation);
    }

    function clearSelection() {
        setSelectedOperation(null);
    }

    return {
        operations,
        selectedOperation,
        totalHours,
        addOperation,
        updateOperation,
        deleteOperation,
        selectOperation,
        clearSelection,
    };
}