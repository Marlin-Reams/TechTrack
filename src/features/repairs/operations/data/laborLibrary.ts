import type { Operation } from "../types/Operation";

export interface LaborArticle {
  articleNumber: string;
  description: string;
  laborType: "fixed" | "variable";
  standardHours: number;
}

export const laborLibrary: LaborArticle[] = [
  {
    articleNumber: "7022837",
    description: "Lifetime Alignment Recheck",
    laborType: "fixed",
    standardHours: 0.8,
  },
  {
    articleNumber: "7015342",
    description: "Alignment Check",
    laborType: "fixed",
    standardHours: 0.6,
  },
  {
    articleNumber: "7046930",
    description: "Courtesy Check",
    laborType: "fixed",
    standardHours: 0.1,
  },
  {
    articleNumber: "7052329",
    description: "Battery Corrosion",
    laborType: "fixed",
    standardHours: 0.3,
  },
  {
    articleNumber: "7041572",
    description: "Power Steering Bleed",
    laborType: "fixed",
    standardHours: 0.8,
  },
  {
    articleNumber: "7003186",
    description: "Technician Labor",
    laborType: "variable",
    standardHours: 0.0,
  },
];