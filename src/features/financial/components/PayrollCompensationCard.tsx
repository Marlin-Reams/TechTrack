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

export default function PayrollCompensationCard({
    summary,
}: Props) {

    return (

        <section className="payroll-compensation-card">

            <h2>Compensation</h2>

            <div className="summary-grid">

                <div>
                    <span>Weekly Guarantee Floor</span>
                    <strong>
                        {formatCurrency(
                            summary.guaranteeEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Weekly Goal</span>
                    <strong>
                        {formatCurrency(
                            summary.goalEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Average Imported Week</span>
                    <strong>
                        {formatCurrency(summary.averageWeeklyGross)}
                    </strong>
                </div>

                <div>
                    <span>Year to Date Gross</span>
                    <strong>
                        {summary.annualProjectionUsesYearToDate
                            ? formatCurrency(summary.yearToDateGross)
                            : "Waiting for next import"}
                    </strong>
                </div>

                <div>
                    <span>
                        Projected This Month
                        {summary.estimatedMonthPaychecks > 0
                            ? ` (${summary.estimatedMonthPaychecks} estimated)`
                            : ""}
                    </span>
                    <strong>
                        {formatCurrency(
                            summary.projectedMonthlyIncome,
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Projected Annual
                        {summary.annualProjectionUsesYearToDate
                            ? ` (${summary.remainingPayWeeks} weeks left)`
                            : ""}
                    </span>
                    <strong>
                        {formatCurrency(
                            summary.projectedAnnualIncome,
                        )}
                    </strong>
                </div>

            </div>

        </section>

    );

}
