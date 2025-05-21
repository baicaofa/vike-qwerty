import type { IUser } from "./User";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

// 修改: 将 UserDocument 修改为 IUser

// 与客户端一致的 IPerformanceEntry，但 timeStamp 使用 Date 类型
export interface IPerformanceEntry {
  timeStamp: Date; // 服务端通常用 Date 类型
  chapter: number | null;
  timing: number[];
  wrongCount: number;
  mistakes: { [index: number]: string[] }; // 与客户端 LetterMistakes 一致
  // entryUuid?: string; // 可选：为每个 performance entry 添加唯一ID，便于精确操作和去重
}

export interface IWordRecord extends Document {
  uuid: string; // 全局唯一 ID，用于同步，标识这个 (word, dict, userId) 的组合
  userId: mongoose.Types.ObjectId | IUser; // 修改: 将 UserDocument 修改为 IUser // 关联到 User 模型
  word: string;
  dict: string;
  // timeStamp: Date; // 移除
  // chapter: number | null; // 移除
  // timing: number[]; // 移除
  // wrongCount: number; // 移除
  // mistakes: { [index: number]: string[] }; // 移除

  performanceHistory: IPerformanceEntry[]; // 新增：历史表现记录

  firstSeenAt?: Date; // 新增：首次记录该单词的时间戳
  lastPracticedAt?: Date; // 新增：最近一次练习该单词的时间戳

  sync_status: string; // 同步状态，主要由客户端维护，服务器可记录
  last_modified: number; // 客户端记录的最后修改时间戳 (Unix timestamp)
  clientModifiedAt: Date; // 客户端记录的最后修改时间 (Date object)
  // serverModifiedAt: Date; // Mongoose timestamps 会自动添加 updatedAt，可作为此用途
  isDeleted: boolean;

  // Mongoose Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceEntrySchema: Schema<IPerformanceEntry> = new Schema(
  {
    timeStamp: { type: Date, required: true },
    chapter: { type: Number, default: null },
    timing: { type: [Number], required: true },
    wrongCount: { type: Number, required: true },
    mistakes: { type: Schema.Types.Mixed, required: true }, // Schema.Types.Mixed 用于灵活的对象结构
    // entryUuid: { type: String, unique: true, sparse: true }, // 如果添加，确保唯一性
  },
  { _id: false }
); // _id: false 表示子文档不自动生成 _id

const WordRecordSchema: Schema<IWordRecord> = new Schema(
  {
    uuid: { type: String, required: true, unique: true, index: true }, // 保持 uuid 唯一性并索引
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    word: { type: String, required: true },
    dict: { type: String, required: true, index: true },

    performanceHistory: { type: [PerformanceEntrySchema], default: [] },

    firstSeenAt: { type: Date },
    lastPracticedAt: { type: Date },

    sync_status: { type: String, default: "synced" }, // 服务器端默认为 synced
    last_modified: { type: Number, required: true }, // 客户端时间戳
    clientModifiedAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true } // 自动管理 createdAt 和 updatedAt (作为 serverModifiedAt)
);

// 关键索引：确保 (userId, dict, word) 的组合是唯一的
// 这将强制每个用户在每个词典中对每个单词只有一个 WordRecord 文档
WordRecordSchema.index({ userId: 1, dict: 1, word: 1 }, { unique: true });

// 可选：为常用的查询字段添加索引
WordRecordSchema.index({ userId: 1, updatedAt: 1 }); // 用于按用户和最后更新时间查询
WordRecordSchema.index({ userId: 1, lastPracticedAt: 1 }); // 用于按用户和最后练习时间查询

// 移除旧的 chapter 索引，因为它不再是顶级字段
// WordRecordSchema.index({ dict: 1, chapter: 1 });

export default mongoose.model<IWordRecord>("WordRecord", WordRecordSchema);
