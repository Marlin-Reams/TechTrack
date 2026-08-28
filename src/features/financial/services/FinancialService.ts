import { getProductivitySummary }
    from "../../dashboard/services/productivityService";

import { getUserSettings }
    from "../../settings/services/settingsService";

import type { FinancialSummary }
    from "../types/FinancialSummary";

import { getPaystubs }
    from "../paystubs/repository/paystubRepository";

class FinancialService {

    async getWeeklySummary(): Promise<FinancialSummary> {

        const [productivity, settings, paystubs] = await Promise.all([
            getProductivitySummary(),
            getUserSettings(),
            getPaystubs(),
        ]);

        const flagHours =
            productivity.weeklyHours;

        const grossEarnings =
            flagHours * settings.flatRatePay;

        const goalHours =
            settings.weeklyFlagHourGoal;

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

        const guaranteeHours = 40 * 0.75;

        const guaranteeEarnings =
            guaranteeHours * settings.flatRatePay;

        const actualEarnings =
            Math.max(
                grossEarnings,
                guaranteeEarnings,
            );

        const differenceFromGuarantee =
            grossEarnings - guaranteeEarnings;

        const goalEarnings =
            goalHours * settings.flatRatePay;

        const projectedWeeklyIncome =
            actualEarnings;

        const validPaystubs = paystubs
            .filter(paystub =>
                paystub.status === "processed"
                && (paystub.extraction?.grossPay ?? 0) > 0
                && paystub.extraction?.netPay !== undefined
            )
            .sort((left, right) =>
                getPaystubTime(right.extraction?.payDate, right.uploadDate)
                - getPaystubTime(left.extraction?.payDate, left.uploadDate)
            );

        const latestPaystub = validPaystubs[0]?.extraction;
        const historical = validPaystubs.map(paystub => paystub.extraction!);
        const totalGross = historical.reduce(
            (total, paystub) => total + (paystub.grossPay ?? 0),
            0,
        );
        const averageWeeklyGross = historical.length > 0
            ? totalGross / historical.length
            : projectedWeeklyIncome;
        const currentMonth = new Date();
        const currentMonthPaystubs = validPaystubs.filter(paystub => {
            const date = parsePayDate(paystub.extraction?.payDate);
            return date
                && date.getFullYear() === currentMonth.getFullYear()
                && date.getMonth() === currentMonth.getMonth();
        });
        const currentMonthGross = currentMonthPaystubs.reduce(
            (total, paystub) => total + (paystub.extraction?.grossPay ?? 0),
            0,
        );
        const currentMonthPaychecks = new Set(
            currentMonthPaystubs.map(paystub => paystub.extraction?.payDate),
        ).size;
        const expectedMonthPaychecks = countWeekdaysInMonth(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            5,
        );
        const estimatedMonthPaychecks = Math.max(
            expectedMonthPaychecks - currentMonthPaychecks,
            0,
        );
        const projectedMonthlyIncome =
            currentMonthGross + averageWeeklyGross * estimatedMonthPaychecks;
        const yearToDateGross = latestPaystub?.yearToDateGross ?? 0;
        const remainingPayWeeks = getRemainingWeeklyPayPeriods(latestPaystub?.payDate);
        const annualProjectionUsesYearToDate = yearToDateGross > 0;
        const projectedAnnualIncome = annualProjectionUsesYearToDate
            ? yearToDateGross + averageWeeklyGross * remainingPayWeeks
            : averageWeeklyGross * 52;
        const totalTaxes = historical.reduce(
            (total, paystub) => total
                + (paystub.federalTax ?? 0)
                + (paystub.stateTax ?? 0)
                + (paystub.socialSecurity ?? 0)
                + (paystub.medicare ?? 0),
            0,
        );
        const estimatedTaxRate = totalGross > 0
            ? totalTaxes / totalGross
            : 0;
        const estimatedTaxes = actualEarnings * estimatedTaxRate;
        const estimatedInsurance = average(
            historical.map(paystub =>
                (paystub.medical ?? 0)
                + (paystub.dental ?? 0)
                + (paystub.vision ?? 0)
            ),
        );
        const estimatedRetirement = average(
            historical.map(paystub => paystub.retirement ?? 0),
        );
        const estimatedOtherDeductions = average(
            historical.map(paystub => paystub.loanRepayment ?? 0),
        );

        const estimatedTakeHome =
            actualEarnings
            - estimatedTaxes
            - estimatedInsurance
            - estimatedRetirement
            - estimatedOtherDeductions;

        return {

            weekFlagHours: flagHours,

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
            currentMonthPaychecks,
            estimatedMonthPaychecks,
            projectedAnnualIncome,
            yearToDateGross,
            averageWeeklyGross,
            remainingPayWeeks,
            annualProjectionUsesYearToDate,

            estimatedTaxes,
            estimatedInsurance,
            estimatedRetirement,
            estimatedOtherDeductions,

            estimatedTakeHome,
            paystubsUsed: historical.length,
            estimatedTaxRate,

            latestPaystub: latestPaystub
                ? {
                    payDate: latestPaystub.payDate,
                    grossPay: latestPaystub.grossPay,
                    netPay: latestPaystub.netPay,
                    flagHours: latestPaystub.flatRateHours,
                }
                : undefined,

        };

    }

}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((total, value) => total + value, 0) / values.length;
}

function getPaystubTime(payDate?: string, fallback?: string): number {
    if (payDate) {
        const [month, day, year] = payDate.split("/").map(Number);
        if (month && day && year) return new Date(year, month - 1, day).getTime();
    }
    return fallback ? new Date(fallback).getTime() : 0;
}

function getRemainingWeeklyPayPeriods(payDate?: string): number {
    if (!payDate) return 0;
    const [month, day, year] = payDate.split("/").map(Number);
    if (!month || !day || !year) return 0;

    const finalDay = new Date(year, 11, 31);
    const nextPayDate = new Date(year, month - 1, day + 7);
    let remaining = 0;
    while (nextPayDate <= finalDay) {
        remaining += 1;
        nextPayDate.setDate(nextPayDate.getDate() + 7);
    }
    return remaining;
}

function parsePayDate(payDate?: string): Date | undefined {
    if (!payDate) return undefined;
    const [month, day, year] = payDate.split("/").map(Number);
    if (!month || !day || !year) return undefined;
    return new Date(year, month - 1, day);
}

function countWeekdaysInMonth(year: number, month: number, weekday: number): number {
    let count = 0;
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        if (date.getDay() === weekday) count += 1;
        date.setDate(date.getDate() + 1);
    }
    return count;
}

export default new FinancialService();
