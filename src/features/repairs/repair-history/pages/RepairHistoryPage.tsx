import useRepairHistory from "../hooks/useRepairHistory";
import RepairHistoryList from "../components/RepairHistoryList";

export default function RepairHistoryPage() {
    const {
        repairs,
        loading,
        error,
    } = useRepairHistory();

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

            <p>Total Repairs: {repairs.length}</p>

            <RepairHistoryList
                repairs={repairs}
            />
        </main>
    );
}