import { useState } from "react";

import type { Paystub } from "../types/Paystub";

import PaystubDetailsModal from "./PaystubDetailsModal";

interface PaystubCardProps {
    paystub: Paystub;
}

export default function PaystubCard({
    paystub,
}: PaystubCardProps) {

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const extraction =
        paystub.extraction;

    return (

        <>

            <article
                className="paystub-card"
                onClick={() => setDetailsOpen(true)}
            >

                <h3>

                    {extraction?.payDate ??
                        "Unknown Pay Date"}

                </h3>

                <p>

                    Net Pay

                    {" "}

                    {formatCurrency(
                        extraction?.netPay
                    )}

                </p>

                <p>

                    Gross Pay

                    {" "}

                    {formatCurrency(
                        extraction?.grossPay
                    )}

                </p>

                <p>

                    Status

                    {" "}

                    {paystub.status}

                </p>

            </article>

            <PaystubDetailsModal

                paystub={paystub}

                open={detailsOpen}

                onClose={() =>
                    setDetailsOpen(false)
                }

            />

        </>

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