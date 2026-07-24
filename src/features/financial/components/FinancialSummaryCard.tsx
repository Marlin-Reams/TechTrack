import type { FinancialSummary } from "../types/FinancialSummary";

interface Props {
    summary: FinancialSummary;
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

export default function FinancialSummaryCard({
    summary,
}: Props) {

    return (

        <section className="financial-summary-card">

            <h2>Weekly Summary</h2>

            <div className="summary-grid">

                <div>
                    <span>Flag Hours</span>
                    <strong>
                        {summary.weekFlagHours.toFixed(1)}
                    </strong>
                </div>

                <div>
                    <span>Clock Hours</span>
                    <strong>
                        {summary.weekClockHours.toFixed(1)}
                    </strong>
                </div>

                <div>
                    <span>Goal Hours</span>
                    <strong>
                        {summary.goalHours.toFixed(1)}
                    </strong>
                </div>

                <div>
                    <span>Remaining</span>
                    <strong>
                        {summary.remainingGoalHours.toFixed(1)}
                    </strong>
                </div>

                <div>
                    <span>Gross Earnings</span>
                    <strong>
                        {formatCurrency(
                            summary.grossEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Estimated Take Home</span>
                    <strong>
                        {formatCurrency(
                            summary.estimatedTakeHome,
                        )}
                    </strong>
                </div>

            </div>

        </section>

    );

}