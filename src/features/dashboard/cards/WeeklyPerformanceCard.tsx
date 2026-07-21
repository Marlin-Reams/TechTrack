import DashboardCard from "./DashboardCard";
import "./WeeklyPerformanceCard.css";

type WeeklyPerformanceCardProps = {
  flagHours: number;
  goal: number;
};

function WeeklyPerformanceCard({
  flagHours,
  goal,
}: WeeklyPerformanceCardProps) {
  const progress = goal > 0 ? (flagHours / goal) * 100 : 0;

  return (
    <DashboardCard title="Weekly Performance">
      <div className="weekly-performance">
        <h1>{flagHours.toFixed(1)}</h1>

        <p>Flag Hours</p>

        <p>Weekly Goal: {goal.toFixed(1)} hrs</p>

        <progress value={flagHours} max={goal} />

        <p>{progress.toFixed(1)}%</p>
      </div>
    </DashboardCard>
  );
}

export default WeeklyPerformanceCard;