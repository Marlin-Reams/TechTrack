import "./CreateRepairPage.css";

import RepairHeader from "../repair-header/components/RepairHeader";
import OperationsSection from "../operations/components/OperationsSection";
import NotesSection from "../notes/components/NotesSection";
import AttachmentsSection from "../attachments/components/AttachmentsSection";

export default function CreateRepairPage() {

    function handleSaveRepair() {
        console.log("Save Repair");
    }

    return (
        <main className="create-repair-page">

            <RepairHeader />

            <OperationsSection />

            <NotesSection />

            <AttachmentsSection />

            <div className="repair-actions">
                <button
                    className="save-repair-button"
                    onClick={handleSaveRepair}
                >
                    Save Repair
                </button>
            </div>

        </main>
    );
}