import type { PayPeriod } from "../../types/FirestonePaystub";

export function parsePayPeriod(
    documentText: string
): PayPeriod {

    return {

        periodNumber:
            extractValue(
                documentText,
                "PAY PERIOD"
            ),

        periodStart:
            extractValue(
                documentText,
                "PERIOD START"
            ),

        periodEnd:
            extractValue(
                documentText,
                "PERIOD END"
            ),

        payDate:
            extractValue(
                documentText,
                "PAY DATE"
            ),

    };

}

function extractValue(
    text: string,
    label: string
): string | undefined {

    const expression =
        new RegExp(
            `${escapeRegex(label)}\\s+([^\\n]+)`,
            "i"
        );

    const match =
        text.match(expression);

    if (!match) {
        return undefined;
    }

    return match[1].trim();

}

function escapeRegex(
    value: string
): string {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}