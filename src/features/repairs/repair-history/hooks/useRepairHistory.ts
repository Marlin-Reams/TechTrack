import { useEffect, useState } from "react";

import { getCompletedRepairs } from "../../repository/repairRepository";
import type { StoredRepair } from "../../types/StoredRepair";

export default function useRepairHistory() {
    const [repairs, setRepairs] = useState<StoredRepair[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRepairs() {
            try {
                const repairs = await getCompletedRepairs();

                setRepairs(repairs);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Unable to load repair history.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadRepairs();
    }, []);

    return {
        repairs,
        loading,
        error,
    };
}