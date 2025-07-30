import ReviewProgressBar from "./components/ReviewProgressBar";
import ReviewSummary from "./components/ReviewSummary";
import WordCard from "./components/WordCard";
import { Link } from "@/components/ui/Link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useDailyReviewPlan,
  useTodayReviews,
} from "@/hooks/useSpacedRepetition";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import {
  areAllWordsPracticed,
  getPracticeStats,
  getPracticedWords,
  getUnpracticedWords,
  groupWordsByPracticeCount,
  initializeTodayReviews,
} from "@/utils/reviewRounds";
import { useTranslation } from "react-i18next";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

/**
 * 今日复习页面
 * 显示今天需要复习的单词，并按练习次数分组
 */
export default function ReviewTodayPage() {
  const { t } = useTranslation();
  const {
    reviews,
    completedCount,
    totalCount,
    progress,
    loading,
    refreshTodayReviews,
  } = useTodayReviews();
  const { plan } = useDailyReviewPlan();

  const [activeTab, setActiveTab] = useState<
    "all" | "unpracticed" | "practiced"
  >("all");

  // 按练习次数分组
  const groupedWords = useMemo(() => {
    return groupWordsByPracticeCount(reviews);
  }, [reviews]);

  // 获取未练习和已练习单词
  const unpracticedWords = useMemo(() => {
    return getUnpracticedWords(reviews);
  }, [reviews]);

  const practicedWords = useMemo(() => {
    return getPracticedWords(reviews);
  }, [reviews]);

  // 计算练习统计
  const stats = useMemo(() => {
    return getPracticeStats(reviews);
  }, [reviews]);

  // 检查是否所有单词都已练习
  const allWordsPracticed = useMemo(() => {
    return areAllWordsPracticed(reviews);
  }, [reviews]);

  // 渲染单词列表
  const renderWordList = () => {
    if (loading) {
      return <div className="text-center py-8">{t("review:status.loading")}</div>;
    }

    if (reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{t("review:today.noReviewToday")}</p>
        </div>
      );
    }

    // 根据当前选择的标签页过滤单词
    let displayWords: IWordReviewRecord[] = [];

    switch (activeTab) {
      case "unpracticed":
        displayWords = unpracticedWords;
        break;
      case "practiced":
        displayWords = practicedWords;
        break;
      case "all":
      default:
        displayWords = reviews;
        break;
    }

    if (displayWords.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">
            {activeTab === "unpracticed"
              ? t("review:today.noUnpracticedWords")
              : t("review:today.noPracticedWords")}
          </p>
        </div>
      );
    }

    if (activeTab === "all") {
      // 按照练习次数分组显示
      return (
        <div className="space-y-6">
          {Object.entries(groupedWords).map(([countStr, words]) => {
            const count = parseInt(countStr);

            return (
              <div key={countStr} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    {count === 0 ? t("review:today.unpracticed") : t("review:today.practicedCount", { count })}
                  </h3>
                  <Badge variant="outline">{words.length} {t("review:history.word")}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {words.map((word) => (
                    <WordCard
                      key={word.id}
                      word={word}
                      practiceCount={word.todayPracticeCount}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // 不分组显示（用于已练习/未练习标签页）
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            practiceCount={word.todayPracticeCount}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("review:today.title")}</h1>
        <div>
          <Button
            onClick={() => refreshTodayReviews()}
            size="sm"
            variant="outline"
            className="mr-2"
          >
            {t("common:buttons.refresh")}
          </Button>
          <Link href="/review/practice">
            <Button size="sm">{t("review:today.startTodayReview")}</Button>
          </Link>
        </div>
      </div>

      {/* 进度总览 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t("review:today.reviewProgress")}</h2>
          <Badge variant={progress >= 100 ? "default" : "outline"}>
            {completedCount}/{totalCount}
          </Badge>
        </div>

        <div className="mt-2">
          <ReviewProgressBar progress={progress} />
        </div>

        {/* 练习统计信息 */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">{t("review:stats.totalWords")}</p>
            <p className="text-xl font-bold">{stats.totalWords}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">{t("review:today.unpracticed")}</p>
            <p className="text-xl font-bold text-red-600">
              {stats.unpracticedWords}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">已练习</p>
            <p className="text-xl font-bold text-green-600">
              {stats.practicedWords}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">完成率</p>
            <p className="text-xl font-bold text-blue-600">
              {stats.completionRate}%
            </p>
          </div>
        </div>

        {/* 所有单词练习状态 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          {allWordsPracticed ? (
            <p className="text-green-600 font-medium">
              所有单词已完成至少一次练习! 你可以继续练习以加深记忆。
            </p>
          ) : (
            <p className="text-blue-600 font-medium">
              还有 {stats.unpracticedWords}{" "}
              个单词未练习，请先完成所有单词的第一次练习。
            </p>
          )}
        </div>

        {/* 练习入口 */}
        <div className="mt-4 flex justify-center">
          <Link
            href={
              allWordsPracticed
                ? "/review/practice?practiced=1"
                : "/review/practice"
            }
          >
            <Button>{allWordsPracticed ? "继续练习" : "开始练习"}</Button>
          </Link>
        </div>
      </div>

      {/* 复习计划概览 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <ReviewSummary plan={plan || undefined} />
      </div>

      {/* 单词分类标签页 */}
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            全部单词
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "unpracticed"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("unpracticed")}
          >
            未练习 ({unpracticedWords.length})
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "practiced"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("practiced")}
          >
            已练习 ({practicedWords.length})
          </button>
        </div>
      </div>

      {/* 单词列表 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {renderWordList()}
      </div>
    </div>
  );
}
