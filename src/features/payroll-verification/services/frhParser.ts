/** Conservative FRH text extraction. Never use an unvalidated OCR result to update repairs. */
export interface FrhRow {
    ro: string;
    hours: number;
    sourceLine: string;
}
export interface FrhHeader {
    technicianId: string | null;
    storeId: string | null;
    from: string | null;
    to: string | null;
    printedAt: string | null;
}
export interface FrhParseResult {
    header: FrhHeader;
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
    const header: FrhHeader = { technicianId: null, storeId: null, from: null, to: null, printedAt: null };
    const rows: FrhRow[] = [];
    const technician = layoutText.match(/\b(?:technician|tech)\s*(?:id|#|number|no\.)?\s*[:#-]?\s*(\d{1,5})\b/i);
    const store = layoutText.match(/\bstore\s*(?:id|#|number|no\.)?\s*[:#-]?\s*(\d{2,7})\b/i);
    const from = layoutText.match(/\bfrom\s*[:#-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/i);
    const to = layoutText.match(/\bto\s*[:#-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/i);
    const printed = layoutText.match(/\b(?:printed|print date)\s*[:#-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/i);
    header.technicianId = technician?.[1] ?? null;
    header.storeId = store?.[1] ?? null;
    header.from = from?.[1] ?? null;
    header.to = to?.[1] ?? null;
    header.printedAt = printed?.[1] ?? null;
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
    for (const [field, value] of Object.entries(header)) if (!value) warnings.push(`Could not confidently read ${field} from report header.`);
    if (!rows.length) warnings.push("No unambiguous RO/hour rows found.");
    if (printedTotal === null) warnings.push("Printed total not confidently detected.");
    else if (Math.abs(calculatedTotal - printedTotal) > 0.051) {
        warnings.push(`Parsed ${calculatedTotal.toFixed(1)} hours differs from printed ${printedTotal.toFixed(1)} hours.`);
    }
    warnings.push("FRH format has not been validated against raw OCR; preview only.");
    return { header, rows, printedTotal, calculatedTotal, warnings, readyForComparison: false };
}
