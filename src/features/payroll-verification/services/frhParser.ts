/** Conservative FRH text extraction. Never use an unvalidated OCR result to update repairs. */
export interface FrhRow {
    ro: string;
    hours: number;
    sourceLine: string;
}
export interface FrhParseResult {
    rows: FrhRow[];
    printedTotal: number | null;
    calculatedTotal: number;
    warnings: string[];
    readyForComparison: boolean;
}

const roundTenths = (value: number) => Math.round(value * 10) / 10;

/**
 * Preview only: requires a 5-7 digit RO and one explicit decimal hour value on
 * the same line. FRH layout may differ, so raw OCR remains the source of truth.
 */
export function parseFrhPreview(layoutText: string): FrhParseResult {
    const rows: FrhRow[] = [];
    const warnings: string[] = [];
    let printedTotal: number | null = null;
    const lines = layoutText.split(/\r?\n/);
    for (const line of lines) {
        const normalized = line.replace(/\s+/g, " ").trim();
        if (!normalized) continue;
        if (/\b(total|grand total|frh total)\b/i.test(normalized)) {
            const amounts = normalized.match(/\b\d+\.\d{1,2}\b/g);
            if (amounts?.length) printedTotal = Number(amounts.at(-1));
            continue;
        }
        const roMatch = normalized.match(/\b(?:RO\s*#?\s*)?(\d{5,7})\b/i);
        if (!roMatch) continue;
        const remainder = normalized.slice(normalized.indexOf(roMatch[0]) + roMatch[0].length);
        const amounts = remainder.match(/\b\d+\.\d{1,2}\b/g);
        if (!amounts || amounts.length !== 1) {
            warnings.push(`RO ${roMatch[1]}: ambiguous hours; check original scan.`);
            continue;
        }
        const hours = Number(amounts[0]);
        if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
            warnings.push(`RO ${roMatch[1]}: implausible hours.`);
            continue;
        }
        rows.push({ ro: roMatch[1], hours, sourceLine: normalized });
    }
    const seen = new Set<string>();
    for (const row of rows) {
        if (seen.has(row.ro)) warnings.push(`RO ${row.ro} appears more than once; manual review required.`);
        seen.add(row.ro);
    }
    const calculatedTotal = roundTenths(rows.reduce((sum, row) => sum + row.hours, 0));
    if (!rows.length) warnings.push("No unambiguous RO/hour rows found.");
    if (printedTotal === null) warnings.push("Printed total not confidently detected.");
    else if (Math.abs(calculatedTotal - printedTotal) > 0.051) {
        warnings.push(`Parsed ${calculatedTotal.toFixed(1)} hours differs from printed ${printedTotal.toFixed(1)} hours.`);
    }
    warnings.push("FRH format has not been validated against raw OCR; preview only.");
    return { rows, printedTotal, calculatedTotal, warnings, readyForComparison: false };
}
