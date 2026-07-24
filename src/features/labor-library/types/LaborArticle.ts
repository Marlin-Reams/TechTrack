export interface LaborArticle {
    articleNumber: string;
    description: string;
    laborType: "fixed" | "variable";
    standardHours: number;
    active: boolean;
}