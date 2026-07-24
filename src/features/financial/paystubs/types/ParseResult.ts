import type { PayrollExtraction } from "./Paystub";

export interface ParseResult {

    success: boolean;

    extraction?: PayrollExtraction;

    confidence: number;

    parserVersion: string;

    error?: string;

}