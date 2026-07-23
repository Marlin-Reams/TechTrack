import type { RefObject } from "react";

type ArticleInputProps = {
    value: string;
    onChange: (value: string) => void;
    onEnter: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
};

export default function ArticleInput({
    value,
    onChange,
    onEnter,
    inputRef,
}: ArticleInputProps) {
    return (
        <div className="field">
            <label htmlFor="articleNumber">Article Number</label>

            <input
                ref={inputRef}
                id="articleNumber"
                type="text"
                placeholder="Enter labor article number..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onEnter();
                    }
                }}
            />
        </div>
    );
}