import "./AttachmentsSection.css";

import useAttachments from "../hooks/useAttachments";

export default function AttachmentsSection() {
    const {
        attachments,
    } = useAttachments();

    return (
        <section className="attachments-section">
            <div className="attachments-header">
                <h2>Attachments</h2>

                <button type="button">
                    Add Photos
                </button>
            </div>

            {attachments.length === 0 ? (
                <div className="attachments-empty">
                    No photos or attachments added.
                </div>
            ) : (
                <ul className="attachments-list">
                    {attachments.map((attachment) => (
                        <li key={attachment.id}>
                            <span>{attachment.fileName}</span>
                            <span>{attachment.fileSize} KB</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}