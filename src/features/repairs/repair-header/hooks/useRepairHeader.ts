import { useState } from "react";
import type { RepairHeader } from "../types/RepairHeader";

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export default function useRepairHeader() {
    const [header, setHeader] = useState<RepairHeader>({
        repairOrderNumber: "",
        vin: "",
        licensePlate: "",
        year: "",
        make: "",
        model: "",
        engine: "",
        repairDate: getToday(),
        mileage: null,
    });

    function updateRepairOrderNumber(value: string) {
        setHeader((previous) => ({
            ...previous,
            repairOrderNumber: value,
        }));
    }

    function updateVin(value: string) {
        setHeader((previous) => ({
            ...previous,
            vin: value,
        }));
    }

    function updateLicensePlate(value: string) {
        setHeader((previous) => ({
            ...previous,
            licensePlate: value,
        }));
    }

    function updateYear(value: string) {
        setHeader((previous) => ({
            ...previous,
            year: value,
        }));
    }

    function updateMake(value: string) {
        setHeader((previous) => ({
            ...previous,
            make: value,
        }));
    }

    function updateModel(value: string) {
        setHeader((previous) => ({
            ...previous,
            model: value,
        }));
    }

    function updateEngine(value: string) {
        setHeader((previous) => ({
            ...previous,
            engine: value,
        }));
    }

    function updateRepairDate(value: string) {
        setHeader((previous) => ({
            ...previous,
            repairDate: value,
        }));
    }

    function updateMileage(value: number | null) {
        setHeader((previous) => ({
            ...previous,
            mileage: value,
        }));
    }

    return {
        header,
        updateRepairOrderNumber,
        updateVin,
        updateLicensePlate,
        updateYear,
        updateMake,
        updateModel,
        updateEngine,
        updateRepairDate,
        updateMileage,
    };
}