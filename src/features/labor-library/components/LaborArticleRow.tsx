import type { LaborArticle } from "../types/LaborArticle";

interface LaborArticleRowProps {
    article: LaborArticle;
    onEdit: (article: LaborArticle) => void;
}

export default function LaborArticleRow({
    article,
    onEdit,
}: LaborArticleRowProps) {

    return (

        <tr>

            <td>{article.articleNumber}</td>

            <td>{article.description}</td>

            <td>
                {article.laborType === "fixed"
                    ? "Fixed"
                    : "Variable"}
            </td>

            <td className="labor-hours">
                {article.laborType === "fixed"
                    ? article.standardHours
                    : "—"}
            </td>

            <td>

                <span
                    className={
                        article.active
                            ? "status-active"
                            : "status-inactive"
                    }
                >
                    {article.active
                        ? "● Active"
                        : "● Inactive"}
                </span>

            </td>

            <td>

                <button
                    className="edit-button"
                    onClick={() => onEdit(article)}
                >
                    Edit
                </button>

            </td>

        </tr>

    );
}