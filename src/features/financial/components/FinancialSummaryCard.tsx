import type { FinancialSummary } from "../types/FinancialSummary";

interface Props {
    summary: FinancialSummary;
}

export default function FinancialSummaryCard({
    summary,
}: Props) {

    return (

        <section>

            <h2>Weekly Summary</h2>

            <p>
                Flag Hours: {summary.weekFlagHours}
            </p>

            <p>
                Clock Hours: {summary.weekClockHours}
            </p>

            <p>
                Goal Hours: {summary.goalHours}
            </p>

            <p>
                Remaining Hours: {summary.remainingGoalHours}
            </p>

        </section>

    );
}