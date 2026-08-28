import type {
    DeductionSection,
} from "../../types/FirestonePaystub";

import { getCurrentAmountFromRow } from "./parserHelpers";

export function parseDeductions(
    sectionText: string
): DeductionSection {

    return {

        medical:
            getCurrentAmountFromRow(
                sectionText,
                "medical"
            ),

        dental:
            getCurrentAmountFromRow(
                sectionText,
                "dental"
            ),

        vision:
            getCurrentAmountFromRow(
                sectionText,
                "vision"
            ),

        loanRepayment:
            getCurrentAmountFromRow(
                sectionText,
                "loan repayment"
            ),

        totalDeductions:
            getCurrentAmountFromRow(
                sectionText,
                "total deductions"
            ),

    };

}
