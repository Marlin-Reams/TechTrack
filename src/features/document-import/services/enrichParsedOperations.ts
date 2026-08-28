import { getLaborArticle }
    from "../../labor-library/repository/laborLibraryRepository";

import type { ParsedOperation }
    from "../types/ParsedOperation";

export async function enrichParsedOperations(
    operations: ParsedOperation[],
): Promise<ParsedOperation[]> {

    return Promise.all(

        operations.map(async operation => {

            const laborArticle =
                await getLaborArticle(
                    operation.articleNumber
                );

            if (!laborArticle) {

                return operation;

            }

            return {

                ...operation,

                description:
                    laborArticle.description,

                standardHours:
                    laborArticle.standardHours,

                laborType:
                    laborArticle.laborType,

            };

        })

    );

}