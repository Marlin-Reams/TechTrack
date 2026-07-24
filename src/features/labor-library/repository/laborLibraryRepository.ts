import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import {
    db,
    getCurrentUserId,
} from "../../../firebase/repositoryHelpers";

import type { LaborArticle } from "../types/LaborArticle";

/* -------------------------------------------------------------------------- */
/*                               Private Helpers                              */
/* -------------------------------------------------------------------------- */

function getLaborLibraryCollection() {
    return collection(
        db,
        "users",
        getCurrentUserId(),
        "laborLibrary"
    );
}

function getLaborArticleDocument(
    articleNumber: string
) {
    return doc(
        db,
        "users",
        getCurrentUserId(),
        "laborLibrary",
        articleNumber
    );
}

/* -------------------------------------------------------------------------- */
/*                              Public Repository                             */
/* -------------------------------------------------------------------------- */

export async function getLaborArticles(): Promise<LaborArticle[]> {
    const snapshot = await getDocs(
        getLaborLibraryCollection()
    );

    return snapshot.docs.map(
        (doc) => doc.data() as LaborArticle
    );
}

export async function getLaborArticle(
    articleNumber: string
): Promise<LaborArticle | null> {

    const snapshot = await getDoc(
        getLaborArticleDocument(articleNumber)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as LaborArticle;
}

export async function createLaborArticle(
    article: LaborArticle
): Promise<void> {

    await setDoc(
        getLaborArticleDocument(article.articleNumber),
        {
            ...article,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );
}

export async function updateLaborArticle(
    article: LaborArticle
): Promise<void> {

    await updateDoc(
        getLaborArticleDocument(article.articleNumber),
        {
            description: article.description,
            laborType: article.laborType,
            standardHours: article.standardHours,
            active: article.active,
            updatedAt: serverTimestamp(),
        }
    );
}