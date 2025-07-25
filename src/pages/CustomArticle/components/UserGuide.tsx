import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation("article");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 标题栏 */}
        <div
          className="bg-blue-50 px-6 py-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {t("guide.customArticleTitle")}
            </h2>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* 内容区域 */}
        {isExpanded && (
          <div className="px-6 py-6 space-y-6">
            {/* 功能简介 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.introduction")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("guide.introText")}
              </p>
            </section>

            {/* 主要特点 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.features")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✨</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature1")}</strong> -
                    {t("guide.feature1Desc")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📝</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature2")}</strong> -{" "}
                    {t("guide.feature2Desc")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">🎯</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature3")}</strong> -{" "}
                    {t("guide.feature3Desc")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">🔊</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature4")}</strong> -{" "}
                    {t("guide.feature4Desc")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-500">💾</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature5")}</strong> -{" "}
                    {t("guide.feature5Desc")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">📊</span>
                  <span className="text-gray-700">
                    <strong>{t("guide.feature6")}</strong> -{" "}
                    {t("guide.feature6Desc")}
                  </span>
                </div>
              </div>
            </section>

            {/* 使用步骤 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.steps")}
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    {t("guide.step1")}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {t("guide.step1Desc")}
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    {t("guide.step2")}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {t("guide.step2Desc")}
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    {t("guide.step3")}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {t("guide.step3Desc")}
                  </p>
                </div>
              </div>
            </section>

            {/* 常见问题 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.faq")}
              </h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    {t("guide.faq1")}
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    {t("guide.faq1Answer")}
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    {t("guide.faq2")}
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    {t("guide.faq2Answer")}
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    {t("guide.faq3")}
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    {t("guide.faq3Answer")}
                  </p>
                </details>
              </div>
            </section>

            {/* 小贴士 */}
            <section className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <h4 className="font-medium text-blue-800">
                    {t("guide.tips")}
                  </h4>
                  <p className="text-blue-700 text-sm mt-1">
                    {t("guide.tipsText")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
