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

export default function PayrollDeductionsCard({
    summary,
}: Props) {

    const totalDeductions =
        summary.estimatedTaxes
        + summary.estimatedInsurance
        + summary.estimatedRetirement
        + summary.estimatedOtherDeductions;

    return (

        <section className="payroll-deductions-card">

            <div className="financial-card-heading">
                <h2>Deductions</h2>
                <span>
                    Based on {summary.paystubsUsed} paystub{summary.paystubsUsed === 1 ? "" : "s"}
                </span>
            </div>

            <div className="summary-grid">

                <div>
                    <span>Estimated Taxes ({(summary.estimatedTaxRate * 100).toFixed(1)}%)</span>
                    <strong>
                        {formatCurrency(
                            summary.estimatedTaxes,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Insurance</span>
                    <strong>
                        {formatCurrency(
                            summary.estimatedInsurance,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Retirement</span>
                    <strong>
                        {formatCurrency(
                            summary.estimatedRetirement,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Other Deductions</span>
                    <strong>
                        {formatCurrency(
                            summary.estimatedOtherDeductions,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Total Deductions</span>
                    <strong>
                        {formatCurrency(
                            totalDeductions,
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
