export interface RepairHeader {
    repairOrderNumber: string;
    vin: string;
    licensePlate: string;
    year: string;
    make: string;
    model: string;
    engine: string;
    repairDate: string;
    mileage: number | null;
}