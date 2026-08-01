import { useNavigate } from "react-router-dom";

import DashboardCard from "./DashboardCard";

import "./WorkloadCard.css";

type WorkloadCardProps = {
    expectedHours: number;
    verifiedHours: number;

    pendingCount: number;
    verifiedCount: number;
    issueCount: number;
    resolvedCount: number;
};

export default function WorkloadCard({
    expectedHours,
    verifiedHours,
    pendingCount,
    verifiedCount,
    issueCount,
    resolvedCount,
}: WorkloadCardProps) {

    const navigate = useNavigate();

    const difference = verifiedHours - expectedHours;

    const percentVerified =
        expectedHours === 0
            ? 100
            : Math.round((verifiedHours / expectedHours) * 100);

    return (

        <DashboardCard title="Payroll Verification">

            <div className="workload-card">

                <div className="metric">

                    <h1>
                        {verifiedHours.toFixed(1)}
                        <span className="hours-divider">
                            {" / "}
                        </span>
                        {expectedHours.toFixed(1)}
                    </h1>

                    <p>Verified This Week</p>

                    <div className="summary">

                        {verifiedHours === expectedHours ? (

                            <>
                                ✓ {percentVerified}% of payroll verified
                            </>

                        ) : (

                            <>
                                {difference.toFixed(1)} hour
                                {Math.abs(difference) !== 1 ? "s" : ""}
                                {" "}
                                difference
                            </>

                        )}

                    </div>

                </div>

                <div className="status-grid">

                  <button
                        className="status-card"
                        onClick={() =>
                            navigate(
                                "/repairs/history?payroll=verified"
                            )
                        }
                    >
                        <span className="dot">🟢</span>

                        <span className="count">
                            {verifiedCount}
                        </span>

                        <span className="label">
                            Verified
                        </span>
                    </button>

                <button
                        className="status-card"
                        onClick={() =>
                            navigate(
                                "/repairs/history?payroll=pending"
                            )
                        }
                    >
                        <span className="dot">🟡</span>

                        <span className="count">
                            {pendingCount}
                        </span>

                        <span className="label">
                            Pending
                        </span>
                    </button>

                    <button
                        className="status-card"
                        onClick={() =>
                            navigate(
                                "/repairs/history?payroll=issue"
                            )
                        }
                    >
                        <span className="dot">🔴</span>

                        <span className="count">
                            {issueCount}
                        </span>

                        <span className="label">
                            Issues
                        </span>
                    </button>

                      

                    
                    <button
                        className="status-card"
                        onClick={() =>
                            navigate(
                                "/repairs/history?payroll=resolved"
                            )
                        }
                    >
                        <span className="dot">🔵</span>

                        <span className="count">
                            {resolvedCount}
                        </span>

                        <span className="label">
                            Resolved
                        </span>
                    </button>

                </div>

                <div className="payroll-details">

                    <div className="detail-row">

                        <span>Expected Hours</span>

                        <strong>
                            {expectedHours.toFixed(1)}
                        </strong>

                    </div>

                    <div className="detail-row">

                        <span>Verified Hours</span>

                        <strong>
                            {verifiedHours.toFixed(1)}
                        </strong>

                    </div>

                    <div className="detail-row">

                        <span>Difference</span>

                        <strong>
                            {difference >= 0 ? "+" : ""}
                            {difference.toFixed(1)}
                        </strong>

                    </div>

                </div>

            </div>

        </DashboardCard>

    );

}