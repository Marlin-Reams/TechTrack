import type { PayrollProfile } from "../types/PayrollProfile";

interface Props {

    profile: PayrollProfile;

}

export default function PayrollCompensationCard({
    profile,
}: Props) {

    return (

        <section className="financial-card">

            <h2>Compensation</h2>

            <p>

                <strong>Flat Rate Pay:</strong>{" "}

                ${profile.flatRatePay.toFixed(2)}

            </p>

            <p>

                <strong>Weekly Goal:</strong>{" "}

                {profile.weeklyGoalHours} hrs

            </p>

        </section>

    );

}