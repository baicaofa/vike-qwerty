import { generateUUID } from "../uuid";
import type { SyncStatus } from "./record";

/**
 * 复习历史记录接口
 * 记录每次复习的详细历史，用于统计和分析
 */
export interface IReviewHistory {
  id?: number; // Dexie auto-incrementing primary key
  uuid: string; // 全局唯一ID
  userId?: string; // 用户ID（客户端可选，服务端必需）
  wordReviewRecordId: number; // 关联WordReviewRecord的ID
  word: string; // 单词（冗余存储，便于查询）
  dict: string; // 复习时使用的词典

  // 复习详情
  reviewedAt: number; // 复习时间戳
  reviewResult: "correct" | "incorrect"; // 复习结果
  responseTime: number; // 响应时间(毫秒)
  intervalProgressBefore: number; // 复习前间隔进度 (0-1)
  intervalProgressAfter: number; // 复习后间隔进度 (0-1)
  intervalIndexBefore: number; // 复习前间隔索引
  intervalIndexAfter: number; // 复习后间隔索引

  // 复习上下文
  reviewType: "scheduled" | "manual" | "practice_triggered"; // 复习触发方式
  sessionId?: string; // 复习会话ID（用于批量复习统计）

  // 同步相关
  sync_status: SyncStatus;
  last_modified: number;
}

/**
 * ReviewHistory 类实现
 */
export class ReviewHistory implements IReviewHistory {
  id?: number;
  uuid: string;
  userId?: string;
  wordReviewRecordId: number;
  word: string;
  dict: string;
  reviewedAt: number;
  reviewResult: "correct" | "incorrect";
  responseTime: number;
  intervalProgressBefore: number;
  intervalProgressAfter: number;
  intervalIndexBefore: number;
  intervalIndexAfter: number;
  reviewType: "scheduled" | "manual" | "practice_triggered";
  sessionId?: string;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(
    wordReviewRecordId: number,
    word: string,
    dict: string,
    reviewResult: "correct" | "incorrect",
    responseTime: number,
    intervalProgressBefore: number,
    intervalProgressAfter: number,
    intervalIndexBefore: number,
    intervalIndexAfter: number,
    reviewType: "scheduled" | "manual" | "practice_triggered" = "scheduled",
    sessionId?: string
  ) {
    this.uuid = generateUUID();
    this.wordReviewRecordId = wordReviewRecordId;
    this.word = word;
    this.dict = dict;
    this.reviewedAt = Date.now();
    this.reviewResult = reviewResult;
    this.responseTime = responseTime;
    this.intervalProgressBefore = intervalProgressBefore;
    this.intervalProgressAfter = intervalProgressAfter;
    this.intervalIndexBefore = intervalIndexBefore;
    this.intervalIndexAfter = intervalIndexAfter;
    this.reviewType = reviewType;
    this.sessionId = sessionId;

    this.sync_status = "local_new";
    this.last_modified = Date.now();
  }

  /**
   * 获取间隔进度变化
   */
  getIntervalProgressChange(): number {
    return this.intervalProgressAfter - this.intervalProgressBefore;
  }

  /**
   * 获取间隔索引变化
   */
  getIntervalIndexChange(): number {
    return this.intervalIndexAfter - this.intervalIndexBefore;
  }

  /**
   * 判断是否为有效复习（响应时间合理）
   */
  isValidReview(): boolean {
    // 响应时间在100ms到30秒之间认为是有效的
    return this.responseTime >= 100 && this.responseTime <= 30000;
  }

  /**
   * 获取复习效果评分
   * 综合考虑正确性、响应时间、间隔进度提升等因素
   */
  getReviewEffectivenessScore(): number {
    let score = 0;

    // 基础分：正确答案50分，错误答案0分
    if (this.reviewResult === "correct") {
      score += 50;
    }

    // 响应时间分：越快越好（最多20分）
    const responseTimeScore = Math.max(0, 20 - (this.responseTime / 1000) * 2);
    score += responseTimeScore;

    // 间隔进度提升分：提升越多越好（最多30分）
    const progressImprovement = this.getIntervalProgressChange();
    if (progressImprovement > 0) {
      score += Math.min(30, progressImprovement * 100);
    }

    return Math.round(score);
  }
}

/**
 * 复习统计接口
 */
export interface IReviewStatistics {
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  accuracy: number;
  averageResponseTime: number;
  averageIntervalProgressGain: number;
  reviewsByDate: { [date: string]: number };
  reviewsByDict: { [dict: string]: number };
  reviewsByLevel: { [level: number]: number };
  effectivenessScore: number;
}

/**
 * 复习会话接口
 */
export interface IReviewSession {
  id: string;
  startTime: number;
  endTime?: number;
  wordCount: number;
  completedCount: number;
  correctCount: number;
  totalResponseTime: number;
  sessionType: "daily" | "custom" | "emergency";
  isCompleted: boolean;
}
