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
        + summary.estimatedRetirement;

    return (

        <section className="payroll-deductions-card">

            <h2>Deductions</h2>

            <div className="summary-grid">

                <div>
                    <span>Estimated Taxes</span>
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