import type { DailyReviewPlan } from "@/utils/spaced-repetition/scheduleGenerator";
import type React from "react";
import { useTranslation } from "react-i18next";

interface ReviewSummaryProps {
  plan?: DailyReviewPlan;
}

/**
 * 复习摘要组件
 * 显示今日复习计划的概览信息
 */
const ReviewSummary: React.FC<ReviewSummaryProps> = ({ plan }) => {
  const { t } = useTranslation();
  if (!plan) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t("review:summary.noData")}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {t("review:summary.todayOverview")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {plan.reviewWords.length}
          </p>
          <p className="text-sm text-gray-600">
            {t("review:summary.plannedReview")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {plan.urgentWords.length}
          </p>
          <p className="text-sm text-gray-600">
            {t("review:summary.urgentReview")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {plan.estimatedTime}
          </p>
          <p className="text-sm text-gray-600">
            {t("review:summary.estimatedTime")}
          </p>
        </div>
        <div className="text-center">
          <p
            className={`text-2xl font-bold ${
              plan.difficulty === "easy"
                ? "text-green-600"
                : plan.difficulty === "normal"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {plan.difficulty === "easy"
              ? t("review:summary.easy")
              : plan.difficulty === "normal"
              ? t("review:summary.normal")
              : t("review:summary.hard")}
          </p>
          <p className="text-sm text-gray-600">
            {t("review:summary.difficultyLevel")}
          </p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">{plan.loadRecommendation}</p>
      </div>
    </div>
  );
};

export default ReviewSummary;
