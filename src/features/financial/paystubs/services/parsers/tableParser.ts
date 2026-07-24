export type PayrollTable = Record<string, number>;

export function parsePayrollTable(
    sectionText: string
): PayrollTable {

    const table: PayrollTable = {};

    const lines = sectionText
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    for (const line of lines) {

        const match = line.match(
            /^(.+?)\s+(-?[\d,]+\.\d{2})$/
        );

        if (!match) {
            continue;
        }

        const label = normalizeLabel(match[1]);

        table[label] = Number(
            match[2].replace(/,/g, "")
        );

    }

    return table;

}

export function getAmount(
    table: PayrollTable,
    label: string
): number | undefined {

    return table[
        normalizeLabel(label)
    ];

}

function normalizeLabel(
    value: string
): string {

    return value
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();

}