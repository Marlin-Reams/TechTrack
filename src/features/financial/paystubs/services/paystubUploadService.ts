import {
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";

import {
    auth,
    storage,
} from "../../../../firebase";

import {
    createPaystub,
    markPaystubFailed,
    updatePaystubExtraction,
    updatePaystubStatus,
} from "../repository/paystubRepository";

import { extractPdfText } from "./pdfTextExtractor";
import FirestonePaystubParser from "./FirestonePaystubParser";

export async function uploadPaystub(
    file: File
): Promise<void> {
    
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are supported.");
    }

    const maxFileSize =
        10 * 1024 * 1024;

    if (file.size > maxFileSize) {
        throw new Error(
            "Maximum file size is 10 MB."
        );
    }

    const timestamp = Date.now();

    const storagePath =
        `users/${user.uid}/paystubs/${timestamp}-${file.name}`;

    const storageReference =
        ref(storage, storagePath);

    await uploadBytes(
        storageReference,
        file
    );

    const downloadUrl =
        await getDownloadURL(
            storageReference
        );

    const paystubId =
        await createPaystub({

            fileName: file.name,

            storagePath,

            downloadUrl,

            uploadDate:
                new Date().toISOString(),

            status: "uploaded",

        });

    try {

        await updatePaystubStatus(
            paystubId,
            "processing"
        );

        const documentText =
            await extractPdfText(file);

        if (
            !FirestonePaystubParser.canParse(
                documentText
            )
        ) {

            throw new Error(
                "Unsupported paystub format."
            );

        }

        
        const result =
            await FirestonePaystubParser.parse(
                documentText
            );
        if (
            !result.success ||
            !result.extraction
        ) {

            throw new Error(
                result.error ??
                "Unable to parse paystub."
            );

        }

        await updatePaystubExtraction(

            paystubId,

            result.extraction,

            result.parserVersion,

            result.confidence

        );

    } catch (error) {

        await markPaystubFailed(

            paystubId,

            error instanceof Error
                ? error.message
                : "Unknown processing error"

        );
    }
}