import { useState } from "react";

import useRepairHistory from "../hooks/useRepairHistory";
import RepairHistoryList from "../components/RepairHistoryList";

export default function RepairHistoryPage() {

    const [payrollStatus, setPayrollStatus] = useState<
        "all" |
        "pending" |
        "verified" |
        "issue" |
        "resolved"
    >("all");

    const {
        repairs,
        loading,
        error,
    } = useRepairHistory({
        payrollStatus,
    });

    if (loading) {
        return (
            <main>
                <h1>Repair History</h1>
                <p>Loading repairs...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h1>Repair History</h1>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main>

            <h1>Repair History</h1>

            <div
                style={{
                    marginBottom: "1.5rem",
                }}
            >

                <label
                    htmlFor="payroll-filter"
                >
                    Payroll Status
                </label>

                <br />

                <select
                    id="payroll-filter"
                    value={payrollStatus}
                    onChange={(event) =>
                        setPayrollStatus(
                            event.target.value as
                            | "all"
                            | "pending"
                            | "verified"
                            | "issue"
                            | "resolved"
                        )
                    }
                >
                    <option value="all">
                        All
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="verified">
                        Verified
                    </option>

                    <option value="issue">
                        Issue
                    </option>

                    <option value="resolved">
                        Resolved
                    </option>

                </select>

            </div>

            <p>
                Total Repairs: {repairs.length}
            </p>

            <RepairHistoryList
                repairs={repairs}
            />

        </main>
    );

}