import { useState } from "react";
import type { RepairRecord } from "../types/RepairRecord";

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export default function useRepairRecord() {
    const [repairRecord, setRepairRecord] = useState<RepairRecord>({
        header: {
            repairOrderNumber: "",
            repairDate: getToday(),
            mileage: null,
        },
        operations: [],
    });

    return {
        repairRecord,
        setRepairRecord,
    };
}