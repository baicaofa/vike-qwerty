import type { IWordReviewRecord } from "../utils/db/wordReviewRecord";

/**
 * 章节数据结构
 * 用于组织单词复习的章节化管理
 */
export interface Chapter {
  /** 章节编号（1, 2, 3...） */
  chapterNumber: number;
  /** 该章节包含的单词（固定20个） */
  words: IWordReviewRecord[];
  /** 总单词数（固定20） */
  totalWords: number;
  /** 已练习的单词数 */
  completedWords: number;
  /** 是否完成 */
  isCompleted: boolean;
  /** 练习次数 */
  practiceCount: number;
}

/**
 * 章节完成统计
 * 用于展示章节练习结果
 */
export interface ChapterStats {
  /** 正确率（百分比） */
  accuracy: number;
  /** 每分钟字数 */
  wpm: number;
  /** 完成时间（秒） */
  time: number;
  /** 错误的单词 */
  wrongWords: IWordReviewRecord[];
  /** 正确的单词 */
  correctWords: IWordReviewRecord[];
}

/**
 * 章节练习状态
 * 用于管理章节练习进度
 */
export interface ChapterProgress {
  /** 当前章节编号 */
  currentChapter: number | null;
  /** 当前单词索引 */
  currentWordIndex: number;
  /** 是否正在练习中 */
  isInProgress: boolean;
  /** 练习开始时间 */
  startTime?: number;
}

/**
 * 章节本地存储数据
 * 用于持久化章节练习次数
 */
export interface ChapterStorageData {
  /** 日期字符串 (YYYY-MM-DD) */
  date: string;
  /** 章节练习次数映射 */
  practiceCounts: Record<number, number>;
}
