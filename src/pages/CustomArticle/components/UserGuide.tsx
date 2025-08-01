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

            {/* 主要功能 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.mainFeatures")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Word文档上传 */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600 text-xl">📄</span>
                    <h4 className="font-semibold text-blue-800">
                      {t("guide.wordUpload")}
                    </h4>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {t("guide.wordUploadDesc")}
                  </p>
                </div>

                {/* 文章编辑 */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600 text-xl">✏️</span>
                    <h4 className="font-semibold text-green-800">
                      {t("guide.articleEdit")}
                    </h4>
                  </div>
                  <p className="text-green-700 text-sm">
                    {t("guide.articleEditDesc")}
                  </p>
                </div>

                {/* 标点符号控制 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-purple-600 text-xl">🎯</span>
                    <h4 className="font-semibold text-purple-800">
                      {t("guide.punctuationControl")}
                    </h4>
                  </div>
                  <p className="text-purple-700 text-sm">
                    {t("guide.punctuationControlDesc")}
                  </p>
                </div>

                {/* 实时练习 */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-orange-600 text-xl">⚡</span>
                    <h4 className="font-semibold text-orange-800">
                      {t("guide.realTimePractice")}
                    </h4>
                  </div>
                  <p className="text-orange-700 text-sm">
                    {t("guide.realTimePracticeDesc")}
                  </p>
                </div>
              </div>
            </section>

            {/* 使用步骤 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.howToUse")}
              </h3>
              <div className="space-y-4">
                {/* 步骤1：上传文章 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <h4 className="font-medium text-gray-800">
                      {t("guide.step1Title")}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("guide.step1Desc")}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>{t("guide.tip")}:</strong> {t("guide.step1Tip")}
                  </div>
                </div>

                {/* 步骤2：开始练习 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <h4 className="font-medium text-gray-800">
                      {t("guide.step2Title")}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("guide.step2Desc")}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>{t("guide.tip")}:</strong> {t("guide.step2Tip")}
                  </div>
                </div>

                {/* 步骤3：调整设置 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <h4 className="font-medium text-gray-800">
                      {t("guide.step3Title")}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t("guide.step3Desc")}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>{t("guide.tip")}:</strong> {t("guide.step3Tip")}
                  </div>
                </div>
              </div>
            </section>

            {/* 高级功能 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.advancedFeatures")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">🔧</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {t("guide.advanced1")}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t("guide.advanced1Desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">📊</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {t("guide.advanced2")}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t("guide.advanced2Desc")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">🎵</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {t("guide.advanced3")}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t("guide.advanced3Desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">💾</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {t("guide.advanced4")}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t("guide.advanced4Desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 常见问题 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t("guide.faq")}
              </h3>
              <div className="space-y-3">
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer p-3 text-gray-700 hover:text-blue-600 font-medium bg-gray-50 rounded-t-lg group-open:bg-blue-50">
                    {t("guide.faq1")}
                  </summary>
                  <div className="p-3 bg-white rounded-b-lg">
                    <p className="text-gray-600 text-sm">
                      {t("guide.faq1Answer")}
                    </p>
                  </div>
                </details>
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer p-3 text-gray-700 hover:text-blue-600 font-medium bg-gray-50 rounded-t-lg group-open:bg-blue-50">
                    {t("guide.faq2")}
                  </summary>
                  <div className="p-3 bg-white rounded-b-lg">
                    <p className="text-gray-600 text-sm">
                      {t("guide.faq2Answer")}
                    </p>
                  </div>
                </details>
                <details className="group border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer p-3 text-gray-700 hover:text-blue-600 font-medium bg-gray-50 rounded-t-lg group-open:bg-blue-50">
                    {t("guide.faq3")}
                  </summary>
                  <div className="p-3 bg-white rounded-b-lg">
                    <p className="text-gray-600 text-sm">
                      {t("guide.faq3Answer")}
                    </p>
                  </div>
                </details>
              </div>
            </section>

            {/* 使用技巧 */}
            <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {t("guide.proTips")}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <p className="text-yellow-700">{t("guide.proTip1")}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <p className="text-yellow-700">{t("guide.proTip2")}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <p className="text-yellow-700">{t("guide.proTip3")}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">•</span>
                      <p className="text-yellow-700">{t("guide.proTip4")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 支持格式 */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">
                {t("guide.supportedFormats")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">.docx (推荐)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⚠</span>
                  <span className="text-gray-700">.doc (部分支持)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📝</span>
                  <span className="text-gray-700">
                    {t("guide.manualInput")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t("guide.formatNote")}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
