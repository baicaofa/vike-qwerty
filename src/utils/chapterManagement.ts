import type { Chapter, ChapterStorageData } from "../typings/chapter";
import type { IWordReviewRecord } from "./db/wordReviewRecord";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "./localStorage";

// 章节常量配置
export const CHAPTER_CONFIG = {
  /** 每章单词数量（固定） */
  WORDS_PER_CHAPTER: 20,
  /** 章节练习次数存储键前缀 */
  STORAGE_KEY_PREFIX: "chapter_practice_counts",
} as const;

/**
 * 计算章节的完成状态
 */
function calculateChapterCompletion(words: IWordReviewRecord[]): {
  completedWords: number;
  isCompleted: boolean;
} {
  if (!Array.isArray(words) || words.length === 0) {
    return { completedWords: 0, isCompleted: false };
  }

  const today = new Date().toISOString().split("T")[0];
  const todayStart = new Date(today).getTime();

  // 统计今天已练习的单词数
  const completedWords = words.filter((word) => {
    // 安全检查：确保word是有效对象
    if (!word || typeof word !== "object") {
      return false;
    }

    // 检查今日练习次数
    const todayPracticeCount = word.todayPracticeCount || 0;
    if (todayPracticeCount <= 0) {
      return false;
    }

    // 检查最后练习时间
    const lastPracticedAt = word.lastPracticedAt;
    if (lastPracticedAt && lastPracticedAt >= todayStart) {
      return true;
    }

    // 有练习次数记录即认为已练习
    return todayPracticeCount > 0;
  }).length;

  const isCompleted = words.length > 0 && completedWords === words.length;

  return { completedWords, isCompleted };
}

/**
 * 生成按原始顺序的章节列表
 * @param reviewWords 待复习单词列表
 * @param date 日期字符串 (YYYY-MM-DD)
 * @returns 章节列表
 */
export function generateChapters(
  reviewWords: IWordReviewRecord[],
  date: string
): Chapter[] {
  try {
    // 输入验证
    if (!Array.isArray(reviewWords)) {
      console.error("generateChapters: reviewWords 必须是数组");
      return [];
    }

    if (reviewWords.length === 0) {
      return [];
    }

    // 直接使用原始数据，无需过滤

    if (!date || typeof date !== "string") {
      console.error("generateChapters: date 必须是有效的字符串");
      return [];
    }

    // 验证日期格式
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error("generateChapters: date 格式必须是 YYYY-MM-DD");
      return [];
    }

    // 保持原始顺序，不进行随机打乱
    const orderedWords = [...reviewWords];

    const chapters: Chapter[] = [];
    const { WORDS_PER_CHAPTER } = CHAPTER_CONFIG;

    // 按固定数量分组创建章节
    for (let i = 0; i < orderedWords.length; i += WORDS_PER_CHAPTER) {
      const chapterWords = orderedWords.slice(i, i + WORDS_PER_CHAPTER);
      const chapterNumber = Math.floor(i / WORDS_PER_CHAPTER) + 1;

      // 跳过空章节
      if (chapterWords.length === 0) {
        continue;
      }

      // 计算章节完成状态
      const { completedWords, isCompleted } =
        calculateChapterCompletion(chapterWords);

      // 获取章节练习次数
      const practiceCounts = getChapterPracticeCounts(date);
      const practiceCount = practiceCounts[chapterNumber] || 0;

      chapters.push({
        chapterNumber,
        words: chapterWords,
        totalWords: chapterWords.length,
        completedWords,
        isCompleted,
        practiceCount,
      });
    }

    return chapters;
  } catch (error) {
    console.error("generateChapters 执行失败:", error);
    return [];
  }
}

/**
 * 获取指定日期的章节练习次数记录
 */
export function getChapterPracticeCounts(date: string): Record<number, number> {
  try {
    const key = `${CHAPTER_CONFIG.STORAGE_KEY_PREFIX}_${date}`;
    const stored = getLocalStorageItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("获取章节练习次数失败:", error);
    return {};
  }
}

/**
 * 更新指定章节的练习次数
 */
export function updateChapterPracticeCount(
  date: string,
  chapterNumber: number
): void {
  try {
    const key = `${CHAPTER_CONFIG.STORAGE_KEY_PREFIX}_${date}`;
    const counts = getChapterPracticeCounts(date);
    counts[chapterNumber] = (counts[chapterNumber] || 0) + 1;
    setLocalStorageItem(key, JSON.stringify(counts));
  } catch (error) {
    console.error("更新章节练习次数失败:", error);
  }
}

/**
 * 获取章节练习总览数据
 */
export function getChapterOverview(date: string): {
  totalChapters: number;
  completedChapters: number;
  totalPractices: number;
} {
  const practiceCounts = getChapterPracticeCounts(date);
  const chapterNumbers = Object.keys(practiceCounts).map(Number);

  return {
    totalChapters: Math.max(0, ...chapterNumbers, 0),
    completedChapters: chapterNumbers.filter((num) => practiceCounts[num] > 0)
      .length,
    totalPractices: Object.values(practiceCounts).reduce(
      (sum, count) => sum + count,
      0
    ),
  };
}

/**
 * 清理过期的章节数据
 * 删除除今天以外的所有章节练习记录
 */
export function cleanupExpiredChapterData(): void {
  try {
    const today = new Date().toISOString().split("T")[0];
    const prefix = CHAPTER_CONFIG.STORAGE_KEY_PREFIX + "_";

    // 在浏览器环境中遍历 localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      const keysToRemove: string[] = [];

      // 收集需要删除的键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const date = key.replace(prefix, "");
          if (date !== today) {
            keysToRemove.push(key);
          }
        }
      }

      // 删除过期数据
      keysToRemove.forEach((key) => {
        removeLocalStorageItem(key);
      });

      console.log(`清理了 ${keysToRemove.length} 个过期章节数据`);
    }
  } catch (error) {
    console.error("清理过期章节数据失败:", error);
  }
}

/**
 * 重置指定日期的所有章节练习次数
 */
export function resetChapterPracticeCounts(date: string): void {
  try {
    const key = `${CHAPTER_CONFIG.STORAGE_KEY_PREFIX}_${date}`;
    removeLocalStorageItem(key);
  } catch (error) {
    console.error("重置章节练习次数失败:", error);
  }
}

/**
 * 获取章节存储数据（用于调试和数据导出）
 */
export function getChapterStorageData(date: string): ChapterStorageData | null {
  try {
    const practiceCounts = getChapterPracticeCounts(date);
    if (Object.keys(practiceCounts).length === 0) {
      return null;
    }

    return {
      date,
      practiceCounts,
    };
  } catch (error) {
    console.error("获取章节存储数据失败:", error);
    return null;
  }
}

/**
 * 检查是否需要进行数据清理
 * 建议在应用启动时调用
 */
export function shouldCleanupChapterData(): boolean {
  try {
    const today = new Date().toISOString().split("T")[0];
    const lastCleanupKey = "chapter_last_cleanup";
    const lastCleanup = getLocalStorageItem(lastCleanupKey);

    if (!lastCleanup || lastCleanup !== today) {
      setLocalStorageItem(lastCleanupKey, today);
      return true;
    }

    return false;
  } catch (error) {
    console.error("检查数据清理状态失败:", error);
    return false;
  }
}
