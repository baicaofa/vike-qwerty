import mongoose from "mongoose";

export interface ICustomDictionary extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  length: number;
  language: string;
  languageCategory: string;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  version: number;
}

const customDictionarySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "词库名称是必需的"],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "我的词库",
  },
  tags: {
    type: [String],
    default: [],
  },
  length: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    default: "en",
  },
  languageCategory: {
    type: String,
    default: "en",
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  version: {
    type: Number,
    default: 1,
  },
});

// 复合唯一索引：确保同一用户下词库名称唯一
customDictionarySchema.index({ userId: 1, name: 1 }, { unique: true });

// 更新时自动更新updatedAt字段
customDictionarySchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

export default mongoose.model<ICustomDictionary>(
  "CustomDictionary",
  customDictionarySchema
);
