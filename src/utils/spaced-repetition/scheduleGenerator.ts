import { generateUUID } from "../../utils/uuid";
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

    // 直接使用所有到期单词，不进行人为数量限制
    const recommendedWords = dueWords;

    // 按逾期时间排序
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

    // 分离紧急和普通单词（不再限制数量）
    const urgentReviewWords = sortedWords.filter((word) =>
      urgentWords.includes(word)
    );
    const normalReviewWords = sortedWords.filter(
      (word) => !urgentWords.includes(word)
    );

    // 基于实际单词数量计算难度
    const totalReviewWords =
      urgentReviewWords.length + normalReviewWords.length;
    let difficulty: "easy" | "normal" | "hard" = "normal";

    if (totalReviewWords < 20) {
      difficulty = "easy";
    } else if (totalReviewWords > 80) {
      difficulty = "hard";
    }

    // 预估复习时间（每个单词平均3分钟）
    const estimatedTime = Math.round(recommendedWords.length);

    // 生成负载建议
    const loadRecommendation = generateLoadRecommendation(
      urgentReviewWords.length,
      normalReviewWords.length,
      totalReviewWords
    );

    return {
      date: date.toISOString().split("T")[0],
      totalWords: allWordReviews.length,
      urgentWords: urgentReviewWords,
      normalWords: normalReviewWords,
      reviewWords: [...urgentReviewWords, ...normalReviewWords],
      estimatedTime,
      difficulty,
      loadRecommendation,
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
        todayPracticeCount: wordReviewRecord.todayPracticeCount,
        isGraduated: wordReviewRecord.isGraduated,
        lastReviewedAt: wordReviewRecord.lastReviewedAt, // 添加最后复习时间更新
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

    // 计算完成率（基于今日复习数量与到期单词数量的比例）
    const completionRate =
      dueWords > 0 ? Math.min(100, (reviewedToday / dueWords) * 100) : 100;

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
 * 将单词练习结果同步到复习系统，并更新或创建单词的复习记录。
 *
 * @param word 练习的单词
 * @param dictId 单词所在的词典ID
 * @param practiceResult 练习结果
 */
export async function syncWordPracticeToReview(
  word: string,
  dictId: string,
  practiceResult: {
    isCorrect: boolean;
    responseTime: number;
    timestamp: number;
  }
): Promise<void> {
  try {
    await updateWordReviewRecord(word, dictId, practiceResult.isCorrect);
  } catch (error) {
    console.error(`Failed to sync practice for word "${word}":`, error);
    // 根据需要决定是否向上抛出异常
  }
}

/**
 * 根据练习结果更新单词的复习记录。
 * 此函数确保每个单词只有一个复习记录。
 *
 * @param word 要更新的单词
 * @param dictId 单词当前所属的词典ID（用于记录，不用于查询）
 * @param isCorrect 本次练习是否正确
 */
async function updateWordReviewRecord(
  word: string,
  dictId: string,
  isCorrect: boolean
): Promise<void> {
  const config = await getReviewConfig();
  // 修改这里，不再使用 new 操作符，因为 AlgorithmUtils 是对象而非构造函数
  // const algorithm = new AlgorithmUtils(config);

  // 按 word 查找，确保全局唯一性（跨词典统一）
  const record = await db.wordReviewRecords.where({ word }).first();

  if (record) {
    // 记录存在，更新它
    // 直接使用 record 的方法更新记录
    const updatedRecord = {
      ...record,
      nextReviewAt: record.nextReviewAt,
      currentIntervalIndex: record.currentIntervalIndex,
      todayPracticeCount: record.todayPracticeCount,
      lastReviewedAt: record.lastReviewedAt,
    };

    // 更新今日练习次数和最后复习时间
    updatedRecord.todayPracticeCount =
      (updatedRecord.todayPracticeCount || 0) + 1;

    await db.wordReviewRecords.update(record.id!, {
      ...updatedRecord,
      sync_status: "local_modified",
      last_modified: Date.now(),
    });
  } else {
    // 记录不存在，创建新的
    // 使用config.baseIntervals替代intervalSequence
    const intervalSequence = config.baseIntervals || [1, 3, 7, 15, 30, 60];
    const currentIntervalIndex = 0; // 总是从0开始，让复习算法正常推进
    const nextInterval = intervalSequence[currentIntervalIndex];
    const now = Date.now();

    const newRecord: IWordReviewRecord = {
      word,
      uuid: generateUUID(),
      intervalSequence,
      currentIntervalIndex,
      nextReviewAt: now + AlgorithmUtils.daysToMilliseconds(nextInterval),
      isGraduated: false,
      totalReviews: 0, // 从0开始，因为还没有进行过复习
      todayPracticeCount: 0, // 从0开始，因为还没有练习
      sync_status: "local_new",
      last_modified: now,
      // 添加IWordReviewRecord要求的其他必填字段
      lastPracticedAt: now,
      lastReviewedAt: now, // 设置最后复习时间
      sourceDicts: [dictId], // 使用dictId作为源词典
      preferredDict: dictId, // 设置为首选词典
      firstSeenAt: now,
    };

    // 使用 put 而不是 add，避免重复创建
    // 如果已存在相同 word 的记录，put 会更新而不是创建新记录
    await db.wordReviewRecords.put(newRecord);
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
  responseTime = 2000
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
    const wordRecord = toWordReviewRecord(wordReviewRecord);

    // 保存复习前的间隔索引和进度
    const intervalIndexBefore = wordRecord.currentIntervalIndex;
    const intervalProgressBefore = wordRecord.isGraduated
      ? 1
      : wordRecord.currentIntervalIndex / wordRecord.intervalSequence.length;

    // 检查今天是否已经复习过（基于数据库记录的实际状态）
    const today = new Date().toISOString().split("T")[0];
    const lastReviewDate = wordRecord.lastReviewedAt
      ? new Date(wordRecord.lastReviewedAt).toISOString().split("T")[0]
      : null;
    const isFirstReviewToday =
      lastReviewDate !== today || (wordRecord.todayPracticeCount || 0) === 0;

    if (isFirstReviewToday && isFirstReviewOfRound) {
      const oldNextReviewAt = wordRecord.nextReviewAt;
      wordRecord.completeReview(timestamp);
    } else {
      // 重复练习，只更新练习次数和时间戳
      if (wordRecord.todayPracticeCount === undefined) {
        wordRecord.todayPracticeCount = 0;
      }
      wordRecord.todayPracticeCount++;
      wordRecord.lastPracticedAt = timestamp;
      wordRecord.lastReviewedAt = timestamp;
    }

    // 设置同步字段
    wordRecord.last_modified = Date.now();
    if (wordRecord.sync_status === "synced") {
      wordRecord.sync_status = "local_modified";
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

      // 为 reviewHistory 添加同步字段
      reviewHistory.uuid = generateUUID();
      reviewHistory.sync_status = "local_new";
      reviewHistory.last_modified = Date.now();

      // 保存复习历史记录到数据库
      await db.reviewHistories.add(reviewHistory);
    }
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

    // 查找所有需要重置的记录（最后复习时间不是今天的）
    const allRecords = await db.wordReviewRecords.toArray();
    const recordsToReset = allRecords.filter((record) => {
      if (!record.lastReviewedAt) return false;
      const lastReviewDate = new Date(record.lastReviewedAt)
        .toISOString()
        .split("T")[0];
      return lastReviewDate !== today && record.todayPracticeCount > 0;
    });

    // 批量重置
    for (const record of recordsToReset) {
      await db.wordReviewRecords.update(record.id!, {
        todayPracticeCount: 0,
        last_modified: Date.now(),
      });
    }
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
 * 生成负载建议
 */
function generateLoadRecommendation(
  urgentCount: number,
  normalCount: number,
  totalCount: number
): string {
  if (totalCount === 0) {
    return "今日无需复习，继续保持学习节奏";
  }

  if (urgentCount > normalCount) {
    return "今日复习量较重，建议专注于重要单词的复习";
  } else if (totalCount > 80) {
    return "今日复习量较大，建议分时段进行复习";
  } else if (totalCount < 20) {
    return "今日复习量适中，可以适当增加学习内容";
  } else {
    return "今日复习量适中，保持当前的学习节奏";
  }
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

      // 计算当天到期的单词数量作为目标
      const allWordReviews = await db.wordReviewRecords.toArray();
      const dueWords = filterDueWords(allWordReviews, dayEnd.getTime());
      const target = dueWords.length;

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
        target,
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
