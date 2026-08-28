import { createRepairRecord }
    from "../../repairs/repair-entry/services/repairFactory";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

import type { ParsedRepairOrder }
    from "../types/ParsedRepairOrder";

export function mapParsedRepairOrder(
    parsed: ParsedRepairOrder,
): RepairRecord {

    const repair =
        createRepairRecord();

    repair.header.repairOrderNumber =
        parsed.repairOrderNumber;

    repair.header.repairDate =
        parsed.repairDate;

    repair.header.mileage =
        parsed.mileage;

    repair.header.year =
        parsed.year ?? "";

    repair.header.make =
        parsed.make ?? "";

    repair.header.model =
        parsed.model ?? "";

    repair.header.engine =
        parsed.engine ?? "";

    repair.header.vin =
        parsed.vin ?? "";

    repair.header.licensePlate =
        parsed.licensePlate ?? "";

    repair.header.customerName =
        parsed.customer ?? "";

    repair.header.serviceAdvisor =
        parsed.advisor ?? "";

    repair.operations = parsed.operations.map(
    (operation) => ({

        id: crypto.randomUUID(),

        articleNumber:
            operation.articleNumber ?? "",

        description:
            operation.description ?? "",

        workPerformed:
            operation.description ?? "",

        laborType:
            operation.laborType ?? "variable",

        hours:
            operation.actualHours ?? 0,

    })
);

    return repair;

}