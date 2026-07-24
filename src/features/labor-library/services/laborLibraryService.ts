import {
    createLaborArticle,
    getLaborArticle,
    getLaborArticles,
    updateLaborArticle,
} from "../repository/laborLibraryRepository";

import type { LaborArticle } from "../types/LaborArticle";

export async function findLaborArticle(
    articleNumber: string
): Promise<LaborArticle | null> {

    return getLaborArticle(articleNumber);
}

export async function getAllLaborArticles() {
    return getLaborArticles();
}

export async function addLaborArticle(
    article: LaborArticle
) {
    return createLaborArticle(article);
}

export async function editLaborArticle(
    article: LaborArticle
) {
    return updateLaborArticle(article);
}