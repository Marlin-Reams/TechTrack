import type {
    NetPaySection,
} from "../../types/FirestonePaystub";

import {
    getAmountAfterLabel,
} from "./parserHelpers";

export function parseNetPay(
    sectionText: string
): NetPaySection {

    return {

        amount:
            getAmountAfterLabel(
                sectionText,
                "net pay"
            ),

    };

}