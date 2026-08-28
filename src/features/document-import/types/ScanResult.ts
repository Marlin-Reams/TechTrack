import type { ParsedRepairOrder } from "./ParsedRepairOrder";

export interface ScanResult {

    /**
     * Was OCR successful?
     */
    success: boolean;

    /**
     * Raw OCR text.
     */
    rawText: string;

    /**
     * Confidence score (0–100).
     */
    confidence: number;

    /**
     * Parsed repair order.
     */
    parsedRepairOrder?: ParsedRepairOrder;

    /**
     * Any warnings produced during OCR/parsing.
     */
    warnings: string[];

}