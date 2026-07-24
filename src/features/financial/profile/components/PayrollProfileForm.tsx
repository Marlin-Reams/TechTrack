import type { ChangeEvent } from "react";

import type { PayrollProfile }
    from "../../types/PayrollProfile";

interface Props {

    profile: PayrollProfile;

    onChange(
        updates: Partial<PayrollProfile>,
    ): void;

}

export default function PayrollProfileForm({

    profile,

    onChange,

}: Props) {

    function updateNumber(

        key: keyof PayrollProfile,

    ) {

        return (

            event: ChangeEvent<HTMLInputElement>,

        ) => {

            onChange({

                [key]: Number(
                    event.target.value,
                ),

            });

        };

    }

    return (

        <section className="payroll-profile-form">

            <h2>Compensation</h2>

            <label>

                Flat Rate Pay

                <input
                    type="number"
                    value={profile.flatRatePay}
                    onChange={updateNumber(
                        "flatRatePay",
                    )}
                />

            </label>

            <label>

                Weekly Goal Hours

                <input
                    type="number"
                    value={profile.weeklyGoalHours}
                    onChange={updateNumber(
                        "weeklyGoalHours",
                    )}
                />

            </label>

            <label>

                Guarantee %

                <input
                    type="number"
                    value={profile.guaranteePercentage}
                    onChange={updateNumber(
                        "guaranteePercentage",
                    )}
                />

            </label>

            <h2>Taxes</h2>

            <label>

                Federal %

                <input
                    type="number"
                    value={profile.federalTaxRate}
                    onChange={updateNumber(
                        "federalTaxRate",
                    )}
                />

            </label>

            <label>

                State %

                <input
                    type="number"
                    value={profile.stateTaxRate}
                    onChange={updateNumber(
                        "stateTaxRate",
                    )}
                />

            </label>

            <label>

                Social Security %

                <input
                    type="number"
                    value={profile.socialSecurityRate}
                    onChange={updateNumber(
                        "socialSecurityRate",
                    )}
                />

            </label>

            <label>

                Medicare %

                <input
                    type="number"
                    value={profile.medicareRate}
                    onChange={updateNumber(
                        "medicareRate",
                    )}
                />

            </label>

            <h2>Deductions</h2>

            <label>

                Insurance Per Week

                <input
                    type="number"
                    value={profile.insurancePerWeek}
                    onChange={updateNumber(
                        "insurancePerWeek",
                    )}
                />

            </label>

            <label>

                Retirement Per Week

                <input
                    type="number"
                    value={profile.retirementPerWeek}
                    onChange={updateNumber(
                        "retirementPerWeek",
                    )}
                />

            </label>

        </section>

    );

}