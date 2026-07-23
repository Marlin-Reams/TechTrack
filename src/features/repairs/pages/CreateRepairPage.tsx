import "./CreateRepairPage.css";

import RepairHeader from "../repair-header/components/RepairHeader";
import OperationsSection from "../operations/components/OperationsSection";
import NotesSection from "../notes/components/NotesSection";


export default function CreateRepairPage() {
    return (
        <main className="create-repair-page">
            <RepairHeader />

            <OperationsSection />

            <NotesSection />
            
        </main>
    );
}