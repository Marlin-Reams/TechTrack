export interface PayrollExtraction {

    grossPay?: number;

    netPay?: number;

    regularHours?: number;

    overtimeHours?: number;

    flatRateHours?: number;

    federalTax?: number;

    stateTax?: number;

    socialSecurity?: number;

    medicare?: number;

    medical?: number;

    dental?: number;

    vision?: number;

    retirement?: number;

    loanRepayment?: number;

    vacationHours?: number;

    sickHours?: number;

    holidayHours?: number;

    payPeriodStart?: string;

    payPeriodEnd?: string;

    payDate?: string;
}

export type PaystubStatus =
    | "uploaded"
    | "processing"
    | "processed"
    | "failed";

export interface Paystub {

    id: string;

    fileName: string;

    storagePath: string;

    downloadUrl: string;

    uploadDate: string;

    status: PaystubStatus;

    extraction?: PayrollExtraction;

    parserVersion?: string;

    parserConfidence?: number;

    processingError?: string;
}