import type { Paystub } from "../types/Paystub";

interface PaystubDetailsModalProps {
    paystub: Paystub | null;
    open: boolean;
    onClose: () => void;
}

export default function PaystubDetailsModal({
    paystub,
    open,
    onClose,
}: PaystubDetailsModalProps) {

    if (!open || !paystub) {
        return null;
    }

    const extraction =
        paystub.extraction;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <header className="modal-header">

                    <h2>
                        Paystub Details
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </header>

                {!extraction ? (

                    <p>
                        This paystub has not been processed.
                    </p>

                ) : (

                    <section className="paystub-details">

                        <table>

                            <tbody>

                                <tr>
                                    <th>Pay Date</th>
                                    <td>{extraction.payDate ?? "-"}</td>
                                </tr>

                                <tr>
                                    <th>Pay Period</th>
                                    <td>
                                        {extraction.payPeriodStart ?? "-"}
                                        {" - "}
                                        {extraction.payPeriodEnd ?? "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <th>Gross Pay</th>
                                    <td>{formatCurrency(extraction.grossPay)}</td>
                                </tr>

                                <tr>
                                    <th>Net Pay</th>
                                    <td>{formatCurrency(extraction.netPay)}</td>
                                </tr>

                                <tr>
                                    <th>Flag Hours</th>
                                    <td>{extraction.flatRateHours ?? "-"}</td>
                                </tr>

                                <tr>
                                    <th>Federal Tax</th>
                                    <td>{formatCurrency(extraction.federalTax)}</td>
                                </tr>

                                <tr>
                                    <th>Social Security</th>
                                    <td>{formatCurrency(extraction.socialSecurity)}</td>
                                </tr>

                                <tr>
                                    <th>Medicare</th>
                                    <td>{formatCurrency(extraction.medicare)}</td>
                                </tr>

                                <tr>
                                    <th>Medical</th>
                                    <td>{formatCurrency(extraction.medical)}</td>
                                </tr>

                                <tr>
                                    <th>Dental</th>
                                    <td>{formatCurrency(extraction.dental)}</td>
                                </tr>

                                <tr>
                                    <th>Vision</th>
                                    <td>{formatCurrency(extraction.vision)}</td>
                                </tr>

                                <tr>
                                    <th>Loan Repayment</th>
                                    <td>{formatCurrency(extraction.loanRepayment)}</td>
                                </tr>

                            </tbody>

                        </table>

                    </section>

                )}

            </div>

        </div>

    );

}

function formatCurrency(
    value?: number
): string {

    if (value == null) {
        return "-";
    }

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        }
    );

}