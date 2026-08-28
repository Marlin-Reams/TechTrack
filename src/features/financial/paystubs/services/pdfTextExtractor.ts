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

        const rows = new Map<number, Array<{ x: number; text: string }>>();

        for (const item of content.items) {
            if (!("str" in item) || !item.str.trim()) {
                continue;
            }

            const x = item.transform[4];
            const y = Math.round(item.transform[5] * 2) / 2;
            const row = rows.get(y) ?? [];
            row.push({ x, text: item.str });
            rows.set(y, row);
        }

        const pageText = [...rows.entries()]
            .sort(([firstY], [secondY]) => secondY - firstY)
            .map(([, row]) => row
                .sort((first, second) => first.x - second.x)
                .map(item => item.text)
                .join(" "))
            .join("\n");

        text += pageText + "\n";
    }

    return text;
}
