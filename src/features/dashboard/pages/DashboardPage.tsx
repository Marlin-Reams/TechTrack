import WeeklyPerformanceCard from "../cards/WeeklyPerformanceCard";
import WorkloadCard from "../cards/WorkloadCars";

function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <WeeklyPerformanceCard
          flagHours={28.4}
          goal={50}
        />

         <WorkloadCard
    repairOrders={14}
    flagHours={28.4}
  />
      </div>
    </>
  );
}

export default DashboardPage;