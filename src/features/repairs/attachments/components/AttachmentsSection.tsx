import "./AttachmentsSection.css";

import type { Dispatch, SetStateAction } from "react";

import type { RepairAttachment } from "../types/RepairAttachment";
import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

type AttachmentsSectionProps = {
    attachments: RepairAttachment[];
    setRepairRecord: Dispatch<SetStateAction<RepairRecord>>;
};

export default function AttachmentsSection({
    attachments,
}: AttachmentsSectionProps) {
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