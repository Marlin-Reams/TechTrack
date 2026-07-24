export interface FirestoneSections {

    payPeriod: string;

    earnings: string;

    deductions: string;

    taxes: string;

    taxBases: string;

    netPay: string;

}

export function splitFirestoneSections(
    documentText: string
): FirestoneSections {

    return {

        payPeriod: getSection(
            documentText,
            "PAY PERIOD",
            "EARNINGS"
        ),

        earnings: getSection(
            documentText,
            "EARNINGS",
            "DEDUCTIONS"
        ),

        deductions: getSection(
            documentText,
            "DEDUCTIONS",
            "TAXES"
        ),

        taxes: getSection(
            documentText,
            "TAXES",
            "TAX BASES"
        ),

        taxBases: getSection(
            documentText,
            "TAX BASES",
            "NET PAY"
        ),

        netPay: getSection(
            documentText,
            "NET PAY",
            ""
        ),

    };

}

function getSection(
    text: string,
    startLabel: string,
    endLabel: string
): string {

    const start =
        text.indexOf(startLabel);

    if (start === -1) {
        return "";
    }

    if (!endLabel) {
        return text.substring(start);
    }

    const end =
        text.indexOf(
            endLabel,
            start
        );

    if (end === -1) {
        return text.substring(start);
    }

    return text.substring(
        start,
        end
    );

}