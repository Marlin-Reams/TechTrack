import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import "./ReviewImportPage.css";

import {
    clearImportSession,
    getImportSession,
}
    from "../repository/importSessionRepository";

import { mapParsedRepairOrder }
    from "../services/mapParsedRepairOrder";

import { createRepair }
    from "../../repairs/repository/repairRepository";

import ReviewHeaderCard
    from "../components/ReviewHeaderCard";
import type { EditableHeaderField }
    from "../components/ReviewHeaderCard";

import ReviewOperationCard
    from "../components/ReviewOperationCard";

import { enrichParsedRepairOrder }
    from "../services/enrichParsedRepairOrder";

import type { ParsedRepairOrder }
    from "../types/ParsedRepairOrder";
import type { ParsedOperation }
    from "../types/ParsedOperation";

export default function ReviewImportPage() {

    const navigate = useNavigate();

    const session =
        getImportSession();

    const [parsedRepair, setParsedRepair] =
        useState<ParsedRepairOrder | null>(
            null
        );

    const [isCreating, setIsCreating] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {

        async function loadRepair() {

            if (!session?.scan.parsedRepairOrder) {

                return;

            }

            const enriched =
                await enrichParsedRepairOrder(
                    session.scan.parsedRepairOrder
                );

            setParsedRepair(enriched);

        }

        loadRepair();

    }, [session]);

    if (!session) {

        return (
            <Navigate
                to="/repairs/scan"
                replace
            />
        );

    }

    if (!parsedRepair) {

        return (

            <main>

                <h1>
                    Loading Repair Order...
                </h1>

            </main>

        );

    }

    async function handleCreateRepair() {
        const currentRepair = parsedRepair;

        if (!currentRepair) {
            setErrorMessage("The scanned repair is no longer available.");
            return;
        }

        if (!currentRepair.repairOrderNumber.trim()) {
            setErrorMessage("Repair order number is required.");
            return;
        }

        if (currentRepair.operations.length === 0) {
            setErrorMessage("Add at least one labor operation.");
            return;
        }

        if (currentRepair.operations.some(
            operation => operation.actualHours === undefined
        )) {
            setErrorMessage(
                "Enter labor hours for every operation before creating the repair."
            );
            return;
        }

        setIsCreating(true);
        setErrorMessage("");

        try {
            const repairRecord =
                mapParsedRepairOrder(currentRepair);

            const repairId =
                await createRepair(repairRecord);

            clearImportSession();
            navigate(`/repairs/${repairId}`);
        }
        catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to create repair."
            );
        }
        finally {
            setIsCreating(false);
        }
    }

    function updateHeader(
        field: EditableHeaderField,
        value: string | number,
    ) {
        setParsedRepair(previous => previous
            ? { ...previous, [field]: value }
            : previous
        );
    }

    function updateOperation(
        index: number,
        operation: ParsedOperation,
    ) {
        setParsedRepair(previous => previous
            ? {
                ...previous,
                operations: previous.operations.map(
                    (candidate, candidateIndex) =>
                        candidateIndex === index
                            ? operation
                            : candidate
                ),
            }
            : previous
        );
    }

    function removeOperation(index: number) {
        setParsedRepair(previous => previous
            ? {
                ...previous,
                operations: previous.operations.filter(
                    (_, candidateIndex) => candidateIndex !== index
                ),
            }
            : previous
        );
    }

    function addOperation() {
        setParsedRepair(previous => previous
            ? {
                ...previous,
                operations: [
                    ...previous.operations,
                    {
                        articleNumber: "",
                        description: "",
                        laborType: "variable",
                        actualHours: undefined,
                        details: [],
                    },
                ],
            }
            : previous
        );
    }

    return (

        <main className="review-import-page">

            <h1>
                Review Repair Order
            </h1>

            {session.imageUrls.length > 0 && (
                <section className="review-source-pages">
                    <h2>Source Pages</h2>
                    <p>
                        Compare the enhanced pages with the fields below. Select a page to open it full size.
                    </p>
                    <div className="review-source-grid">
                        {session.imageUrls.map((imageUrl, index) => (
                            <a
                                key={imageUrl}
                                href={imageUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Enhanced work order page ${index + 1}`}
                                />
                                <span>Page {index + 1}</span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            <ReviewHeaderCard
                repair={parsedRepair}
                onChange={updateHeader}
            />

            <section>

                <h2>
                    Operations Found ({parsedRepair.operations.length})
                </h2>

                <div className="review-operations-grid">

                    {parsedRepair.operations.map((operation, index) => (

                        <ReviewOperationCard
                            key={index}
                            operation={operation}
                            index={index}
                            onChange={updated =>
                                updateOperation(index, updated)
                            }
                            onRemove={() => removeOperation(index)}
                        />

                    ))}

                </div>

                <button type="button" onClick={addOperation}>
                    Add Operation
                </button>

            </section>

            {errorMessage && (
                <p className="review-error" role="alert">
                    {errorMessage}
                </p>
            )}

            <button
                onClick={handleCreateRepair}
                disabled={isCreating}
            >
                {isCreating ? "Creating Repair..." : "Create Repair"}
            </button>

        </main>

    );

}
