import mongoose from "mongoose";

/**
 * 例句接口
 */
export interface ISentence {
  english: string;
  chinese: string;
}

/**
 * 详细翻译接口
 */
export interface IDetailedTranslation {
  pos: string; // 词性：n, v, adj, adv等
  chinese: string;
  english: string;
}

/**
 * 官方词汇库接口
 */
export interface IOfficialWordLibrary extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  id: string; // 自定义ID
  name: string; // 单词名称
  usphone: string; // 美式音标
  ukphone: string; // 英式音标
  sentences: ISentence[]; // 例句
  detailed_translations: IDetailedTranslation[]; // 详细翻译
  frequency: number; // 词频等级 1-10（10最高频）
  difficulty: number; // 难度等级 1-10（10最难）
  tags: string[]; // 标签：['CET4', 'TOEFL', 'GRE']等
  wordLength: number; // 单词长度（用于索引优化）
  firstLetter: string; // 首字母（用于索引优化）
  createdAt: number;
  updatedAt: number;
}

/**
 * 例句Schema
 */
const sentenceSchema = new mongoose.Schema(
  {
    english: {
      type: String,
      required: true,
      trim: true,
    },
    chinese: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * 详细翻译Schema
 */
const detailedTranslationSchema = new mongoose.Schema(
  {
    pos: {
      type: String,
      required: true,
      trim: true,
      index: true, // 为词性建立索引，便于按词性查询
    },
    chinese: {
      type: String,
      required: true,
      trim: true,
    },
    english: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * 官方词汇库Schema
 */
const officialWordLibrarySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "单词名称是必需的"],
    unique: true, // 单词名称唯一
    trim: true,
    lowercase: true, // 自动转换为小写
    index: true, // 主要查询字段，建立索引
  },
  usphone: {
    type: String,
    default: "",
    trim: true,
  },
  ukphone: {
    type: String,
    default: "",
    trim: true,
  },
  sentences: {
    type: [sentenceSchema],
    default: [],
  },
  detailed_translations: {
    type: [detailedTranslationSchema],
    default: [],
  },
  frequency: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
    index: true, // 用于按频率排序
  },
  difficulty: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
    index: true, // 用于按难度筛选
  },
  tags: {
    type: [String],
    default: [],
    index: true, // 用于按标签筛选
  },
  wordLength: {
    type: Number,
    required: true,
    index: true, // 用于按长度筛选
  },
  firstLetter: {
    type: String,
    required: true,
    maxlength: 1,
    lowercase: true,
    index: true, // 用于按首字母筛选
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

// 复合索引：提高查询性能
officialWordLibrarySchema.index({ name: 1, frequency: -1 }); // 按名称和频率查询
officialWordLibrarySchema.index({ firstLetter: 1, wordLength: 1 }); // 按首字母和长度查询
officialWordLibrarySchema.index({ tags: 1, difficulty: 1 }); // 按标签和难度查询
officialWordLibrarySchema.index({ frequency: -1, difficulty: 1 }); // 按频率和难度排序

// 文本索引：支持模糊搜索
officialWordLibrarySchema.index({
  name: "text",
  "detailed_translations.chinese": "text",
  "detailed_translations.english": "text",
});

// 更新时间自动更新
officialWordLibrarySchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // 自动计算派生字段
  if (this.name) {
    this.wordLength = this.name.length;
    this.firstLetter = this.name.charAt(0).toLowerCase();
  }

  next();
});

// 更新操作时自动更新时间戳
officialWordLibrarySchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);

export default mongoose.model<IOfficialWordLibrary>(
  "OfficialWordLibrary",
  officialWordLibrarySchema
);
