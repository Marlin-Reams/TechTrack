import DashboardCard from "./DashboardCard";
import "./WeeklyPerformanceCard.css";

type WeeklyPerformanceCardProps = {
    flagHours: number;
    goal: number;
    repairOrders: number;
    averageHoursPerRepair: number;
};

export default function WeeklyPerformanceCard({
    flagHours,
    goal,
    repairOrders,
    averageHoursPerRepair,
}: WeeklyPerformanceCardProps) {

    const progress =
        goal > 0
            ? (flagHours / goal) * 100
            : 0;

    return (
        <DashboardCard title="Weekly Performance">

            <div className="weekly-performance">

                <h1>{flagHours.toFixed(1)}</h1>

                <p>Flag Hours</p>

                <p>
                    Weekly Goal: {goal.toFixed(1)} hrs
                </p>

                <progress
                    value={flagHours}
                    max={goal}
                />

                <p>{progress.toFixed(1)}%</p>

                <hr />

                <p>
                    <strong>Completed ROs:</strong>{" "}
                    {repairOrders}
                </p>

                <p>
                    <strong>Avg Hours / RO:</strong>{" "}
                    {averageHoursPerRepair.toFixed(2)}
                </p>

            </div>

        </DashboardCard>
    );
}