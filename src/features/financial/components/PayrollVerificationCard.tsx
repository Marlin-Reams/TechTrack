import type { PayrollProfile } from "../types/PayrollProfile";

interface Props {

    profile: PayrollProfile;

}

export default function PayrollVerificationCard({
    profile,
}: Props) {

    return (

        <section className="financial-card">

            <h2>Verification</h2>

            <p>

                <strong>Last Verified:</strong>{" "}

                {profile.lastVerified || "Never"}

            </p>

            <p>

                <strong>Confidence:</strong>{" "}

                Coming Soon

            </p>

        </section>

    );

}