import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DocumentImportPage.css";

import DocumentPageEditor
    from "../components/DocumentPageEditor";
import { importDocument }
    from "../services/documentImportService";
import { processDocumentImage }
    from "../services/processDocumentImage";
import { setImportSession }
    from "../repository/importSessionRepository";
import {getOcrUsage, type OcrUsage}
    from "../services/ocr/ocrApi";

import type { DocumentPage }
    from "../types/DocumentPage";
import type { ImportSession }
    from "../types/ImportSession";

export default function DocumentImportPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pagesRef = useRef<DocumentPage[]>([]);

    const [pages, setPages] = useState<DocumentPage[]>([]);
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [ocrUsage, setOcrUsage] = useState<OcrUsage | null>(null);

    useEffect(() => {
        getOcrUsage()
            .then(setOcrUsage)
            .catch(() => setOcrUsage(null));
    }, []);

    useEffect(() => {
        pagesRef.current = pages;
    }, [pages]);

    useEffect(() => {
        return () => {
            for (const page of pagesRef.current) {
                URL.revokeObjectURL(page.previewUrl);
            }
        };
    }, []);

    function addFiles(files: File[]) {
        const newPages = files.map(file => ({
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
            rotation: 0 as const,
            enhance: true,
            crop: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        }));

        setPages(previous => {
            const existing = new Set(
                previous.map(page =>
                    `${page.file.name}-${page.file.size}-${page.file.lastModified}`
                )
            );

            const uniquePages = newPages.filter(page => {
                const key = `${page.file.name}-${page.file.size}-${page.file.lastModified}`;

                if (existing.has(key)) {
                    URL.revokeObjectURL(page.previewUrl);
                    return false;
                }

                existing.add(key);
                return true;
            });

            return [...previous, ...uniquePages];
        });
        setErrorMessage("");
    }

    function updatePage(updated: DocumentPage) {
        setPages(previous => previous.map(page =>
            page.id === updated.id ? updated : page
        ));
    }

    function removePage(id: string) {
        setPages(previous => {
            const removed = previous.find(page => page.id === id);

            if (removed) {
                URL.revokeObjectURL(removed.previewUrl);
            }

            return previous.filter(page => page.id !== id);
        });
    }

    function movePage(index: number, direction: -1 | 1) {
        const destination = index + direction;

        if (destination < 0 || destination >= pages.length) {
            return;
        }

        setPages(previous => {
            const reordered = [...previous];
            const [page] = reordered.splice(index, 1);

            if (!page) {
                return previous;
            }

            reordered.splice(destination, 0, page);
            return reordered;
        });
    }

    async function handleImport() {
        if (pages.length === 0) {
            return;
        }

        setStatus("Enhancing document pages...");
        setErrorMessage("");
        setIsScanning(true);

        try {
            const processedFiles: File[] = [];

            for (let index = 0; index < pages.length; index++) {
                const page = pages[index];

                if (!page) {
                    continue;
                }

                setStatus(`Enhancing page ${index + 1} of ${pages.length}...`);
                processedFiles.push(
                    await processDocumentImage(page)
                );
            }

            setStatus("Reading repair order...");
            const result = await importDocument(processedFiles);
            const imageUrls = processedFiles.map(file =>
                URL.createObjectURL(file)
            );

            const session: ImportSession = {
                id: crypto.randomUUID(),
                imageName: pages.map(page => page.file.name).join(", "),
                imageUrls,
                scan: result,
            };

            setImportSession(session);
            navigate("/repairs/scan/review");
        }
        catch (error) {
            setStatus("");
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to scan the repair order."
            );
        }
        finally {
            setIsScanning(false);
        }
    }

    return (
        <main className="document-import-page">
            <h1>Scan Repair Order</h1>
            <p>
                Add every page, crop away the background, and enhance the text before scanning.
            </p>

            {ocrUsage && (
                <section
                    className={`ocr-usage ${
                        ocrUsage.count >= 950 ? "ocr-usage-danger" :
                        ocrUsage.count >= 800 ? "ocr-usage-warning" : ""
                    }`}
                    aria-label="Monthly Google OCR usage"
                >
                    <div>
                        <strong>Google OCR this month</strong>
                        <span>
                            {ocrUsage.count.toLocaleString()} of{" "}
                            {ocrUsage.monthlyFreeLimit.toLocaleString()} free pages
                        </span>
                    </div>
                    <progress
                        value={Math.min(ocrUsage.count, ocrUsage.monthlyFreeLimit)}
                        max={ocrUsage.monthlyFreeLimit}
                    />
                    <small>
                        Automatically resets each month with Google&apos;s billing cycle.
                        This app counter tracks pages scanned after it was enabled.
                    </small>
                </section>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="visually-hidden-file"
                onChange={event => {
                    addFiles(Array.from(event.target.files ?? []));
                    event.target.value = "";
                }}
            />

            <button
                className="scan-card"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
            >
                <div className="camera-icon">📷</div>
                <h2>{pages.length === 0 ? "Add First Page" : "Add Another Page"}</h2>
                <p>Use the camera, scanner app, or an existing image</p>
            </button>

            {pages.length > 0 && (
                <section className="selected-pages">
                    <div className="selected-pages-heading">
                        <div>
                            <h2>Prepare Pages</h2>
                            <p>{pages.length} page{pages.length === 1 ? "" : "s"} selected</p>
                        </div>
                        <strong>Enhancement is on by default</strong>
                    </div>

                    <div className="page-editor-grid">
                        {pages.map((page, index) => (
                            <DocumentPageEditor
                                key={page.id}
                                page={page}
                                index={index}
                                totalPages={pages.length}
                                disabled={isScanning}
                                onChange={updatePage}
                                onMove={direction => movePage(index, direction)}
                                onRemove={() => removePage(page.id)}
                            />
                        ))}
                    </div>

                    <button
                        className="start-scan-button"
                        type="button"
                        onClick={handleImport}
                        disabled={isScanning}
                    >
                        {isScanning
                            ? "Processing..."
                            : `Enhance & Scan ${pages.length} Page${pages.length === 1 ? "" : "s"}`}
                    </button>
                </section>
            )}

            {status && <p className="scan-status">{status}</p>}
            {errorMessage && (
                <p className="scan-error" role="alert">{errorMessage}</p>
            )}
        </main>
    );
}
