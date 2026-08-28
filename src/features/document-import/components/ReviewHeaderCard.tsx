import "./ReviewHeaderCard.css";

import type { ParsedRepairOrder }
    from "../types/ParsedRepairOrder";

export type EditableHeaderField =
    | "repairOrderNumber"
    | "repairDate"
    | "year"
    | "make"
    | "model"
    | "engine"
    | "mileage"
    | "vin"
    | "licensePlate"
    | "customer"
    | "advisor";

interface Props {
    repair: ParsedRepairOrder;
    onChange: (
        field: EditableHeaderField,
        value: string | number,
    ) => void;
}

export default function ReviewHeaderCard({
    repair,
    onChange,
}: Props) {
    const confidenceClass =
        repair.confidence >= 90
            ? "confidence-good"
            : repair.confidence >= 70
                ? "confidence-warning"
                : "confidence-low";

    return (
        <section className="review-card">
            <div className="review-header">
                <div>
                    <h2>Review extracted details</h2>
                    <p>Correct anything that OCR did not read accurately.</p>
                </div>

                <div className={confidenceClass}>
                    Confidence
                    <strong>{repair.confidence}%</strong>
                </div>
            </div>

            {repair.warnings.length > 0 && (
                <div className="review-warnings" role="status">
                    <strong>Needs review</strong>
                    <ul>
                        {repair.warnings.map(warning => (
                            <li key={warning}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="review-grid">
                <ReviewInput label="Repair Order #" value={repair.repairOrderNumber}
                    onChange={value => onChange("repairOrderNumber", value)} required />
                <ReviewInput label="Date" type="date" value={repair.repairDate}
                    onChange={value => onChange("repairDate", value)} required />
                <ReviewInput label="Mileage" type="number" value={repair.mileage || ""}
                    onChange={value => onChange("mileage", Number(value) || 0)} />
                <ReviewInput label="VIN" value={repair.vin ?? ""}
                    onChange={value => onChange("vin", value.toUpperCase())} />
                <ReviewInput label="Plate" value={repair.licensePlate ?? ""}
                    onChange={value => onChange("licensePlate", value.toUpperCase())} />
                <ReviewInput label="Year" value={repair.year ?? ""}
                    onChange={value => onChange("year", value)} />
                <ReviewInput label="Make" value={repair.make ?? ""}
                    onChange={value => onChange("make", value)} />
                <ReviewInput label="Model" value={repair.model ?? ""}
                    onChange={value => onChange("model", value)} />
                <ReviewInput label="Engine" value={repair.engine ?? ""}
                    onChange={value => onChange("engine", value)} />
                <ReviewInput label="Advisor" value={repair.advisor ?? ""}
                    onChange={value => onChange("advisor", value)} />
                <ReviewInput label="Customer" value={repair.customer ?? ""}
                    onChange={value => onChange("customer", value)} />
            </div>
        </section>
    );
}

interface ReviewInputProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: "text" | "date" | "number";
    required?: boolean;
}

function ReviewInput({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}: ReviewInputProps) {
    const missing = required && String(value).trim() === "";

    return (
        <label className={missing ? "review-field missing" : "review-field"}>
            <span>{label}</span>
            <input
                type={type}
                value={value}
                onChange={event => onChange(event.target.value)}
                aria-invalid={missing}
            />
        </label>
    );
}
