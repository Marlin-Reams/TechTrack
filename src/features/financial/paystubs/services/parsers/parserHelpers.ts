export function normalizeWhitespace(
    text: string
): string {

    return text
        .replace(/\r/g, "")
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

function escapeRegex(
    value: string
): string {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}

export function getAmountAfterLabel(
    text: string,
    label: string,
    occurrence: number = 1
): number | undefined {

    const normalized =
        normalizeWhitespace(text);

    const expression =
        new RegExp(
            `${escapeRegex(label)}((?:\\s+[\\d,]+\\.\\d{2})+)`,
            "i"
        );

    const match =
        normalized.match(expression);

    if (!match) {
        return undefined;
    }

    const amounts =
        match[1].match(/[\d,]+\.\d{2}/g);

    if (!amounts) {
        return undefined;
    }

    if (
        occurrence < 1 ||
        occurrence > amounts.length
    ) {
        return undefined;
    }

    return Number(
        amounts[occurrence - 1]
            .replace(/,/g, "")
    );

}

export function getDateAfterLabel(
    text: string,
    label: string
): string | undefined {

    const normalized =
        normalizeWhitespace(text);

    const expression =
        new RegExp(
            `${escapeRegex(label)}\\s+(\\d{2}\\/\\d{2}\\/\\d{4})`,
            "i"
        );

    const match =
        normalized.match(expression);

    if (!match) {
        return undefined;
    }

    return match[1];

}

export function getDateBeforeLabel(
    text: string,
    label: string
): string | undefined {

    const normalized =
        normalizeWhitespace(text);

    const expression =
        new RegExp(
            `(\\d{2}\\/\\d{2}\\/\\d{4})\\s+${escapeRegex(label)}`,
            "i"
        );

    const match =
        normalized.match(expression);

    if (!match) {
        return undefined;
    }

    return match[1];

}

export function getTextAfterLabel(
    text: string,
    label: string
): string | undefined {

    const normalized =
        normalizeWhitespace(text);

    const expression =
        new RegExp(
            `${escapeRegex(label)}\\s+(.+?)($|\\s{2,})`,
            "i"
        );

    const match =
        normalized.match(expression);

    if (!match) {
        return undefined;
    }

    return match[1].trim();

}