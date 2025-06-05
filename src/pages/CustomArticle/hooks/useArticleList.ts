import type { CustomArticle } from "../store/type";
import { useDeleteArticle, useGetArticles } from "@/utils/db/article";
import { useCallback, useEffect, useState } from "react";

export function useArticleList() {
  const [articles, setArticles] = useState<CustomArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getArticles = useGetArticles();
  const deleteArticle = useDeleteArticle();

  // 加载文章列表
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const articleList = await getArticles();
      setArticles(articleList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("加载文章失败"));
      console.error("加载文章列表失败:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getArticles]);

  // 删除文章
  const handleDeleteArticle = useCallback(
    async (id: number) => {
      try {
        const success = await deleteArticle(id);
        if (success) {
          // 更新列表，移除已删除的文章
          setArticles((prevArticles) =>
            prevArticles.filter((article) => article.id !== id)
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error("删除文章失败:", err);
        return false;
      }
    },
    [deleteArticle]
  );

  // 初始加载
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    isLoading,
    error,
    refreshArticles: loadArticles,
    deleteArticle: handleDeleteArticle,
  };
}
