import { useArticleList } from "../hooks/useArticleList";
import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import type { CustomArticle } from "../store/type";
import EditArticleDialog from "./EditArticleDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timeStamp2String } from "@/utils";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ArticleHistory() {
  const { dispatch } = useContext(ArticleContext);
  const { articles, isLoading, error, refreshArticles, deleteArticle } =
    useArticleList();
  const [sortBy, setSortBy] = useState<"createdAt" | "lastPracticedAt">(
    "lastPracticedAt"
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CustomArticle | null>(
    null
  );

  // 使用i18n翻译
  const { t } = useTranslation("article");
  const { t: tCommon } = useTranslation("common");
  // 使用Tabs组件，不再需要单独的activeTab状态

  // 处理排序
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "createdAt" | "lastPracticedAt");
  };

  // 获取用户自定义文章
  const userArticles = articles
    .filter((article) => !article.isOfficial)
    .sort((a, b) => {
      const valueA = a[sortBy] || a.createdAt;
      const valueB = b[sortBy] || b.createdAt;
      return valueB - valueA;
    });

  // 获取官方文章
  const officialArticles = articles
    .filter((article) => article.isOfficial)
    .sort((a, b) => {
      const valueA = a[sortBy] || a.createdAt;
      const valueB = b[sortBy] || b.createdAt;
      return valueB - valueA;
    });

  // 加载文章进行练习
  const handlePracticeArticle = (article: CustomArticle) => {
    // 先重置练习状态
    dispatch({ type: ArticleActionType.RESET_TYPING });

    // 设置文章文本
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TEXT,
      payload: article.content,
    });

    // 设置文章标题
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TITLE,
      payload: article.title,
    });

    // 设置从历史记录进入的标志
    dispatch({
      type: ArticleActionType.SET_FROM_HISTORY,
      payload: true,
    });

    // 处理文本
    dispatch({ type: ArticleActionType.PROCESS_TEXT });

    // 重置当前单词索引，确保从第一个单词开始
    dispatch({ type: ArticleActionType.SET_CURRENT_WORD_INDEX, payload: 0 });

    // 退出历史记录视图
    dispatch({
      type: ArticleActionType.SET_VIEW_HISTORY,
      payload: false,
    });

    // 直接进入练习步骤
    dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
  };

  // 编辑文章
  const handleEditArticle = (article: CustomArticle) => {
    setEditingArticle(article);
    setEditDialogOpen(true);
  };

  // 删除文章
  const handleDeleteArticle = async (id: number) => {
    if (window.confirm(t("history.deleteConfirm"))) {
      const success = await deleteArticle(id);
      if (success) {
        refreshArticles();
      } else {
        alert(t("history.deleteError"));
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
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold truncate mr-2">
                {article.title}
              </h3>
              {article.isOfficial && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tCommon("status.official")}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">
              {tCommon("time.created")}:{" "}
              {timeStamp2String(article.createdAt / 1000)}
            </p>
            <p className="text-sm text-gray-500">
              {tCommon("time.lastPracticed")}:{" "}
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
              {tCommon("buttons.practice")}
            </button>
            {!article.isOfficial && (
              <button
                type="button"
                className="my-btn-secondary text-sm"
                onClick={() => handleEditArticle(article)}
                title={t("history.editTooltip")}
              >
                {tCommon("buttons.edit")}
              </button>
            )}
            <button
              type="button"
              className="my-btn-secondary text-sm"
              onClick={() => handleDeleteArticle(article.id!)}
              disabled={article.isOfficial} // 官方文章不允许删除
              title={
                article.isOfficial
                  ? t("history.deleteTooltipOfficial")
                  : t("history.deleteTooltip")
              }
            >
              {tCommon("buttons.delete")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染用户自定义文章空状态
  const renderUserEmpty = () => (
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
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {t("history.emptyUser")}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{t("history.emptyUserDesc")}</p>
      <div className="mt-6">
        <button type="button" className="my-btn-primary" onClick={handleBack}>
          {tCommon("buttons.create")}
        </button>
      </div>
    </div>
  );

  // 渲染官方文章空状态
  const renderOfficialEmpty = () => (
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
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {t("history.emptyOfficial")}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {t("history.emptyOfficialDesc")}
      </p>
      <div className="mt-6">
        <button type="button" className="my-btn-primary" onClick={handleBack}>
          {tCommon("buttons.back")}
        </button>
      </div>
    </div>
  );

  // 渲染加载状态
  const renderLoading = () => (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">{tCommon("status.loading")}</p>
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <div className="text-center py-10 text-red-500">
      <p>
        {t("history.loadError")}: {error?.message}
      </p>
      <button
        type="button"
        className="my-btn-secondary mt-4"
        onClick={refreshArticles}
      >
        {tCommon("buttons.retry")}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("history.title")}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-by" className="text-sm text-gray-600">
              {tCommon("sort.label")}:
            </label>
            <select
              id="sort-by"
              className="text-sm border rounded py-1"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="lastPracticedAt">
                {tCommon("sort.lastPracticed")}
              </option>
              <option value="createdAt">{tCommon("sort.created")}</option>
            </select>
          </div>
          <button
            type="button"
            className="my-btn-secondary"
            onClick={handleBack}
          >
            {tCommon("buttons.back")}
          </button>
        </div>
      </div>

      {/* 使用Radix UI的Tabs组件 */}
      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="user" className="flex-1">
              {t("history.userArticles")} ({userArticles.length})
            </TabsTrigger>
            <TabsTrigger value="official" className="flex-1">
              {t("history.officialArticles")} ({officialArticles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="w-full">
            {userArticles.length === 0 ? (
              renderUserEmpty()
            ) : (
              <div className="w-full">
                {userArticles.map((article, index) =>
                  renderArticleItem(article, index)
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="official" className="w-full">
            {officialArticles.length === 0 ? (
              renderOfficialEmpty()
            ) : (
              <div className="w-full">
                {officialArticles.map((article, index) =>
                  renderArticleItem(article, index)
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 编辑文章弹窗 */}
      <EditArticleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        article={editingArticle || undefined}
        mode="edit"
      />
    </div>
  );
}
