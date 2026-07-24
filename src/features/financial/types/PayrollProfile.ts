export interface PayrollProfile {

    flatRatePay: number;

    weeklyGoalHours: number;

    medicalDeduction: number;

    dentalDeduction: number;

    visionDeduction: number;

    retirementDeduction: number;

    loanRepayment: number;

    federalWithholdingPercent: number;

    stateWithholdingPercent: number;

    socialSecurityPercent: number;

    medicarePercent: number;

    lastVerified: string;

}