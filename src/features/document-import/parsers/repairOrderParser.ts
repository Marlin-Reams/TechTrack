import type { ParsedRepairOrder } from "../types/ParsedRepairOrder";
import { extractHeader } from "./extractHeader";
import { extractOperations } from "./extractOperations";

export function parseRepairOrder(
    rawText: string,
    layoutText = "",
): ParsedRepairOrder {

    const header =
        extractHeader(rawText);

    const rawOperations =
        extractOperations(rawText);

    const layoutOperations = layoutText.trim()
        ? extractOperations(layoutText)
        : [];

    const operations = mergeOperations(
        rawOperations,
        layoutOperations,
    );

    const warnings: string[] = [];

    const headerChecks = [
        ["repair order number", header.repairOrderNumber],
        ["repair date", header.repairDate],
        ["customer", header.customer],
        ["VIN", header.vin],
        ["license plate", header.licensePlate],
        ["vehicle year", header.year],
        ["vehicle make", header.make],
        ["vehicle model", header.model],
        ["mileage", header.mileage],
    ] as const;

    for (const [label, value] of headerChecks) {
        if (value === "" || value === null) {
            warnings.push(`Missing ${label}.`);
        }
    }

    if (operations.length === 0) {
        warnings.push("No labor operations were found.");
    }

    const operationsMissingHours = operations.filter(
        operation => operation.actualHours === undefined
    ).length;

    if (operationsMissingHours > 0) {
        warnings.push(
            `${operationsMissingHours} operation${operationsMissingHours === 1 ? " is" : "s are"} missing labor hours.`
        );
    }

    const headerValuesFound = headerChecks.filter(
        ([, value]) => value !== "" && value !== null
    ).length;

    const headerScore = headerValuesFound / headerChecks.length;
    const operationScore = operations.length === 0
        ? 0
        : operations.filter(operation =>
            Boolean(operation.articleNumber) &&
            operation.actualHours !== undefined
        ).length / operations.length;

    const calculatedConfidence = Math.round(
        (headerScore * 0.6 + operationScore * 0.4) * 100
    );

    // OCR output still requires human confirmation; avoid presenting an
    // unverified scan as perfectly accurate.
    const confidence = Math.min(calculatedConfidence, 95);

    return {

        repairOrderNumber:
            header.repairOrderNumber,

        repairDate: header.repairDate,

        mileage: header.mileage ?? 0,

        year: header.year,

        make: header.make,

        model: header.model,

        engine: header.engine,

        vin: header.vin,

        licensePlate: header.licensePlate,

        advisor: header.advisor,

        customer: header.customer,

        confidence,

        warnings,

        operations,

    };

}

function mergeOperations<T extends {
    articleNumber: string;
    actualHours?: number;
    description?: string;
}>(rawOperations: T[], layoutOperations: T[]): T[] {
    const occurrence = new Map<string, number>();
    const layoutByOccurrence = new Map<string, T>();

    for (const operation of layoutOperations) {
        const index = occurrence.get(operation.articleNumber) ?? 0;
        layoutByOccurrence.set(`${operation.articleNumber}:${index}`, operation);
        occurrence.set(operation.articleNumber, index + 1);
    }

    occurrence.clear();

    const merged = rawOperations.map(operation => {
        const index = occurrence.get(operation.articleNumber) ?? 0;
        const layout = layoutByOccurrence.get(
            `${operation.articleNumber}:${index}`
        );
        occurrence.set(operation.articleNumber, index + 1);

        if (!layout) {
            return operation;
        }

        return {
            ...operation,
            actualHours: chooseActualHours(
                layout.actualHours,
                operation.actualHours,
            ),
            description: chooseDescription(
                layout.description,
                operation.description,
            ),
        };
    });

    const mergedKeys = new Set<string>();
    occurrence.clear();

    for (const operation of rawOperations) {
        const index = occurrence.get(operation.articleNumber) ?? 0;
        mergedKeys.add(`${operation.articleNumber}:${index}`);
        occurrence.set(operation.articleNumber, index + 1);
    }

    occurrence.clear();
    for (const operation of layoutOperations) {
        const index = occurrence.get(operation.articleNumber) ?? 0;
        const key = `${operation.articleNumber}:${index}`;
        occurrence.set(operation.articleNumber, index + 1);

        if (!mergedKeys.has(key)) {
            merged.push(operation);
        }
    }

    return merged;
}

function chooseActualHours(
    preferred?: number,
    fallback?: number,
): number | undefined {
    // N/C is shown in the far-right price column. If one OCR text layout
    // preserves a positive FRH value while the other only sees N/C, keep the
    // positive labor time.
    if (preferred === 0 && fallback !== undefined && fallback > 0) {
        return fallback;
    }

    if (fallback === 0 && preferred !== undefined && preferred > 0) {
        return preferred;
    }

    return preferred ?? fallback;
}

function chooseDescription(
    preferred?: string,
    fallback?: string,
): string | undefined {
    const preferredWords = preferred?.match(/[A-Z]{2,}/gi)?.length ?? 0;
    const fallbackWords = fallback?.match(/[A-Z]{2,}/gi)?.length ?? 0;

    return preferredWords >= fallbackWords
        ? preferred
        : fallback;
}
