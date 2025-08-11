/**
 * 复习练习计数功能模块
 * 管理每日练习次数和状态
 */
import { db } from "./db";
import type { IWordReviewRecord } from "./db/wordReviewRecord";
import { getDueWordsForReview } from "./spaced-repetition/scheduleGenerator";

// 本地存储键
const LAST_RESET_DATE_KEY = "lastResetDate";

/**
 * 获取单词的平均练习次数
 *
 * @param todayWords 今日复习单词列表
 * @returns 平均练习次数
 */
export function getAveragePracticeCount(
  todayWords: IWordReviewRecord[]
): number {
  if (!todayWords || todayWords.length === 0) return 0;

  const totalPracticeCount = todayWords.reduce(
    (sum, word) => sum + (word.todayPracticeCount || 0),
    0
  );

  return totalPracticeCount / todayWords.length;
}

/**
 * 按练习次数对单词进行分组
 *
 * @param todayWords 今日复习单词列表
 * @returns 按练习次数分组的单词对象
 */
export function groupWordsByPracticeCount(
  todayWords: IWordReviewRecord[]
): Record<number, IWordReviewRecord[]> {
  if (!todayWords || todayWords.length === 0) {
    return {};
  }

  const groups: Record<number, IWordReviewRecord[]> = {};

  // 对每个单词按照其练习次数进行分组
  todayWords.forEach((word) => {
    const practiceCount = word.todayPracticeCount || 0;

    if (!groups[practiceCount]) {
      groups[practiceCount] = [];
    }

    groups[practiceCount].push(word);
  });

  return groups;
}

/**
 * 获取指定练习次数的单词
 *
 * @param todayWords 今日复习单词列表
 * @param practiceCount 练习次数（默认为0，表示未练习的单词）
 * @returns 指定练习次数的单词列表
 */
export function getWordsByPracticeCount(
  todayWords: IWordReviewRecord[],
  practiceCount = 0
): IWordReviewRecord[] {
  if (!todayWords || todayWords.length === 0) return [];

  return todayWords.filter(
    (word) => (word.todayPracticeCount || 0) === practiceCount
  );
}

/**
 * 检查是否所有单词至少练习了一次
 *
 * @param todayWords 今日复习单词列表
 * @returns 布尔值表示是否所有单词都至少练习了一次
 */
export function areAllWordsPracticed(todayWords: IWordReviewRecord[]): boolean {
  if (!todayWords || todayWords.length === 0) return true;

  // 检查是否所有单词至少练习了一次
  return todayWords.every((word) => (word.todayPracticeCount || 0) > 0);
}

/**
 * 获取未练习单词列表
 *
 * @param todayWords 今日复习单词列表
 * @returns 未练习的单词列表
 */
export function getUnpracticedWords(
  todayWords: IWordReviewRecord[]
): IWordReviewRecord[] {
  return getWordsByPracticeCount(todayWords, 0);
}

/**
 * 获取已练习单词列表
 *
 * @param todayWords 今日复习单词列表
 * @returns 已练习的单词列表
 */
export function getPracticedWords(
  todayWords: IWordReviewRecord[]
): IWordReviewRecord[] {
  if (!todayWords || todayWords.length === 0) return [];

  return todayWords.filter((word) => (word.todayPracticeCount || 0) > 0);
}

/**
 * 初始化今日复习数据
 * 在每天首次加载时重置所有单词的todayPracticeCount
 *
 * @returns Promise<IWordReviewRecord[]> 今日需要复习的单词列表
 */
export async function initializeTodayReviews(): Promise<IWordReviewRecord[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. 获取今天仍然到期的单词
  const dueWords = await getDueWordsForReview(undefined, "urgency");

  // 2. 获取今天所有练习历史
  const practicedHistory = await db.reviewHistories
    .where("reviewedAt")
    .aboveOrEqual(todayStart.getTime())
    .toArray();

  // 3. 如果没有练习历史，直接返回到期单词，并确保它们练习次数为0
  if (practicedHistory.length === 0) {
    return dueWords.map((word) => ({ ...word, todayPracticeCount: 0 }));
  }

  // 4. 统计练习次数，并获取已练习单词的完整记录
  const practiceCounts = new Map<string, number>();
  practicedHistory.forEach((history) => {
    const count = practiceCounts.get(history.word) || 0;
    practiceCounts.set(history.word, count + 1);
  });

  const practicedWordNames = Array.from(practiceCounts.keys());
  const rawPracticedWordRecords = await db.wordReviewRecords
    .where("word")
    .anyOf(practicedWordNames)
    .toArray();

  // 直接使用原始已练习单词的数据
  const practicedWordRecords = rawPracticedWordRecords;

  // 5. 合并列表，确保唯一性和数据准确性
  const todayWordsMap = new Map<string, IWordReviewRecord>();

  // 首先处理已练习的单词
  practicedWordRecords.forEach((record) => {
    todayWordsMap.set(record.word, {
      ...record,
      todayPracticeCount: practiceCounts.get(record.word) || 0,
    });
  });

  // 然后处理到期但今天未练习的单词，如果已存在则忽略
  dueWords.forEach((record) => {
    if (!todayWordsMap.has(record.word)) {
      todayWordsMap.set(record.word, {
        ...record,
        todayPracticeCount: 0,
      });
    }
  });

  // 6. 返回合并后的数组
  return Array.from(todayWordsMap.values());
}

/**
 * 更新单词练习次数
 *
 * @param wordId 单词ID或单词名称
 * @param incrementCount 是否增加计数（默认为true）
 * @returns Promise<IWordReviewRecord> 更新后的单词记录
 */
export async function updateWordPracticeCount(
  wordId: string | number,
  incrementCount = true
): Promise<IWordReviewRecord | undefined> {
  let wordRecord: IWordReviewRecord | undefined;

  try {
    // 根据ID类型查询单词记录
    if (typeof wordId === "number") {
      wordRecord = await db.wordReviewRecords.get(wordId);
    } else {
      wordRecord = await db.wordReviewRecords
        .where("word")
        .equals(wordId)
        .first();
    }

    if (!wordRecord) {
      console.warn(`No review record found for word: ${wordId}`);
      return undefined;
    }

    // 确保字段存在
    if (wordRecord.todayPracticeCount === undefined) {
      wordRecord.todayPracticeCount = 0;
    }

    // 更新练习次数
    if (incrementCount) {
      wordRecord.todayPracticeCount += 1;
    }

    // 更新最后练习时间
    wordRecord.lastPracticedAt = Date.now();

    // 保存到数据库
    await db.wordReviewRecords.put(wordRecord);

    return wordRecord;
  } catch (error) {
    console.error("更新单词练习次数失败:", error);
    return undefined;
  }
}

/**
 * 获取单词练习次数
 *
 * @param wordId 单词ID或单词名称
 * @returns Promise<number> 单词的练习次数
 */
export async function getWordPracticeCount(
  wordId: string | number
): Promise<number> {
  try {
    let wordRecord: IWordReviewRecord | undefined;

    // 根据ID类型查询单词记录
    if (typeof wordId === "number") {
      wordRecord = await db.wordReviewRecords.get(wordId);
    } else {
      wordRecord = await db.wordReviewRecords
        .where("word")
        .equals(wordId)
        .first();
    }

    return wordRecord?.todayPracticeCount || 0;
  } catch (error) {
    console.error("获取单词练习次数失败:", error);
    return 0;
  }
}

/**
 * 获取今日练习统计
 *
 * @param todayWords 今日复习单词列表
 * @returns 练习统计信息
 */
export function getPracticeStats(todayWords: IWordReviewRecord[]) {
  if (!todayWords || todayWords.length === 0) {
    return {
      totalWords: 0,
      unpracticedWords: 0,
      practicedWords: 0,
      completionRate: 0,
    };
  }

  const unpracticedWords = getUnpracticedWords(todayWords).length;
  const practicedWords = getPracticedWords(todayWords).length;
  const totalWords = todayWords.length;

  return {
    totalWords,
    unpracticedWords,
    practicedWords,
    completionRate:
      totalWords > 0 ? Math.round((practicedWords / totalWords) * 100) : 0,
  };
}
