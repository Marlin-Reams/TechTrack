import WeeklyPerformanceCard from "../components/WeeklyPerformanceCard";
import WorkloadCard from "../components/WorkloadCard";
import NeedsVerificationCard
    from "../../payroll-verification/components/NeedsVerificationCard";
import useDashboard from "../hooks/useDashboard";

export default function DashboardPage() {
    const summary = useDashboard();

    if (!summary) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <>
            <h1>Dashboard</h1>

            <div className="dashboard-grid">
                <WeeklyPerformanceCard
                    flagHours={summary.weeklyHours}
                    goal={summary.weeklyGoal}
                    repairOrders={summary.repairOrders}
                    averageHoursPerRepair={summary.averageHoursPerRepair}
                />

                <WorkloadCard
    expectedHours={summary.expectedHours}
    verifiedHours={summary.verifiedHours}
    pendingCount={summary.pendingCount}
    verifiedCount={summary.verifiedCount}
    issueCount={summary.issueCount}
    resolvedCount={summary.resolvedCount}
/>
            </div>

            <NeedsVerificationCard
                repairs={summary.recentRepairs}
            />
        </>
    );
}