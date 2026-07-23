import "./OperationsSection.css";

import OperationsEditor from "./OperationsEditor";
import OperationsTable from "./OperationsTable";
import useOperations from "../hooks/useOperations";

export default function OperationsSection() {
    const {
        operations,
        selectedOperation,
        totalHours,
        addOperation,
        updateOperation,
        deleteOperation,
        selectOperation,
        clearSelection,
    } = useOperations();

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
                onEditOperation={selectOperation}
                onDeleteOperation={deleteOperation}
            />
        </section>
    );
}