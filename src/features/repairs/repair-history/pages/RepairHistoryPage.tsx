import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterPanel from "../../../../components/FilterPanel/FilterPanel";
import SearchToolbar from "../../../../components/SearchToolbar/SearchToolbar";

import useRepairHistory from "../hooks/useRepairHistory";
import RepairHistoryList from "../components/RepairHistoryList";
import RepairHistoryCalendar from "../components/RepairHistoryCalendar";
import "./RepairHistoryPage.css";

const payrollFilters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "issue", label: "Issues" },
    { value: "resolved", label: "Resolved" },
] as const;

const timeFilters = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "older", label: "Older" },
] as const;

export default function RepairHistoryPage() {

    const [searchText, setSearchText] = useState("");
    const [displayMode, setDisplayMode] = useState<"list" | "calendar">("list");
    const [searchParams, setSearchParams] = useSearchParams();

const adjustedOnly =
    searchParams.get("adjusted") === "true";

const initialPayrollStatus =
    (searchParams.get("payroll") as
        | "all"
        | "pending"
        | "verified"
        | "issue"
        | "resolved"
        | null) ?? "all";
   const [payrollStatus, setPayrollStatus] =
    useState<(typeof payrollFilters)[number]["value"]>(
        initialPayrollStatus
    );

    useEffect(() => {
    setPayrollStatus(initialPayrollStatus);
}, [initialPayrollStatus]);

    const [timePeriod, setTimePeriod] =
        useState<(typeof timeFilters)[number]["value"]>("all");

    const {
        repairs,
        loading,
        error,
        retry,
        loadMore,
        loadingMore,
        hasMore,
        loadedCount,
    } = useRepairHistory({
    payrollStatus,
    searchText,
    timePeriod,
    adjustedOnly,
});

    if (loading) {
        return (
            <main>
                <h1>Repair History</h1>
                <p>Loading repairs...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h1>Repair History</h1>
                <p>{error}</p>
                <button type="button" onClick={retry}>
                    Try again
                </button>
            </main>
        );
    }

    return (
        <main className="repair-history-page">

            <header className="repair-history-page__header">
                <div>
                    <h1>Repair History</h1>
                </div>
                <p className="repair-history-page__subtitle">
                    Search every completed repair, review payroll status, or explore work by date.
                </p>
            </header>

            <div className="repair-history-page__command-bar">
            <SearchToolbar>

                <div>

                    <label className="repair-history-page__search-label" htmlFor="repair-search">
                        Search records
                    </label>

                    <div className="repair-history-page__search-wrap">
                        <span className="repair-history-page__search-icon" aria-hidden="true">⌕</span>
                        <input
                            className="repair-history-page__search-input"
                            id="repair-search"
                            type="text"
                            placeholder="Repair order, customer, VIN, plate, vehicle, or operation"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                        />
                    </div>

                </div>

                <FilterPanel>

                    <div
                        style={{
                            marginBottom: "1.5rem",
                        }}
                    >

                        <strong>Status</strong>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: ".5rem",
                                marginTop: ".5rem",
                            }}
                        >
                            {payrollFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    aria-pressed={payrollStatus === filter.value}
                                    onClick={() =>
                                        setPayrollStatus(filter.value)
                                    }
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                    </div>

                    <div>

                        <strong>Time</strong>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: ".5rem",
                                marginTop: ".5rem",
                            }}
                        >
                            {timeFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    aria-pressed={timePeriod === filter.value}
                                    onClick={() =>
                                        setTimePeriod(filter.value)
                                    }
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                    </div>

                </FilterPanel>

                <div
                    className="repair-history-page__view-switch"
                    aria-label="History display"
                >
                    <button
                        className="repair-history-page__view-button"
                        type="button"
                        aria-pressed={displayMode === "list"}
                        onClick={() => setDisplayMode("list")}
                    >
                        ☰&nbsp; List
                    </button>
                    <button
                        className="repair-history-page__view-button"
                        type="button"
                        aria-pressed={displayMode === "calendar"}
                        onClick={() => setDisplayMode("calendar")}
                    >
                        ▦&nbsp; Calendar
                    </button>
                </div>

                {(searchText || payrollStatus !== "all" ||
                    timePeriod !== "all" || adjustedOnly) && (
                    <button
                        className="repair-history-page__clear"
                        type="button"
                        onClick={() => {
                            setSearchText("");
                            setPayrollStatus("all");
                            setTimePeriod("all");
                            setSearchParams({});
                        }}
                    >
                        Clear filters
                    </button>
                )}

            </SearchToolbar>
            </div>

            {displayMode === "list" ? (
                <p className="repair-history-page__result-count">
                    Showing {repairs.length} matching repair
                    {repairs.length === 1 ? "" : "s"} from {loadedCount} loaded
                </p>
            ) : null}

            {displayMode === "list" ? (
                <RepairHistoryList
                    repairs={repairs}
                    expandAll={Boolean(searchText.trim())}
                />
            ) : (
                <RepairHistoryCalendar
                    filters={{ payrollStatus, searchText, adjustedOnly }}
                />
            )}

            {displayMode === "list" && hasMore && (
                <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{
                        display: "block",
                        margin: "2rem auto",
                        padding: ".85rem 2rem",
                        fontSize: "1rem",
                        fontWeight: 700,
                    }}
                >
                    {loadingMore ? "Loading..." : "Load 50 More Repairs"}
                </button>
            )}

        </main>
    );

}
