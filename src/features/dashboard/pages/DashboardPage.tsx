import WeeklyPerformanceCard from "../components/WeeklyPerformanceCard";
import WorkloadCard from "../components/WorkloadCard";
import RecentRepairs from "../components/RecentRepairs";
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
                    repairOrders={summary.openRepairs}
                    flagHours={summary.weeklyHours}
                />
            </div>

            <RecentRepairs
                repairs={summary.recentRepairs}
            />
        </>
    );
}