import type {
    PayPeriod,
} from "../../types/FirestonePaystub";

import { getDateAfterLabel } from "./parserHelpers";

export function parsePayPeriod(
    documentText: string
): PayPeriod {

    return {

        periodNumber:
            documentText.match(/pay period\s+(\d+\/\d{4})/i)?.[1],

        periodStart:
            getDateAfterLabel(
                documentText,
                "period start"
            ),

        periodEnd:
            getDateAfterLabel(
                documentText,
                "period end"
            ),

        payDate:
            getDateAfterLabel(
                documentText,
                "pay date"
            ),

    };

}
