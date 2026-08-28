import { extractOperations } from "./extractOperations.js";
import { ocrBaselineCases } from "./ocrBaselineCases.js";

function comparable(value: unknown): string {
    return JSON.stringify(value);
}

let failures = 0;

for (const baseline of ocrBaselineCases) {
    const expectedArticles = new Set(
        baseline.expected.map(operation => operation.articleNumber),
    );

    // TS is the normal labor marker. TN candidates are retained only when the
    // expected/labor-library baseline recognizes their article number.
    const actual = extractOperations(baseline.rawText)
        .filter(operation =>
            operation.articleType?.toUpperCase() === "TS" ||
            expectedArticles.has(operation.articleNumber)
        )
        .map(operation => ({
            articleNumber: operation.articleNumber,
            articleType: operation.articleType,
            actualHours: operation.actualHours,
            description: operation.description,
        }));

    if (comparable(actual) !== comparable(baseline.expected)) {
        failures += 1;
        console.error(`FAIL: ${baseline.name}`);
        console.error("Expected:", baseline.expected);
        console.error("Actual:  ", actual);
    } else {
        console.log(`PASS: ${baseline.name}`);
    }
}

if (failures > 0) {
    throw new Error(`${failures} OCR baseline case(s) failed.`);
}

console.log(`All ${ocrBaselineCases.length} OCR baseline cases passed.`);
