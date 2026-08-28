import type { DocumentPage }
    from "../types/DocumentPage";

const MIN_OCR_WIDTH = 1800;
const MAX_SCALE = 3;

export async function processDocumentImage(
    page: DocumentPage,
): Promise<File> {
    const bitmap = await createImageBitmap(page.file);

    try {
        const sourceX = bitmap.width * page.crop.left / 100;
        const sourceY = bitmap.height * page.crop.top / 100;
        const sourceWidth = bitmap.width *
            (100 - page.crop.left - page.crop.right) / 100;
        const sourceHeight = bitmap.height *
            (100 - page.crop.top - page.crop.bottom) / 100;

        if (sourceWidth < 50 || sourceHeight < 50) {
            throw new Error("Crop area is too small.");
        }

        const sideways =
            page.rotation === 90 || page.rotation === 270;

        const rotatedWidth = sideways
            ? sourceHeight
            : sourceWidth;
        const rotatedHeight = sideways
            ? sourceWidth
            : sourceHeight;

        const scale = Math.min(
            Math.max(MIN_OCR_WIDTH / rotatedWidth, 1),
            MAX_SCALE,
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(rotatedWidth * scale);
        canvas.height = Math.round(rotatedHeight * scale);

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to prepare document image.");
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(page.rotation * Math.PI / 180);
        context.filter = page.enhance
            ? "grayscale(1) contrast(1.45) brightness(1.08)"
            : "none";

        context.drawImage(
            bitmap,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            -sourceWidth * scale / 2,
            -sourceHeight * scale / 2,
            sourceWidth * scale,
            sourceHeight * scale,
        );

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                result => result
                    ? resolve(result)
                    : reject(new Error("Unable to create enhanced scan.")),
                "image/jpeg",
                0.94,
            );
        });

        const baseName = page.file.name.replace(/\.[^.]+$/, "");

        return new File(
            [blob],
            `${baseName}-scan.jpg`,
            {
                type: "image/jpeg",
                lastModified: Date.now(),
            },
        );
    }
    finally {
        bitmap.close();
    }
}
