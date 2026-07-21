type VariableOperationFormProps = {
    description: string;
    workPerformed: string;
    hours: string;
    onWorkPerformedChange: (value: string) => void;
    onHoursChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function VariableOperationForm({
    description,
    workPerformed,
    hours,
    onWorkPerformedChange,
    onHoursChange,
    onSave,
    onCancel,
}: VariableOperationFormProps) {
    return (
        <div className="variable-operation">
            <h3>{description}</h3>

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
                <button onClick={onSave}>
                    Save
                </button>

                <button onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}