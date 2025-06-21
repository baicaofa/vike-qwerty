import { generateUUID } from "../uuid";
import type { SyncStatus } from "./record";

/**
 * 简化的复习配置接口
 */
export interface IReviewConfig {
  id?: number; // Dexie auto-incrementing primary key
  uuid: string; // 全局唯一ID
  userId?: string; // 用户ID（'default'表示全局默认配置）

  // 基础配置
  baseIntervals: number[]; // 基础复习间隔（天）[1, 3, 7, 15, 30, 60]

  // 复习目标
  dailyReviewTarget: number; // 每日复习目标数量
  maxReviewsPerDay: number; // 每日最大复习数量

  // 提醒设置
  enableNotifications: boolean; // 是否启用提醒
  notificationTime: string; // 提醒时间 (HH:MM格式)

  // 同步相关
  sync_status: SyncStatus;
  last_modified: number;
}

/**
 * 简化的 ReviewConfig 类实现
 */
export class ReviewConfig implements IReviewConfig {
  id?: number;
  uuid: string;
  userId?: string;
  baseIntervals: number[];
  dailyReviewTarget: number;
  maxReviewsPerDay: number;
  enableNotifications: boolean;
  notificationTime: string;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(userId?: string) {
    this.uuid = generateUUID();
    this.userId = userId || "default";

    // 简化的默认配置
    this.baseIntervals = [1, 3, 7, 15, 30, 60];
    this.dailyReviewTarget = 50;
    this.maxReviewsPerDay = 100;
    this.enableNotifications = true;
    this.notificationTime = "09:00";

    this.sync_status = "local_new";
    this.last_modified = Date.now();
  }

  /**
   * 获取指定等级的复习间隔
   */
  getInterval(level: number): number {
    return this.baseIntervals[Math.min(level, this.baseIntervals.length - 1)];
  }

  /**
   * 检查是否应该发送通知
   */
  shouldSendNotification(currentTime: Date = new Date()): boolean {
    if (!this.enableNotifications) {
      return false;
    }

    const currentTimeStr = `${currentTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // 简化：只检查时间，不检查星期几
    return currentTimeStr === this.notificationTime;
  }

  /**
   * 验证配置的有效性
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.baseIntervals.length === 0) {
      errors.push("基础间隔不能为空");
    }

    if (
      this.dailyReviewTarget < 1 ||
      this.dailyReviewTarget > this.maxReviewsPerDay
    ) {
      errors.push("每日复习目标必须在1到最大复习数量之间");
    }

    // 检查间隔是否为正数且递增
    for (let i = 0; i < this.baseIntervals.length; i++) {
      if (this.baseIntervals[i] <= 0) {
        errors.push(`间隔${i + 1}必须为正数`);
      }
      if (i > 0 && this.baseIntervals[i] <= this.baseIntervals[i - 1]) {
        errors.push(`间隔${i + 1}必须大于间隔${i}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 重置为默认配置
   */
  resetToDefaults(): void {
    const defaultConfig = new ReviewConfig(this.userId);

    // 保留ID和同步信息
    const preservedFields = {
      id: this.id,
      uuid: this.uuid,
      userId: this.userId,
      sync_status:
        this.sync_status === "synced" ? "local_modified" : this.sync_status,
    };

    Object.assign(this, defaultConfig, preservedFields);
    this.last_modified = Date.now();
  }
}
