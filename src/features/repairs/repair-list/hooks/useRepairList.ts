import { useEffect, useState } from "react";

import { getRepairList } from "../services/repairListService";

import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

export default function useRepairList() {

    const [repairs, setRepairs] = useState<RepairRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadRepairs() {

        try {

            setLoading(true);

            const results = await getRepairList();

            setRepairs(results);

            setError(null);

        } catch {

            setError("Unable to load repairs.");

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadRepairs();
    }, []);

    return {
        repairs,
        loading,
        error,
        refresh: loadRepairs,
    };
}