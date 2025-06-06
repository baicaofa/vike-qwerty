import { useState } from "react";

export default function UserGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

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
              自定义文章功能使用指南
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
                功能简介
              </h3>
              <p className="text-gray-600 leading-relaxed">
                自定义文章功能允许您使用自己的文本内容进行练习，让您可以练习工作中常用的专业术语、学习材料或任何您感兴趣的文本内容。
              </p>
            </section>

            {/* 主要特点 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                主要特点
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✨</span>
                  <span className="text-gray-700">
                    <strong>完全本地化</strong> -
                    数据保存在浏览器中，不支持跨设备
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📝</span>
                  <span className="text-gray-700">
                    <strong>灵活输入</strong> - 支持最多3000字符
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">🎯</span>
                  <span className="text-gray-700">
                    <strong>智能处理</strong> - 可选择移除标点符号
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">🔊</span>
                  <span className="text-gray-700">
                    <strong>声音反馈</strong> - 可启用按键音效
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-500">💾</span>
                  <span className="text-gray-700">
                    <strong>便捷保存</strong> - 保存常用文章
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">📊</span>
                  <span className="text-gray-700">
                    <strong>实时统计</strong> - 显示速度和准确率
                  </span>
                </div>
              </div>
            </section>

            {/* 使用步骤 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                使用步骤
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    第一步：添加文本
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    在文本框中输入或粘贴您想要练习的内容（最多3000字符），可以是文章、代码、专业术语等任何文本。
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    第二步：文本预处理
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    选择是否移除标点符号、启用声音反馈，预览处理效果。如需重复练习，可点击&quot;保存文章&quot;。
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-800">
                    第三步：开始练习
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    按单词进行练习，实时显示速度、准确率。支持暂停、继续、重新开始等操作。
                  </p>
                </div>
              </div>
            </section>

            {/* 常见问题 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                常见问题
              </h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    我的文章数据会丢失吗？
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    文章数据保存在浏览器的本地存储中，只要不清除浏览器数据就不会丢失。切换浏览器、其他设备访问会丢失。
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    可以练习代码吗？
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    可以！建议开启&quot;移除标点符号&quot;选项来专注于代码中的关键词练习。
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium">
                    后续可以支持云端保存吗？
                  </summary>
                  <p className="text-gray-600 text-sm mt-2 pl-4">
                    可能会在后续版本中支持云端保存，敬请期待。
                  </p>
                </details>
              </div>
            </section>

            {/* 小贴士 */}
            <section className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <h4 className="font-medium text-blue-800">小贴士</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    自定义文章功能特别适合练习专业领域的术语、准备考试材料或提高特定内容的熟练度。
                    练习时不区分大小写，输入错误会自动重置，让您专注于提高打字速度和准确性。
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
