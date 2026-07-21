import type { Operation } from "../types/Operation";

type CreateOperationParams = {
    articleNumber: string;
    description: string;
    workPerformed: string;
    laborType: "fixed" | "variable";
    hours: number;
};

export function createOperation({
    articleNumber,
    description,
    workPerformed,
    laborType,
    hours,
}: CreateOperationParams): Operation {
    return {
        id: crypto.randomUUID(),
        articleNumber,
        description,
        workPerformed,
        laborType,
        hours,
    };
}