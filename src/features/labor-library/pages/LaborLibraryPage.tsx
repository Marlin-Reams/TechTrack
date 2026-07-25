import { useEffect, useState } from "react";

import "../styles/LaborLibraryPage.css";

import LaborArticleForm from "../components/LaborArticleForm";
import LaborArticleTable from "../components/LaborArticleTable";

import {
    getAllLaborArticles,
} from "../services/laborLibraryService";

import type { LaborArticle } from "../types/LaborArticle";

export default function LaborLibraryPage() {

    const [articles, setArticles] = useState<LaborArticle[]>([]);
    const [editingArticle, setEditingArticle] =
        useState<LaborArticle | null>(null);

    const [formMode, setFormMode] =
        useState<"create" | "edit">("create");

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadArticles();
    }, []);

    async function loadArticles() {
        const laborArticles = await getAllLaborArticles();
        setArticles(laborArticles);
    }

    const filteredArticles = articles.filter((article) => {

        const search = searchText.trim().toLowerCase();

        return (
            article.articleNumber
                .toLowerCase()
                .includes(search) ||

            article.description
                .toLowerCase()
                .includes(search)
        );
    });

    function handleEdit(
        article: LaborArticle
    ) {
        setEditingArticle(article);
        setFormMode("edit");
    }

    function handleCancel() {
        setEditingArticle(null);
        setFormMode("create");
    }

    function handleArticleSaved() {
        loadArticles();
        setEditingArticle(null);
        setFormMode("create");
    }

    return (
        <main className="labor-library-page">

            <h1 className="labor-library-title">
                Labor Library
            </h1>

            <section className="labor-card">

                <h2 className="labor-card-title">
                    {formMode === "create"
                        ? "Add Labor Article"
                        : "Edit Labor Article"}
                </h2>

                <LaborArticleForm
                    article={editingArticle}
                    formMode={formMode}
                    onArticleSaved={handleArticleSaved}
                    onCancel={handleCancel}
                />

            </section>

            <section className="labor-card">

                <h2 className="labor-card-title">
                    Labor Articles
                </h2>

                <input
                    className="labor-search"
                    type="text"
                    placeholder="Search by article number or description..."
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(event.target.value)
                    }
                />

                <LaborArticleTable
                    articles={filteredArticles}
                    onEdit={handleEdit}
                />

            </section>

        </main>
    );
}