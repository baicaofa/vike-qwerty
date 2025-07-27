import type { ISentence, IDetailedTranslation } from "./OfficialWordLibrary";
import mongoose from "mongoose";

export interface ICustomWord extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  dictId: string;
  name: string;
  index: number;

  // 数据来源标识
  sourceType: "official" | "user_custom" | "empty";
  officialWordId?: string; // 关联官方词汇库ID

  // 用户数据（仅在修改或自定义时存储）
  userData?: {
    usphone: string;
    ukphone: string;
    sentences: ISentence[];
    detailed_translations: IDetailedTranslation[];
  };

  // 状态标识
  isUserModified: boolean; // 用户是否修改过
  isEmpty: boolean; // 是否为空白待填写

  createdAt: number;
  updatedAt: number;
}

// 用户数据子Schema
const userDataSchema = new mongoose.Schema(
  {
    usphone: {
      type: String,
      default: "",
    },
    ukphone: {
      type: String,
      default: "",
    },
    sentences: {
      type: [
        {
          english: { type: String, required: true },
          chinese: { type: String, required: true },
        },
      ],
      default: [],
    },
    detailed_translations: {
      type: [
        {
          pos: { type: String, required: true },
          chinese: { type: String, required: true },
          english: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const customWordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  dictId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "单词是必需的"],
    trim: true,
    index: true,
  },
  index: {
    type: Number,
    required: true,
    default: 0,
  },

  // 数据来源标识
  sourceType: {
    type: String,
    enum: ["official", "user_custom", "empty"],
    default: "empty",
  },
  officialWordId: {
    type: String,
  },

  // 用户数据
  userData: {
    type: userDataSchema,
    default: undefined,
  },

  // 状态标识
  isUserModified: {
    type: Boolean,
    default: false,
  },
  isEmpty: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

// 创建复合索引，用于按词库ID和索引排序
customWordSchema.index({ dictId: 1, index: 1 });
customWordSchema.index({ sourceType: 1 });
customWordSchema.index({ officialWordId: 1 });

export default mongoose.model<ICustomWord>("CustomWord", customWordSchema);
