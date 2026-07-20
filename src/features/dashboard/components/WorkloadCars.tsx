import DashboardCard from "./DashboardCard";
import "./WorkloadCard.css";

type WorkloadCardProps = {
  repairOrders: number;
  flagHours: number;
};

function WorkloadCard({
  repairOrders,
  flagHours,
}: WorkloadCardProps) {
  const averageHoursPerRO =
    repairOrders > 0 ? flagHours / repairOrders : 0;

  return (
    <DashboardCard title="Workload">
      <div className="workload-card">
        <div className="metric">
          <h1>{repairOrders}</h1>
          <p>Repair Orders</p>
        </div>

        <div className="metric">
          <h1>{averageHoursPerRO.toFixed(2)}</h1>
          <p>Avg Hours / RO</p>
        </div>
      </div>
    </DashboardCard>
  );
}

export default WorkloadCard;