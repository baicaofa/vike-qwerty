import { useTodayReviews } from "../../hooks/useSpacedRepetition";
import { Link } from "@/components/Link";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";

interface ReviewStatusIndicatorProps {
  pageContext?: any;
}

export const ReviewStatusIndicator: React.FC<ReviewStatusIndicatorProps> = ({
  pageContext,
}) => {
  const { reviews, completedCount, totalCount, progress } = useTodayReviews();
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation("common");
  // 计算需要复习的单词数量
  const dueCount = reviews.filter((word) => {
    // 简化的复习判断：只基于时间
    return !word.isGraduated && Date.now() >= word.nextReviewAt;
  }).length;

  // 简化的紧急复习判断：逾期超过1天
  const urgentCount = reviews.filter((word) => {
    if (word.isGraduated) return false;
    const daysOverdue =
      (Date.now() - word.nextReviewAt) / (24 * 60 * 60 * 1000);
    return daysOverdue > 1;
  }).length;

  // 确定状态颜色
  const getStatusColor = () => {
    if (urgentCount > 0) return "bg-red-500"; // 有紧急复习
    if (dueCount > 0) return "bg-yellow-500"; // 有到期复习
    if (progress >= 100) return "bg-green-500"; // 已完成
    return "bg-gray-400"; // 无需复习
  };

  const getStatusText = () => {
    if (urgentCount > 0) return `${urgentCount}${t("reviewstatus.urgent")}`;
    if (dueCount > 0) return `${dueCount}${t("reviewstatus.due")}`;
    if (progress >= 100) return t("reviewstatus.completed");
    return t("reviewstatus.noReview");
  };

  const getStatusIcon = () => {
    if (urgentCount > 0) return "🚨";
    if (dueCount > 0) return "📚";
    if (progress >= 100) return "✅";
    return "🧠";
  };

  return (
    <div className="relative">
      {/* 主指示器 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-80 ${getStatusColor()}`}
        title={t("reviewstatus.clickForDetails")}
      >
        <span>{getStatusIcon()}</span>
        <span className="hidden md:inline">{getStatusText()}</span>
        {dueCount > 0 && (
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
            {dueCount}
          </span>
        )}
      </button>

      {/* 展开的详情面板 */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("reviewstatus.reviewStatus")}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* 今日进度 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>{t("reviewstatus.todayProgress")}</span>
                <span>
                  {completedCount} / {totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress.toFixed(1)}% {t("reviewstatus.completedText")}
              </div>
            </div>

            {/* 复习统计 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {totalCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {t("reviewstatus.plannedReview")}
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-bold text-red-600">
                  {urgentCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {t("reviewstatus.urgentReview")}
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="space-y-2">
              {dueCount > 0 ? (
                <Link
                  href="/review/today"
                  pageContext={pageContext}
                  className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  {t("reviewstatus.startReview", { count: dueCount })}
                </Link>
              ) : (
                <Link
                  href="/review/"
                  pageContext={pageContext}
                  className="block w-full bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  {t("reviewstatus.viewDashboard")}
                </Link>
              )}

              <div className="flex space-x-2">
                <Link
                  href="/review/"
                  pageContext={pageContext}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center py-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("reviewstatus.statistics")}
                </Link>
                <Link
                  href="/review/history"
                  pageContext={pageContext}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center py-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("reviewstatus.reviewHistory")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};
