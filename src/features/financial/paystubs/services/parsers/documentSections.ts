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

      payPeriod: getSection(documentText, "pay period", "earnings"),
earnings: getSection(documentText, "earnings", "deductions"),
deductions: getSection(documentText, "deductions", "taxes"),
taxes: getSection(documentText, "taxes", "tax bases"),
taxBases: getSection(documentText, "tax bases", "net pay"),
netPay: getSection(documentText, "net pay", ""),

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