import type {
    NetPaySection,
} from "../../types/FirestonePaystub";

import { getLastAmountFromRow } from "./parserHelpers";

export function parseNetPay(
    sectionText: string
): NetPaySection {

    return {

        amount:
            getLastAmountFromRow(
                sectionText,
                "bank transfer"
            ),

    };

}
