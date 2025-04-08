import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface IReviewRecord extends Document {
  uuid: string;
  userId: mongoose.Types.ObjectId;
  dict: string;
  createTime: Date;
  isFinished: boolean;
  words: any[]; // 使用any[]类型，因为Word类型可能未定义
  sync_status: string;
  last_modified: Date;
  clientModifiedAt: Date;
  serverModifiedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewRecordSchema: Schema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dict: { type: String, required: true },
    createTime: { type: Date, required: true },
    isFinished: { type: Boolean, required: true },
    words: { type: [Schema.Types.Mixed], required: true },
    sync_status: { type: String, default: "synced" },
    last_modified: { type: Date, required: true },
    clientModifiedAt: { type: Date, required: true },
    serverModifiedAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create index for efficient querying
ReviewRecordSchema.index({ userId: 1, updatedAt: 1 });
ReviewRecordSchema.index({ uuid: 1 });
ReviewRecordSchema.index({ userId: 1, createTime: 1 });

export default mongoose.model<IReviewRecord>(
  "ReviewRecord",
  ReviewRecordSchema
);
