import "../styles/LaborArticleTable.css";

import LaborArticleRow from "./LaborArticleRow";

import type { LaborArticle } from "../types/LaborArticle";

interface LaborArticleTableProps {
    articles: LaborArticle[];
    onEdit: (article: LaborArticle) => void;
}

export default function LaborArticleTable({
    articles,
    onEdit,
}: LaborArticleTableProps) {

    if (articles.length === 0) {
        return (
            <p>No labor articles found.</p>
        );
    }

    return (
        <table className="labor-table">

            <thead>

                <tr>
                    <th>Article</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                {articles.map((article) => (

                    <LaborArticleRow
                        key={article.articleNumber}
                        article={article}
                        onEdit={onEdit}
                    />

                ))}

            </tbody>

        </table>
    );
}