import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

export async function extractPdfText(
    file: File
): Promise<string> {

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjs.getDocument({
            data: buffer,
        }).promise;

    let text = "";

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);

        const content =
            await page.getTextContent();

        const pageText =
            content.items
                .map((item) => {

                    if ("str" in item) {
                        return item.str;
                    }

                    return "";

                })
                .join(" ");

        text += pageText + "\n";
    }

    return text;
}