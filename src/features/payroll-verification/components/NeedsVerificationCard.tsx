import "./NeedsVerificationCard.css";

import { useNavigate } from "react-router-dom";

import type { StoredRepair } from "../../repairs/types/StoredRepair";

interface NeedsVerificationCardProps {
    repairs: StoredRepair[];
}

export default function NeedsVerificationCard({
    repairs,
}: NeedsVerificationCardProps) {

    const navigate = useNavigate();

    const pendingRepairs = repairs.filter(
        repair => repair.payrollVerification?.status !== "verified"
    );

    return (
        <section>

            <h2>Needs Payroll Verification</h2>

            {pendingRepairs.length === 0 && (
                <p>🎉 All repairs have been verified.</p>
            )}

            <div className="verification-grid">

            {pendingRepairs.map(repair => {

                const expectedHours = repair.operations.reduce(
                    (total, operation) => total + operation.hours,
                    0
                );

                

                return (

                    <div
                        key={repair.id}
                        className="verification-card"
                        onClick={() =>
                            navigate(`/payroll-verification/${repair.id}`)
                        }
                    >

                        <h3>
                            RO #{repair.header.repairOrderNumber}
                        </h3>

                        <p>
                            {repair.header.year}{" "}
                            {repair.header.make}{" "}
                            {repair.header.model}
                        </p>

                        <p>
                            Expected Hours:{" "}
                            <strong>
                                {expectedHours.toFixed(1)}
                            </strong>
                        </p>

                    </div>

                );

            })}

            </div>
            
        </section>
    );
}