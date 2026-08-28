import "./ReviewOperationCard.css";

import type { ParsedOperation }
    from "../types/ParsedOperation";

interface Props {
    operation: ParsedOperation;
    index: number;
    onChange: (operation: ParsedOperation) => void;
    onRemove: () => void;
}

export default function ReviewOperationCard({
    operation,
    index,
    onChange,
    onRemove,
}: Props) {
    function update<K extends keyof ParsedOperation>(
        field: K,
        value: ParsedOperation[K],
    ) {
        onChange({
            ...operation,
            [field]: value,
        });
    }

    return (
        <article className="review-operation-card">
            <div className="operation-card-heading">
                <strong>Operation {index + 1}</strong>
                <button type="button" onClick={onRemove}>
                    Remove
                </button>
            </div>

            <label>
                Description
                <input
                    value={operation.description ?? ""}
                    onChange={event => update("description", event.target.value)}
                />
            </label>

            <div className="operation-fields">
                <label>
                    Article #
                    <input
                        value={operation.articleNumber}
                        onChange={event => update("articleNumber", event.target.value)}
                    />
                </label>

                <label>
                    Labor hours
                    <input
                        className={operation.actualHours === undefined ? "missing" : ""}
                        type="number"
                        min="0"
                        step="0.1"
                        value={operation.actualHours ?? ""}
                        onChange={event => update(
                            "actualHours",
                            event.target.value === ""
                                ? undefined
                                : Number(event.target.value)
                        )}
                    />
                </label>
            </div>
        </article>
    );
}
