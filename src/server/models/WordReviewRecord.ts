import type { IUser } from "./User";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

/**
 * 服务端单词复习记录接口
 */
export interface IWordReviewRecord extends Document {
  uuid: string; // 全局唯一ID
  userId: mongoose.Types.ObjectId | IUser; // 关联到User模型
  word: string; // 单词（跨词典统一）

  // 客户端算法字段
  intervalSequence: number[]; // 间隔序列（天数）如 [1, 3, 7, 15, 30, 60]
  currentIntervalIndex: number; // 当前间隔索引
  isGraduated: boolean; // 是否已完成所有间隔

  // 复习状态
  nextReviewAt: Date; // 下次复习时间
  totalReviews: number; // 总复习次数
  consecutiveCorrect: number; // 连续正确次数
  lastReviewResult: "correct" | "incorrect" | null; // 最后复习结果

  // 练习相关字段
  todayPracticeCount: number; // 今日练习次数，用于轮次控制
  lastPracticedAt: Date; // 最后练习时间

  // 词典关联信息
  sourceDicts: string[]; // 这个单词出现在哪些词典中
  preferredDict: string; // 优先使用哪个词典的释义和发音

  // 时间戳
  firstSeenAt: Date; // 首次遇到该单词的时间
  lastReviewedAt: Date; // 最后复习时间

  // 同步相关
  sync_status: string; // 同步状态
  last_modified: number; // 客户端记录的最后修改时间戳
  clientModifiedAt: Date; // 客户端记录的最后修改时间
  isDeleted: boolean; // 是否已删除

  // Mongoose Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const WordReviewRecordSchema: Schema<IWordReviewRecord> = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      immutable: true, // 设置为不可变，更新时忽略此字段
      // 移除 index: true，unique: true 已经创建了索引
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // 移除 index: true，使用 Schema 级别的索引定义
    },
    word: {
      type: String,
      required: true,
      // 移除 index: true，word 索引包含在复合索引中
    },

    // 客户端算法字段
    intervalSequence: {
      type: [Number],
      required: true,
      default: [1, 3, 7, 15, 30, 60],
    },
    currentIntervalIndex: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isGraduated: {
      type: Boolean,
      required: true,
      default: false,
    },

    // 复习状态
    nextReviewAt: {
      type: Date,
      required: true,
      // 移除 index: true，使用 Schema 级别的复合索引
    },
    totalReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    consecutiveCorrect: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastReviewResult: {
      type: String,
      enum: ["correct", "incorrect", null],
      default: null,
    },

    // 练习相关字段
    todayPracticeCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastPracticedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // 词典关联信息
    sourceDicts: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "sourceDicts must contain at least one dictionary",
      },
    },
    preferredDict: {
      type: String,
      required: true,
    },

    // 时间戳
    firstSeenAt: {
      type: Date,
      required: true,
    },
    lastReviewedAt: {
      type: Date,
      required: true,
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
      // 移除 index: true，isDeleted 索引不是必需的
    },
  },
  { timestamps: true }
);

// 索引：确保 (userId, word) 的组合是唯一的
WordReviewRecordSchema.index({ userId: 1, word: 1 }, { unique: true });

// 常用查询索引
WordReviewRecordSchema.index({ userId: 1, nextReviewAt: 1 }); // 按复习时间查询
WordReviewRecordSchema.index({ userId: 1, lastReviewedAt: 1 }); // 按最后复习时间查询
WordReviewRecordSchema.index({ userId: 1, updatedAt: 1 }); // 同步查询

export default mongoose.model<IWordReviewRecord>(
  "wordReviewRecords", // 将模型名称从"WordReviewRecord"改为"wordReviewRecords"
  WordReviewRecordSchema
);
