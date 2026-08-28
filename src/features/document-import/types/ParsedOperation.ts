export interface ParsedOperation {

    /**
     * Firestone labor article.
     */
    articleNumber: string;

    /**
     * Technician ID.
     */
    technicianId?: string;

    /**
     * TS / TN / NN
     */
    articleType?: string;

    /**
     * Description from Labor Library.
     */
    description?: string;

    /**
     * Fixed or Variable.
     */
    laborType?: "fixed" | "variable";

    /**
     * Standard hours from the Labor Library.
     * (Only meaningful for fixed labor.)
     */
    standardHours?: number;

    /**
     * Actual FRH found on the work order.
     */
    actualHours?: number;

    /**
     * Extra OCR lines if needed.
     */
    details: string[];

}