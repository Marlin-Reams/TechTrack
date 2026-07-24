export interface PayrollRecord {

    id: string;

    userId: string;

    createdAt: string;

    updatedAt: string;

    source: PayrollSource;

    payPeriod: PayrollPeriod;

    earnings: PayrollEarnings;

    deductions: PayrollDeductions;

    taxes: PayrollTaxes;

    netPay: number;

    metadata: PayrollMetadata;

}

export interface PayrollSource {

    employer: string;

    parser: string;

    parserVersion: string;

    confidence: number;

    originalFileName: string;

}

export interface PayrollPeriod {

    payDate?: string;

    periodStart?: string;

    periodEnd?: string;

}

export interface PayrollEarnings {

    grossPay?: number;

    flagHours?: number;

    flagRate?: number;

}

export interface PayrollDeductions {

    medical?: number;

    dental?: number;

    vision?: number;

    loanRepayment?: number;

    total?: number;

}

export interface PayrollTaxes {

    federal?: number;

    socialSecurity?: number;

    medicare?: number;

    total?: number;

}

export interface PayrollMetadata {

    rawTextStored: boolean;

    reviewRequired: boolean;

}