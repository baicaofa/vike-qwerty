import type { IUser } from "./User";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

/**
 * 服务端复习历史记录接口
 */
export interface IReviewHistory extends Document {
  uuid: string; // 全局唯一ID
  userId: mongoose.Types.ObjectId | IUser; // 关联到User模型
  wordReviewRecordId: mongoose.Types.ObjectId; // 关联WordReviewRecord的ID
  word: string; // 单词（冗余存储，便于查询）
  dict: string; // 复习时使用的词典

  // 复习详情
  reviewedAt: Date; // 复习时间
  reviewResult: "correct" | "incorrect"; // 复习结果
  responseTime: number; // 响应时间(毫秒)
  memoryStrengthBefore: number; // 复习前记忆强度
  memoryStrengthAfter: number; // 复习后记忆强度
  reviewLevelBefore: number; // 复习前等级
  reviewLevelAfter: number; // 复习后等级

  // 复习上下文
  reviewType: "scheduled" | "manual" | "practice_triggered"; // 复习触发方式
  sessionId?: string; // 复习会话ID（用于批量复习统计）

  // 同步相关
  sync_status: string; // 同步状态
  last_modified: number; // 客户端记录的最后修改时间戳
  clientModifiedAt: Date; // 客户端记录的最后修改时间
  isDeleted: boolean; // 是否已删除

  // Mongoose Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReviewHistorySchema: Schema<IReviewHistory> = new Schema(
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
      required: true,
      index: true,
    },
    wordReviewRecordId: {
      type: Schema.Types.ObjectId,
      ref: "WordReviewRecord",
      required: true,
      index: true,
    },
    word: {
      type: String,
      required: true,
      index: true,
    },
    dict: {
      type: String,
      required: true,
    },

    // 复习详情
    reviewedAt: {
      type: Date,
      required: true,
      index: true,
    },
    reviewResult: {
      type: String,
      enum: ["correct", "incorrect"],
      required: true,
      index: true,
    },
    responseTime: {
      type: Number,
      required: true,
      min: 0,
    },
    memoryStrengthBefore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    memoryStrengthAfter: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    reviewLevelBefore: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    reviewLevelAfter: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    // 复习上下文
    reviewType: {
      type: String,
      enum: ["scheduled", "manual", "practice_triggered"],
      required: true,
      default: "scheduled",
    },
    sessionId: {
      type: String,
      index: true,
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

// 常用查询索引
ReviewHistorySchema.index({ userId: 1, reviewedAt: 1 }); // 按用户和复习时间查询
ReviewHistorySchema.index({ userId: 1, word: 1, reviewedAt: 1 }); // 按用户、单词和时间查询
ReviewHistorySchema.index({ userId: 1, sessionId: 1 }); // 按会话查询
ReviewHistorySchema.index({ userId: 1, reviewResult: 1, reviewedAt: 1 }); // 按结果和时间查询
ReviewHistorySchema.index({ userId: 1, updatedAt: 1 }); // 同步查询

export default mongoose.model<IReviewHistory>(
  "ReviewHistory",
  ReviewHistorySchema
);
