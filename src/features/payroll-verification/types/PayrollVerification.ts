export type PayrollVerificationStatus =
    | "pending"
    | "verified"
    | "issue"
    | "resolved";

export interface PayrollVerification {

    status: PayrollVerificationStatus;

    /**
     * Hours TechTrack calculated
     * from the repair operations.
     */
    expectedHours?: number;

    /**
     * Hours actually paid
     * according to the paystub.
     */
    paidHours?: number;

    /**
     * Optional explanation when
     * expected and paid differ.
     */
    adjustmentReason?: string;

    verifiedDate?: string;

    issueType?: string;

    issueNotes?: string;

    resolutionNotes?: string;

    resolvedDate?: string;

    operationAdjustments?: PayrollOperationAdjustment[];
}

export interface PayrollOperationAdjustment {
    date: string;
    reason: string;
    previousExpectedHours: number;
    correctedExpectedHours: number;
    changedBy: "payroll-review";
}
