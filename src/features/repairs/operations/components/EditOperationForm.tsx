type EditOperationFormProps = {
    workPerformed: string;
    hours: string;
    onWorkPerformedChange: (value: string) => void;
    onHoursChange: (value: string) => void;
    onUpdate: () => void;
    onCancel: () => void;
};

export default function EditOperationForm({
    workPerformed,
    hours,
    onWorkPerformedChange,
    onHoursChange,
    onUpdate,
    onCancel,
}: EditOperationFormProps) {
    return (
        <div className="variable-operation">
            <h3>Edit Operation</h3>

            <div className="field">
                <label>Work Performed</label>

                <input
                    value={workPerformed}
                    onChange={(e) =>
                        onWorkPerformedChange(e.target.value)
                    }
                />
            </div>

            <div className="field">
                <label>Hours</label>

                <input
                    type="number"
                    step="0.1"
                    value={hours}
                    onChange={(e) =>
                        onHoursChange(e.target.value)
                    }
                />
            </div>

            <div className="buttons">
                <button onClick={onUpdate}>
                    Update
                </button>

                <button onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}