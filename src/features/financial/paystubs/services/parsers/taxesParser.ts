import type {
    TaxSection,
} from "../../types/FirestonePaystub";

import {
    getAmountAfterLabel,
} from "./parserHelpers";

export function parseTaxes(
    sectionText: string
): TaxSection {

    return {

        federal:
            getAmountAfterLabel(
                sectionText,
                "federal income tax"
            ),

        socialSecurity:
            getAmountAfterLabel(
                sectionText,
                "social security"
            ),

        medicare:
            getAmountAfterLabel(
                sectionText,
                "medicare"
            ),

        totalTaxes:
            getAmountAfterLabel(
                sectionText,
                "total taxes"
            ),

    };

}