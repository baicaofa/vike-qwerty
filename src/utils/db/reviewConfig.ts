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
  enableNotifications: boolean;
  notificationTime: string;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(userId?: string) {
    this.uuid = generateUUID();
    this.userId = userId || "default";

    // 简化的默认配置
    this.baseIntervals = [1, 3, 7, 15, 30, 60];
    this.enableNotifications = true;
    this.notificationTime = "09:00";

    this.sync_status = "local_new";
    this.last_modified = Date.now();
  }

  /**
   * 从数据库记录创建 ReviewConfig 实例
   */
  static fromRecord(record: any): ReviewConfig {
    const config = new ReviewConfig(record.userId);
    config.id = record.id;
    config.uuid = record.uuid;
    config.baseIntervals = record.baseIntervals || [1, 3, 7, 15, 30, 60];
    config.enableNotifications = record.enableNotifications ?? true;
    config.notificationTime = record.notificationTime || "09:00";
    config.sync_status = record.sync_status || "local_new";
    config.last_modified = record.last_modified || Date.now();
    return config;
  }

  /**
   * 转换为数据库记录格式
   */
  toRecord(): Omit<IReviewConfig, "id"> {
    return {
      uuid: this.uuid,
      userId: this.userId,
      baseIntervals: this.baseIntervals,
      enableNotifications: this.enableNotifications,
      notificationTime: this.notificationTime,
      sync_status: this.sync_status,
      last_modified: this.last_modified,
    };
  }

  /**
   * 验证配置的有效性
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.baseIntervals.length === 0) {
      errors.push("基础间隔不能为空");
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
}
