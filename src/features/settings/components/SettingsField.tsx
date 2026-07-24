interface SettingsFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export default function SettingsField({
    label,
    value,
    onChange,
}: SettingsFieldProps) {
    return (
        <div className="settings-field">

            <label>
                {label}
            </label>

            <input
                type="number"
                value={value}
                onChange={(e) =>
                    onChange(Number(e.target.value))
                }
            />

        </div>
    );
}