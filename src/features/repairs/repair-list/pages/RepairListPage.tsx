import useRepairList from "../hooks/useRepairList";

import RepairList from "../components/RepairList";

export default function RepairListPage() {

    const {
        repairs,
        loading,
        error,
    } = useRepairList();

    if (loading) {
        return (
            <main>
                <h1>Repairs</h1>
                <p>Loading repairs...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h1>Repairs</h1>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main>

            <h1>Repairs</h1>

            <RepairList
                repairs={repairs}
            />

        </main>
    );
}