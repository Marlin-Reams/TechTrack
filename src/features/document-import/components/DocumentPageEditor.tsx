import "./DocumentPageEditor.css";

import type {
    DocumentCrop,
    DocumentPage,
} from "../types/DocumentPage";

interface Props {
    page: DocumentPage;
    index: number;
    totalPages: number;
    disabled: boolean;
    onChange: (page: DocumentPage) => void;
    onMove: (direction: -1 | 1) => void;
    onRemove: () => void;
}

export default function DocumentPageEditor({
    page,
    index,
    totalPages,
    disabled,
    onChange,
    onMove,
    onRemove,
}: Props) {
    function updateCrop(
        field: keyof DocumentCrop,
        value: number,
    ) {
        onChange({
            ...page,
            crop: {
                ...page.crop,
                [field]: value,
            },
        });
    }

    function rotate() {
        const rotations: DocumentPage["rotation"][] = [
            0, 90, 180, 270,
        ];
        const current = rotations.indexOf(page.rotation);

        onChange({
            ...page,
            rotation: rotations[(current + 1) % rotations.length],
        });
    }

    function reset() {
        onChange({
            ...page,
            rotation: 0,
            enhance: true,
            crop: { top: 0, right: 0, bottom: 0, left: 0 },
        });
    }

    return (
        <article className="document-page-editor">
            <header>
                <strong>Page {index + 1}</strong>
                <span>{page.file.name}</span>
            </header>

            <div className="document-editor-workspace">
                <div className="document-preview-frame">
                    <img
                        src={page.previewUrl}
                        alt={`Work order page ${index + 1}`}
                        style={{
                            transform: `rotate(${page.rotation}deg)`,
                            filter: page.enhance
                                ? "grayscale(1) contrast(1.35) brightness(1.05)"
                                : "none",
                            clipPath: `inset(${page.crop.top}% ${page.crop.right}% ${page.crop.bottom}% ${page.crop.left}%)`,
                        }}
                    />
                </div>

                <aside className="document-editor-controls">
                    <h3>Edit Page</h3>
                    <div className="page-editor-actions">
                        <button type="button" onClick={rotate} disabled={disabled}>
                            Rotate 90°
                        </button>
                        <label>
                            <input
                                type="checkbox"
                                checked={page.enhance}
                                onChange={event => onChange({
                                    ...page,
                                    enhance: event.target.checked,
                                })}
                                disabled={disabled}
                            />
                            Enhance text
                        </label>
                        <button type="button" onClick={reset} disabled={disabled}>
                            Reset
                        </button>
                    </div>

                    <div className="crop-section">
                        <h3>Crop Background</h3>
                        <p>Move each edge inward until only the paper remains.</p>
                        <div className="crop-controls">
                            {(["top", "right", "bottom", "left"] as const)
                                .map(field => (
                                    <label key={field}>
                                        {field} {page.crop[field]}%
                                        <input
                                            type="range"
                                            min="0"
                                            max="35"
                                            value={page.crop[field]}
                                            onChange={event =>
                                                updateCrop(field, Number(event.target.value))
                                            }
                                            disabled={disabled}
                                        />
                                    </label>
                                ))}
                        </div>
                    </div>

                    <footer>
                        {totalPages > 1 && (
                            <>
                                <span className="page-order-label">Page order:</span>
                                <button type="button" onClick={() => onMove(-1)} disabled={disabled || index === 0}>
                                    Earlier
                                </button>
                                <button type="button" onClick={() => onMove(1)} disabled={disabled || index === totalPages - 1}>
                                    Later
                                </button>
                            </>
                        )}
                        <button className="remove-page" type="button" onClick={onRemove} disabled={disabled}>
                            Remove
                        </button>
                    </footer>
                </aside>
            </div>
        </article>
    );
}
