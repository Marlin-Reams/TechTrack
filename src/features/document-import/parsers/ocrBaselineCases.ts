import type { ParsedOperation } from "../types/ParsedOperation.js";

export interface OcrBaselineCase {
    name: string;
    rawText: string;
    expected: Array<Pick<
        ParsedOperation,
        "articleNumber" | "articleType" | "actualHours" | "description"
    >>;
}

/**
 * Privacy-safe parser baselines distilled from real Firestone work orders.
 * Keep these synthetic: never place customer names, addresses, phone numbers,
 * VINs, plates, or the source photographs in this file.
 */
export const ocrBaselineCases: OcrBaselineCase[] = [
    {
        name: "TS labor rows ignore neighboring prices",
        rawText: [
            "FULL SYNTHETIC (NON-DEXOS) OIL CHANGE",
            "0W-20 PZL PLAT FULL SYN UP TO 5 QTS 7034622 09TN 1 97.99",
            "PREMIUM OIL CHANGE LABOR 7003355 09TS 0.3 1 6.01",
            "OIL FILTER WASTE RECYCLING 7075051 09TN 1 3.99",
            "COURTESY CHECK 7046930 09TS 0.1 1 N/C",
        ].join("\n"),
        expected: [
            {
                articleNumber: "7003355",
                articleType: "TS",
                actualHours: 0.3,
                description: "PREMIUM OIL CHANGE LABOR",
            },
            {
                articleNumber: "7046930",
                articleType: "TS",
                actualHours: 0.1,
                description: "COURTESY CHECK",
            },
        ],
    },
    {
        name: "same article can represent several variable labor rows",
        rawText: [
            "* REMOVE & REPLACE RADIATOR HOSE - LOWER 7020869 09TS 0.1 1 17.30",
            "* REMOVE & REPLACE RADIATOR HOSE - UPPER 7020869 09TS 0.1 1 17.30",
            "REMOVE & REPLACE THERMOSTAT HOUSING 7020869 09TS 1.1 1 190.30",
            "REMOVE & REPLACE COOLING SYSTEM 7003240 09TS 3.5 1 599.50",
        ].join("\n"),
        expected: [
            {
                articleNumber: "7020869",
                articleType: "TS",
                actualHours: 0.1,
                description: "* REMOVE & REPLACE RADIATOR HOSE - LOWER",
            },
            {
                articleNumber: "7020869",
                articleType: "TS",
                actualHours: 0.1,
                description: "* REMOVE & REPLACE RADIATOR HOSE - UPPER",
            },
            {
                articleNumber: "7020869",
                articleType: "TS",
                actualHours: 1.1,
                description: "REMOVE & REPLACE THERMOSTAT HOUSING",
            },
            {
                articleNumber: "7003240",
                articleType: "TS",
                actualHours: 3.5,
                description: "REMOVE & REPLACE COOLING SYSTEM",
            },
        ],
    },
    {
        name: "TN vehicle inspection may contain FRH",
        rawText: [
            "VEHICLE INSPECTION 7028789 09TN 0.5 1 21.99",
            "TIRE ROTATION - NO CHARGE 7001119 09TS 1 N/C",
            "ELECTRONIC BATTERY CHECK 7002909 09TS 1 N/C",
            "AIR FILTER LABOR 7001062 09TS 0.2 1 N/C",
        ].join("\n"),
        expected: [
            {
                articleNumber: "7028789",
                articleType: "TN",
                actualHours: 0.5,
                description: "VEHICLE INSPECTION",
            },
            {
                articleNumber: "7001119",
                articleType: "TS",
                actualHours: 0,
                description: "TIRE ROTATION - NO CHARGE",
            },
            {
                articleNumber: "7002909",
                articleType: "TS",
                actualHours: 0,
                description: "ELECTRONIC BATTERY CHECK",
            },
            {
                articleNumber: "7001062",
                articleType: "TS",
                actualHours: 0.2,
                description: "AIR FILTER LABOR",
            },
        ],
    },
    {
        name: "missing variable labor remains missing",
        rawText: [
            "BATTERY REPLACEMENT",
            "REMOVE & REPLACE BATTERY 7005394 09TS 1 20.00",
            "BATTERY CORE 7004413 09TN 1 22.00",
        ].join("\n"),
        expected: [
            {
                articleNumber: "7005394",
                articleType: "TS",
                actualHours: undefined,
                description: "REMOVE & REPLACE BATTERY",
            },
        ],
    },
    {
        name: "standalone FRH can be recovered but a price cannot",
        rawText: [
            "COOLANT FLUSH LABOR 7003302 09TS",
            "0.8",
            "1",
            "74.99",
            "RADIATOR 7042544 09TN 1 318.99",
        ].join("\n"),
        expected: [
            {
                articleNumber: "7003302",
                articleType: "TS",
                actualHours: 0.8,
                description: "COOLANT FLUSH LABOR",
            },
        ],
    },
    {
        name: "Courtesy Check FRH wins over the N/C price column",
        rawText: "COURTESY CHECK 7046930 09TS 0.1 1 N/C",
        expected: [
            {
                articleNumber: "7046930",
                articleType: "TS",
                actualHours: 0.1,
                description: "COURTESY CHECK",
            },
        ],
    },
];
