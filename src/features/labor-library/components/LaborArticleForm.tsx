import { useEffect, useMemo, useState } from "react";

import "../styles/LaborArticleForm.css";

import {
    addLaborArticle,
    editLaborArticle,
} from "../services/laborLibraryService";

import type { LaborArticle } from "../types/LaborArticle";

interface LaborArticleFormProps {
    article: LaborArticle | null;
    formMode: "create" | "edit";
    onArticleSaved: () => void;
    onCancel: () => void;
}

export default function LaborArticleForm({
    article,
    formMode,
    onArticleSaved,
    onCancel,
}: LaborArticleFormProps) {

    const [articleNumber, setArticleNumber] = useState("");
    const [description, setDescription] = useState("");
    const [laborType, setLaborType] =
        useState<"fixed" | "variable">("fixed");
    const [standardHours, setStandardHours] = useState("");
    const [allowNonStandardArticleNumber, setAllowNonStandardArticleNumber] =
        useState(false);

    useEffect(() => {

        if (!article) {

            setArticleNumber("");
            setDescription("");
            setLaborType("fixed");
            setStandardHours("");
            setAllowNonStandardArticleNumber(false);

            return;

        }

        setArticleNumber(article.articleNumber);
        setDescription(article.description);
        setLaborType(article.laborType);
        setStandardHours(
            article.laborType === "fixed"
                ? article.standardHours.toString()
                : ""
        );

    }, [article]);

    const formIsValid = useMemo(() => {

        if (
            !allowNonStandardArticleNumber &&
            articleNumber.length !== 7
        ) {
            return false;
        }

        if (description.trim() === "") {
            return false;
        }

        if (
            laborType === "fixed" &&
            Number(standardHours) <= 0
        ) {
            return false;
        }

        return true;

    }, [
        articleNumber,
        description,
        laborType,
        standardHours,
        allowNonStandardArticleNumber,
    ]);

    const hasChanges = useMemo(() => {

        if (formMode === "create") {
            return true;
        }

        if (!article) {
            return false;
        }

        return (
            description !== article.description ||
            laborType !== article.laborType ||
            (
                laborType === "fixed"
                    ? Number(standardHours)
                    : 0
            ) !== article.standardHours
        );

    }, [
        article,
        formMode,
        description,
        laborType,
        standardHours,
    ]);

    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        if (!formIsValid) {
            return;
        }

        if (
            formMode === "edit" &&
            !hasChanges
        ) {
            return;
        }

        const laborArticle: LaborArticle = {
            articleNumber,
            description,
            laborType,
            standardHours:
                laborType === "fixed"
                    ? Number(standardHours)
                    : 0,
            active: article?.active ?? true,
        };

        if (formMode === "edit") {

            await editLaborArticle(
                laborArticle
            );

        } else {

            await addLaborArticle(
                laborArticle
            );

        }

        setArticleNumber("");
        setDescription("");
        setLaborType("fixed");
        setStandardHours("");
        setAllowNonStandardArticleNumber(false);

        onArticleSaved();

    }

    return (

        <form
            className="labor-article-form"
            onSubmit={handleSubmit}
        >

            <div className="labor-form-group">

                <label>
                    Article Number
                </label>

                <input
                    placeholder="7015342"
                    maxLength={7}
                    inputMode="numeric"
                    disabled={formMode === "edit"}
                    value={articleNumber}
                    onChange={(event) =>
                        setArticleNumber(
                            event.target.value.replace(/\D/g, "")
                        )
                    }
                />

            </div>

            <div className="labor-form-group">

                <label>
                    Description
                </label>

                <input
                    placeholder="Alignment Check"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

            </div>

            <div className="labor-form-group">

                <label>
                    Labor Type
                </label>

                <select
                    value={laborType}
                    onChange={(event) => {

                        const value =
                            event.target.value as
                            "fixed" | "variable";

                        setLaborType(value);

                        if (value === "variable") {
                            setStandardHours("");
                        }

                    }}
                >
                    <option value="fixed">
                        Fixed
                    </option>

                    <option value="variable">
                        Variable
                    </option>

                </select>

            </div>

            <div className="labor-form-group">

                <label>
                    Standard Hours
                </label>

                <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    disabled={laborType === "variable"}
                    value={standardHours}
                    onChange={(event) => {

                        const value =
                            event.target.value;

                        if (
                            /^\d*\.?\d*$/.test(value)
                        ) {
                            setStandardHours(value);
                        }

                    }}
                />

            </div>

            <button
                className="labor-save-button"
                type="submit"
                disabled={
                    !formIsValid ||
                    (
                        formMode === "edit" &&
                        !hasChanges
                    )
                }
            >
                {formMode === "edit"
                    ? "Update Article"
                    : "Save Article"}
            </button>

            {formMode === "edit" && (

                <button
                    type="button"
                    className="labor-save-button"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            )}

            <label className="labor-override">

                <input
                    type="checkbox"
                    checked={
                        allowNonStandardArticleNumber
                    }
                    onChange={(event) =>
                        setAllowNonStandardArticleNumber(
                            event.target.checked
                        )
                    }
                />

                Override 7-Digit Validation

            </label>

        </form>

    );

}