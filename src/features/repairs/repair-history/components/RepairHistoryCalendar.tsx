import { useEffect, useMemo, useState } from "react";

import RepairCard from "../../repair-card/RepairCard";
import type { StoredRepair } from "../../types/StoredRepair";
import { getCompletedRepairsForMonth } from "../../repository/repairRepository";
import {
    filterRepairHistory,
    type RepairHistoryFilters,
} from "../../services/repairHistoryService";

import styles from "./RepairHistoryCalendar.module.css";

type RepairHistoryCalendarProps = {
    filters?: Pick<RepairHistoryFilters, "payrollStatus" | "searchText" | "adjustedOnly">;
};

function getRepairDate(repair: StoredRepair) {
    const value = repair.completedDate ?? repair.header.repairDate;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export default function RepairHistoryCalendar({
    filters = {},
}: RepairHistoryCalendarProps) {
    const [visibleMonth, setVisibleMonth] = useState(
        () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [monthRepairs, setMonthRepairs] = useState<StoredRepair[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        getCompletedRepairsForMonth(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth()
        )
            .then((repairs) => {
                if (active) setMonthRepairs(repairs);
            })
            .catch(() => {
                if (active) setError("Unable to load this month. Please try again.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [visibleMonth]);

    const repairs = useMemo(
        () => filterRepairHistory(monthRepairs, filters),
        [monthRepairs, filters]
    );

    const repairsByDate = useMemo(() => {
        const grouped = new Map<string, StoredRepair[]>();
        repairs.forEach((repair) => {
            const key = dateKey(getRepairDate(repair));
            grouped.set(key, [...(grouped.get(key) ?? []), repair]);
        });
        return grouped;
    }, [repairs]);

    const firstWeekday = visibleMonth.getDay();
    const daysInMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        0
    ).getDate();
    const calendarCellCount = 42;
    const trailingEmptyDays = calendarCellCount - firstWeekday - daysInMonth;
    const monthLabel = visibleMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });
    const selectedRepairs = selectedDate
        ? repairsByDate.get(selectedDate) ?? []
        : [];

    function changeMonth(offset: number) {
        setVisibleMonth((current) => new Date(
            current.getFullYear(),
            current.getMonth() + offset,
            1
        ));
        setSelectedDate(null);
    }

    return (
        <section className={styles.calendarSection}>
            <div className={styles.calendarHeader}>
                <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
                    ←
                </button>
                <h2>{monthLabel}</h2>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
                    →
                </button>
            </div>

            <p className={styles.monthSummary}>
                {loading
                    ? "Loading all repairs for this month..."
                    : `${repairs.length} repair${repairs.length === 1 ? "" : "s"} completed this month`}
            </p>

            {error && <p className={styles.error}>{error}</p>}

            {!error && <div className={styles.calendarGrid} aria-busy={loading}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div className={styles.weekday} key={day}>{day}</div>
                ))}
                {Array.from({ length: firstWeekday }).map((_, index) => (
                    <div className={styles.emptyDay} key={`empty-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth(),
                        day
                    );
                    const key = dateKey(date);
                    const count = repairsByDate.get(key)?.length ?? 0;
                    const today = dateKey(new Date()) === key;
                    return (
                        <button
                            type="button"
                            className={[
                                styles.day,
                                count > 0 ? styles.hasRepairs : "",
                                today ? styles.today : "",
                                selectedDate === key ? styles.selectedDay : "",
                            ].filter(Boolean).join(" ")}
                            key={key}
                            onClick={() => setSelectedDate(key)}
                            aria-label={`${date.toLocaleDateString()}: ${count} repair${count === 1 ? "" : "s"}`}
                        >
                            <span className={styles.dayNumber}>{day}</span>
                            {count > 0 && (
                                <strong title={`${count} work order${count === 1 ? "" : "s"}`}>
                                    {count}
                                </strong>
                            )}
                        </button>
                    );
                })}
                {Array.from({ length: trailingEmptyDays }).map((_, index) => (
                    <div className={styles.emptyDay} key={`trailing-empty-${index}`} />
                ))}
            </div>}

            {selectedDate && (
                <div className={styles.selectedRepairs}>
                    <h2>
                        {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                        {` — ${selectedRepairs.length} repair${selectedRepairs.length === 1 ? "" : "s"}`}
                    </h2>
                    {selectedRepairs.length > 0 ? (
                        <div className={styles.repairsGrid}>
                            {selectedRepairs.map((repair) => (
                                <RepairCard repair={repair} key={repair.id} />
                            ))}
                        </div>
                    ) : (
                        <p>No repairs were completed on this day.</p>
                    )}
                </div>
            )}
        </section>
    );
}
