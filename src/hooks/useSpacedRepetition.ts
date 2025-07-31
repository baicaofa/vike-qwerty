import { db } from "../utils/db";
import type { IReviewConfig } from "../utils/db/reviewConfig";
import type { IWordReviewRecord } from "../utils/db/wordReviewRecord";
import { toWordReviewRecord } from "../utils/db/wordReviewRecord";
import {
  areAllWordsPracticed,
  getPracticeStats,
  initializeTodayReviews,
} from "../utils/reviewRounds";
import {
  getReviewConfig,
  updateReviewConfig,
} from "../utils/spaced-repetition/config";
import {
  generateDailyReviewPlan,
  getDueWordsForReview,
  getReviewStatistics,
} from "../utils/spaced-repetition/scheduleGenerator";
import type {
  DailyReviewPlan,
  ReviewStatistics,
} from "../utils/spaced-repetition/scheduleGenerator";
import { useCallback, useEffect, useState } from "react";

/**
 * 复习计划Hook
 */
export function useReviewSchedule() {
  const [todayReviews, setTodayReviews] = useState<IWordReviewRecord[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<IWordReviewRecord[]>(
    []
  );
  const [overdueReviews, setOverdueReviews] = useState<IWordReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = Date.now();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // 获取今日需要复习的单词
      const dueWords = await getDueWordsForReview(undefined, "urgency");
      setTodayReviews(dueWords);

      // 获取所有单词复习记录
      const allWordReviews = await db.wordReviewRecords.toArray();

      // 筛选逾期单词
      const overdue = allWordReviews.filter(
        (record) =>
          record.nextReviewAt < now &&
          record.nextReviewAt < todayStart.getTime()
      );
      setOverdueReviews(overdue);

      // 筛选即将到期的单词（未来3天内）
      const threeDaysLater = now + 3 * 24 * 60 * 60 * 1000;
      const upcoming = allWordReviews.filter(
        (record) =>
          record.nextReviewAt > todayEnd.getTime() &&
          record.nextReviewAt <= threeDaysLater
      );
      setUpcomingReviews(upcoming);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh schedule"
      );
      console.error("Failed to refresh review schedule:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSchedule();
  }, [refreshSchedule]);

  return {
    todayReviews,
    upcomingReviews,
    overdueReviews,
    loading,
    error,
    refreshSchedule,
  };
}

/**
 * 今日复习Hook
 * 简化版：去除轮次概念，保留练习次数管理
 */
export function useTodayReviews() {
  const [reviews, setReviews] = useState<IWordReviewRecord[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // 简化状态
  const [allPracticed, setAllPracticed] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    totalWords: 0,
    unpracticedWords: 0,
    practicedWords: 0,
    completionRate: 0,
  });

  const refreshTodayReviews = useCallback(async () => {
    try {
      setLoading(true);

      // 获取并初始化今日复习数据（包括重置每日练习计数）
      const todayWords = await initializeTodayReviews();
      setReviews(todayWords);
      setTotalCount(todayWords.length);

      // 计算是否所有单词已练习
      const allPracticed = areAllWordsPracticed(todayWords);
      setAllPracticed(allPracticed);

      // 计算练习统计
      const stats = getPracticeStats(todayWords);
      setPracticeStats(stats);

      // 计算已完成数量
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const completed = await db.reviewHistories
        .where("reviewedAt")
        .between(todayStart.getTime(), todayEnd.getTime())
        .count();

      setCompletedCount(completed);
      // 直接使用 todayWords.length 而不是状态中的 totalCount，避免循环依赖
      setProgress(
        todayWords.length > 0 ? (completed / todayWords.length) * 100 : 0
      );
    } catch (err) {
      console.error("Failed to refresh today reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []); // 移除 totalCount 依赖，避免无限循环

  useEffect(() => {
    refreshTodayReviews();
  }, [refreshTodayReviews]);

  return {
    reviews,
    completedCount,
    totalCount,
    progress,
    loading,
    refreshTodayReviews,
    // 简化后的状态
    allPracticed,
    practiceStats,
  };
}

/**
 * 单词复习状态Hook
 */
export function useWordReviewStatus(word: string) {
  const [reviewRecord, setReviewRecord] = useState<IWordReviewRecord | null>(
    null
  );
  const [intervalProgress, setIntervalProgress] = useState(0);
  const [nextReviewDate, setNextReviewDate] = useState<Date>(new Date());
  const [isReviewDue, setIsReviewDue] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      setLoading(true);

      const record = await db.wordReviewRecords
        .where("word")
        .equals(word)
        .first();

      if (record) {
        const wordRecord = toWordReviewRecord(record);
        setReviewRecord(wordRecord);

        // 简化的进度计算：基于间隔索引
        const progress = record.isGraduated
          ? 1
          : record.currentIntervalIndex / record.intervalSequence.length;
        setIntervalProgress(progress);

        setNextReviewDate(new Date(wordRecord.nextReviewAt));
        setIsReviewDue(wordRecord.isReviewDue());
      } else {
        setReviewRecord(null);
        setIntervalProgress(0);
        setNextReviewDate(new Date());
        setIsReviewDue(false);
      }
    } catch (err) {
      console.error("Failed to refresh word review status:", err);
    } finally {
      setLoading(false);
    }
  }, [word]);

  const updateAfterPractice = useCallback(async () => {
    if (!reviewRecord) return;

    try {
      // 这里可以调用同步函数来更新复习状态
      // 暂时先刷新状态
      await refreshStatus();
    } catch (err) {
      console.error("Failed to update after practice:", err);
      throw err;
    }
  }, [reviewRecord, refreshStatus]);

  useEffect(() => {
    if (word) {
      refreshStatus();
    }
  }, [word, refreshStatus]);

  return {
    reviewRecord,
    intervalProgress,
    nextReviewDate,
    isReviewDue,
    loading,
    updateAfterPractice,
    refreshStatus,
  };
}

/**
 * 复习统计Hook
 */
export function useReviewStatistics(dateRange?: { start: Date; end: Date }) {
  const [stats, setStats] = useState<ReviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const statistics = await getReviewStatistics(dateRange);
      setStats(statistics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get statistics");
      console.error("Failed to get review statistics:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}

/**
 * 复习配置Hook
 */
export function useReviewConfig() {
  const [config, setConfig] = useState<IReviewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewConfig = await getReviewConfig();
      setConfig(reviewConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get config");
      console.error("Failed to get review config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (updates: Partial<IReviewConfig>) => {
    try {
      setError(null);

      const updatedConfig = await updateReviewConfig(updates);
      setConfig(updatedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update config");
      console.error("Failed to update review config:", err);
      throw err;
    }
  }, []);

  const resetConfig = useCallback(async () => {
    try {
      setError(null);

      // 删除现有配置，让系统重新创建默认配置
      await db.reviewConfigs.clear();
      const defaultConfig = await getReviewConfig();
      setConfig(defaultConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset config");
      console.error("Failed to reset review config:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  return {
    config,
    loading,
    error,
    updateConfig,
    resetConfig,
    refreshConfig,
  };
}

/**
 * 复习历史Hook
 */
export function useReviewHistory(timeRange = "30d") {
  const [history, setHistory] = useState<IWordReviewRecord[]>([]);
  const [stats, setStats] = useState<{
    totalReviews: number;
    averageAccuracy: number;
    studyDays: number;
    masteredWords: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 计算时间范围
      const now = Date.now();
      let startTime = 0;

      switch (timeRange) {
        case "7d":
          startTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case "30d":
          startTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
        case "90d":
          startTime = now - 90 * 24 * 60 * 60 * 1000;
          break;
        case "all":
        default:
          startTime = 0;
          break;
      }

      // 获取有复习记录的单词
      const allWords = await db.wordReviewRecords.toArray();
      const wordsWithHistory = allWords.filter(
        (word) =>
          (word.reviewHistory?.length > 0 || word.totalReviews > 0) &&
          (timeRange === "all" ||
            (word.reviewHistory &&
              word.reviewHistory.some((h) => h.timestamp >= startTime)) ||
            (word.lastReviewedAt && word.lastReviewedAt >= startTime))
      );

      setHistory(wordsWithHistory);

      // 计算统计数据
      const totalReviews = wordsWithHistory.reduce(
        (sum, word) =>
          sum +
          (word.reviewHistory?.filter((h) => h.timestamp >= startTime)
            ?.length ||
            word.totalReviews ||
            0),
        0
      );

      const correctReviews = wordsWithHistory.reduce(
        (sum, word) =>
          sum +
          (word.reviewHistory?.filter(
            (h) => h.timestamp >= startTime && h.isCorrect
          )?.length || 0),
        0
      );

      const averageAccuracy =
        totalReviews > 0
          ? Math.round((correctReviews / totalReviews) * 100)
          : 0;

      const studyDaysSet = new Set(
        wordsWithHistory.flatMap((word) => [
          ...(word.reviewHistory || [])
            .filter((h) => h.timestamp >= startTime)
            .map((h) => new Date(h.timestamp).toDateString()),
          ...(word.lastReviewedAt && word.lastReviewedAt >= startTime
            ? [new Date(word.lastReviewedAt).toDateString()]
            : []),
        ])
      );

      const masteredWords = wordsWithHistory.filter((word) => {
        const wordRecord = toWordReviewRecord(word);
        return (wordRecord as any).level >= 5; // 简化：等级5以上视为掌握
      }).length;

      setStats({
        totalReviews,
        averageAccuracy,
        studyDays: studyDaysSet.size,
        masteredWords,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
      console.error("Failed to load review history:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    history,
    stats,
    loading,
    error,
    refreshHistory,
  };
}

/**
 * 每日复习计划Hook
 */
export function useDailyReviewPlan(date?: Date) {
  const [plan, setPlan] = useState<DailyReviewPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewPlan = await generateDailyReviewPlan(date);
      setPlan(reviewPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
      console.error("Failed to generate daily review plan:", err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    refreshPlan();
  }, [refreshPlan]);

  return {
    plan,
    loading,
    error,
    refreshPlan,
  };
}
