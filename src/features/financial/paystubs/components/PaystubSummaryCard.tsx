import type { Paystub } from "../types/Paystub";

interface Props {
    paystub: Paystub;
    onClick?: () => void;
}

export default function PaystubSummaryCard({
    paystub,
    onClick,
}: Props) {

    const extraction =
        paystub.extraction;

    return (

        <article
            className="paystub-summary-card"
            onClick={onClick}
        >

            <h3>
                {extraction?.payDate ?? "Unknown Pay Date"}
            </h3>

            <p>

                Gross Pay:

                {" "}

                {formatCurrency(
                    extraction?.grossPay
                )}

            </p>

            <p>

                Net Pay:

                {" "}

                {formatCurrency(
                    extraction?.netPay
                )}

            </p>

            <p>

                Flag Hours:

                {" "}

                {extraction?.flatRateHours ?? "-"}

            </p>

            <p>

                Status:

                {" "}

                {paystub.status}

            </p>

        </article>

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