import { useState } from "react";

import type { RepairRecord }
from "../../repair-entry/types/RepairRecord";

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export default function useRepairRecord() {

    const [repairRecord, setRepairRecord] =
        useState<RepairRecord>({

            status: "active",

            header: {

                repairOrderNumber: "",
                repairDate: getToday(),
                mileage: null,

                vin: "",
                licensePlate: "",

                year: "",
                make: "",
                model: "",
                engine: "",

                customerName: "",
                serviceAdvisor: "",

            },

            operations: [],

            notes: {
                content: "",
            },

            attachments: [],

            payrollVerification: {
                status: "pending",
            },

        });

    return {
        repairRecord,
        setRepairRecord,
    };

}