import DashboardCard from "../features/dashboard/components/DashboardCard";

function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      <p>Welcome back!</p>

      <DashboardCard title="Weekly Performance">
        <p>Flag Hours: 0.0</p>
      </DashboardCard>
    </main>
  );
}

export default DashboardPage;