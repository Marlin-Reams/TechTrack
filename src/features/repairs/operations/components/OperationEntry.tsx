import { useEffect, useRef, useState } from "react";
import type { Operation } from "../types/Operation";
import type { LaborArticle } from "../data/laborLibrary";
import { findLaborArticle } from "../services/laborLibraryService";
import { createOperation } from "../services/operationFactory";
import ArticleInput from "./ArticleInput";
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
    const articleInputRef = useRef<HTMLInputElement>(null);

    const [articleNumber, setArticleNumber] = useState("");
    const [pendingArticle, setPendingArticle] =
        useState<LaborArticle | null>(null);
    const [workPerformed, setWorkPerformed] = useState("");
    const [hours, setHours] = useState("");

    const editing = selectedOperation !== null;

    useEffect(() => {
        if (!selectedOperation) {
            return;
        }

        setArticleNumber(selectedOperation.articleNumber);
        setWorkPerformed(selectedOperation.workPerformed);
        setHours(selectedOperation.hours.toString());
    }, [selectedOperation]);

    function resetForm() {
        setArticleNumber("");
        setPendingArticle(null);
        setWorkPerformed("");
        setHours("");

        articleInputRef.current?.focus();
    }

    function handleArticleEnter() {
        if (editing) return;

        if (!articleNumber.trim()) return;

        const article = findLaborArticle(articleNumber);

        if (!article) {
            alert("Article not found.");
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
        setArticleNumber("");
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
                <ArticleInput
                    value={articleNumber}
                    onChange={setArticleNumber}
                    onEnter={handleArticleEnter}
                    inputRef={articleInputRef}
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