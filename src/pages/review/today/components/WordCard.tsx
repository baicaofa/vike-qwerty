import { Badge } from "@/components/ui/badge";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import type React from "react";
import { useTranslation } from "react-i18next";

export interface WordCardProps {
  word: IWordReviewRecord;
  practiceCount?: number;
}

/**
 * 单词卡片组件
 * 显示单词复习信息
 */
const WordCard: React.FC<WordCardProps> = ({ word, practiceCount }) => {
  const { t } = useTranslation("review");
  const actualPracticeCount = practiceCount ?? word.todayPracticeCount ?? 0;

  // 简化的进度计算（使用固定的间隔序列长度）
  const maxIntervalIndex = 6; // 基于默认的 [1, 3, 7, 15, 30, 60] 序列
  const currentInterval = word.currentIntervalIndex || 0; // 防护性检查
  const progress = word.isGraduated ? 1 : currentInterval / maxIntervalIndex;

  // 判断是否需要复习
  const nextReviewAt = word.nextReviewAt || Date.now(); // 防护性检查
  const isReviewDue = !word.isGraduated && Date.now() >= nextReviewAt;

  // 计算优先级（基于逾期时间和间隔索引）
  const daysOverdue = Math.max(
    0,
    (Date.now() - nextReviewAt) / (24 * 60 * 60 * 1000)
  );
  const priority = daysOverdue * 100 + (10 - currentInterval) * 10;

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "border-red-200";
    if (priority >= 60) return "border-yellow-200";
    if (priority >= 40) return "border-blue-200";
    return "border-green-200";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.8) return "text-green-600";
    if (progress >= 0.6) return "text-blue-600";
    if (progress >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  // 简化背景色逻辑，基于练习次数
  const getBgColor = () => {
    if (actualPracticeCount > 0) return "bg-green-50";
    return "bg-white";
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${getPriorityColor(
        priority
      )} ${getBgColor()} hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{word.word}</h3>
        <div className="flex items-center space-x-2">
          {isReviewDue && (
            <Badge variant="destructive">{t("wordCard.due", "逾期")}</Badge>
          )}
          {word.isGraduated && (
            <Badge variant="success">{t("wordCard.graduated", "已毕业")}</Badge>
          )}
          {actualPracticeCount > 0 && (
            <Badge variant="secondary">
              {t("wordCard.practiceCount", "练习次数")}: {actualPracticeCount}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            {t("wordCard.reviewProgress", "复习进度")}:
          </span>
          <span className={`font-medium ${getProgressColor(progress)}`}>
            {isNaN(progress) ? "0" : (progress * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            {t("wordCard.priority", "优先级")}:
          </span>
          <span className="font-medium">
            {isNaN(priority) ? "0" : priority.toFixed(0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            {t("wordCard.nextReview", "下次复习")}:
          </span>
          <span className="font-medium text-xs">
            {word.isGraduated
              ? t("wordCard.completed", "已完成")
              : new Date(nextReviewAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {t("wordCard.totalReviews", "总复习次数")}: {word.totalReviews || 0} |{" "}
        {t("wordCard.intervalLevel", "间隔等级")}: {currentInterval}/
        {maxIntervalIndex}
      </div>
    </div>
  );
};

export default WordCard;
