import "./CreateRepairPage.css";

import RepairHeader from "../repair-header/components/RepairHeader";
import OperationsSection from "../operations/components/OperationsSection";

export default function CreateRepairPage() {
    return (
        <main className="create-repair-page">
            <RepairHeader />

            <OperationsSection />
        </main>
    );
}