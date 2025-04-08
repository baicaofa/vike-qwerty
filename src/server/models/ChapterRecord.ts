import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface IChapterRecord extends Document {
  uuid: string;
  userId: mongoose.Types.ObjectId;
  timeStamp: Date;
  dict: string;
  chapter: number | null;
  time: number;
  id: number;
  correctCount: number;
  wrongCount: number;
  wordCount: number;
  correctWordIndexes: number[];
  wordNumber: number;
  wordRecordIds: number[];
  sync_status: string;
  last_modified: Date;
  clientModifiedAt: Date;
  serverModifiedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterRecordSchema: Schema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Number, required: true },
    timeStamp: { type: Date, required: true },
    dict: { type: String, required: true },
    chapter: { type: Number, default: null },
    time: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true },
    wordCount: { type: Number, required: true },
    correctWordIndexes: { type: [Number], required: true },
    wordNumber: { type: Number, required: true },
    wordRecordIds: { type: [Number], required: true },
    sync_status: { type: String, default: "synced" },
    last_modified: { type: Date, required: true },
    clientModifiedAt: { type: Date, required: true },
    serverModifiedAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create index for efficient querying
ChapterRecordSchema.index({ userId: 1, updatedAt: 1 });
ChapterRecordSchema.index({ uuid: 1 });
ChapterRecordSchema.index({ dict: 1, chapter: 1 });

export default mongoose.model<IChapterRecord>(
  "ChapterRecord",
  ChapterRecordSchema
);
