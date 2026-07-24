import type { ParseResult } from "../types/ParseResult";
import type {
    FirestonePaystub,
} from "../types/FirestonePaystub";
import type {
    PayrollExtraction,
} from "../types/Paystub";

import type { PaystubParser } from "./PaystubParser";

import { splitFirestoneSections } from "./parsers/documentSections";

import { parsePayPeriod } from "./parsers/payPeriodParser";
import { parseDeductions } from "./parsers/deductionsParser";

import { parseEarnings } from "./parsers/earningsParser";
const parseTaxes = (_section: string) => ({});

const parseTaxBases = (_section: string) => ({});

const parseNetPay = (_section: string) => ({});

class FirestonePaystubParser implements PaystubParser {

    canParse(
        documentText: string
    ): boolean {

        const normalized = normalize(documentText);

        return (
            normalized.includes("bridgestone") ||
            normalized.includes("firestone")
        );

    }

    async parse(
        documentText: string
    ): Promise<ParseResult> {

        try {

            const normalized =
                normalize(documentText);

            const sections =
                splitFirestoneSections(normalized);

            const paystub: FirestonePaystub = {

                payPeriod:
                    parsePayPeriod(
                        sections.payPeriod
                    ),

                earnings:
                    parseEarnings(
                        sections.earnings
                    ),

                deductions:
                    parseDeductions(
                        sections.deductions
                    ),

                taxes:
                    parseTaxes(
                        sections.taxes
                    ),

                taxBases:
                    parseTaxBases(
                        sections.taxBases
                    ),

                netPay:
                    parseNetPay(
                        sections.netPay
                    )

            };

            const extraction: PayrollExtraction = {

                payPeriodStart:
                    paystub.payPeriod.periodStart,

                payPeriodEnd:
                    paystub.payPeriod.periodEnd,

                payDate:
                    paystub.payPeriod.payDate,

                grossPay:
                    paystub.earnings.grossPay,

                flatRateHours:
                    paystub.earnings.flagHours,

                medical:
                    paystub.deductions.medical,

                dental:
                    paystub.deductions.dental,

                vision:
                    paystub.deductions.vision,

                loanRepayment:
                    paystub.deductions.loanRepayment,

                federalTax:
                    paystub.taxes.federal,

                socialSecurity:
                    paystub.taxes.socialSecurity,

                medicare:
                    paystub.taxes.medicare,

                netPay:
                    paystub.netPay.amount,

            };

            return {

                success: true,

                extraction,

                confidence: 0.98,

                parserVersion: "3.0.0"

            };

        } catch (error) {

            return {

                success: false,

                confidence: 0,

                parserVersion: "3.0.0",

                error:
                    error instanceof Error
                        ? error.message
                        : "Parser failed"

            };

        }

    }

}

function normalize(
    text: string
): string {

    return text
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/ +/g, " ");

}

export default new FirestonePaystubParser();