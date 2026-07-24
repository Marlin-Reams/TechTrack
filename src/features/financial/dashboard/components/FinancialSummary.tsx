import { useEffect, useState } from "react";

import financialService from "../../services/FinancialService";

import type { FinancialSummary as FinancialSummaryModel }
    from "../../types/FinancialSummary";

export default function FinancialSummary() {

    const [summary, setSummary] =
        useState<FinancialSummaryModel | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadSummary();

    }, []);

    async function loadSummary() {

        try {

            const result =
                await financialService.getWeeklySummary();

            setSummary(result);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <p>Loading...</p>;

    }

    if (!summary) {

        return <p>No financial data.</p>;

    }

    return (

        <section className="financial-summary">

            <div className="summary-card">

                <h3>Current Week</h3>

                <p>Flag Hours</p>
                <strong>{summary.weekFlagHours.toFixed(1)}</strong>

                <p>Goal Hours</p>
                <strong>{summary.goalHours.toFixed(1)}</strong>

                <p>Remaining</p>
                <strong>{summary.remainingGoalHours.toFixed(1)}</strong>

            </div>

            <div className="summary-card">

                <h3>Earnings</h3>

                <p>Gross</p>
                <strong>{formatCurrency(summary.grossEarnings)}</strong>

                <p>Estimated Take Home</p>
                <strong>{formatCurrency(summary.estimatedTakeHome)}</strong>

                <p>Projected Annual</p>
                <strong>{formatCurrency(summary.projectedAnnualIncome)}</strong>

            </div>

        </section>

    );

}

function formatCurrency(
    value: number,
) {

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        },
    );

}