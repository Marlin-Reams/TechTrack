const OCR_URL =
    "https://us-central1-techtrack-ebb19.cloudfunctions.net/scanRepairOrder";

export interface OcrUsage {
    month: string;
    count: number;
    monthlyFreeLimit: number;
}

export async function getOcrUsage(): Promise<OcrUsage> {
    const response = await fetch(OCR_URL);

    if (!response.ok) {
        throw new Error("Unable to load OCR usage.");
    }

    const result = await response.json() as OcrUsage & {
        success: boolean;
    };

    return {
        month: result.month,
        count: result.count,
        monthlyFreeLimit: result.monthlyFreeLimit,
    };
}

export async function scanRepairOrder(
    image: File,
): Promise<{
    normalizedText: string;
    layoutText: string;
}> {

    const response = await fetch(OCR_URL, {
        method: "POST",
        headers: {
            "Content-Type": image.type,
        },
        body: image,
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text);
    }

    const result = JSON.parse(text);

    return {
        normalizedText: result.normalizedText,
        layoutText: result.layoutText ?? "",
    };
}
