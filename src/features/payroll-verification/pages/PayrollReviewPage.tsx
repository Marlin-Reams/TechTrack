import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { getCompletedRepairs } from "../../repairs/repository/repairRepository";
import type { StoredRepair } from "../../repairs/types/StoredRepair";
import { verifyPayroll } from "../services/payrollVerificationService";
import "./PayrollReviewPage.css";

type Filter = "pending" | "issue" | "verified" | "all";
type VerifiedRange = "week" | "month" | "all";

export default function PayrollReviewPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [repairs, setRepairs] = useState<StoredRepair[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<Filter>(() => filterFromQuery(searchParams.get("status")));
    const [verifiedRange, setVerifiedRange] = useState<VerifiedRange>("month");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadRepairs() {
        setLoading(true);
        setError("");
        try {
            const result = await getCompletedRepairs();
            setRepairs(result.sort((left, right) => repairDate(right).localeCompare(repairDate(left))));
        } catch {
            setError("Payroll records could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { void loadRepairs(); }, []);

    const counts = useMemo(() => ({
        pending: repairs.filter(repair => statusOf(repair) === "pending").length,
        issue: repairs.filter(repair => statusOf(repair) === "issue").length,
        verified: repairs.filter(repair => ["verified", "resolved"].includes(statusOf(repair))).length,
        all: repairs.length,
    }), [repairs]);

    const displayedVerifiedCount = useMemo(() => repairs.filter(repair => {
        const status = statusOf(repair);
        return (status === "verified" || status === "resolved") && isInVerifiedRange(repair, verifiedRange);
    }).length, [repairs, verifiedRange]);

    const visibleRepairs = useMemo(() => repairs.filter(repair => {
        const status = statusOf(repair);
        if (filter === "verified") return (status === "verified" || status === "resolved") && isInVerifiedRange(repair, verifiedRange);
        if (filter === "all") return true;
        return status === filter;
    }), [repairs, filter, verifiedRange]);

    const selectableRepairs = visibleRepairs.filter(repair => statusOf(repair) === "pending");
    const allSelected = selectableRepairs.length > 0 && selectableRepairs.every(repair => selected.has(repair.id));
    const selectedRepairs = repairs.filter(repair => selected.has(repair.id) && statusOf(repair) === "pending");
    const selectedHours = selectedRepairs.reduce((sum, repair) => sum + expectedHours(repair), 0);

    function toggleOne(id: string) {
        setSelected(current => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
        setSuccess("");
    }

    function toggleAll() {
        setSelected(current => {
            const next = new Set(current);
            if (allSelected) selectableRepairs.forEach(repair => next.delete(repair.id));
            else selectableRepairs.forEach(repair => next.add(repair.id));
            return next;
        });
        setSuccess("");
    }

    async function verifySelected() {
        if (!selectedRepairs.length || saving) return;
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await Promise.all(selectedRepairs.map(repair => verifyPayroll(repair.id, repair)));
            const verifiedIds = new Set(selectedRepairs.map(repair => repair.id));
            setRepairs(current => current.map(repair => verifiedIds.has(repair.id) ? {
                ...repair,
                payrollVerification: {
                    ...repair.payrollVerification,
                    status: "verified",
                    verifiedDate: new Date().toISOString(),
                },
            } : repair));
            setSelected(new Set());
            setSuccess(`${verifiedIds.size} repair${verifiedIds.size === 1 ? "" : "s"} verified successfully.`);
        } catch {
            setError("Some repairs could not be verified. Refresh and try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className={`payroll-review-page ${selectedRepairs.length ? "has-selection" : ""}`}>
            <header className="payroll-review-header">
                <div><span>PAYROLL WORKSPACE</span><h1>Payroll Review</h1><p>Select everything that matches your payroll, then verify it all at once.</p></div>
                <button type="button" className="payroll-refresh" onClick={() => void loadRepairs()}><RefreshCw size={16} />Refresh</button>
            </header>

            <section className="payroll-review-summary">
                <Summary label="Needs verification" value={counts.pending} tone="pending" />
                <Summary label="Needs attention" value={counts.issue} tone="issue" />
                <Summary label={`Verified · ${verifiedRange === "week" ? "this week" : verifiedRange === "month" ? "this month" : "all time"}`} value={displayedVerifiedCount} tone="verified" />
            </section>

            <section className="payroll-review-card">
                <div className="payroll-review-toolbar">
                    <div className="payroll-filter-tabs" role="group" aria-label="Payroll status">
                        {(["pending", "issue", "verified", "all"] as Filter[]).map(value => <button type="button" key={value} className={filter === value ? "active" : ""} onClick={() => { setFilter(value); setSelected(new Set()); setSearchParams({ status: value }, { replace: true }); }}>{labelFor(value)} <span>{value === "verified" ? displayedVerifiedCount : counts[value]}</span></button>)}
                    </div>
                    {filter === "pending" && <button type="button" className="select-all-button" onClick={toggleAll}>{allSelected ? "Clear selection" : "Select all visible"}</button>}
                    {filter === "verified" && <div className="verified-range" role="group" aria-label="Verified repair time range">
                        {(["week", "month", "all"] as VerifiedRange[]).map(range => <button type="button" key={range} className={verifiedRange === range ? "active" : ""} onClick={() => setVerifiedRange(range)}>{range === "week" ? "This week" : range === "month" ? "This month" : "All time"}</button>)}
                    </div>}
                </div>

                {success && <div className="payroll-success"><CheckCircle2 size={17} />{success}</div>}
                {error && <div className="payroll-error"><AlertTriangle size={17} />{error}</div>}

                {loading ? <div className="payroll-empty">Loading payroll records…</div> : visibleRepairs.length === 0 ? <div className="payroll-empty"><CheckCircle2 size={34} /><strong>{filter === "pending" ? "Payroll is caught up" : "No records in this group"}</strong><span>{filter === "pending" ? "There are no repairs waiting for verification." : "Choose another status above."}</span></div> : (
                    <div className="payroll-review-list">
                        <div className="payroll-list-head"><span /><span>Repair</span><span>Completed</span><span>Vehicle</span><span className="align-right">Expected hours</span><span>Status</span><span /></div>
                        {visibleRepairs.map(repair => {
                            const status = statusOf(repair);
                            const canSelect = status === "pending";
                            return <div className={`payroll-review-row ${selected.has(repair.id) ? "selected" : ""}`} key={repair.id}>
                                <label className={`payroll-check ${canSelect ? "" : "disabled"}`} aria-label={`Select repair ${repair.header.repairOrderNumber}`}>
                                    <input type="checkbox" checked={selected.has(repair.id)} disabled={!canSelect} onChange={() => toggleOne(repair.id)} />
                                    <span><Check size={14} /></span>
                                </label>
                                <strong>RO #{repair.header.repairOrderNumber}</strong>
                                <span>{formatDate(repairDate(repair))}</span>
                                <span className="vehicle-cell">{repair.header.year} {repair.header.make} {repair.header.model}<small>{repair.header.customerName || "No customer"}</small></span>
                                <strong className="hours-cell">{expectedHours(repair).toFixed(1)}</strong>
                                <StatusBadge status={status} />
                                <Link className="payroll-details-link" to={`/payroll-verification/${repair.id}`}>Details <ExternalLink size={13} /></Link>
                            </div>;
                        })}
                    </div>
                )}
            </section>

            {selectedRepairs.length > 0 && <div className="batch-action-bar"><div><strong>{selectedRepairs.length} selected</strong><span>{selectedHours.toFixed(1)} expected hours</span></div><button type="button" onClick={() => void verifySelected()} disabled={saving}><CheckCircle2 size={18} />{saving ? "Verifying…" : `Verify ${selectedRepairs.length} selected`}</button></div>}
        </main>
    );
}

function Summary({ label, value, tone }: { label: string; value: number; tone: string }) { return <article className={`payroll-summary-item ${tone}`}><span>{label}</span><strong>{value}</strong></article>; }
function statusOf(repair: StoredRepair) { return repair.payrollVerification?.status ?? "pending"; }
function repairDate(repair: StoredRepair) { return repair.completedDate ?? repair.header.repairDate ?? ""; }
function expectedHours(repair: StoredRepair) { return repair.payrollVerification?.expectedHours ?? repair.operations.reduce((sum, operation) => sum + (Number(operation.hours) || 0), 0); }
function formatDate(date: string) { if (!date) return "—"; const [year, month, day] = date.split("-"); return `${month}/${day}/${year}`; }
function labelFor(filter: Filter) { return { pending: "Pending", issue: "Issues", verified: "Verified", all: "All" }[filter]; }
function filterFromQuery(value: string | null): Filter { return value === "issue" || value === "verified" || value === "all" || value === "pending" ? value : "pending"; }
function StatusBadge({ status }: { status: string }) { return <span className={`payroll-status ${status}`}>{status === "issue" ? "Issue" : status === "resolved" ? "Resolved" : status === "verified" ? "Verified" : "Pending"}</span>; }
function isInVerifiedRange(repair: StoredRepair, range: VerifiedRange) {
    if (range === "all") return true;
    const value = repairDate(repair);
    if (!value) return false;
    const date = new Date(`${value}T12:00:00`);
    const today = new Date();
    if (range === "month") return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return date >= start && date < end;
}
