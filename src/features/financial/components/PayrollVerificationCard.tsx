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

export default function PayrollVerificationCard({
    summary,
}: Props) {

    return (

        <section className="payroll-verification-card">

            <h2>Payroll Verification</h2>

            <div className="summary-grid">

                <div>
                    <span>Calculated Gross</span>
                    <strong>
                        {formatCurrency(
                            summary.grossEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Actual Earnings Used</span>
                    <strong>
                        {formatCurrency(
                            summary.actualEarnings,
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
                    <span>Difference</span>
                    <strong>
                        {formatCurrency(
                            summary.differenceFromGuarantee,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>
                        Pending Paystub Verification
                    </strong>
                </div>

            </div>

        </section>

    );

}