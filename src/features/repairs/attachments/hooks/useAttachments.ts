import { useState } from "react";
import type { RepairAttachment } from "../types/RepairAttachment";

export default function useAttachments() {
    const [attachments] = useState<RepairAttachment[]>([]);

    return {
        attachments,
    };
}