/**
 * 引入 Mongoose 库及其相关类型
 * mongoose 是用于连接和操作 MongoDB 数据库的 Node.js 库
 * Schema 用于定义 MongoDB 文档的结构
 * Document 是 Mongoose 中表示文档的接口
 */
import mongoose, { Document, Schema } from "mongoose";

/**
 * 定义 IWordRecord 接口，继承自 Mongoose 的 Document 接口
 * 该接口描述了 WordRecord 文档的结构
 */
export interface IWordRecord extends Document {
  // 唯一标识符，用于标识每个单词记录
  uuid: string;
  // 用户 ID，关联到 User 模型，使用 Mongoose 的 ObjectId 类型
  userId: mongoose.Types.ObjectId;
  // 单词内容
  word: string;
  // 时间戳
  timeStamp: Date;
  // 词典ID
  dict: string;
  // 章节ID
  chapter: number | null;
  // 正确次数中输入每个字母的时间差
  timing: number[];
  // 错误次数
  wrongCount: number;
  // 每个字母被错误输入成什么
  mistakes: { [index: number]: string[] };
  // 同步状态
  sync_status: string;
  // 最后修改时间
  last_modified: number;
  // 客户端最后修改时间
  clientModifiedAt: Date;
  // 服务器最后修改时间
  serverModifiedAt: Date;
  // 记录是否已删除的标志
  isDeleted: boolean;
  // 记录创建时间，由 Mongoose 自动管理
  createdAt: Date;
  // 记录更新时间，由 Mongoose 自动管理
  updatedAt: Date;
}

/**
 * 定义 WordRecordSchema，用于描述 WordRecord 文档的结构
 * 该模式包含了文档的字段定义和验证规则
 */
const WordRecordSchema: Schema = new Schema(
  {
    // 唯一标识符，字符串类型，必需且唯一
    uuid: { type: String, required: true, unique: true },
    // 用户 ID，关联到 User 模型，使用 Mongoose 的 ObjectId 类型，必需
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // 单词内容，字符串类型，必需
    word: { type: String, required: true },
    // 时间戳，日期类型，必需
    timeStamp: { type: Date, required: true },
    // 词典ID，字符串类型，必需
    dict: { type: String, required: true },
    // 章节ID，数字类型，可以为null
    chapter: { type: Number, default: null },
    // 正确次数中输入每个字母的时间差，数组类型，必需
    timing: { type: [Number], required: true },
    // 错误次数，数字类型，必需
    wrongCount: { type: Number, required: true },
    // 每个字母被错误输入成什么，对象类型，必需
    mistakes: { type: Schema.Types.Mixed, required: true },
    // 同步状态，字符串类型，默认值为 "synced"
    sync_status: { type: String, default: "synced" },
    // 最后修改时间，数字类型，必需
    last_modified: { type: Number, required: true },
    // 客户端最后修改时间，日期类型，必需
    clientModifiedAt: { type: Date, required: true },
    // 服务器最后修改时间，日期类型，必需
    serverModifiedAt: { type: Date, required: true },
    // 记录是否已删除的标志，布尔类型，默认值为 false
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // 启用 Mongoose 的时间戳功能，自动管理 createdAt 和 updatedAt 字段
);

// 创建索引以提高查询效率
// 按 userId 和 updatedAt 字段创建复合索引
WordRecordSchema.index({ userId: 1, updatedAt: 1 });
// 按 uuid 字段创建索引
WordRecordSchema.index({ uuid: 1 });
// 按 dict 和 chapter 字段创建复合索引
WordRecordSchema.index({ dict: 1, chapter: 1 });

/**
 * 创建并导出 WordRecord 模型
 * 使用 IWordRecord 接口来定义模型的文档类型
 * "WordRecord" 是模型的名称，对应 MongoDB 中的集合名称
 * WordRecordSchema 是用于定义文档结构的模式
 */
export default mongoose.model<IWordRecord>("WordRecord", WordRecordSchema);
