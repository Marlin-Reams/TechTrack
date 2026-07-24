import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import type { DashboardSummary } from "../services/dashboardService";

export default function useDashboard() {
    const [summary, setSummary] =
        useState<DashboardSummary | null>(null);

    useEffect(() => {
        async function load() {
            const data = await getDashboardSummary();
            setSummary(data);
        }

        load();
    }, []);

    return summary;
}