import type {
    DeductionSection,
} from "../../types/FirestonePaystub";

import {
    getAmount,
    parsePayrollTable,
} from "./tableParser";

export function parseDeductions(
    sectionText: string
): DeductionSection {

    const table =
        parsePayrollTable(sectionText);

    return {

        medical:
            getAmount(
                table,
                "Medical"
            ),

        dental:
            getAmount(
                table,
                "Dental"
            ),

        vision:
            getAmount(
                table,
                "Vision"
            ),

        loanRepayment:
            getAmount(
                table,
                "Loan Repayment"
            ),

        totalDeductions:
            getAmount(
                table,
                "Total Deductions"
            ),

    };

}