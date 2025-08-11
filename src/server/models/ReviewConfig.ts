import type { IUser } from "./User";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

/**
 * 简化的服务端复习配置接口
 */
export interface IReviewConfig extends Document {
  uuid: string; // 全局唯一ID
  userId?: mongoose.Types.ObjectId | IUser; // 关联到User模型（'default'表示全局默认配置）

  // 基础配置
  baseIntervals: number[]; // 基础复习间隔（天）[1, 3, 7, 15, 30, 60]

  // 提醒设置
  enableNotifications: boolean; // 是否启用提醒
  notificationTime: string; // 提醒时间 (HH:MM格式)

  // 同步相关
  sync_status: string; // 同步状态
  last_modified: number; // 客户端记录的最后修改时间戳
  clientModifiedAt: Date; // 客户端记录的最后修改时间
  isDeleted: boolean; // 是否已删除

  // Mongoose Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReviewConfigSchema: Schema<IReviewConfig> = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      // 移除 index: true，使用 Schema 级别的索引定义
    },

    // 基础配置
    baseIntervals: {
      type: [Number],
      required: true,
      default: [1, 3, 7, 15, 30, 60],
      validate: {
        validator: function (v: number[]) {
          return v && v.length > 0 && v.every((interval) => interval > 0);
        },
        message: "baseIntervals must contain positive numbers",
      },
    },

    // 提醒设置
    enableNotifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    notificationTime: {
      type: String,
      required: true,
      default: "09:00",
      validate: {
        validator: function (v: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "notificationTime must be in HH:MM format",
      },
    },

    // 同步相关
    sync_status: {
      type: String,
      default: "synced",
    },
    last_modified: {
      type: Number,
      required: true,
    },
    clientModifiedAt: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// 索引：确保每个用户只有一个配置（userId为null表示全局默认配置）
ReviewConfigSchema.index({ userId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IReviewConfig>(
  "reviewConfigs", // 将模型名称从"ReviewConfig"改为"reviewConfigs"
  ReviewConfigSchema
);
