import RepairHistoryList from "../../repairs/repair-history/components/RepairHistoryList";
import type { StoredRepair } from "../../repairs/types/StoredRepair";

interface RecentRepairsProps {
    repairs: StoredRepair[];
}

export default function RecentRepairs({
    repairs,
}: RecentRepairsProps) {
    return (
        <section>
            <h2>Recent Repairs</h2>

            <RepairHistoryList repairs={repairs} />
        </section>
    );
}