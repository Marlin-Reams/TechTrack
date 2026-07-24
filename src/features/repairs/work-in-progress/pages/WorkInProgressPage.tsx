import { useEffect, useState } from "react";

import { getOpenRepairs } from "../../repository/repairRepository";

import RepairHistoryList from "../../repair-history/components/RepairHistoryList";

import type { StoredRepair } from "../../types/StoredRepair";

export default function WorkInProgressPage() {
    const [repairs, setRepairs] = useState<StoredRepair[]>([]);

    useEffect(() => {
        async function loadRepairs() {
            const openRepairs = await getOpenRepairs();

            setRepairs(openRepairs);
        }

        loadRepairs();
    }, []);

    return (
        <main>
            <h1>Work In Progress</h1>

            <p>{repairs.length} Open Repairs</p>

            <RepairHistoryList repairs={repairs} />
        </main>
    );
}