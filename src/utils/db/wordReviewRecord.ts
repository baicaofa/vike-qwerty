import { getUTCUnixTimestamp } from "../index";
import { generateUUID } from "../uuid";
import type { SyncStatus } from "./record";

// 定义每次复习记录的接口
export interface IReviewHistoryEntry {
  timestamp: number;
  isCorrect: boolean;
  responseTime?: number;
}

/**
 * 简化的单词复习记录接口
 * 基于固定间隔序列的渐进式复习系统
 */
export interface IWordReviewRecord {
  id?: number; // Dexie auto-incrementing primary key
  uuid: string; // 全局唯一ID
  userId?: string; // 用户ID（客户端可选，服务端必需）
  word: string; // 单词（跨词典统一）

  // 简化的复习状态
  intervalSequence: number[]; // 间隔序列（天数）如 [1, 3, 7, 15, 30, 60]
  currentIntervalIndex: number; // 当前间隔索引
  nextReviewAt: number; // 下次复习时间戳
  totalReviews: number; // 总复习次数
  todayReviewCount: number; // 今日复习次数
  isGraduated: boolean; // 是否已完成所有间隔

  // 复习历史
  reviewHistory?: IReviewHistoryEntry[]; // 复习历史记录
  consecutiveCorrect?: number; // 连续正确次数
  lastReviewedAt?: number; // 最后复习时间戳

  // 新增：轮次练习相关
  todayPracticeCount: number; // 今日练习次数，用于轮次控制
  lastPracticedAt: number; // 最后练习时间戳

  // 词典关联信息
  sourceDicts: string[]; // 这个单词出现在哪些词典中
  preferredDict: string; // 优先使用哪个词典的释义和发音

  // 时间戳
  firstSeenAt: number; // 首次遇到该单词的时间
  lastReviewDate: string; // 最后复习日期 "2024-12-15"

  // 同步相关
  sync_status: SyncStatus;
  last_modified: number;
}

/**
 * 简化的 WordReviewRecord 类实现
 */
export class WordReviewRecord implements IWordReviewRecord {
  id?: number;
  uuid: string;
  userId?: string;
  word: string;
  intervalSequence: number[];
  currentIntervalIndex: number;
  nextReviewAt: number;
  totalReviews: number;
  todayReviewCount: number;
  isGraduated: boolean;
  reviewHistory?: IReviewHistoryEntry[];
  consecutiveCorrect?: number;
  lastReviewedAt?: number;
  todayPracticeCount: number;
  lastPracticedAt: number;
  sourceDicts: string[];
  preferredDict: string;
  firstSeenAt: number;
  lastReviewDate: string;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(
    word: string,
    sourceDicts: string[],
    preferredDict: string,
    intervalSequence: number[] = [1, 3, 7, 15, 30, 60],
    firstSeenAt?: number
  ) {
    this.uuid = generateUUID();
    this.word = word;
    this.intervalSequence = [...intervalSequence]; // 复制数组
    this.currentIntervalIndex = 0;
    this.totalReviews = 0;
    this.todayReviewCount = 0;
    this.isGraduated = false;
    this.sourceDicts = [...sourceDicts]; // 复制数组
    this.preferredDict = preferredDict;
    this.reviewHistory = [];
    this.consecutiveCorrect = 0;

    // 新增字段初始化
    this.todayPracticeCount = 0;
    this.lastPracticedAt = Date.now();
    this.lastReviewedAt = Date.now();

    const now = getUTCUnixTimestamp();
    this.firstSeenAt = firstSeenAt || now;
    this.lastReviewDate = "";

    // 设置第一次复习时间（明天）
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + this.intervalSequence[0]);
    this.nextReviewAt = tomorrow.getTime();

    this.sync_status = "local_new";
    this.last_modified = Date.now();
  }

  /**
   * 判断是否需要复习
   * 简化逻辑：只基于时间判断
   */
  isReviewDue(currentTime: number = Date.now()): boolean {
    // 如果已经毕业，不需要复习
    if (this.isGraduated) {
      return false;
    }

    // 只检查是否到了预定复习时间
    return currentTime >= this.nextReviewAt;
  }

  /**
   * 判断今天是否已经复习过
   */
  isReviewedToday(): boolean {
    const today = new Date().toISOString().split("T")[0];
    return this.lastReviewDate === today;
  }

  /**
   * 复习后更新状态
   * 简化逻辑：只推进间隔，不做复杂判断
   */
  completeReview(currentTime: number = Date.now()): void {
    const today = new Date().toISOString().split("T")[0];

    // 更新统计
    this.totalReviews++;
    this.todayReviewCount++;
    this.lastReviewDate = today;

    // 更新最后复习时间
    this.lastReviewedAt = currentTime;

    // 更新轮次练习相关字段
    if (this.todayPracticeCount === undefined) {
      this.todayPracticeCount = 0;
    }
    this.todayPracticeCount++;
    this.lastPracticedAt = currentTime;

    // 只有第一次复习才推进间隔
    if (this.todayReviewCount === 1) {
      this.currentIntervalIndex++;

      // 检查是否毕业
      if (this.currentIntervalIndex >= this.intervalSequence.length) {
        this.isGraduated = true;
        this.nextReviewAt = 0; // 不再需要复习
      } else {
        // 设置下次复习时间
        const nextInterval = this.intervalSequence[this.currentIntervalIndex];
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);
        this.nextReviewAt = nextReviewDate.getTime();
      }
    }

    // 更新同步状态
    if (this.sync_status === "synced") {
      this.sync_status = "local_modified";
    }
    this.last_modified = Date.now();
  }

  /**
   * 重置今日复习计数（每日重置）
   */
  resetDailyCount(): void {
    this.todayReviewCount = 0;

    if (this.sync_status === "synced") {
      this.sync_status = "local_modified";
    }
    this.last_modified = Date.now();
  }

  /**
   * 添加新的源词典
   */
  addSourceDict(dict: string): void {
    if (!this.sourceDicts.includes(dict)) {
      this.sourceDicts.push(dict);
      if (this.sync_status === "synced") {
        this.sync_status = "local_modified";
      }
      this.last_modified = Date.now();
    }
  }

  /**
   * 移除源词典
   */
  removeSourceDict(dict: string): void {
    const index = this.sourceDicts.indexOf(dict);
    if (index > -1) {
      this.sourceDicts.splice(index, 1);

      // 如果移除的是首选词典，选择第一个可用的词典作为新的首选
      if (this.preferredDict === dict && this.sourceDicts.length > 0) {
        this.preferredDict = this.sourceDicts[0];
      }

      if (this.sync_status === "synced") {
        this.sync_status = "local_modified";
      }
      this.last_modified = Date.now();
    }
  }

  /**
   * 设置首选词典
   */
  setPreferredDict(dict: string): void {
    if (this.sourceDicts.includes(dict)) {
      this.preferredDict = dict;
      if (this.sync_status === "synced") {
        this.sync_status = "local_modified";
      }
      this.last_modified = Date.now();
    }
  }

  /**
   * 获取复习优先级分数（用于排序）
   * 简化逻辑：基于逾期时间和间隔索引
   */
  getReviewPriority(currentTime: number = Date.now()): number {
    // 如果已经毕业，优先级为0
    if (this.isGraduated) {
      return 0;
    }

    const daysOverdue = Math.max(
      0,
      (currentTime - this.nextReviewAt) / (24 * 60 * 60 * 1000)
    );

    // 优先级 = 逾期天数 × 100 + (低间隔索引优先) × 10
    return daysOverdue * 100 + (10 - this.currentIntervalIndex) * 10;
  }

  /**
   * 获取当前复习进度
   */
  getProgress(): { current: number; total: number; percentage: number } {
    const current = this.currentIntervalIndex;
    const total = this.intervalSequence.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return { current, total, percentage };
  }

  /**
   * 获取当前记忆强度
   * 简化实现：基于当前间隔索引计算
   */
  getCurrentMemoryStrength(): number {
    if (this.isGraduated) return 1.0;
    return Math.min(
      0.95,
      this.currentIntervalIndex / this.intervalSequence.length
    );
  }
}

/**
 * 将普通对象转换为 WordReviewRecord 类实例
 * 用于确保从数据库获取的对象具有完整的方法
 */
export function toWordReviewRecord(obj: IWordReviewRecord): WordReviewRecord {
  const record = new WordReviewRecord(
    obj.word,
    obj.sourceDicts,
    obj.preferredDict,
    obj.intervalSequence,
    obj.firstSeenAt
  );

  // 复制所有属性
  record.id = obj.id;
  record.uuid = obj.uuid;
  record.userId = obj.userId;
  record.currentIntervalIndex = obj.currentIntervalIndex;
  record.nextReviewAt = obj.nextReviewAt;
  record.totalReviews = obj.totalReviews;
  record.todayReviewCount = obj.todayReviewCount;
  record.isGraduated = obj.isGraduated;
  record.reviewHistory = obj.reviewHistory;
  record.consecutiveCorrect = obj.consecutiveCorrect;
  record.lastReviewedAt = obj.lastReviewedAt;
  record.todayPracticeCount = obj.todayPracticeCount;
  record.lastPracticedAt = obj.lastPracticedAt;
  record.lastReviewDate = obj.lastReviewDate;
  record.sync_status = obj.sync_status;
  record.last_modified = obj.last_modified;

  return record;
}

/**
 * 批量转换普通对象数组为 WordReviewRecord 实例数组
 */
export function toWordReviewRecords(
  objects: IWordReviewRecord[]
): WordReviewRecord[] {
  return objects.map((obj) => toWordReviewRecord(obj));
}
