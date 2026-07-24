import { useEffect, useState } from "react";

import FinancialSummaryCard
    from "../../components/FinancialSummaryCard";
import PayrollCompensationCard
    from "../../components/PayrollCompensationCard";
import PayrollDeductionsCard
    from "../../components/PayrollDeductionsCard";
import PayrollVerificationCard
    from "../../components/PayrollVerificationCard";

import FinancialService
    from "../../services/FinancialService";

import type { FinancialSummary }
    from "../../types/FinancialSummary";

import "./FinancialDashboardPage.css";

export default function FinancialDashboardPage() {

    const [summary, setSummary] =
        useState<FinancialSummary | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const result =
                await FinancialService.getWeeklySummary();

            setSummary(result);

        } catch (error) {

            console.error(
                "Failed to load financial dashboard.",
                error,
            );

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <main className="financial-dashboard">
                <p>Loading financial dashboard...</p>
            </main>
        );

    }

    if (!summary) {

        return (
            <main className="financial-dashboard">
                <p>Unable to load financial information.</p>
            </main>
        );

    }

    return (

        <main className="financial-dashboard">

            <FinancialSummaryCard
                summary={summary}
            />

            <div className="financial-dashboard-grid">

                <PayrollCompensationCard
                    summary={summary}
                />

                <PayrollDeductionsCard
                    summary={summary}
                />

            </div>

            <PayrollVerificationCard
                summary={summary}
            />

        </main>

    );

}