import { scanRepairOrder }
from "./ocrApi";

export async function extractTextFromImages(
    images: File[],
): Promise<{
    rawText: string;
    layoutText: string;
}> {

    if (images.length === 0) {

        return {
            rawText: "",
            layoutText: "",
        };

    }

    const rawPages: string[] = [];
    const layoutPages: string[] = [];

    for (const image of images) {

        const text =
            await scanRepairOrder(image);

        rawPages.push(text.normalizedText);
        layoutPages.push(text.layoutText);

    }

    return {
        rawText: rawPages.join("\n\n"),
        layoutText: layoutPages.join("\n\n"),
    };

}
