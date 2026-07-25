import { useEffect, useMemo, useRef, useState } from "react";

import "../styles/LaborArticleLookup.css";

import { getAllLaborArticles } from "../../../labor-library/services/laborLibraryService";
import type { LaborArticle } from "../../../labor-library/types/LaborArticle";

type LaborArticleLookupProps = {
    onSelect: (article: LaborArticle) => void;
};

export default function LaborArticleLookup({
    onSelect,
}: LaborArticleLookupProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    const [articles, setArticles] = useState<LaborArticle[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    useEffect(() => {
        async function loadArticles() {
            const results = await getAllLaborArticles();

            setArticles(
                results.filter(article => article.active)
            );
        }

        loadArticles();
    }, []);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [search]);

    const filteredArticles = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return [];
        }

        return articles
            .filter(article =>
                article.articleNumber.toLowerCase().includes(value) ||
                article.description.toLowerCase().includes(value)
            )
            .slice(0, 10);

    }, [articles, search]);

    function selectArticle(article: LaborArticle) {

        onSelect(article);

        setSearch("");
        setIsOpen(false);

        inputRef.current?.focus();
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>
    ) {

        if (!isOpen || filteredArticles.length === 0) {
            return;
        }

        switch (event.key) {

            case "ArrowDown":
                event.preventDefault();

                setHighlightedIndex(index =>
                    Math.min(
                        index + 1,
                        filteredArticles.length - 1
                    )
                );
                break;

            case "ArrowUp":
                event.preventDefault();

                setHighlightedIndex(index =>
                    Math.max(index - 1, 0)
                );
                break;

            case "Enter":
                event.preventDefault();

                selectArticle(
                    filteredArticles[highlightedIndex]
                );
                break;

            case "Escape":
                setIsOpen(false);
                break;
        }
    }

    return (
        <div
            className="labor-lookup"
            onBlur={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                    )
                ) {
                    setIsOpen(false);
                }
            }}
        >

            <label htmlFor="laborLookup">
                Labor Article
            </label>

            <input
                ref={inputRef}
                id="laborLookup"
                type="text"
                autoComplete="off"
                placeholder="Search article number or description..."
                value={search}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setIsOpen(true);
                }}
            />

            {isOpen && filteredArticles.length > 0 && (

                <div className="labor-lookup-dropdown">

                    {filteredArticles.map((article, index) => (

                        <button
                            key={article.articleNumber}
                            type="button"
                            className={
                                index === highlightedIndex
                                    ? "labor-lookup-item active"
                                    : "labor-lookup-item"
                            }
                            onClick={() => selectArticle(article)}
                            onMouseEnter={() =>
                                setHighlightedIndex(index)
                            }
                        >

                            <div>
                                <strong>
                                    {article.articleNumber}
                                </strong>
                            </div>

                            <div>
                                {article.description}
                            </div>

                            <div>
                                {article.standardHours.toFixed(1)} hrs
                            </div>

                        </button>

                    ))}

                </div>

            )}

        </div>
    );
}