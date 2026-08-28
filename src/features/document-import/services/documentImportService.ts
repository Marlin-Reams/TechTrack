import { parseRepairOrder }
    from "../parsers/repairOrderParser";

import {
    extractTextFromImages,
} from "./ocr/googleVisionOCR";

import type { ScanResult }
    from "../types/ScanResult";

export async function importDocument(
    images: File[],
): Promise<ScanResult> {

    const documentText =
        await extractTextFromImages(
            images
        );

    const parsedRepairOrder =
        parseRepairOrder(
            documentText.rawText,
            documentText.layoutText,
        );

    if (!documentText.rawText.trim()) {
        throw new Error(
            "No readable text was found. Retake the photo in brighter light and keep the full page in frame."
        );
    }

    return {

        success: true,

        rawText: documentText.rawText,

        confidence: parsedRepairOrder.confidence,

        parsedRepairOrder,

        warnings: parsedRepairOrder.warnings,

    };

}
