import { useEffect, useState } from "react";

import financialService from "../services/FinancialService";

import type { FinancialSummary } from "../types/FinancialSummary";

import FinancialSummaryCard from "../components/FinancialSummaryCard";

export default function FinancialPage() {

    const [summary, setSummary] =
        useState<FinancialSummary | null>(null);

    useEffect(() => {

        async function loadFinancialSummary() {

            const result =
                await financialService.getWeeklySummary();

            setSummary(result);
        }

        loadFinancialSummary();

    }, []);

    if (!summary) {
        return <p>Loading...</p>;
    }

    return (
        <main>

            <h1>Financial</h1>

            <FinancialSummaryCard
                summary={summary}
            />

        </main>
    );
}