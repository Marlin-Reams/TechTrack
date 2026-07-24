import { useEffect, useState } from "react";

import payrollProfileService from "../services/PayrollProfileService";

import PayrollCompensationCard from "../components/PayrollCompensationCard";
import PayrollDeductionsCard from "../components/PayrollDeductionsCard";
import PayrollVerificationCard from "../components/PayrollVerificationCard";

import type { PayrollProfile } from "../types/PayrollProfile";

export default function PayrollProfilePage() {

    const [profile, setProfile] =
        useState<PayrollProfile | null>(null);

    useEffect(() => {

        async function loadProfile() {

            const payrollProfile =
                await payrollProfileService.getPayrollProfile();

            setProfile(payrollProfile);

        }

        loadProfile();

    }, []);

    if (!profile) {

        return <p>Loading Payroll Profile...</p>;

    }

    return (

        <main className="payroll-profile-page">

            <h1>Payroll Profile</h1>

            <PayrollCompensationCard
                profile={profile}
            />

            <PayrollDeductionsCard
                profile={profile}
            />

            <PayrollVerificationCard
                profile={profile}
            />

        </main>

    );

}