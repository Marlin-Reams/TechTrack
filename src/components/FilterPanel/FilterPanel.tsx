import { useState } from "react";

import "./FilterPanel.css";

type FilterPanelProps = {
    title?: string;
    children: React.ReactNode;
};

export default function FilterPanel({
    title = "Filters",
    children,
}: FilterPanelProps) {

    const [expanded, setExpanded] =
        useState(false);

    return (
        <section className="filter-panel">

            <button
                className="filter-panel__toggle"
                onClick={() =>
                    setExpanded(!expanded)
                }
            >
                <span>⚙ {title}</span>

                <span>
                    {expanded ? "▲" : "▼"}
                </span>

            </button>

            {expanded && (
                <div className="filter-panel__content">
                    {children}
                </div>
            )}

        </section>
    );

}