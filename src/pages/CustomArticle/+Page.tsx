import ArticleHistory from "./components/ArticleHistory";
import ArticleInput from "./components/ArticleInput";
import ArticlePractice from "./components/ArticlePractice";
import ArticlePreprocess from "./components/ArticlePreprocess";
import UserGuide from "./components/UserGuide";
import { ArticleContext, articleReducer, initialState } from "./store";
import { ArticleActionType } from "./store/type";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { useImmerReducer } from "use-immer";

export function Page() {
  // 使用 useImmerReducer 管理状态
  const [state, dispatch] = useImmerReducer(articleReducer, initialState);

  // 显示保存的文章
  const handleViewHistory = () => {
    dispatch({ type: ArticleActionType.SET_VIEW_HISTORY, payload: true });
  };

  // 根据当前步骤渲染对应组件
  const renderStep = () => {
    // 如果显示保存的文章列表
    if (state.viewHistory) {
      return <ArticleHistory />;
    }

    // 正常的步骤流程
    switch (state.currentStep) {
      case 1:
        return <ArticleInput />;
      case 2:
        return <ArticlePreprocess />;
      case 3:
        return <ArticlePractice />;
      default:
        return <ArticleInput />;
    }
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    // 在保存文章列表视图中不显示步骤指示器
    if (state.viewHistory) {
      return null;
    }

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {/* 第一步 */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              state.currentStep === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${
              state.currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>

          {/* 第二步 */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              state.currentStep === 2
                ? "bg-blue-600 text-white"
                : state.currentStep > 2
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`w-16 h-1 ${
              state.currentStep > 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>

          {/* 第三步 */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              state.currentStep === 3 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
        </div>
      </div>
    );
  };

  // 渲染步骤标题
  const renderStepTitle = () => {
    if (state.viewHistory) {
      return (
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold">自定义文章练习</h1>
        </div>
      );
    }

    const titles = ["添加文本", "文本预处理", "开始练习"];
    return (
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold">
          自定义文章练习 - {titles[state.currentStep - 1]}
        </h1>
      </div>
    );
  };

  return (
    <ArticleContext.Provider value={{ state, dispatch }}>
      <Layout>
        <Header>
          <div className="flex-1 flex justify-end">
            {/* 移除原来的保存文章按钮，改为悬浮按钮 */}
          </div>
        </Header>
        <div className="container mx-auto py-8 px-4">
          {renderStepTitle()}
          {renderStepIndicator()}
          {renderStep()}
        </div>

        {/* 使用指南 - 只在非历史记录视图中显示 */}
        {!state.viewHistory && <UserGuide />}

        {/* 悬浮的保存文章按钮 */}
        {!state.viewHistory && (
          <button
            type="button"
            className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-200 z-50 flex items-center space-x-2"
            onClick={handleViewHistory}
            title="查看保存的文章"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium">保存的文章</span>
          </button>
        )}
      </Layout>
    </ArticleContext.Provider>
  );
}
