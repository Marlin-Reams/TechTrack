import { getProductivitySummary }
    from "../../dashboard/services/productivityService";

import payrollProfileService
    from "./PayrollProfileService";

import type { FinancialSummary }
    from "../types/FinancialSummary";

class FinancialService {

    async getWeeklySummary(): Promise<FinancialSummary> {

        const productivity =
            await getProductivitySummary();

        const payrollProfile =
            await payrollProfileService.getPayrollProfile();

        const flagHours =
            productivity.weeklyHours;

        const grossEarnings =
            flagHours * payrollProfile.flatRatePay;

        const goalHours =
            payrollProfile.weeklyGoalHours;

        const remainingGoalHours =
            Math.max(
                goalHours - flagHours,
                0,
            );

        //
        // Financial v1
        //
        // Firestone guarantee currently treated as
        // a fixed weekly base of $1,140.
        // This can become configurable later.
        //

        const guaranteeHours = 30;

        const guaranteeEarnings = 1140;

        const actualEarnings =
            Math.max(
                grossEarnings,
                guaranteeEarnings,
            );

        const differenceFromGuarantee =
            grossEarnings - guaranteeEarnings;

        const goalEarnings =
            goalHours * payrollProfile.flatRatePay;

        const projectedWeeklyIncome =
            actualEarnings;

        const projectedMonthlyIncome =
            projectedWeeklyIncome * 52 / 12;

        const projectedAnnualIncome =
            projectedWeeklyIncome * 52;

        //
        // These will come from Paystub Import
        // in Financial v2.
        //

        const estimatedTaxes = 0;

        const estimatedInsurance = 0;

        const estimatedRetirement = 0;

        const estimatedTakeHome =
            actualEarnings
            - estimatedTaxes
            - estimatedInsurance
            - estimatedRetirement;

        return {

            weekFlagHours: flagHours,
            weekClockHours: 40,

            goalHours,
            remainingGoalHours,
            guaranteeHours,

            grossEarnings,
            guaranteeEarnings,
            actualEarnings,
            differenceFromGuarantee,

            goalEarnings,
            projectedWeeklyIncome,
            projectedMonthlyIncome,
            projectedAnnualIncome,

            estimatedTaxes,
            estimatedInsurance,
            estimatedRetirement,

            estimatedTakeHome,

        };

    }

}

export default new FinancialService();