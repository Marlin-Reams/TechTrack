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

    const paystub = summary.latestPaystub;

    return (

        <section className="payroll-verification-card">

            <h2>Payroll Verification</h2>

            <div className="summary-grid">

                <div>
                    <span>Current Expected Gross</span>
                    <strong>
                        {formatCurrency(
                            summary.grossEarnings,
                        )}
                    </strong>
                </div>

                <div>
                    <span>Latest Imported Gross</span>
                    <strong>
                        {paystub?.grossPay === undefined
                            ? "-"
                            : formatCurrency(paystub.grossPay)}
                    </strong>
                </div>

                <div>
                    <span>Latest Net Pay</span>
                    <strong>
                        {paystub?.netPay === undefined
                            ? "-"
                            : formatCurrency(paystub.netPay)}
                    </strong>
                </div>

                <div>
                    <span>Latest Flag Hours</span>
                    <strong>
                        {paystub?.flagHours === undefined
                            ? "-"
                            : paystub.flagHours.toFixed(1)}
                    </strong>
                </div>

                <div>
                    <span>Latest Pay Date</span>
                    <strong>
                        {paystub?.payDate ?? "No paystub imported"}
                    </strong>
                </div>

            </div>

        </section>

    );

}
