export interface FinancialSummary {
    // Productivity
    weekFlagHours: number;
    weekClockHours: number;

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
    projectedAnnualIncome: number;

    // Deductions
    estimatedTaxes: number;
    estimatedInsurance: number;
    estimatedRetirement: number;

    // Net
    estimatedTakeHome: number;
}