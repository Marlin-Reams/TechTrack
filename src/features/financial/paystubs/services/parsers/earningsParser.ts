import type {
    EarningsSection,
} from "../../types/FirestonePaystub";

import { getCurrentAmountFromRow, getLastAmountFromRow } from "./parserHelpers";

export function parseEarnings(
    sectionText: string
): EarningsSection {

    return {

        grossPay: getCurrentAmountFromRow(sectionText, "total earnings"),
        yearToDateGross: getLastAmountFromRow(sectionText, "total earnings"),
        ...parseFlagUnits(sectionText),

    };

}

function parseFlagUnits(text: string): Pick<EarningsSection, "flagHours" | "flagRate"> {
    const candidates = text
        .split("\n")
        .filter(line => line.toLowerCase().includes("flag units"))
        .map(line => line.match(/flag units(?:\s+\d{2}\/\d{2}\/\d{4}-\d{2}\/\d{2}\/\d{4})?\s+(\d+\.\d{2})\s+(\d+\.\d{2})/i))
        .filter((match): match is RegExpMatchArray => match !== null)
        .map(match => ({
            flagRate: Number(match[1]),
            flagHours: Number(match[2]),
        }));

    return candidates.sort((first, second) => second.flagHours - first.flagHours)[0] ?? {};
}
