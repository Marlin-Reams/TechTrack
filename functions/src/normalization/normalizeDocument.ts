export function normalizeDocument(
    rawText: string,
): string {

    return rawText

        // Normalize Windows line endings.
        .replace(/\r\n/g, "\n")

        // Remove tabs.
        .replace(/\t/g, " ")

        // Collapse multiple spaces.
        .replace(/ {2,}/g, " ")

        // Remove trailing spaces.
        .replace(/[ ]+\n/g, "\n")

        // Collapse excessive blank lines.
        .replace(/\n{3,}/g, "\n\n")

        // Trim beginning/end.
        .trim();

}