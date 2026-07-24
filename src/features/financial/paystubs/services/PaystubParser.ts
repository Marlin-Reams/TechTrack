import type { ParseResult } from "../types/ParseResult";

export interface PaystubParser {

    /**
     * Returns true if this parser can process
     * the supplied document text.
     */
    canParse(
        documentText: string
    ): boolean;

    /**
     * Parses the supplied document and returns
     * a standardized result.
     */
    parse(
        documentText: string
    ): Promise<ParseResult>;
}