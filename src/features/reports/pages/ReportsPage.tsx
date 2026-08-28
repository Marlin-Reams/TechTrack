import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, BadgeDollarSign, CheckCircle2, ChevronDown, Clock3, ExternalLink, Gauge, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getReportsSnapshot, type ReportPoint, type ReportSlice, type ReportsSnapshot } from "../services/reportService";
import "./ReportsPage.css";

type Metric = "repairs" | "hours" | "earnings";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export default function ReportsPage() {
    const navigate = useNavigate();
    const [report, setReport] = useState<ReportsSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [metric, setMetric] = useState<Metric>("hours");
    const [selectedMonth, setSelectedMonth] = useState<string>();
    const [selectedDay, setSelectedDay] = useState<string>();
    const [expandedOperation, setExpandedOperation] = useState<string>();

    useEffect(() => {
        getReportsSnapshot()
            .then(setReport)
            .catch(() => setError("Reports could not be loaded. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    const chartTitle = useMemo(() => ({
        repairs: "Completed repair orders",
        hours: "Flag hours produced",
        earnings: selectedMonth ? "Estimated daily gross & take-home" : "Imported gross pay",
    }[metric]), [metric, selectedMonth]);

    if (loading) return <main className="reports-page reports-state">Building your reports…</main>;
    if (error || !report) return <main className="reports-page reports-state reports-error">{error}</main>;

    const month = selectedMonth ? report.monthDetails[selectedMonth] : undefined;
    const day = month && selectedDay ? month.days.find(item => item.key === selectedDay) : undefined;
    const scope = day ?? month;
    const scopeLabel = day
        ? new Date(`${day.key}T12:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
        : month
            ? new Date(`${month.key}-01T12:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })
            : "Last 12 months";
    const monthLabel = month
        ? new Date(`${month.key}-01T12:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : "";
    const scopedRepairs = scope?.repairs ?? report.totalRepairs;
    const scopedHours = scope?.hours ?? report.totalHours;
    const scopedVerified = scope?.verifiedRepairs ?? report.verifiedRepairs;
    const scopedRate = scopedRepairs ? scopedVerified / scopedRepairs : 0;
    const scopedAverage = scopedRepairs ? scopedHours / scopedRepairs : 0;
    const scopedPaychecks = scope?.paychecks ?? report.paychecks;
    const scopedOperations = scope?.topOperations ?? report.topOperations;
    const payrollHealth = scope ?? report;

    const chooseMonth = (key: string) => {
        setSelectedMonth(key);
        setSelectedDay(undefined);
    };

    const clearDrilldown = () => {
        setSelectedMonth(undefined);
        setSelectedDay(undefined);
    };

    return (
        <main className="reports-page">
            <header className="reports-hero">
                <div>
                    <span className="reports-eyebrow">PERFORMANCE CENTER</span>
                    <h1>Reports</h1>
                    <p>Your work, productivity, and earnings—all in one view.</p>
                </div>
                <span className="reports-range">{scopeLabel}</span>
            </header>

            <section className="report-kpis" aria-label="Key performance indicators">
                <Kpi icon={<Wrench />} label="Completed repairs" value={number.format(scopedRepairs)} note={scopeLabel} />
                <Kpi icon={<Gauge />} label="Total flag hours" value={number.format(scopedHours)} note={`${number.format(scopedAverage)} average per RO`} />
                <Kpi icon={<CheckCircle2 />} label="Payroll verified" value={`${Math.round(scopedRate * 100)}%`} note={`${scopedVerified} verified records`} tone="good" />
                {scope
                    ? <Kpi icon={<BadgeDollarSign />} label={day ? "Estimated gross" : "Gross earnings"} value={money.format(scope.earnings)} note={day ? `${money.format(day.netEarnings)} estimated take-home · locked to payroll known by this date` : scope.paychecks.length ? `${scope.paychecks.length} imported paycheck${scope.paychecks.length === 1 ? "" : "s"}` : "No paycheck imported in this period"} />
                    : <Kpi icon={<BadgeDollarSign />} label="Projected annual" value={money.format(report.projectedAnnualIncome)} note={`${money.format(report.yearToDateGross)} year to date`} />}
            </section>

            <section className="report-card report-trend-card">
                <div className="report-card-heading">
                    <div className="trend-heading">
                        {month && <button className="drill-back" onClick={day ? () => setSelectedDay(undefined) : clearDrilldown}><ArrowLeft size={15} />{day ? `Back to ${monthLabel}` : "Back to 12 months"}</button>}
                        <div><span className="reports-eyebrow">{month ? "DAILY BREAKDOWN" : "12-MONTH TREND"}</span><h2>{chartTitle}</h2></div>
                    </div>
                    <div className="metric-picker" role="group" aria-label="Chart metric">
                        <button className={metric === "repairs" ? "active" : ""} onClick={() => setMetric("repairs")}>Repairs</button>
                        <button className={metric === "hours" ? "active" : ""} onClick={() => setMetric("hours")}>Hours</button>
                        <button className={metric === "earnings" ? "active" : ""} onClick={() => setMetric("earnings")}>Earnings</button>
                    </div>
                </div>
                <BarChart
                    points={month?.days ?? report.months}
                    metric={metric}
                    selectedKey={selectedDay ?? selectedMonth}
                    daily={Boolean(month)}
                    onSelect={month ? key => setSelectedDay(current => current === key ? undefined : key) : chooseMonth}
                />
                {month && metric === "earnings" && <div className="daily-earnings-legend"><span><i className="gross-dot" />Estimated gross</span><span><i className="net-dot" />Estimated take-home</span></div>}
                <p className="chart-hint">{month ? "Select a day to narrow every report below." : "Select a month to see its daily performance."}</p>
            </section>

            <div className="report-two-column">
                <section className="report-card">
                    <div className="report-card-heading"><div><span className="reports-eyebrow">PAYCHECK TREND</span><h2>Gross vs. take-home</h2></div></div>
                    {scopedPaychecks.length ? <PaycheckChart paychecks={scopedPaychecks} /> : <Empty text={`No paystub was imported for ${scopeLabel.toLowerCase()}.`} />}
                </section>

                <section
                    className="report-card payroll-health-card payroll-health-card-link"
                    role="link"
                    tabIndex={0}
                    aria-label="Open payroll records that need attention"
                    onClick={() => navigate(`/payroll-verification?status=${payrollHealth.issues > 0 ? "issue" : "pending"}`)}
                    onKeyDown={event => {
                        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            navigate(`/payroll-verification?status=${payrollHealth.issues > 0 ? "issue" : "pending"}`);
                        }
                    }}
                >
                    <div className="report-card-heading"><div><span className="reports-eyebrow">PAYROLL HEALTH</span><h2>Verification status</h2></div></div>
                    <PayrollHealth report={payrollHealth} />
                </section>
            </div>

            <section className="report-card">
                <div className="report-card-heading"><div><span className="reports-eyebrow">LABOR MIX</span><h2>Top operations by flag hours</h2></div></div>
                {scopedOperations.length ? (
                    <div className="operations-report-table">
                        <div className="operations-table-header"><span>Operation</span><span>Times performed</span><span>Flag hours</span></div>
                        {scopedOperations.map((operation, index) => {
                            const operationKey = `${operation.description}-${index}`;
                            const singleRepair = operation.repairs.length === 1 ? operation.repairs[0] : undefined;
                            const isExpanded = expandedOperation === operationKey;
                            return <div className="operation-report-group" key={operationKey}>
                                <div className={`operations-table-row ${isExpanded ? "expanded" : ""}`}>
                                    {singleRepair ? (
                                        <Link className="operation-report-link" to={`/repairs/${singleRepair.id}`} title={`Open repair order ${singleRepair.repairOrderNumber}`}>
                                            <b>{index + 1}</b><span>{operation.description}</span><ExternalLink size={14} />
                                        </Link>
                                    ) : (
                                        <button type="button" className="operation-report-link" aria-expanded={isExpanded} onClick={() => setExpandedOperation(current => current === operationKey ? undefined : operationKey)}>
                                            <b>{index + 1}</b><span>{operation.description}</span><ChevronDown className="operation-chevron" size={15} />
                                        </button>
                                    )}
                                    <span>{operation.count}</span>
                                    <strong>{number.format(operation.hours)}</strong>
                                </div>
                                {isExpanded && <div className="operation-ticket-list" aria-label={`Repair orders for ${operation.description}`}>
                                    {operation.repairs.map((repair, repairIndex) => <Link to={`/repairs/${repair.id}`} key={`${repair.id}-${repair.hours}-${repairIndex}`}>
                                        <span><strong>RO #{repair.repairOrderNumber || "—"}</strong><small>{repair.vehicle || "Vehicle not listed"}</small></span>
                                        <span><small>{formatRepairDate(repair.date)}</small><b>{number.format(repair.hours)} hrs</b><ExternalLink size={13} /></span>
                                    </Link>)}
                                </div>}
                            </div>;
                        })}
                    </div>
                ) : <Empty text="Complete repairs to see your top operations." />}
            </section>
        </main>
    );
}

function Kpi({ icon, label, value, note, tone = "default" }: { icon: React.ReactNode; label: string; value: string; note: string; tone?: "default" | "good" }) {
    return <article className={`report-kpi ${tone}`}><span className="report-kpi-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>;
}

type ChartPoint = ReportPoint | (ReportSlice & { key: string; label: string });

function BarChart({ points, metric, onSelect, selectedKey, daily = false }: { points: ChartPoint[]; metric: Metric; onSelect: (key: string) => void; selectedKey?: string; daily?: boolean }) {
    const maximum = Math.max(...points.flatMap(point => metric === "earnings" && daily ? [point.earnings, point.netEarnings] : [point[metric]]), 1);
    return <div className={`bar-chart ${daily ? "daily-chart" : ""}`}>{points.map(point => {
        const value = point[metric];
        const label = metric === "earnings" ? money.format(value) : number.format(value);
        const dailyEarnings = metric === "earnings" && daily;
        const title = dailyEarnings ? `${point.label}: ${money.format(point.earnings)} gross, ${money.format(point.netEarnings)} take-home` : `${point.label}: ${label}`;
        return <button type="button" className={`bar-column ${dailyEarnings ? "earnings-pair" : ""} ${selectedKey === point.key ? "selected" : ""}`} key={point.key} title={title} aria-label={`Show ${title}`} aria-pressed={selectedKey === point.key} onClick={() => onSelect(point.key)}><div className="bar-value">{value ? label : ""}</div><div className="bar-track">{dailyEarnings ? <><div className="bar-fill gross-fill" style={{ height: `${Math.max((point.earnings / maximum) * 100, point.earnings ? 4 : 0)}%` }} /><div className="bar-fill net-fill" style={{ height: `${Math.max((point.netEarnings / maximum) * 100, point.netEarnings ? 4 : 0)}%` }} /></> : <div className="bar-fill" style={{ height: `${Math.max((value / maximum) * 100, value ? 4 : 0)}%` }} />}</div><span>{point.label}</span></button>;
    })}</div>;
}

function PaycheckChart({ paychecks }: { paychecks: ReportsSnapshot["paychecks"] }) {
    const maximum = Math.max(...paychecks.map(paycheck => paycheck.gross), 1);
    return <div className="paycheck-chart">{paychecks.map(paycheck => <div className="paycheck-row" key={paycheck.label}><span>{paycheck.label}</span><div className="paycheck-bars"><div className="paycheck-gross" style={{ width: `${(paycheck.gross / maximum) * 100}%` }}><span>{money.format(paycheck.gross)}</span></div><div className="paycheck-net" style={{ width: `${(paycheck.net / maximum) * 100}%` }}><span>{money.format(paycheck.net)}</span></div></div></div>)}<div className="chart-legend"><span><i className="gross-dot" />Gross</span><span><i className="net-dot" />Take-home</span></div></div>;
}

function PayrollHealth({ report }: { report: Pick<ReportsSnapshot, "verifiedRepairs" | "issues" | "pending"> }) {
    const total = report.verifiedRepairs + report.issues + report.pending;
    const verified = total ? report.verifiedRepairs / total * 100 : 0;
    const issue = total ? report.issues / total * 100 : 0;
    const stopCardNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation();
    return <div className="payroll-health"><div className="donut" style={{ background: `conic-gradient(#3f6b4d 0 ${verified}%, #d6854a ${verified}% ${verified + issue}%, #d8ded9 ${verified + issue}% 100%)` }}><div><strong>{Math.round(verified)}%</strong><span>verified</span></div></div><div className="health-legend"><Link to="/payroll-verification?status=verified" onClick={stopCardNavigation}><i className="verified-dot" /><b>{report.verifiedRepairs}</b> Verified</Link><Link to="/payroll-verification?status=issue" onClick={stopCardNavigation}><i className="issue-dot" /><b>{report.issues}</b> Needs attention</Link><Link to="/payroll-verification?status=pending" onClick={stopCardNavigation}><i className="pending-dot" /><b>{report.pending}</b> Pending</Link>{report.issues > 0 && <Link className="health-alert" to="/payroll-verification?status=issue" onClick={stopCardNavigation}><AlertCircle size={16} />Review flagged payroll records.</Link>}{report.pending > 0 && <Link className="health-alert" to="/payroll-verification?status=pending" onClick={stopCardNavigation}><Clock3 size={16} />{report.pending} records still need verification.</Link>}</div></div>;
}

function Empty({ text }: { text: string }) { return <div className="report-empty">{text}</div>; }

function formatRepairDate(value: string): string {
    if (!value) return "Date not listed";
    const date = new Date(`${value.slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
