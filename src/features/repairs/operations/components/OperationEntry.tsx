import { useEffect, useState } from "react";
import type { Operation } from "../types/Operation";
import type { LaborArticle } from "../../../labor-library/types/LaborArticle";
import { createOperation } from "../services/operationFactory";
import LaborArticleLookup from "./LaborArticleLookup";
import "../styles/OperationEntry.css";
import VariableOperationForm from "./VariableOperationForm";
import EditOperationForm from "./EditOperationForm";

type OperationEntryProps = {
    selectedOperation: Operation | null;
    onAddOperation: (operation: Operation) => void;
    onUpdateOperation: (operation: Operation) => void;
    onCancelEdit: () => void;
};

export default function OperationEntry({
    selectedOperation,
    onAddOperation,
    onUpdateOperation,
    onCancelEdit,
}: OperationEntryProps) {
    

    
    const [pendingArticle, setPendingArticle] =
        useState<LaborArticle | null>(null);
    const [workPerformed, setWorkPerformed] = useState("");
    const [hours, setHours] = useState("");

    const editing = selectedOperation !== null;

    useEffect(() => {
        if (!selectedOperation) {
            return;
        }

        
        setWorkPerformed(selectedOperation.workPerformed);
        setHours(selectedOperation.hours.toString());
    }, [selectedOperation]);

    function resetForm() {
    
    setPendingArticle(null);
    setWorkPerformed("");
    setHours("");
}

    function handleArticleSelected(
    article: LaborArticle
) {

    if (editing) {
        return;
    }

    if (article.laborType === "fixed") {

        onAddOperation(
            createOperation({
                articleNumber: article.articleNumber,
                description: article.description,
                workPerformed: article.description,
                laborType: article.laborType,
                hours: article.standardHours,
            })
        );

        resetForm();
        return;
    }

    setPendingArticle(article);
    setWorkPerformed("");
    setHours("");
}

    function handleSaveVariable() {
        if (!pendingArticle) return;

        const enteredHours = Number(hours);

        if (isNaN(enteredHours) || enteredHours <= 0) {
            alert("Please enter valid hours.");
            return;
        }

        if (!workPerformed.trim()) {
            alert("Please describe the work performed.");
            return;
        }

        onAddOperation(
            createOperation({
                articleNumber: pendingArticle.articleNumber,
                description: pendingArticle.description,
                workPerformed,
                laborType: pendingArticle.laborType,
                hours: enteredHours,
            })
        );

        resetForm();
    }

    function handleUpdate() {
        if (!selectedOperation) return;

        onUpdateOperation({
            ...selectedOperation,
            workPerformed,
            hours: Number(hours),
        });

        resetForm();
        onCancelEdit();
    }

    function handleCancel() {
        resetForm();
        onCancelEdit();
    }

    return (
        <>
            <div className="operation-entry">
                <LaborArticleLookup
    onSelect={handleArticleSelected}
/>
            </div>

            {editing && (
                <EditOperationForm
                    workPerformed={workPerformed}
                    hours={hours}
                    onWorkPerformedChange={setWorkPerformed}
                    onHoursChange={setHours}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            )}

            {!editing && pendingArticle && (
                <VariableOperationForm
                    description={pendingArticle.description}
                    workPerformed={workPerformed}
                    hours={hours}
                    onWorkPerformedChange={setWorkPerformed}
                    onHoursChange={setHours}
                    onSave={handleSaveVariable}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}