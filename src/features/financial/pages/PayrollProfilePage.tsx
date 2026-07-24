import { useEffect, useState } from "react";

import payrollProfileService
    from "../services/PayrollProfileService";

import PayrollProfileForm
    from "../profile/components/PayrollProfileForm";

import type { PayrollProfile }
    from "../types/PayrollProfile";

export default function PayrollProfilePage() {

    const [profile, setProfile] =
        useState<PayrollProfile | null>(null);

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {

        async function loadProfile() {

            const payrollProfile =
                await payrollProfileService.getPayrollProfile();

            setProfile(payrollProfile);

        }

        loadProfile();

    }, []);

    function updateProfile(
        updates: Partial<PayrollProfile>,
    ) {

        if (!profile) {

            return;

        }

        setProfile({

            ...profile,

            ...updates,

        });

    }

    async function saveProfile() {

        if (!profile) {

            return;

        }

        setSaving(true);

        try {

            await payrollProfileService.savePayrollProfile(
                profile,
            );

            alert("Payroll Profile Saved");

        } finally {

            setSaving(false);

        }

    }

    if (!profile) {

        return <p>Loading Payroll Profile...</p>;

    }

    return (

        <main className="payroll-profile-page">

            <h1>Payroll Profile</h1>

            <PayrollProfileForm
                profile={profile}
                onChange={updateProfile}
            />

            <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
            >

                {saving
                    ? "Saving..."
                    : "Save Payroll Profile"}

            </button>

        </main>

    );

}