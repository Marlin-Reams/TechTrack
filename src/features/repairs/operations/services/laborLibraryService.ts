import { laborLibrary } from "../data/laborLibrary";

export function findLaborArticle(articleNumber: string) {
  return laborLibrary.find(
    (article) => article.articleNumber === articleNumber
  );
}