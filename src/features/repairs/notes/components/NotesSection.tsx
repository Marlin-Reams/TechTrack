import "../styles/NotesSection.css";

import useNotes from "../hooks/useNotes";

export default function NotesSection() {
    const {
        note,
        updateNote,
    } = useNotes();

    return (
        <section className="notes-section">
            <h2>Repair Notes</h2>

            <textarea
                placeholder="Document diagnostics, repairs performed, observations, recommendations, measurements, test results..."
                value={note.content}
                onChange={(e) => updateNote(e.target.value)}
                rows={12}
            />

            <div className="notes-footer">
                <span>{note.content.length} characters</span>
            </div>
        </section>
    );
}