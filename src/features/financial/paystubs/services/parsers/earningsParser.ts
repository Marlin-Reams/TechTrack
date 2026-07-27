import type {
    EarningsSection,
} from "../../types/FirestonePaystub";

import {
    getAmountAfterLabel,
} from "./parserHelpers";

export function parseEarnings(
    sectionText: string
): EarningsSection {

    return {

        grossPay:
            getAmountAfterLabel(
                sectionText,
                "total earnings"
            ),

        /*
            These will be implemented
            in the next revision.
        */

        flagHours: undefined,
        flagRate: undefined,

    };

}