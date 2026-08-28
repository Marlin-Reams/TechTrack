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

export function getCurrentAmountFromRow(
    text: string,
    label: string
): number | undefined {
    const line = text
        .split("\n")
        .find(candidate =>
            candidate.toLowerCase().includes(label.toLowerCase())
        );

    if (!line) {
        return undefined;
    }

    const labelIndex = line.toLowerCase().indexOf(label.toLowerCase());
    const values = line
        .slice(labelIndex + label.length)
        .match(/-?[\d,]+\.\d{2}/g);

    if (!values || values.length < 2) {
        return undefined;
    }

    return Math.abs(Number(values[0].replace(/,/g, "")));
}

export function getLastAmountFromRow(
    text: string,
    label: string
): number | undefined {
    const line = text
        .split("\n")
        .find(candidate =>
            candidate.toLowerCase().includes(label.toLowerCase())
        );

    const values = line?.match(/-?[\d,]+\.\d{2}/g);
    const value = values?.at(-1);

    return value === undefined
        ? undefined
        : Math.abs(Number(value.replace(/,/g, "")));
}
