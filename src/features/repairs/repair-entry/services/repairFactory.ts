import type { RepairRecord } from "../types/RepairRecord";

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export function createRepairRecord(): RepairRecord {
    return {
        header: {
            repairOrderNumber: "",
            vin: "",
            licensePlate: "",
            year: "",
            make: "",
            model: "",
            engine: "",
            repairDate: getToday(),
            mileage: null,
        },

        operations: [],

        notes: {
            content: "",
        },

        attachments: [],
    };
}