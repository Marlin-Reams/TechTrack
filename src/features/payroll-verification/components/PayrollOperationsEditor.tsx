import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { Operation } from "../../repairs/operations/types/Operation";
import "./PayrollOperationsEditor.css";

interface Props {
    operations: Operation[];
    onSave: (operations: Operation[], reason: string) => Promise<void>;
    onCancel: () => void;
}

export default function PayrollOperationsEditor({ operations, onSave, onCancel }: Props) {
    const [draft, setDraft] = useState<Operation[]>(() => operations.map(operation => ({ ...operation })));
    const [reason, setReason] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const total = useMemo(() => draft.reduce((sum, operation) => sum + (Number(operation.hours) || 0), 0), [draft]);

    function update(index: number, field: "articleNumber" | "description" | "hours", value: string) {
        setDraft(current => current.map((operation, itemIndex) => itemIndex === index ? {
            ...operation,
            [field]: field === "hours" ? valueAsHours(value) : value,
        } : operation));
    }

    function addOperation() {
        setDraft(current => [...current, {
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `payroll-${Date.now()}`,
            articleNumber: "",
            description: "",
            workPerformed: "",
            laborType: "fixed",
            hours: 0,
        }]);
    }

    async function save() {
        if (!reason.trim()) { setError("Add a short reason so this correction is documented."); return; }
        if (draft.some(operation => !operation.articleNumber.trim() || !operation.description.trim() || operation.hours < 0)) {
            setError("Every labor line needs an article number, description, and zero or more hours."); return;
        }
        setSaving(true); setError("");
        try { await onSave(draft, reason.trim()); }
        catch { setError("The correction could not be saved. Please try again."); setSaving(false); }
    }

    return <section className="payroll-operations-editor">
        <div className="payroll-editor-heading"><div><span>PAYROLL CORRECTION</span><h2>Correct labor operations</h2><p>Edit, remove, or add only the labor lines that should count toward this repair.</p></div><strong>{total.toFixed(1)} hrs</strong></div>
        <div className="payroll-editor-table">
            <div className="payroll-editor-head"><span>Article #</span><span>Description</span><span>Hours</span><span /></div>
            {draft.map((operation, index) => <div className="payroll-editor-row" key={operation.id}>
                <input aria-label={`Operation ${index + 1} article number`} value={operation.articleNumber} onChange={event => update(index, "articleNumber", event.target.value)} />
                <input aria-label={`Operation ${index + 1} description`} value={operation.description} onChange={event => update(index, "description", event.target.value)} />
                <input aria-label={`Operation ${index + 1} hours`} type="number" min="0" step="0.1" value={operation.hours} onChange={event => update(index, "hours", event.target.value)} />
                <button type="button" className="remove-labor" aria-label={`Remove operation ${index + 1}`} onClick={() => setDraft(current => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={17} /></button>
            </div>)}
        </div>
        <button type="button" className="add-labor" onClick={addOperation}><Plus size={16} />Add labor article</button>
        <label className="correction-reason">Reason for correction<textarea value={reason} onChange={event => setReason(event.target.value)} placeholder="Example: Payroll added 0.5 hours for vehicle inspection" rows={3} /></label>
        {error && <p className="payroll-editor-error">{error}</p>}
        <div className="payroll-editor-actions"><button type="button" onClick={onCancel}>Cancel</button><button type="button" className="save-correction" disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save correction"}</button></div>
    </section>;
}

function valueAsHours(value: string) {
    if (value === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}
