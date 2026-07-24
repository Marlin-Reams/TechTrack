import { useEffect, useState } from "react";

import {
    getPaystubs,
} from "../repository/paystubRepository";

import type { Paystub } from "../types/Paystub";

import PaystubCard from "./PaystubCard";

interface PaystubListProps {
    refreshKey: number;
}

export default function PaystubList({
    refreshKey,
}: PaystubListProps) {

    const [paystubs, setPaystubs] =
        useState<Paystub[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadPaystubs();

    }, [refreshKey]);

    async function loadPaystubs() {

        setLoading(true);
        setError("");

        try {

            const results =
                await getPaystubs();

            setPaystubs(results);

        } catch {

            setError(
                "Unable to load paystubs."
            );

        } finally {

            setLoading(false);

        }
    }

    if (loading) {
        return <p>Loading paystubs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (paystubs.length === 0) {
        return (
            <p>
                No paystubs uploaded yet.
            </p>
        );
    }

    return (

        <section>

            {paystubs.map((paystub) => (

                <PaystubCard
                    key={paystub.id}
                    paystub={paystub}
                />

            ))}

        </section>

    );
}