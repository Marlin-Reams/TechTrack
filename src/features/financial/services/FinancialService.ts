import { getProductivitySummary } from "../../dashboard/services/productivityService";

import payrollProfileService from "./PayrollProfileService";

import type { FinancialSummary } from "../types/FinancialSummary";

class FinancialService {

    async getWeeklySummary(): Promise<FinancialSummary> {

        const productivity = await getProductivitySummary();

        const payrollProfile =
            await payrollProfileService.getPayrollProfile();

        const flagHours = productivity.weeklyHours;

        // Clock hours will be added in a future milestone
        const clockHours = 0;

        const grossEarnings =
            flagHours * payrollProfile.flatRatePay;

        const goalHours =
            payrollProfile.weeklyGoalHours;

        const remainingGoalHours =
            Math.max(goalHours - flagHours, 0);

        const guaranteeHours = 0;

        const guaranteeEarnings = 0;

        const actualEarnings =
            Math.max(grossEarnings, guaranteeEarnings);

        const differenceFromGuarantee =
            actualEarnings - guaranteeEarnings;

        const goalEarnings =
            goalHours * payrollProfile.flatRatePay;

        const projectedWeeklyIncome =
            actualEarnings;

        const projectedMonthlyIncome =
            projectedWeeklyIncome * 52 / 12;

        const projectedAnnualIncome =
            projectedWeeklyIncome * 52;

        // Placeholder values until Payroll Profile is fully implemented
        const estimatedTaxes = 0;

        const estimatedInsurance = 0;

        const estimatedRetirement = 0;

        const estimatedTakeHome =
            actualEarnings
            - estimatedTaxes
            - estimatedInsurance
            - estimatedRetirement;

        return {

            // Productivity
            weekFlagHours: flagHours,
            weekClockHours: clockHours,

            // Goal Tracking
            goalHours,
            remainingGoalHours,
            guaranteeHours,

            // Earnings
            grossEarnings,
            guaranteeEarnings,
            actualEarnings,
            differenceFromGuarantee,

            // Goals & Projections
            goalEarnings,
            projectedWeeklyIncome,
            projectedMonthlyIncome,
            projectedAnnualIncome,

            // Deductions
            estimatedTaxes,
            estimatedInsurance,
            estimatedRetirement,

            // Net
            estimatedTakeHome,
        };
    }
}

export default new FinancialService();