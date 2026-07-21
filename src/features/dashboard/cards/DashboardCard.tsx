import type { ReactNode } from "react";
import "./DashboardCard.css";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
};

function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <section className="dashboard-card">
      <header>
        <h2>{title}</h2>
      </header>

      <div>{children}</div>
    </section>
  );
}

export default DashboardCard;