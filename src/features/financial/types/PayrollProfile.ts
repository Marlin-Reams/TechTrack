export interface PayrollProfile {

    // Compensation

    flatRatePay: number;

    weeklyGoalHours: number;

    guaranteePercentage: number;

    // Estimated Deductions

    federalTaxRate: number;

    stateTaxRate: number;

    socialSecurityRate: number;

    medicareRate: number;

    insurancePerWeek: number;

    retirementPerWeek: number;

}