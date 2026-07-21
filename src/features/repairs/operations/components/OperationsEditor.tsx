import type { Operation } from "../types/Operation";
import OperationEntry from "./OperationEntry";

type OperationsEditorProps = {
    selectedOperation: Operation | null;
    onAddOperation: (operation: Operation) => void;
    onUpdateOperation: (operation: Operation) => void;
    onCancelEdit: () => void;
};

export default function OperationsEditor({
    selectedOperation,
    onAddOperation,
    onUpdateOperation,
    onCancelEdit,
}: OperationsEditorProps) {
    return (
        <OperationEntry
            selectedOperation={selectedOperation}
            onAddOperation={onAddOperation}
            onUpdateOperation={onUpdateOperation}
            onCancelEdit={onCancelEdit}
        />
    );
}