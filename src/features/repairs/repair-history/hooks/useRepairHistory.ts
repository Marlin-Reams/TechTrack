import { useEffect, useState } from "react";

import {
    getCompletedRepairs,
} from "../../repository/repairRepository";

import type { StoredRepair }
    from "../../types/StoredRepair";

export interface RepairHistoryFilters {

    payrollStatus?:
        | "all"
        | "pending"
        | "verified"
        | "issue"
        | "resolved";

}

export default function useRepairHistory(
    filters?: RepairHistoryFilters
) {

    const [repairs, setRepairs] =
        useState<StoredRepair[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        async function loadRepairs() {

            try {

                let repairs =
                    await getCompletedRepairs();

                if (
                    filters?.payrollStatus &&
                    filters.payrollStatus !== "all"
                ) {

                    repairs = repairs.filter(
    repair =>
        (
            repair.payrollVerification?.status ??
            "pending"
        ) === filters.payrollStatus
);

                }

                setRepairs(repairs);

            }
            catch (error) {

                if (error instanceof Error) {

                    setError(error.message);

                }
                else {

                    setError(
                        "Unable to load repair history."
                    );

                }

            }
            finally {

                setLoading(false);

            }

        }

        loadRepairs();

    }, [filters]);

    return {

        repairs,

        loading,

        error,

    };

}