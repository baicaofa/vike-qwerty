import ArticleInput from "./components/ArticleInput";
import ArticlePractice from "./components/ArticlePractice";
import ArticlePreprocess from "./components/ArticlePreprocess";
import { ArticleContext, articleReducer, initialState } from "./store";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { RecordDB } from "@/utils/db";
import { initArticleTable } from "@/utils/db/article";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";

export function Page() {
  // 使用 useImmerReducer 管理状态
  const [state, dispatch] = useImmerReducer(articleReducer, initialState);

  // 初始化数据库表
  useEffect(() => {
    const initDb = async () => {
      try {
        const db = new RecordDB();
        initArticleTable(db);
      } catch (error) {
        console.error("初始化文章数据库失败:", error);
      }
    };

    initDb();
  }, []);

  // 根据当前步骤渲染对应组件
  const renderStep = () => {
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
          <div className="flex-1"></div>
        </Header>
        <div className="container mx-auto py-8 px-4">
          {renderStepTitle()}
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </Layout>
    </ArticleContext.Provider>
  );
}
