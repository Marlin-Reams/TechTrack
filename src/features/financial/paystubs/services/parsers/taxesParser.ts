import type {
    TaxSection,
} from "../../types/FirestonePaystub";

import { getCurrentAmountFromRow } from "./parserHelpers";

export function parseTaxes(
    sectionText: string
): TaxSection {

    const socialSecurity = getCurrentAmountFromRow(sectionText, "social security tax");
    const medicare = getCurrentAmountFromRow(sectionText, "medicare tax");
    const totalTaxes = getCurrentAmountFromRow(sectionText, "total taxes");
    const federal = totalTaxes !== undefined
        ? Math.max(totalTaxes - (socialSecurity ?? 0) - (medicare ?? 0), 0)
        : undefined;

    return { federal, socialSecurity, medicare, totalTaxes };

}
