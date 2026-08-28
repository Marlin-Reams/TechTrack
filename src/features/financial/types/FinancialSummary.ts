export interface FinancialSummary {
    // Productivity
    weekFlagHours: number;

    // Goal Tracking
    goalHours: number;
    remainingGoalHours: number;
    guaranteeHours: number;

    // Earnings
    grossEarnings: number;
    guaranteeEarnings: number;
    actualEarnings: number;
    differenceFromGuarantee: number;

    // Goals & Projections
    goalEarnings: number;
    projectedWeeklyIncome: number;
    projectedMonthlyIncome: number;
    currentMonthPaychecks: number;
    estimatedMonthPaychecks: number;
    projectedAnnualIncome: number;
    yearToDateGross: number;
    averageWeeklyGross: number;
    remainingPayWeeks: number;
    annualProjectionUsesYearToDate: boolean;

    // Deductions
    estimatedTaxes: number;
    estimatedInsurance: number;
    estimatedRetirement: number;
    estimatedOtherDeductions: number;

    // Net
    estimatedTakeHome: number;

    // Historical estimate quality
    paystubsUsed: number;
    estimatedTaxRate: number;

    // Most recently imported payroll statement
    latestPaystub?: {
        payDate?: string;
        grossPay?: number;
        netPay?: number;
        flagHours?: number;
    };
}
