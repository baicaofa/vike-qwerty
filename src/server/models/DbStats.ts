import mongoose from "mongoose";

// 定义数据库版本统计信息模型的接口
export interface IDbStats {
  deviceId: string;
  currentVersion: number;
  expectedVersion: number;
  timestamp: Date;
  userAgent: string;
}

// 定义数据库版本统计信息的Schema
const DbStatsSchema = new mongoose.Schema<IDbStats>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    currentVersion: {
      type: Number,
      required: true,
    },
    expectedVersion: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// 创建并导出模型
export default mongoose.model<IDbStats>("DbStats", DbStatsSchema);
