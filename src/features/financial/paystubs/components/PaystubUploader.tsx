import { useState } from "react";

import { uploadPaystub } from "../services/paystubUploadService";

interface PaystubUploaderProps {
    onUploadComplete: () => void;
}

type UploadStatus =
    | "idle"
    | "uploading"
    | "success"
    | "error";

export default function PaystubUploader({
    onUploadComplete,
}: PaystubUploaderProps) {

    const [uploadStatus, setUploadStatus] =
        useState<UploadStatus>("idle");

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleFileSelected(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadStatus("uploading");
        setErrorMessage("");

        try {

            await uploadPaystub(file);

            setUploadStatus("success");

            event.target.value = "";

            onUploadComplete();

        } catch (error) {

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Unable to upload paystub."
                );
            }

            setUploadStatus("error");
        }
    }

    return (

        <section>

            <h2>Upload Paystub</h2>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelected}
                disabled={
                    uploadStatus === "uploading"
                }
            />

            {uploadStatus === "uploading" && (
                <p>Uploading...</p>
            )}

            {uploadStatus === "success" && (
                <p>✓ Upload Complete</p>
            )}

            {uploadStatus === "error" && (
                <p>{errorMessage}</p>
            )}

        </section>
    );
}