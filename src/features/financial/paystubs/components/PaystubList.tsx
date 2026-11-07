import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, List } from "lucide-react";
import { getPaystubs } from "../repository/paystubRepository";
import type { Paystub } from "../types/Paystub";
import PaystubCard from "./PaystubCard";

interface PaystubListProps { refreshKey: number; }
type ViewMode = "list" | "calendar";

export default function PaystubList({ refreshKey }: PaystubListProps) {
    const [paystubs, setPaystubs] = useState<Paystub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [view, setView] = useState<ViewMode>("list");
    const [month, setMonth] = useState(() => new Date());

    useEffect(() => {
        // Refresh whenever the parent signals a new paystub.
        void (async () => {
        setLoading(true); setError("");
        try {
            const sorted = [...await getPaystubs()].sort((a, b) => paystubTime(b) - paystubTime(a));
            setPaystubs(sorted);
            const latest = sorted.map(paystubDate).find(Boolean);
            if (latest) setMonth(new Date(latest.getFullYear(), latest.getMonth(), 1));
        } catch { setError("Unable to load paystubs."); }
        finally { setLoading(false); }
        })();
    }, [refreshKey]);

    const monthPaystubs = useMemo(() => paystubs.filter(paystub => {
        const date = paystubDate(paystub);
        return date && date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    }), [paystubs, month]);

    if (loading) return <p>Loading paystubs...</p>;
    if (error) return <p>{error}</p>;
    if (paystubs.length === 0) return <p>No paystubs uploaded yet.</p>;

    return <section className="paystub-records">
        <div className="paystub-records-toolbar">
            <div><span className="paystub-eyebrow">PAYROLL HISTORY</span><h2>{paystubs.length} Paystubs</h2></div>
            <div className="paystub-view-toggle" aria-label="Paystub display">
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><List size={17} /> List</button>
                <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}><CalendarDays size={17} /> Calendar</button>
            </div>
        </div>
        {view === "list" ? <div className="paystub-list-grid">
            {paystubs.map(paystub => <PaystubCard key={paystub.id} paystub={paystub} />)}
        </div> : <PaystubCalendar month={month} paystubs={monthPaystubs}
            onPrevious={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            onNext={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} />}
    </section>;
}

function PaystubCalendar({ month, paystubs, onPrevious, onNext }: { month: Date; paystubs: Paystub[]; onPrevious: () => void; onNext: () => void; }) {
    const leading = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cellCount = 42;
    const byDay = new Map<number, Paystub[]>();
    paystubs.forEach(paystub => { const date = paystubDate(paystub); if (date) byDay.set(date.getDate(), [...(byDay.get(date.getDate()) ?? []), paystub]); });
    return <div className="paystub-calendar-shell">
        <header className="paystub-calendar-header">
            <button onClick={onPrevious} aria-label="Previous month"><ChevronLeft /></button>
            <div><h3>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3><span>{paystubs.length} paystub{paystubs.length === 1 ? "" : "s"} this month</span></div>
            <button onClick={onNext} aria-label="Next month"><ChevronRight /></button>
        </header>
        <div className="paystub-calendar">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div className="paystub-weekday" key={day}>{day}</div>)}
            {Array.from({ length: cellCount }, (_, index) => {
                const day = index - leading + 1; const inMonth = day >= 1 && day <= days;
                return <div className={`paystub-day ${inMonth ? "" : "empty"}`} key={index}>
                    {inMonth && <span className="paystub-day-number">{day}</span>}
                    {(byDay.get(day) ?? []).map(paystub => <a className="paystub-calendar-event" href={paystub.downloadUrl} target="_blank" rel="noreferrer" key={paystub.id}>
                        <strong>{formatCurrency(paystub.extraction?.netPay)}</strong><span>{paystub.extraction?.flatRateHours?.toFixed(1) ?? "-"} flag hrs</span>
                    </a>)}
                </div>;
            })}
        </div>
    </div>;
}

function paystubDate(paystub: Paystub): Date | undefined {
    const value = paystub.extraction?.payDate;
    if (value) { const [m, d, y] = value.split("/").map(Number); if (m && d && y) return new Date(y, m - 1, d); }
    const fallback = new Date(paystub.uploadDate); return Number.isNaN(fallback.getTime()) ? undefined : fallback;
}
function paystubTime(paystub: Paystub): number { return paystubDate(paystub)?.getTime() ?? 0; }
function formatCurrency(value?: number): string { return value == null ? "-" : value.toLocaleString("en-US", { style: "currency", currency: "USD" }); }
