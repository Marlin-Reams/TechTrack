export interface FirestonePaystub {

    payPeriod: PayPeriod;

    earnings: EarningsSection;

    deductions: DeductionSection;

    taxes: TaxSection;

    taxBases: TaxBaseSection;

    netPay: NetPaySection;
}

export interface PayPeriod {

    periodNumber?: string;

    periodStart?: string;

    periodEnd?: string;

    payDate?: string;
}

export interface EarningsSection {

    flagHours?: number;

    flagRate?: number;

    grossPay?: number;
}

export interface DeductionSection {

    medical?: number;

    dental?: number;

    vision?: number;

    loanRepayment?: number;

    totalDeductions?: number;
}

export interface TaxSection {

    federal?: number;

    socialSecurity?: number;

    medicare?: number;

    totalTaxes?: number;
}

export interface TaxBaseSection {

    medicare?: number;

    socialSecurity?: number;

    federal?: number;
}

export interface NetPaySection {

    amount?: number;
}