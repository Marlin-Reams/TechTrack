async function createVisionClient() {
    const vision =
        await import("@google-cloud/vision");

    return new vision.default.ImageAnnotatorClient();
}

type VisionClient =
    Awaited<ReturnType<typeof createVisionClient>>;

let client: VisionClient | null = null;

async function getClient(): Promise<VisionClient> {

    if (!client) {

        client =
            await createVisionClient();

    }

    return client;

}

export interface VisionDocumentText {
    rawText: string;
    layoutText: string;
}

interface PositionedWord {
    text: string;
    x: number;
    y: number;
    height: number;
}

export async function readImagesText(
    images: Buffer[],
): Promise<VisionDocumentText> {

    const rawPages: string[] = [];
    const layoutPages: string[] = [];

    const visionClient =
        await getClient();

    for (const image of images) {

        const [result] =
            await visionClient.documentTextDetection({

                image: {
                    content: image,
                },

            });

        const annotation = result.fullTextAnnotation;

        rawPages.push(annotation?.text ?? "");

        for (const page of annotation?.pages ?? []) {
            const words: PositionedWord[] = [];
            for (const block of page.blocks ?? []) {
                for (const paragraph of block.paragraphs ?? []) {
                    for (const word of paragraph.words ?? []) {
                        const text = (word.symbols ?? [])
                            .map(symbol => symbol.text ?? "")
                            .join("")
                            .trim();

                        const vertices =
                            word.boundingBox?.vertices ?? [];

                        if (!text || vertices.length === 0) {
                            continue;
                        }

                        const xs = vertices.map(vertex => vertex.x ?? 0);
                        const ys = vertices.map(vertex => vertex.y ?? 0);
                        const top = Math.min(...ys);
                        const bottom = Math.max(...ys);

                        words.push({
                            text,
                            x: Math.min(...xs),
                            y: (top + bottom) / 2,
                            height: Math.max(bottom - top, 1),
                        });
                    }
                }
            }

            layoutPages.push(rebuildRows(words));
        }

    }

    return {
        rawText: rawPages.join("\n\n"),
        layoutText: layoutPages.join("\n\n"),
    };

}

function rebuildRows(words: PositionedWord[]): string {
    if (words.length === 0) {
        return "";
    }

    const medianHeight = [...words]
        .map(word => word.height)
        .sort((left, right) => left - right)[
            Math.floor(words.length / 2)
        ];

    // Keep adjacent work-order table rows separate. The earlier
    // 0.65 multiplier merged roughly 100 printed rows into only
    // 19 reconstructed lines on a normal phone photo.
    const tolerance = Math.max(medianHeight * 0.25, 3);
    const rows: PositionedWord[][] = [];

    for (const word of [...words].sort((left, right) =>
        left.y - right.y || left.x - right.x
    )) {
        const row = rows.find(candidate => {
            const averageY = candidate.reduce(
                (total, item) => total + item.y,
                0
            ) / candidate.length;

            return Math.abs(averageY - word.y) <= tolerance;
        });

        if (row) {
            row.push(word);
        }
        else {
            rows.push([word]);
        }
    }

    return rows
        .map(row => row
            .sort((left, right) => left.x - right.x)
            .map(word => word.text)
            .join(" ")
        )
        .join("\n");
}
