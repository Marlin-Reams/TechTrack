export type OperationValidationResult = {
    valid: boolean;
    message?: string;
};

type ValidateOperationParams = {
    articleNumber: string;
    laborType: "fixed" | "variable";
    hours: number;
};

export function validateOperation({
    articleNumber,
    laborType,
    hours,
}: ValidateOperationParams): OperationValidationResult {
    if (!articleNumber.trim()) {
        return {
            valid: false,
            message: "Please select a labor article.",
        };
    }

    if (laborType === "variable" && hours <= 0) {
        return {
            valid: false,
            message: "Labor hours must be greater than zero.",
        };
    }

    return {
        valid: true,
    };
}