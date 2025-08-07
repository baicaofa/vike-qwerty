import ArticleHistory from "./components/ArticleHistory";
import ArticlePractice from "./components/ArticlePractice";
import UserGuide from "./components/UserGuide";
import { useArticleList } from "./hooks/useArticleList";
import { ArticleContext, articleReducer, initialState } from "./store";
import { ArticleActionType } from "./store/type";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { getRandomArticle } from "@/data/officialArticles";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useImmerReducer } from "use-immer";

export function Page() {
  // 使用 useImmerReducer 管理状态
  const [state, dispatch] = useImmerReducer(articleReducer, initialState);
  const { articles, isLoading } = useArticleList();

  // 使用i18n翻译
  const { t } = useTranslation("article");

  // 页面加载时，加载最近的文章或默认文章，并直接进入练习步骤
  useEffect(() => {
    // 如果已经有文章内容或者正在显示历史记录，不需要加载
    if (
      state.articleText.trim().length > 0 ||
      state.viewHistory ||
      state.fromHistory
    ) {
      // 如果有文章内容但不是从历史记录进入，确保直接进入练习步骤
      if (
        state.articleText.trim().length > 0 &&
        !state.viewHistory &&
        !state.fromHistory
      ) {
        dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
      }
      return;
    }

    // 如果正在加载历史记录，等待加载完成
    if (isLoading) {
      return;
    }

    // 如果有历史记录，加载最近的一篇文章
    if (articles.length > 0) {
      const latestArticle = articles[0]; // 文章已按最近练习时间排序
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TEXT,
        payload: latestArticle.content,
      });

      // 设置文章标题
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TITLE,
        payload: latestArticle.title,
      });

      // 处理文本
      dispatch({ type: ArticleActionType.PROCESS_TEXT });

      // 直接进入练习步骤
      dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
      return;
    }

    // 如果没有历史记录，加载一篇随机推荐文章
    const randomArticle = getRandomArticle();
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TEXT,
      payload: randomArticle.content,
    });

    // 设置文章标题
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TITLE,
      payload: randomArticle.title,
    });

    // 处理文本
    dispatch({ type: ArticleActionType.PROCESS_TEXT });

    // 直接进入练习步骤
    dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
  }, [
    articles,
    isLoading,
    dispatch,
    state.articleText,
    state.viewHistory,
    state.fromHistory,
  ]);

  // 渲染内容
  const renderContent = () => {
    // 如果显示保存的文章列表
    if (state.viewHistory) {
      return <ArticleHistory />;
    }

    // 直接显示练习页面
    return <ArticlePractice />;
  };

  // 渲染标题
  const renderTitle = () => {
    if (state.viewHistory) {
      return (
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold">
            {t("history.title", "文章历史")}
          </h1>
        </div>
      );
    }
  };

  return (
    <ArticleContext.Provider value={{ state, dispatch }}>
      <Layout>
        <Header />

        <div className="container mx-auto py-8 px-4">
          {renderTitle()}
          {renderContent()}
        </div>

        {/* 使用指南 - 只在非历史记录视图中显示 */}
        {!state.viewHistory && <UserGuide />}
      </Layout>
    </ArticleContext.Provider>
  );
}
