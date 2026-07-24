import type { Paystub } from "../types/Paystub";

interface Props {
    paystub: Paystub;
}

export default function PaystubDetails({
    paystub,
}: Props) {

    const extraction =
        paystub.extraction;

    if (!extraction) {

        return (
            <p>
                This paystub has not been processed.
            </p>
        );

    }

    return (

        <section className="paystub-details">

            <h2>Paystub Details</h2>

            <table>

                <tbody>

                    <tr>
                        <th>Pay Date</th>
                        <td>{extraction.payDate ?? "-"}</td>
                    </tr>

                    <tr>
                        <th>Pay Period</th>
                        <td>

                            {extraction.payPeriodStart}
                            {" - "}
                            {extraction.payPeriodEnd}

                        </td>
                    </tr>

                    <tr>
                        <th>Gross Pay</th>
                        <td>

                            {formatCurrency(
                                extraction.grossPay
                            )}

                        </td>
                    </tr>

                    <tr>
                        <th>Net Pay</th>
                        <td>

                            {formatCurrency(
                                extraction.netPay
                            )}

                        </td>
                    </tr>

                    <tr>
                        <th>Flag Hours</th>
                        <td>

                            {extraction.flatRateHours ?? "-"}

                        </td>
                    </tr>

                </tbody>

            </table>

        </section>

    );

}

function formatCurrency(
    value?: number
) {

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