import type { PayrollProfile } from "../types/PayrollProfile";

interface Props {

    profile: PayrollProfile;

}

export default function PayrollDeductionsCard({
    profile,
}: Props) {

    return (

        <section className="financial-card">

            <h2>Deductions</h2>

            <p>Medical: ${profile.medicalDeduction.toFixed(2)}</p>

            <p>Dental: ${profile.dentalDeduction.toFixed(2)}</p>

            <p>Vision: ${profile.visionDeduction.toFixed(2)}</p>

            <p>Retirement: ${profile.retirementDeduction.toFixed(2)}</p>

            <p>Loan Repayment: ${profile.loanRepayment.toFixed(2)}</p>

        </section>

    );

}