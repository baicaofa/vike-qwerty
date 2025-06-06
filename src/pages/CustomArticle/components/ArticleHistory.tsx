import { useArticleList } from "../hooks/useArticleList";
import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import type { CustomArticle } from "../store/type";
import { timeStamp2String } from "@/utils";
import { useContext, useState } from "react";

export default function ArticleHistory() {
  const { dispatch } = useContext(ArticleContext);
  const { articles, isLoading, error, refreshArticles, deleteArticle } =
    useArticleList();
  const [sortBy, setSortBy] = useState<"createdAt" | "lastPracticedAt">(
    "lastPracticedAt"
  );

  // 处理排序
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "createdAt" | "lastPracticedAt");
  };

  // 按选择的字段排序文章
  const sortedArticles = [...articles].sort((a, b) => {
    return b[sortBy] - a[sortBy]; // 降序排列
  });

  // 加载文章进行练习
  const handlePracticeArticle = (article: CustomArticle) => {
    // 设置文章文本
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TEXT,
      payload: article.content,
    });

    // 设置从历史记录进入的标志
    dispatch({
      type: ArticleActionType.SET_FROM_HISTORY,
      payload: true,
    });

    // 直接设置处理后的文本，避免再次处理
    dispatch({
      type: ArticleActionType.SET_VIEW_HISTORY,
      payload: false,
    });

    // 直接跳转到预处理步骤
    dispatch({ type: ArticleActionType.NEXT_STEP });
  };

  // 删除文章
  const handleDeleteArticle = async (id: number) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      const success = await deleteArticle(id);
      if (success) {
        refreshArticles();
      } else {
        alert("删除文章失败，请重试。");
      }
    }
  };

  // 返回自定义文章首页
  const handleBack = () => {
    dispatch({ type: ArticleActionType.SET_VIEW_HISTORY, payload: false });
  };

  // 渲染文章项
  const renderArticleItem = (article: CustomArticle, index: number) => {
    return (
      <div
        key={article.id}
        className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 truncate">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              创建时间: {timeStamp2String(article.createdAt / 1000)}
            </p>
            <p className="text-sm text-gray-500">
              上次练习:{" "}
              {timeStamp2String(
                (article.lastPracticedAt || article.createdAt) / 1000
              )}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="my-btn-primary text-sm"
              onClick={() => handlePracticeArticle(article)}
            >
              练习
            </button>
            <button
              type="button"
              className="my-btn-secondary text-sm"
              onClick={() => handleDeleteArticle(article.id!)}
            >
              删除
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染空状态
  const renderEmpty = () => (
    <div className="text-center py-10">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">暂无保存的文章</h3>
      <p className="mt-1 text-sm text-gray-500">
        开始创建一篇新的文章进行练习吧！
      </p>
      <div className="mt-6">
        <button type="button" className="my-btn-primary" onClick={handleBack}>
          创建新文章
        </button>
      </div>
    </div>
  );

  // 渲染加载状态
  const renderLoading = () => (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">加载中...</p>
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center py-10 text-red-500">
      <p>加载文章失败: {error?.message}</p>
      <button
        type="button"
        className="my-btn-secondary mt-4"
        onClick={refreshArticles}
      >
        重试
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">保存的文章</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-by" className="text-sm text-gray-600">
              排序:
            </label>
            <select
              id="sort-by"
              className="text-sm border rounded px-2 py-1"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="lastPracticedAt">最近练习</option>
              <option value="createdAt">创建时间</option>
            </select>
          </div>
          <button
            type="button"
            className="my-btn-secondary"
            onClick={handleBack}
          >
            返回
          </button>
        </div>
      </div>

      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : sortedArticles.length === 0 ? (
        renderEmpty()
      ) : (
        <div className="w-full">
          {sortedArticles.map((article, index) =>
            renderArticleItem(article, index)
          )}
        </div>
      )}
    </div>
  );
}
