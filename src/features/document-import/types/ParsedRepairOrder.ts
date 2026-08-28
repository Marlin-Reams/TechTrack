import type { ParsedOperation } from "./ParsedOperation";


export interface ParsedRepairOrder {

    repairOrderNumber: string;

    repairDate: string;

    mileage: number;

    year?: string;

    make?: string;

    model?: string;

    engine?: string;

    vin?: string;

    licensePlate?: string;

    advisor?: string;

    customer?: string;

    operations: ParsedOperation[];

    /**
     * Overall parser confidence (0–100)
     */
    confidence: number;

    /**
     * OCR/parser warnings
     */
    warnings: string[];
}