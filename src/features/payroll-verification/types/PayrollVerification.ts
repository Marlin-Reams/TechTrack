export type PayrollVerificationStatus =
    | "pending"
    | "verified"
    | "issue";

export interface PayrollVerification {
    status: PayrollVerificationStatus;

    paidHours?: number;

    verifiedDate?: string;

    notes?: string;
}