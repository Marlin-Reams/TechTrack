import type {
    EarningsSection,
} from "../../types/FirestonePaystub";

import {
    getAmount,
    parsePayrollTable,
} from "./tableParser";

export function parseEarnings(
    sectionText: string
): EarningsSection {

    const table =
        parsePayrollTable(sectionText);

    return {

        grossPay:
            getAmount(
                table,
                "Total Earnings"
            ),

        /*
            Firestone paystubs do not currently
            expose these in the table format.

            We'll populate them in a later parser
            revision when we parse the earnings
            detail rows.
        */

        flagHours: undefined,

        flagRate: undefined,

    };

}