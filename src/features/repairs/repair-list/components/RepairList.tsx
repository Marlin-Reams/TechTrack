import RepairCard from "./RepairCard";

import type { RepairRecord } from "../../repair-entry/types/RepairRecord";

type RepairListProps = {
    repairs: RepairRecord[];
};

export default function RepairList({
    repairs,
}: RepairListProps) {

    if (repairs.length === 0) {
        return (
            <p>No repairs found.</p>
        );
    }

    return (
        <section className="repair-list">

            {repairs.map((repair) => (

                <RepairCard
    key={repair.header.repairOrderNumber}
    repair={repair}
/>

            ))}

        </section>
    );
}