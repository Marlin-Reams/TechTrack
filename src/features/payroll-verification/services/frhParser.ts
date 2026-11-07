/** Firestone Technician Daily FRH Workorder Summary OCR parser. Never auto-update on warnings. */
export interface FrhRow {
    ro: string;
    hours: number;
    sourceLine: string;
    datePosted?: string;
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
const datePattern = String.raw`\d{1,2}\/\d{1,2}\/\d{4}`;
const timePattern = String.raw`\d{1,2}:\d{2}(?::\d{2})?\s*[AP]M`;
const dateTimePattern = new RegExp(String.raw`(${datePattern})\s+(${timePattern})`, "i");
const parseDateTime = (value: string) => {
    const match = value.match(dateTimePattern);
    return match ? `${match[1]} ${match[2].replace(/\s+/g, "")}` : null;
};
function captureDateTime(text: string, label: string): string | null {
    const match = text.match(new RegExp(String.raw`\b${label}\s*(?:Date)?\s*[:#-]?\s*(${datePattern}\s+${timePattern})`, "i"));
    return match ? parseDateTime(match[1]) : null;
}
const hourPattern = String.raw`(\d{1,2}\.\d{1,2})`;
const roPattern = String.raw`(?:RO\s*#?\s*)?(\d{5,7})`;
const rowPattern = new RegExp(String.raw`^\s*${roPattern}\s+${hourPattern}(?:\s+(${datePattern}\s+${timePattern}))?\s*$`, "i");
const labeledTotal = (line: string) => {
    const match = line.match(/(?:total\s+hours|week\s+to\s+date\s+total(?:\s+w\/?\s*adjustments)?)\s*[:\s]+(\d{1,3}\.\d{1,2})\s*$/i);
    return match ? Number(match[1]) : null;
};

export function parseFrhPreview(layoutText: string): FrhParseResult {
    const warnings: string[] = [];
    const rows: FrhRow[] = [];
    const header: FrhHeader = {
        technicianId: null, storeId: null, from: null, to: null, printedAt: null,
    };
    const lines = layoutText.split(/\r?\n/).map(line => line.replace(/\s+/g, " ").trim()).filter(Boolean);
    if (!/Technician\s+Daily\s+FRH\s+Workorder\s+Summary/i.test(layoutText)) {
        warnings.push("Report title not confidently detected.");
    }
    const store = layoutText.match(/\bStore\s*#\s*0*(\d{2,7})\b/i);
    const tech = layoutText.match(/(?:^|\n)\s*(\d{1,3})\s+[A-Z][A-Z '-]+,\s*[A-Z][A-Z '-]+/i);
    header.storeId = store?.[1] ? store[1].padStart(6, "0") : null;
    header.technicianId = tech?.[1]?.padStart(2, "0") ?? null;
    header.from = captureDateTime(layoutText, "From");
    header.to = captureDateTime(layoutText, "To");
    header.printedAt = layoutText.match(/\bPrint\s+Date\s+(\d{1,2}\/\d{1,2}\/\d{4})\b/i)?.[1] ?? null;

    let inAdjustedSection = false;
    let inTotalsSection = false;
    let printedTotal: number | null = null;
    let wtdTotal: number | null = null;
    let adjustedTotal: number | null = null;
    let sawAdjustments = false;
    for (const line of lines) {
        if (/^Adjusted\s*$/i.test(line) || /^Adjusted\s+Work\s+Order/i.test(line)) {
            inAdjustedSection = true;
            sawAdjustments = true;
            continue;
        }
        if (/Week\s+To\s+Date\s+Total/i.test(line)) {
            inTotalsSection = true;
        }
        if (/Week\s+To\s+Date\s+Total\s+w\/?\s*Adjustments/i.test(line)) {
            adjustedTotal = labeledTotal(line);
            continue;
        }
        if (/Week\s+To\s+Date\s+Total/i.test(line)) {
            wtdTotal = labeledTotal(line);
            continue;
        }
        if (/^Total\s+Hours\b/i.test(line)) {
            printedTotal = labeledTotal(line);
            continue;
        }
        if (inTotalsSection) continue;
        const match = line.match(rowPattern);
        if (match && !inAdjustedSection) {
            const hours = Number(match[2]);
            if (!Number.isFinite(hours) || hours > 24) {
                warnings.push(`RO ${match[1]}: implausible hours.`);
                continue;
            }
            rows.push({ ro: match[1], hours, sourceLine: line, datePosted: match[3] ? parseDateTime(match[3]) ?? undefined : undefined });
        } else if (match && inAdjustedSection) {
            warnings.push(`Adjusted RO ${match[1]} requires separate adjustment review.`);
        } else if (/^\d{5,7}\b/.test(line) && !inAdjustedSection) {
            warnings.push(`Unrecognized RO row: ${line}`);
        }
    }
    const calculatedTotal = roundTenths(rows.reduce((sum, row) => sum + row.hours, 0));
    const seen = new Set<string>();
    for (const row of rows) {
        if (seen.has(row.ro)) warnings.push(`RO ${row.ro} appears more than once; manual review required.`);
        seen.add(row.ro);
    }
    for (const [key, value] of Object.entries(header)) {
        if (!value) warnings.push(`Could not confidently read ${key} from report header.`);
    }
    if (!rows.length) warnings.push("No unambiguous RO/hour rows found.");
    if (printedTotal === null) warnings.push("Total Hours not confidently detected.");
    else if (Math.abs(calculatedTotal - printedTotal) > 0.051) {
        warnings.push(`Parsed ${calculatedTotal.toFixed(1)} hours differs from printed ${printedTotal.toFixed(1)} hours.`);
    }
    if (wtdTotal !== null && printedTotal !== null && Math.abs(wtdTotal - printedTotal) > 0.051) {
        warnings.push("Week-to-date total differs from Total Hours.");
    }
    if (adjustedTotal !== null && printedTotal !== null && Math.abs(adjustedTotal - printedTotal) > 0.051) {
        warnings.push("Week-to-date adjusted total differs from Total Hours; inspect adjustments.");
    }
    if (sawAdjustments && adjustedTotal === null) warnings.push("Adjusted section detected but final adjusted total not read.");
    if (!header.from || !header.to) warnings.push("Posting window must be reviewed.");
    // The report can be compared read-only; completion requires separate identity and user review.
    return { header, rows, printedTotal, calculatedTotal, warnings, readyForComparison: warnings.length === 0 };
}
