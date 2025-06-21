import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

/**
 * 复习统计数据接口
 */
export interface ReviewStatsData {
  accuracy: number; // 准确率 (0-100)
  averageTime: number; // 平均用时 (毫秒)
  currentStreak: number; // 当前连击数
  maxStreak: number; // 最大连击数
  progress: number; // 进度 (0-1)
  correctCount: number; // 正确数量
  incorrectCount: number; // 错误数量
  totalCount: number; // 总数量
  totalTime: number; // 总用时
}

/**
 * 单词完成结果接口
 */
export interface WordResult {
  word: string;
  isCorrect: boolean;
  responseTime: number;
  timestamp: number;
}

/**
 * 复习统计Hook
 * 管理复习过程中的实时统计数据
 */
export function useReviewStats(totalWords: number) {
  const [results, setResults] = useState<WordResult[]>([]);

  // 使用防抖优化频繁更新，避免影响打字体验
  const debouncedUpdateStats = useDebouncedCallback(
    (newResults: WordResult[]) => {
      setResults(newResults);
    },
    100 // 100ms防抖
  );

  // 计算统计数据 - 使用useMemo优化性能
  const stats: ReviewStatsData = useMemo(() => {
    const totalCount = results.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const incorrectCount = totalCount - correctCount;

    // 准确率计算
    const accuracy =
      totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    // 平均用时计算
    const totalTime = results.reduce((sum, r) => sum + r.responseTime, 0);
    const averageTime = totalCount > 0 ? Math.round(totalTime / totalCount) : 0;

    // 连击数计算
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // 从最新的结果开始计算当前连击
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].isCorrect) {
        if (i === results.length - 1 || currentStreak > 0) {
          currentStreak++;
        }
      } else {
        break;
      }
    }

    // 计算最大连击
    for (const result of results) {
      if (result.isCorrect) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // 进度计算
    const progress = totalWords > 0 ? totalCount / totalWords : 0;

    return {
      accuracy,
      averageTime,
      currentStreak,
      maxStreak,
      progress,
      correctCount,
      incorrectCount,
      totalCount,
      totalTime,
    };
  }, [results, totalWords]);

  // 添加单词结果
  const addWordResult = useCallback(
    (result: Omit<WordResult, "timestamp">) => {
      const newResult: WordResult = {
        ...result,
        timestamp: Date.now(),
      };

      const newResults = [...results, newResult];

      // 使用防抖更新，避免频繁渲染
      debouncedUpdateStats(newResults);

      // 立即更新本地状态，确保后续调用能获取到最新数据
      setResults(newResults);
    },
    [results, debouncedUpdateStats]
  );

  // 重置统计
  const resetStats = useCallback(() => {
    setResults([]);
    debouncedUpdateStats.cancel(); // 取消待执行的防抖更新
  }, [debouncedUpdateStats]);

  // 获取最近N个结果
  const getRecentResults = useCallback(
    (count: number) => {
      return results.slice(-count);
    },
    [results]
  );

  // 获取准确率趋势（最近10个单词）
  const getAccuracyTrend = useCallback(() => {
    const recentResults = getRecentResults(10);
    if (recentResults.length === 0) return 0;

    const recentCorrect = recentResults.filter((r) => r.isCorrect).length;
    return Math.round((recentCorrect / recentResults.length) * 100);
  }, [getRecentResults]);

  // 获取速度趋势（最近5个单词的平均用时）
  const getSpeedTrend = useCallback(() => {
    const recentResults = getRecentResults(5);
    if (recentResults.length === 0) return 0;

    const recentTotalTime = recentResults.reduce(
      (sum, r) => sum + r.responseTime,
      0
    );
    return Math.round(recentTotalTime / recentResults.length);
  }, [getRecentResults]);

  // 判断是否表现良好（准确率>80%且平均用时<3秒）
  const isPerformingWell = useMemo(() => {
    return stats.accuracy >= 80 && stats.averageTime <= 3000;
  }, [stats.accuracy, stats.averageTime]);

  // 获取表现等级
  const getPerformanceLevel = useCallback(() => {
    if (stats.totalCount < 3) return "warming-up"; // 热身中

    if (stats.accuracy >= 95 && stats.averageTime <= 2000) return "excellent";
    if (stats.accuracy >= 85 && stats.averageTime <= 3000) return "good";
    if (stats.accuracy >= 70 && stats.averageTime <= 4000) return "fair";
    return "needs-improvement";
  }, [stats.accuracy, stats.averageTime, stats.totalCount]);

  return {
    stats,
    results,
    addWordResult,
    resetStats,
    getRecentResults,
    getAccuracyTrend,
    getSpeedTrend,
    isPerformingWell,
    getPerformanceLevel,
  };
}

export default useReviewStats;
