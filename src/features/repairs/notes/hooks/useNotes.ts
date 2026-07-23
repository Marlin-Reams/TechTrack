import { useState } from "react";
import type { RepairNote } from "../types/RepairNote";

export default function useNotes() {
    const [note, setNote] = useState<RepairNote>({
        content: "",
    });

    function updateNote(content: string) {
        setNote({
            content,
        });
    }

    return {
        note,
        updateNote,
    };
}