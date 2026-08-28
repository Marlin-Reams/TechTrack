import { onRequest }
    from "firebase-functions/v2/https";

import cors
    from "cors";

import { readImagesText }
    from "../vision/googleVision";

import { normalizeDocument }
    from "../normalization/normalizeDocument";

import {getOcrUsage, recordOcrUsage}
    from "../vision/ocrUsage";

const corsHandler = cors({
    origin: true,
});

export const scanRepairOrder =
    onRequest((request, response) => {

        corsHandler(request, response, async () => {

            try {

                if (request.method === "GET") {
                    response.json({
                        success: true,
                        ...(await getOcrUsage()),
                    });
                    return;
                }

                if (request.method !== "POST") {

                    response.status(405).send(
                        "Method Not Allowed"
                    );

                    return;

                }

                const images: Buffer[] = [

                    request.rawBody,

                ];

                const documentText =
                    await readImagesText(images);

                const usage = await recordOcrUsage(images.length);

                const normalizedText =
                    normalizeDocument(documentText.rawText);

                const layoutText =
                    normalizeDocument(documentText.layoutText);

                response.json({

                    success: true,

                    rawText: documentText.rawText,

                    normalizedText,

                    layoutText,

                    usage,

                });

            }

            catch (error) {

                console.error(error);

                response.status(500).json({

                    success: false,

                    message:
                        "Unable to scan repair order.",

                });

            }

        });

    });
