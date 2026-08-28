export interface ExtractedHeader {

    repairOrderNumber: string;

    repairDate: string;

    customer: string;

    vin: string;

    licensePlate: string;

    mileage: number | null;

    year: string;

    make: string;

    model: string;

    engine: string;

    advisor: string;

}

function extractRepairOrderNumber(
    rawText: string,
): string {

    return (
        rawText.match(
            /WORK ORDER\s+(\d+)/i
        )?.[1] ?? ""
    );

}

function extractRepairDate(
    rawText: string,
): string {

    const revisionMatch =
        rawText.match(
            /WO\s+REVISION[^\n]*?(\d{2})\/(\d{2})\/(\d{4})/i
        );

    if (revisionMatch) {
        return `${revisionMatch[3]}-${revisionMatch[1]}-${revisionMatch[2]}`;
    }

    const checkInMatch = rawText.match(
        /\bIN\s+(\d{2})\/(\d{2})\/(\d{2})\s+\d{2}:\d{2}(?:AM|PM)/i
    );

    if (!checkInMatch) {

        return "";

    }

    const month = checkInMatch[1];
    const day = checkInMatch[2];
    const year = `20${checkInMatch[3]}`;

    return `${year}-${month}-${day}`;

}

// function extractLicensePlate(
//     rawText: string,
// ): string {

//     const lines =
//         rawText
//             .split("\n")
//             .map(line => line.trim());

//     const licIndex =
//         lines.findIndex(line =>
//             line === "LIC #"
//         );

//     if (
//         licIndex > 0
//     ) {

//         const previousLine =
//             lines[licIndex - 1];

//         return previousLine
//             .replace(/\s+FL$/i, "")
//             .trim();

//     }

//     return "";

// }

function extractCustomer(
    rawText: string,
): string {

    const lines =
        rawText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

    const customerName = lines.find(line =>
        /^[A-Z][A-Z' /-]{2,},\s*[A-Z][A-Z' /-]{2,}$/.test(line) &&
        !/^(LAKELAND|MULBERRY),/i.test(line)
    );

    if (customerName) {
        return customerName;
    }

    return "";

}

function extractVIN(
    rawText: string,
): string {

    const directMatch = rawText.match(
        /VIN\s*#?\s*([A-HJ-NPR-Z0-9]{17})/i
    );

    if (directMatch) {
        return directMatch[1].toUpperCase();
    }

    const anyVin = rawText.match(
        /\b([A-HJ-NPR-Z0-9]{17})\b/i
    );

    return anyVin?.[1].toUpperCase() ?? "";

}

function extractLicensePlate(
    rawText: string,
): string {
    const floridaCandidates = Array.from(
        rawText.matchAll(/\b([A-Z0-9]{4,10})\s+FL\b/gi)
    )
        .map(match => match[1].toUpperCase())
        .filter(value => /[A-Z]/.test(value) && /\d/.test(value));

    if (floridaCandidates.length > 0) {
        return floridaCandidates[0];
    }

    const match = rawText.match(
        /\bLIC(?:ENSE)?\s*#?\s*([A-Z0-9]{4,10})/i
    );

    return match?.[1].toUpperCase() ?? "";
}

function extractMileage(
    rawText: string,
): number | null {

    const match =
        rawText.match(
            /MILEAGE\s*([\d, ]{1,12})/i
        );

    if (!match) {

        return null;

    }

    return Number(
        match[1].replace(/\D/g, "")
    );

}



function extractVehicle(
    rawText: string,
) {

    const lines =
        rawText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

    const vehicleIndex =
    lines.findIndex(line =>
        /^(19|20)\d{2}\s+[A-Z]/.test(line)
    );

    if (vehicleIndex === -1) {

        return {

            year: "",
            make: "",
            model: "",
            engine: "",
            licensePlate: "",

        };

    }

    const vehicleLine =
        lines[vehicleIndex];

    const parts =
        vehicleLine.split(/\s+/);

    const year =
        parts.shift() ?? "";

    const make =
        parts.shift() ?? "";

    const model =
        parts.join(" ");

    //
    // Engine is the next line that begins with
    // something like 1.4L or 5.3L
    //

    const engineIndex =
        lines.findIndex(
            (line, index) =>
                index > vehicleIndex &&
                /^\d+\.\dL/i.test(line)
        );

    const engine =
        engineIndex >= 0
            ? lines[engineIndex]
            : "";

    //
    // Plate is the line immediately after
    // the engine.
    //

//     let licensePlate = "";

//     if (engineIndex >= 0) {

//         const plateLine =
//             lines[engineIndex + 1] ?? "";

//         licensePlate =
//             plateLine
//                 .replace(/\s+FL$/i, "")
//                 .trim();

//     }

//     return {

//         year,
//         make,
//         model,
//         engine,
//         licensePlate,

//     };

// }
let licensePlate = "";

for (let i = engineIndex + 1; i < lines.length; i++) {

    const line = lines[i];

    if (/^[A-Z0-9]{5,8}\s+FL$/i.test(line)) {

        licensePlate =
            line.replace(/\s+FL$/i, "");

        break;

    }

}

return {

    year,

    make,

    model,

    engine,

    licensePlate,

};

}
function extractAdvisor(
    rawText: string,
): string {

    const match =
        rawText.match(
            /SERVICE ADVISOR:\s*[\r\n]+\d+\s+([A-Z]+)/i
        );

    return match?.[1] ?? "";

}

export function extractHeader(
    rawText: string,
): ExtractedHeader {

    const vehicle =
        extractVehicle(rawText);

    return {

        repairOrderNumber:
            extractRepairOrderNumber(rawText),

        customer:
            extractCustomer(rawText),

        vin:
            extractVIN(rawText),

        mileage:
            extractMileage(rawText),

        year:
            vehicle.year,

        make:
            vehicle.make,

        model:
            vehicle.model,

        engine:
            vehicle.engine,

        advisor:
            extractAdvisor(rawText),

        repairDate:
            extractRepairDate(rawText),

        licensePlate:
            extractLicensePlate(rawText) ||
            vehicle.licensePlate,

    };

}
