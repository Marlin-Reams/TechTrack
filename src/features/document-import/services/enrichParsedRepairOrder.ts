import { getLaborArticles }
    from "../../labor-library/repository/laborLibraryRepository";

import type { ParsedRepairOrder }
    from "../types/ParsedRepairOrder";

function hasUsefulScannedDescription(description?: string): boolean {
    if (!description) {
        return false;
    }

    const words = description.match(/[A-Z]{2,}/gi) ?? [];
    const containsColumnNoise = /\bN\s*\/\s*C\b|\b\d+\.\d+\b/.test(description);

    return words.length >= 2 && !containsColumnNoise;
}

export async function enrichParsedRepairOrder(
    parsedRepair: ParsedRepairOrder,
): Promise<ParsedRepairOrder> {

    //
    // Load library once
    //

    const library =
        await getLaborArticles();

    //
    // Build lookup map
    //

    const laborMap =
        new Map(

            library.map(article => [

                article.articleNumber,

                article,

            ])

        );

    //
    // Enrich operations
    //

    const operations =
        parsedRepair.operations.map(operation => {

            const laborArticle =
                laborMap.get(
                    operation.articleNumber
                );

            if (!laborArticle) {

                return {

                    ...operation,

                    libraryFound: false,

                };

            }

            const isCourtesyCheck =
                operation.articleNumber === "7046930";
            const actualHours = isCourtesyCheck && operation.actualHours === 0
                ? laborArticle.standardHours
                : operation.actualHours ??
                    (laborArticle.laborType === "fixed"
                        ? laborArticle.standardHours
                        : undefined);

            return {

                ...operation,

                description:
                    laborArticle.laborType === "fixed"
                        ? laborArticle.description
                        : hasUsefulScannedDescription(operation.description)
                            ? operation.description
                            : laborArticle.description,

                standardHours:
                    laborArticle.standardHours,

                laborType:
                    laborArticle.laborType,

                actualHours,

                libraryFound: true,

            };

        }).filter(operation =>
            operation.articleType !== "TN" ||
            (
                operation.libraryFound &&
                operation.laborType === "fixed" &&
                operation.actualHours !== undefined
            )
        );

    const missingHours = operations.filter(
        operation => operation.actualHours === undefined
    ).length;
    const warnings = parsedRepair.warnings.filter(
        warning => !/operations? (?:is|are) missing labor hours/i.test(warning)
    );

    if (missingHours > 0) {
        warnings.push(
            `${missingHours} operation${missingHours === 1 ? " is" : "s are"} missing labor hours.`
        );
    }

    return {

        ...parsedRepair,

        operations,

        warnings,

    };

}
