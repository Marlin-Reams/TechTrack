import type { ParsedOperation }
    from "../types/ParsedOperation.js";

export function extractOperations(
    rawText: string,
): ParsedOperation[] {

    const lines =
        rawText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

    const operations: ParsedOperation[] = [];

    for (let i = 0; i < lines.length; i++) {

        const laborMatch = lines[i].match(
            /\b(\d{6,7})\s+([A-Z0-9]+?)\s*(TS|TN)\b(?:\s+(\d+\.\d+))?/i
        );

        if (!laborMatch) {

            continue;

        }

        const articleNumber =
            laborMatch[1];

        const technicianId =
            laborMatch[2];

        const articleType =
            laborMatch[3];

        //
        // Find description
        //

        let description = lines[i]
            .slice(0, laborMatch.index ?? 0)
            .trim();

        for (let j = i - 1; !description && j >= 0; j--) {

            const line = lines[j];

            if (
                /^\d/.test(line) ||
                /^\d{6,7}\s+\S+(TS|TN|NN)$/.test(line)
            ) {

                continue;

            }

            description = line;

            break;

        }

        //
        // Find FRH hours
        //

        let actualHours = laborMatch[4]
            ? Number(laborMatch[4])
            : undefined;

        // Google Vision occasionally places a faint FRH value on its own
        // line. Recover only small, plausible TS time values. This rejects
        // the part/labor prices that caused the earlier 1.99/6.01 errors.
        if (actualHours === undefined && articleType.toUpperCase() === "TS") {
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const candidate = lines[j];

                if (/\b\d{6,7}\s+\S+(?:TS|TN)\b/i.test(candidate) ||
                    /^-?\d+$/.test(candidate)) {
                    break;
                }

                if (/^\d+\.\d+$/.test(candidate)) {
                    const value = Number(candidate);

                    if (value <= 1.5) {
                        actualHours = value;
                    }

                    break;
                }
            }
        }

        // On some layouts the Courtesy Check FRH is reconstructed into
        // the description column. Recover it before treating N/C as zero.
        if (
            actualHours === undefined &&
            /COURTESY\s+CHECK/i.test(description)
        ) {
            const embeddedHours = description.match(/\b(\d+\.\d+)\b/);
            actualHours = embeddedHours
                ? Number(embeddedHours[1])
                : 0;
        }

        if (
            actualHours === undefined &&
            /\bN\s*\/?\s*C\b/i.test(lines[i])
        ) {
            actualHours = 0;
        }

        operations.push({

            articleNumber,

            technicianId,

            articleType,

            actualHours,

            description,

            details: [],

        });

    }

    return operations;

}
