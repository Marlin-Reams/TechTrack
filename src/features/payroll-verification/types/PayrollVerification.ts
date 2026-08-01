export type PayrollVerificationStatus =
    | "pending"
    | "verified"
    | "issue"
    | "resolved";

export interface PayrollVerification {

    status: PayrollVerificationStatus;

    /**
     * What TechTrack calculated.
     * (Derived from Operations)
     */
    paidHours?: number;

    /**
     * When payroll was first verified.
     */
    verifiedDate?: string;

    /**
     * Present only when payroll does not match.
     */
    issueType?: string;

    issueNotes?: string;

    /**
     * Present once an issue has been resolved.
     */
    resolutionNotes?: string;

    resolvedDate?: string;
}