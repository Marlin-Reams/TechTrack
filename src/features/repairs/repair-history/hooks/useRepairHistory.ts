import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getRepairHistoryPage,
    filterRepairHistory,
    type RepairHistoryFilters,
} from "../../services/repairHistoryService";

import type { StoredRepair } from "../../types/StoredRepair";
import type { RepairPageCursor }
    from "../../repository/repairRepository";

export default function useRepairHistory(
    filters: RepairHistoryFilters = {}
) {
    const [allRepairs, setAllRepairs] =
        useState<StoredRepair[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [reloadCount, setReloadCount] = useState(0);
    const [cursor, setCursor] = useState<RepairPageCursor | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const {
        payrollStatus,
        timePeriod,
        searchText,
        adjustedOnly,
    } = filters;

    useEffect(() => {

        let cancelled = false;

        async function loadRepairs() {

            try {

                setError(null);

                const page = await getRepairHistoryPage();

                if (!cancelled) {
                    setAllRepairs(page.repairs);
                    setCursor(page.cursor);
                    setHasMore(page.hasMore);
                }

            }
            catch (error) {

                if (cancelled) {
                    return;
                }

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

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        loadRepairs();

        return () => {
            cancelled = true;
        };

    }, [reloadCount]);

    const repairs = useMemo(
        () => filterRepairHistory(allRepairs, {
            payrollStatus,
            timePeriod,
            searchText,
            adjustedOnly,
        }),
        [allRepairs, payrollStatus, timePeriod, searchText, adjustedOnly]
    );

    const retry = useCallback(() => {
        setLoading(true);
        setReloadCount((count) => count + 1);
    }, []);

    const loadMore = useCallback(async () => {
        if (!cursor || !hasMore || loadingMore) {
            return;
        }

        setLoadingMore(true);
        setError(null);

        try {
            const page = await getRepairHistoryPage(cursor);
            setAllRepairs((current) => [...current, ...page.repairs]);
            setCursor(page.cursor);
            setHasMore(page.hasMore);
        }
        catch (error) {
            setError(error instanceof Error
                ? error.message
                : "Unable to load more repair history.");
        }
        finally {
            setLoadingMore(false);
        }
    }, [cursor, hasMore, loadingMore]);

    return {

        repairs,

        loading,

        error,

        retry,

        loadMore,

        loadingMore,

        hasMore,

        loadedCount: allRepairs.length,

    };

}
