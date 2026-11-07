import { useState } from "react";
import { Link } from "react-router-dom";
import { scanRepairOrder } from "../../document-import/services/ocr/ocrApi";
import { parseFrhPreview } from "../services/frhParser";

export default function FrhReportScanPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState<Array<{ name: string; normalizedText: string; layoutText: string }>>([]);

    async function scan() {
        if (!files.length || busy) return;
        setBusy(true);
        setError("");
        setResults([]);
        try {
            const output = [];
            for (const file of files) {
                const result = await scanRepairOrder(file);
                output.push({ name: file.name, ...result });
            }
            setResults(output);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Unable to read FRH report.");
        } finally {
            setBusy(false);
        }
    }

    const previews = results.map(result => ({ name: result.name, preview: parseFrhPreview(result.layoutText || result.normalizedText) }));

    const text = results.map(result =>
        `=== ${result.name} ===\nLAYOUT TEXT\n${result.layoutText}\n\nNORMALIZED TEXT\n${result.normalizedText}`
    ).join("\n\n");

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
            <Link to="/payroll-verification">Back to Payroll Review</Link>
            <h1>Scan FRH Workorder Summary</h1>
            <p>Development preview: read a Daily or Week-to-Date FRH printout and inspect the OCR result. This does not change any repair or payroll status.</p>
            <label htmlFor="frh-files">Photograph or upload report pages</label>
            <input id="frh-files" type="file" accept="image/*" multiple
                onChange={event => { setFiles(Array.from(event.target.files ?? [])); setResults([]); setError(""); }} />
            <p>{files.length} page(s) selected</p>
            <button type="button" onClick={() => void scan()} disabled={busy || !files.length}>
                {busy ? "Reading report..." : "Read FRH Report"}
            </button>
            {error && <p role="alert">{error}</p>}
            {results.length > 0 && (
                <section>
                    <h2>FRH extraction preview</h2>
                    <p><strong>Preview only.</strong> No repairs will be completed or payroll verified by this screen.</p>
                    {previews.map(({ name, preview }) => <section key={name}>
                        <h3>{name}</h3>
                        <p>{preview.rows.length} RO rows found. Parsed total: {preview.calculatedTotal.toFixed(1)} hours. Printed total: {preview.printedTotal === null ? "Not detected" : preview.printedTotal.toFixed(1) + " hours"}.</p>
                        <ul>{preview.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>
                        {preview.rows.length > 0 && <table><thead><tr><th>RO</th><th>Hours</th></tr></thead><tbody>{preview.rows.map((row, index) => <tr key={`${row.ro}-${index}`}><td>{row.ro}</td><td>{row.hours.toFixed(1)}</td></tr>)}</tbody></table>}
                    </section>)}
                    <h2>OCR diagnostic output</h2>
                    <p>Review the From/To dates, RO numbers and hours. The output may contain customer or store information, so only share what you're comfortable sharing.</p>
                    <button type="button" onClick={() => void navigator.clipboard.writeText(text)}>Copy OCR Text</button>
                    <textarea readOnly aria-label="FRH OCR text" value={text} rows={24}
                        style={{ display: "block", width: "100%", marginTop: 12, fontFamily: "monospace" }} />
                </section>
            )}
        </main>
    );
}
