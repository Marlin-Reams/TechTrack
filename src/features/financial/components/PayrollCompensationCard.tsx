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
                    <span>Gross Earnings</span>
                    <strong>
                        {formatCurrency(
                            summary.grossEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Guarantee Earnings</span>
                    <strong>
                        {formatCurrency(
                            summary.guaranteeEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Actual Earnings</span>
                    <strong>
                        {formatCurrency(
                            summary.actualEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Difference</span>
                    <strong>
                        {formatCurrency(
                            summary.differenceFromGuarantee,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Goal Earnings</span>
                    <strong>
                        {formatCurrency(
                            summary.goalEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Projected Weekly</span>
                    <strong>
                        {formatCurrency(
                            summary.projectedWeeklyIncome,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Projected Monthly</span>
                    <strong>
                        {formatCurrency(
                            summary.projectedMonthlyIncome,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Projected Annual</span>
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