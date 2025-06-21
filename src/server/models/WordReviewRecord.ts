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

  // 复习状态
  forgettingFactor: number; // 个人遗忘系数 (0.1-1.0)
  nextReviewAt: Date; // 下次复习时间
  reviewLevel: number; // 复习等级 (0-6)
  consecutiveCorrect: number; // 连续正确次数
  lastReviewResult: "correct" | "incorrect" | null; // 最后复习结果

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
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    word: {
      type: String,
      required: true,
      index: true,
    },

    // 复习状态
    forgettingFactor: {
      type: Number,
      required: true,
      default: 0.5,
      min: 0.1,
      max: 1.0,
    },
    nextReviewAt: {
      type: Date,
      required: true,
      index: true,
    },
    reviewLevel: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 6,
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
      index: true,
    },
  },
  { timestamps: true }
);

// 索引：确保 (userId, word) 的组合是唯一的
WordReviewRecordSchema.index({ userId: 1, word: 1 }, { unique: true });

// 常用查询索引
WordReviewRecordSchema.index({ userId: 1, nextReviewAt: 1 }); // 按复习时间查询
WordReviewRecordSchema.index({ userId: 1, reviewLevel: 1 }); // 按复习等级查询
WordReviewRecordSchema.index({ userId: 1, lastReviewedAt: 1 }); // 按最后复习时间查询
WordReviewRecordSchema.index({ userId: 1, updatedAt: 1 }); // 同步查询

export default mongoose.model<IWordReviewRecord>(
  "WordReviewRecord",
  WordReviewRecordSchema
);
