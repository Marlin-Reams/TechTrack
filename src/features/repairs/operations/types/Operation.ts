export interface Operation {
    id: string;

    articleNumber: string;

    description: string;

    workPerformed: string;

    laborType: "fixed" | "variable";

    hours: number;
}