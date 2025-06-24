import { db } from "../db";
import type { IReviewConfig } from "../db/reviewConfig";
import { ReviewHistory } from "../db/reviewHistory";
import type { IWordReviewRecord } from "../db/wordReviewRecord";
import { toWordReviewRecord } from "../db/wordReviewRecord";
import { getReviewConfig } from "./config";
import { AlgorithmUtils } from "./index";
import { filterDueWords, filterUrgentWords } from "./priorityCalculator";

/**
 * 复习优先级类型
 */
export type ReviewPriorityType = "urgency" | "difficulty" | "random";

/**
 * 复习统计接口
 */
export interface ReviewStatistics {
  totalWords: number;
  reviewedToday: number;
  dueWords: number;
  urgentWords: number;
  overdueWords: number;
  averageMemoryStrength: number;
  completionRate: number;
  streakDays: number;
  weeklyProgress: {
    date: string;
    reviewed: number;
    target: number;
    accuracy: number;
  }[];
  monthlyStats: {
    totalReviews: number;
    averageAccuracy: number;
    timeSpent: number;
    wordsLearned: number;
  };
}

/**
 * 每日复习计划接口
 */
export interface DailyReviewPlan {
  date: string;
  totalWords: number;
  urgentWords: IWordReviewRecord[];
  normalWords: IWordReviewRecord[];
  reviewWords: IWordReviewRecord[];
  targetCount: number;
  estimatedTime: number; // 预估时间（分钟）
  difficulty: "easy" | "normal" | "hard";
  loadRecommendation: string;
}

/**
 * 生成每日复习计划
 *
 * @param date 目标日期
 * @param config 复习配置
 * @returns 每日复习计划
 */
export async function generateDailyReviewPlan(
  date: Date = new Date(),
  config?: IReviewConfig
): Promise<DailyReviewPlan> {
  try {
    // 获取配置
    const reviewConfig = config || (await getReviewConfig());

    // 获取所有单词复习记录
    const allWordReviews = await db.wordReviewRecords.toArray();

    // 筛选需要复习的单词
    const dueWords = filterDueWords(
      allWordReviews,
      date.getTime(),
      reviewConfig
    );
    const urgentWords = filterUrgentWords(
      allWordReviews,
      date.getTime(),
      reviewConfig
    );

    // 简化：直接使用到期单词作为推荐单词
    const recommendedWords = dueWords;

    // 简化：按逾期时间排序
    const sortedWords = recommendedWords.sort((a, b) => {
      // 优先级：逾期时间越长，优先级越高
      const aDaysOverdue = Math.max(
        0,
        (date.getTime() - a.nextReviewAt) / (24 * 60 * 60 * 1000)
      );
      const bDaysOverdue = Math.max(
        0,
        (date.getTime() - b.nextReviewAt) / (24 * 60 * 60 * 1000)
      );
      return bDaysOverdue - aDaysOverdue;
    });

    // 分离紧急和普通单词
    const urgentReviewWords = sortedWords
      .filter((word) => urgentWords.includes(word))
      .slice(0, Math.ceil(reviewConfig.dailyReviewTarget * 0.3));

    const normalReviewWords = sortedWords
      .filter((word) => !urgentWords.includes(word))
      .slice(0, reviewConfig.dailyReviewTarget - urgentReviewWords.length);

    // 简化负载计算
    const totalReviewWords =
      urgentReviewWords.length + normalReviewWords.length;
    const loadPercentage =
      (totalReviewWords / reviewConfig.dailyReviewTarget) * 100;

    // 预估复习时间（每个单词平均3分钟）
    const estimatedTime = Math.round(recommendedWords.length * 3);

    // 确定难度等级
    let difficulty: "easy" | "normal" | "hard" = "normal";
    if (loadPercentage < 50) {
      difficulty = "easy";
    } else if (loadPercentage > 150) {
      difficulty = "hard";
    }

    return {
      date: date.toISOString().split("T")[0],
      totalWords: allWordReviews.length,
      urgentWords: urgentReviewWords,
      normalWords: normalReviewWords,
      reviewWords: [...urgentReviewWords, ...normalReviewWords],
      targetCount: reviewConfig.dailyReviewTarget,
      estimatedTime,
      difficulty,
      loadRecommendation:
        urgentReviewWords.length > normalReviewWords.length
          ? "今日复习量较重，建议专注于重要单词的复习"
          : "今日复习量适中，保持当前的学习节奏",
    };
  } catch (error) {
    console.error("Failed to generate daily review plan:", error);
    throw error;
  }
}

/**
 * 更新单词复习计划
 *
 * @param wordReviewRecord 单词复习记录
 * @param config 复习配置
 */
export async function updateWordReviewSchedule(
  wordReviewRecord: IWordReviewRecord,
  config?: IReviewConfig
): Promise<void> {
  try {
    // 更新数据库中的记录
    if (wordReviewRecord.id) {
      await db.wordReviewRecords.update(wordReviewRecord.id, {
        nextReviewAt: wordReviewRecord.nextReviewAt,
        currentIntervalIndex: wordReviewRecord.currentIntervalIndex,
        totalReviews: wordReviewRecord.totalReviews,
        todayReviewCount: wordReviewRecord.todayReviewCount,
        isGraduated: wordReviewRecord.isGraduated,
        lastReviewDate: wordReviewRecord.lastReviewDate,
        sync_status:
          wordReviewRecord.sync_status === "synced"
            ? "local_modified"
            : wordReviewRecord.sync_status,
        last_modified: Date.now(),
      });
    }
  } catch (error) {
    console.error("Failed to update word review schedule:", error);
    throw error;
  }
}

/**
 * 获取复习统计
 *
 * @param dateRange 日期范围
 * @returns 复习统计
 */
export async function getReviewStatistics(
  dateRange: { start: Date; end: Date } = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
    end: new Date(),
  }
): Promise<ReviewStatistics> {
  try {
    const startTime = dateRange.start.getTime();
    const endTime = dateRange.end.getTime();
    const todayStart = AlgorithmUtils.getTodayStart();
    const todayEnd = AlgorithmUtils.getTodayEnd();

    // 获取所有单词复习记录
    const allWordReviews = await db.wordReviewRecords.toArray();

    // 获取复习历史记录
    const reviewHistories = await db.reviewHistories
      .where("reviewedAt")
      .between(startTime, endTime)
      .toArray();

    // 获取今日复习记录
    const todayReviews = await db.reviewHistories
      .where("reviewedAt")
      .between(todayStart, todayEnd)
      .toArray();

    // 计算基础统计
    const totalWords = allWordReviews.length;
    const reviewedToday = todayReviews.length;
    const dueWords = filterDueWords(allWordReviews).length;
    const urgentWords = filterUrgentWords(allWordReviews).length;
    const overdueWords = allWordReviews.filter(
      (record) => Date.now() > record.nextReviewAt
    ).length;

    // 计算平均复习进度（基于间隔索引）
    const totalProgress = allWordReviews.reduce((sum, record) => {
      if (record.isGraduated) return sum + 1;
      // 使用固定的间隔序列长度
      const maxIntervalIndex = 6; // 基于默认的 [1, 3, 7, 15, 30, 60] 序列
      return sum + record.currentIntervalIndex / maxIntervalIndex;
    }, 0);
    const averageProgress = totalWords > 0 ? totalProgress / totalWords : 0;

    // 计算完成率
    const config = await getReviewConfig();
    const completionRate =
      config.dailyReviewTarget > 0
        ? Math.min(100, (reviewedToday / config.dailyReviewTarget) * 100)
        : 0;

    // 计算连续天数
    const streakDays = await calculateStreakDays();

    // 生成周进度
    const weeklyProgress = await generateWeeklyProgress();

    // 计算月度统计
    const monthlyStats = await calculateMonthlyStats(reviewHistories);

    return {
      totalWords,
      reviewedToday,
      dueWords,
      urgentWords,
      overdueWords,
      averageMemoryStrength: averageProgress,
      completionRate,
      streakDays,
      weeklyProgress,
      monthlyStats,
    };
  } catch (error) {
    console.error("Failed to get review statistics:", error);
    throw error;
  }
}

/**
 * 获取需要复习的单词
 *
 * @param limit 限制数量
 * @param priorityOrder 优先级排序方式
 * @returns 需要复习的单词列表
 */
export async function getDueWordsForReview(
  limit?: number,
  priorityOrder: ReviewPriorityType = "urgency"
): Promise<IWordReviewRecord[]> {
  try {
    const allWordReviews = await db.wordReviewRecords.toArray();
    const config = await getReviewConfig();

    // 筛选需要复习的单词
    const dueWords = filterDueWords(allWordReviews, Date.now(), config);

    // 简化排序：按逾期时间排序
    const sortedWords = dueWords.sort((a, b) => {
      const aDaysOverdue = Math.max(
        0,
        (Date.now() - a.nextReviewAt) / (24 * 60 * 60 * 1000)
      );
      const bDaysOverdue = Math.max(
        0,
        (Date.now() - b.nextReviewAt) / (24 * 60 * 60 * 1000)
      );
      return bDaysOverdue - aDaysOverdue;
    });

    // 应用限制
    const limitedWords = limit ? sortedWords.slice(0, limit) : sortedWords;

    return limitedWords;
  } catch (error) {
    console.error("Failed to get due words for review:", error);
    throw error;
  }
}

/**
 * 同步WordRecord变化到WordReviewRecord
 * 当用户练习单词时，自动更新复习状态
 *
 * @param word 单词
 * @param dict 词典
 * @param practiceResult 练习结果
 */
export async function syncWordPracticeToReview(
  word: string,
  dict: string,
  practiceResult: {
    isCorrect: boolean;
    responseTime: number;
    timestamp: number;
  }
): Promise<void> {
  try {
    // 查找对应的WordReviewRecord
    let wordReviewRecord = await db.wordReviewRecords
      .where("word")
      .equals(word)
      .first();

    if (!wordReviewRecord) {
      // 如果不存在，创建新的复习记录
      const config = await getReviewConfig();
      const { WordReviewRecord } = await import("../db/wordReviewRecord");

      wordReviewRecord = new WordReviewRecord(
        word,
        [dict],
        dict,
        config.baseIntervals,
        practiceResult.timestamp
      );

      await db.wordReviewRecords.add(wordReviewRecord);
      console.log(`Created new review record for word: ${word}`);
    } else {
      // 更新现有记录的词典信息
      if (!wordReviewRecord.sourceDicts.includes(dict)) {
        wordReviewRecord.sourceDicts.push(dict);

        // 更新同步状态
        if (wordReviewRecord.sync_status === "synced") {
          wordReviewRecord.sync_status = "local_modified";
        }
        wordReviewRecord.last_modified = Date.now();

        // 保存更新
        if (wordReviewRecord.id) {
          await db.wordReviewRecords.update(wordReviewRecord.id, {
            sourceDicts: wordReviewRecord.sourceDicts,
            sync_status: wordReviewRecord.sync_status,
            last_modified: wordReviewRecord.last_modified,
          });
        }
      }

      console.log(`Updated existing review record for word: ${word}`);
    }
  } catch (error) {
    console.error("Failed to sync word practice to review:", error);
    throw error;
  }
}

/**
 * 简化的复习完成函数
 * 用于在复习页面直接调用，推进单词的复习间隔
 *
 * @param word 单词
 * @param timestamp 复习时间戳
 * @param isFirstReviewOfRound 是否为当前轮次的首次复习，默认为true
 * @param reviewResult 复习结果，"correct"或"incorrect"，默认为"correct"
 * @param responseTime 响应时间(毫秒)，默认为2000ms
 */
export async function completeWordReview(
  word: string,
  timestamp: number = Date.now(),
  isFirstReviewOfRound = true,
  reviewResult: "correct" | "incorrect" = "correct",
  responseTime: number = 2000
): Promise<void> {
  try {
    // 查找对应的WordReviewRecord
    const wordReviewRecord = await db.wordReviewRecords
      .where("word")
      .equals(word)
      .first();

    if (!wordReviewRecord) {
      console.warn(`No review record found for word: ${word}`);
      return;
    }

    // 转换为类实例并完成复习
    const { toWordReviewRecord } = await import("../db/wordReviewRecord");
    const wordRecord = toWordReviewRecord(wordReviewRecord);

    // 保存复习前的间隔索引和进度
    const intervalIndexBefore = wordRecord.currentIntervalIndex;
    // 简化的进度计算：基于间隔索引
    const intervalProgressBefore = wordRecord.isGraduated
      ? 1
      : wordRecord.currentIntervalIndex / wordRecord.intervalSequence.length;

    if (isFirstReviewOfRound) {
      // 首次复习，完全更新（包括间隔推进）
      wordRecord.completeReview(timestamp);
    } else {
      // 重复练习，只更新练习次数和时间戳
      if (wordRecord.todayPracticeCount === undefined) {
        wordRecord.todayPracticeCount = 0;
      }
      wordRecord.todayPracticeCount++;
      wordRecord.lastPracticedAt = timestamp;
      wordRecord.last_modified = Date.now();
    }

    // 保存到数据库
    await updateWordReviewSchedule(wordRecord);

    // 计算复习后的间隔进度
    const intervalProgressAfter = wordRecord.isGraduated
      ? 1
      : wordRecord.currentIntervalIndex / wordRecord.intervalSequence.length;

    // 创建复习历史记录
    if (isFirstReviewOfRound) {
      const reviewHistory = new ReviewHistory(
        wordRecord.id || 0,
        word,
        wordRecord.preferredDict || "",
        reviewResult,
        responseTime,
        intervalProgressBefore,
        intervalProgressAfter,
        intervalIndexBefore,
        wordRecord.currentIntervalIndex,
        "scheduled"
      );

      // 保存复习历史记录到数据库
      await db.reviewHistories.add(reviewHistory);
    }

    console.log(
      `Completed review for word: ${word}, new interval index: ${wordRecord.currentIntervalIndex}`
    );
  } catch (error) {
    console.error("Failed to complete word review:", error);
    throw error;
  }
}

/**
 * 重置所有单词的今日复习计数
 * 应该在每天开始时调用
 */
export async function resetDailyReviewCounts(): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 查找所有需要重置的记录（lastReviewDate不是今天的）
    const allRecords = await db.wordReviewRecords.toArray();
    const recordsToReset = allRecords.filter(
      (record) => record.lastReviewDate !== today && record.todayReviewCount > 0
    );

    // 批量重置
    for (const record of recordsToReset) {
      await db.wordReviewRecords.update(record.id!, {
        todayReviewCount: 0,
        last_modified: Date.now(),
      });
    }

    console.log(`Reset daily review counts for ${recordsToReset.length} words`);
  } catch (error) {
    console.error("Failed to reset daily review counts:", error);
    throw error;
  }
}

// 辅助函数

/**
 * 获取负载建议文本
 */
function getLoadRecommendation(recommendation: string): string {
  const recommendations = {
    light: "今日复习量较轻，可以考虑增加一些新单词的学习",
    normal: "今日复习量适中，保持当前的学习节奏",
    heavy: "今日复习量较重，建议专注于重要单词的复习",
    overwhelming: "今日复习量过大，建议分批进行或调整学习计划",
  };

  return (
    recommendations[recommendation as keyof typeof recommendations] ||
    recommendations.normal
  );
}

/**
 * 计算连续学习天数
 */
async function calculateStreakDays(): Promise<number> {
  try {
    let streakDays = 0;
    const currentDate = new Date();

    // 从今天开始往前检查
    while (streakDays < 365) {
      // 最多检查一年
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayReviews = await db.reviewHistories
        .where("reviewedAt")
        .between(dayStart.getTime(), dayEnd.getTime())
        .count();

      if (dayReviews > 0) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streakDays;
  } catch (error) {
    console.error("Failed to calculate streak days:", error);
    return 0;
  }
}

/**
 * 生成周进度数据
 */
async function generateWeeklyProgress(): Promise<
  Array<{
    date: string;
    reviewed: number;
    target: number;
    accuracy: number;
  }>
> {
  try {
    const config = await getReviewConfig();
    const weeklyProgress = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // 获取当天的所有复习记录
      const dayReviews = await db.reviewHistories
        .where("reviewedAt")
        .between(dayStart.getTime(), dayEnd.getTime())
        .toArray();

      const reviewed = dayReviews.length;

      // 计算准确率
      const correctReviews = dayReviews.filter(
        (review) => review.reviewResult === "correct"
      ).length;
      const accuracy =
        reviewed > 0 ? Math.round((correctReviews / reviewed) * 100) : 0;

      weeklyProgress.push({
        date: date.toLocaleDateString("zh-CN", {
          month: "numeric",
          day: "numeric",
        }),
        reviewed,
        target: config.dailyReviewTarget,
        accuracy,
      });
    }

    return weeklyProgress;
  } catch (error) {
    console.error("Failed to generate weekly progress:", error);
    return [];
  }
}

/**
 * 计算月度统计
 */
async function calculateMonthlyStats(reviewHistories: any[]): Promise<{
  totalReviews: number;
  averageAccuracy: number;
  timeSpent: number;
  wordsLearned: number;
}> {
  try {
    const totalReviews = reviewHistories.length;
    const correctReviews = reviewHistories.filter(
      (r) => r.reviewResult === "correct"
    ).length;
    const averageAccuracy =
      totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;

    // 计算总时间（基于响应时间）
    const timeSpent =
      reviewHistories.reduce((sum, r) => sum + (r.responseTime || 0), 0) /
      (1000 * 60); // 转换为分钟

    // 计算学会的单词数（已毕业的单词）
    const allRecords = await db.wordReviewRecords.toArray();
    const wordsLearned = allRecords.filter(
      (record) => record.isGraduated
    ).length;

    return {
      totalReviews,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      timeSpent: Math.round(timeSpent),
      wordsLearned,
    };
  } catch (error) {
    console.error("Failed to calculate monthly stats:", error);
    return {
      totalReviews: 0,
      averageAccuracy: 0,
      timeSpent: 0,
      wordsLearned: 0,
    };
  }
}
