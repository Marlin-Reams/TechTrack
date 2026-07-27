import type {
    PayPeriod,
} from "../../types/FirestonePaystub";

import {
    getDateAfterLabel,
    getDateBeforeLabel,
    getTextAfterLabel,
} from "./parserHelpers";

export function parsePayPeriod(
    documentText: string
): PayPeriod {

    console.log("Using NEW payPeriodParser");
    console.log(documentText);

    return {

        periodNumber:
            getTextAfterLabel(
                documentText,
                "pay period"
            ),

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
            getDateBeforeLabel(
                documentText,
                "pay date"
            ),

    };

}