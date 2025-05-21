"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PerformanceEntrySchema = new mongoose_1.Schema({
    timeStamp: { type: Date, required: true },
    chapter: { type: Number, default: null },
    timing: { type: [Number], required: true },
    wrongCount: { type: Number, required: true },
    mistakes: { type: mongoose_1.Schema.Types.Mixed, required: true }, // Schema.Types.Mixed 用于灵活的对象结构
    // entryUuid: { type: String, unique: true, sparse: true }, // 如果添加，确保唯一性
}, { _id: false }); // _id: false 表示子文档不自动生成 _id
var WordRecordSchema = new mongoose_1.Schema({
    uuid: { type: String, required: true, unique: true, index: true }, // 保持 uuid 唯一性并索引
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    word: { type: String, required: true },
    dict: { type: String, required: true, index: true },
    performanceHistory: { type: [PerformanceEntrySchema], default: [] },
    firstSeenAt: { type: Date },
    lastPracticedAt: { type: Date },
    sync_status: { type: String, default: "synced" }, // 服务器端默认为 synced
    last_modified: { type: Number, required: true }, // 客户端时间戳
    clientModifiedAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true } // 自动管理 createdAt 和 updatedAt (作为 serverModifiedAt)
);
// 关键索引：确保 (userId, dict, word) 的组合是唯一的
// 这将强制每个用户在每个词典中对每个单词只有一个 WordRecord 文档
WordRecordSchema.index({ userId: 1, dict: 1, word: 1 }, { unique: true });
// 可选：为常用的查询字段添加索引
WordRecordSchema.index({ userId: 1, updatedAt: 1 }); // 用于按用户和最后更新时间查询
WordRecordSchema.index({ userId: 1, lastPracticedAt: 1 }); // 用于按用户和最后练习时间查询
// 移除旧的 chapter 索引，因为它不再是顶级字段
// WordRecordSchema.index({ dict: 1, chapter: 1 }); 
exports.default = mongoose_1.default.model("WordRecord", WordRecordSchema);
