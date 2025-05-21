"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// 确保 WordRecordModel 和 IUser 的路径正确
var WordRecord_1 = require("../server/models/WordRecord");
function migrateWordRecords() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, oldRecords, groupedRecords, idsOfOldRecordsToDelete_1, _a, _b, _c, _i, key, group, performanceHistory, newAggregatedUuid, latestLastModified, newRecordData, existingMigratedRecord, error_2, deleteResult, error_3;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR')];
                case 1:
                    _e.sent();
                    console.log('MongoDB connected successfully.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _e.sent();
                    console.error('MongoDB connection error:', error_1);
                    return [2 /*return*/]; // 连接失败则退出
                case 3:
                    console.log('开始 WordRecord 数据迁移...');
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 18, 19, 20]);
                    return [4 /*yield*/, WordRecord_1.default.find({
                            timeStamp: { $exists: true }, // 假设 timeStamp 在顶层表明是旧记录
                            performanceHistory: { $exists: false } // 并且没有 performanceHistory 字段
                        }).lean()];
                case 5:
                    oldRecords = _e.sent();
                    if (oldRecords.length === 0) {
                        console.log('没有找到需要迁移的旧版 WordRecord 文档。');
                        // await mongoose.disconnect(); // 如果在此处管理连接
                        return [2 /*return*/];
                    }
                    console.log("\u627E\u5230 ".concat(oldRecords.length, " \u6761\u65E7\u7248\u8BB0\u5F55\u5F85\u5904\u7406\u3002"));
                    groupedRecords = oldRecords.reduce(function (acc, record) {
                        var userIdString = record.userId.toString(); // 将 ObjectId 转换为字符串作为键的一部分
                        var key = "".concat(userIdString, "-").concat(record.dict, "-").concat(record.word);
                        if (!acc[key]) {
                            acc[key] = {
                                userId: record.userId,
                                dict: record.dict,
                                word: record.word,
                                flatEntries: [],
                                uuidsFromOldRecords: new Set(),
                                minFirstSeenAt: record.timeStamp, // 初始化为当前记录的时间戳
                                maxLastPracticedAt: record.timeStamp, // 初始化为当前记录的时间戳
                                allLastModified: [], // 收集所有 last_modified 时间戳
                            };
                        }
                        acc[key].flatEntries.push(record);
                        if (record.uuid) {
                            acc[key].uuidsFromOldRecords.add(record.uuid);
                        }
                        if (record.timeStamp < acc[key].minFirstSeenAt) {
                            acc[key].minFirstSeenAt = record.timeStamp;
                        }
                        if (record.timeStamp > acc[key].maxLastPracticedAt) {
                            acc[key].maxLastPracticedAt = record.timeStamp;
                        }
                        if (typeof record.last_modified === 'number') {
                            acc[key].allLastModified.push(record.last_modified);
                        }
                        return acc;
                    }, {});
                    idsOfOldRecordsToDelete_1 = [];
                    _a = groupedRecords;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _e.label = 6;
                case 6:
                    if (!(_i < _b.length)) return [3 /*break*/, 14];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 13];
                    key = _c;
                    group = groupedRecords[key];
                    performanceHistory = group.flatEntries
                        .map(function (oldEntry) { return ({
                        timeStamp: oldEntry.timeStamp,
                        chapter: oldEntry.chapter,
                        timing: oldEntry.timing,
                        wrongCount: oldEntry.wrongCount,
                        mistakes: oldEntry.mistakes,
                        // 如果旧记录的 uuid 是针对单次练习的，可以考虑在这里生成 entryUuid
                        // entryUuid: oldEntry.uuid || uuidv4(), 
                    }); })
                        .sort(function (a, b) { return a.timeStamp.getTime() - b.timeStamp.getTime(); });
                    newAggregatedUuid = (_d = group.uuidsFromOldRecords.values().next().value) !== null && _d !== void 0 ? _d : "migrated-".concat(group.userId.toString(), "-").concat(group.dict, "-").concat(group.word, "-").concat(Date.now());
                    latestLastModified = group.allLastModified.length > 0
                        ? Math.max.apply(Math, group.allLastModified) : Date.now();
                    newRecordData = {
                        uuid: newAggregatedUuid,
                        userId: group.userId,
                        dict: group.dict,
                        word: group.word,
                        performanceHistory: performanceHistory,
                        firstSeenAt: group.minFirstSeenAt,
                        lastPracticedAt: group.maxLastPracticedAt,
                        sync_status: 'synced', // 服务器端迁移后通常认为是已同步状态
                        last_modified: latestLastModified,
                        clientModifiedAt: new Date(latestLastModified), // 从时间戳转换
                        isDeleted: false,
                    };
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 12, , 13]);
                    return [4 /*yield*/, WordRecord_1.default.findOne({
                            userId: group.userId,
                            dict: group.dict,
                            word: group.word,
                        })];
                case 8:
                    existingMigratedRecord = _e.sent();
                    if (!existingMigratedRecord) return [3 /*break*/, 9];
                    console.warn("\u5DF2\u5B58\u5728\u9488\u5BF9\u5206\u7EC4 ".concat(key, " \u7684\u8FC1\u79FB\u540E\u8BB0\u5F55\u3002\u5C06\u5C1D\u8BD5\u5408\u5E76/\u66F4\u65B0\u3002"));
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, WordRecord_1.default.create(newRecordData)];
                case 10:
                    _e.sent();
                    console.log("\u4E3A\u5206\u7EC4 ".concat(key, " \u521B\u5EFA\u4E86\u65B0\u7684\u805A\u5408\u8BB0\u5F55\u3002"));
                    _e.label = 11;
                case 11:
                    // 标记该组内的旧记录ID以便删除
                    group.flatEntries.forEach(function (oldEntry) { return idsOfOldRecordsToDelete_1.push(oldEntry._id); });
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _e.sent();
                    console.error("\u5904\u7406\u5206\u7EC4 ".concat(key, " \u65F6\u51FA\u9519:"), error_2);
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 6];
                case 14:
                    if (!(idsOfOldRecordsToDelete_1.length > 0)) return [3 /*break*/, 16];
                    console.log("\u51C6\u5907\u5220\u9664 ".concat(idsOfOldRecordsToDelete_1.length, " \u6761\u65E7\u7248\u6241\u5E73\u5316\u8BB0\u5F55..."));
                    return [4 /*yield*/, WordRecord_1.default.deleteMany({ _id: { $in: idsOfOldRecordsToDelete_1 } })];
                case 15:
                    deleteResult = _e.sent();
                    console.log("\u6210\u529F\u5220\u9664\u4E86 ".concat(deleteResult.deletedCount, " \u6761\u65E7\u7248\u6241\u5E73\u5316\u8BB0\u5F55\u3002"));
                    return [3 /*break*/, 17];
                case 16:
                    console.log('没有旧记录被标记为删除（可能已处理或跳过）。');
                    _e.label = 17;
                case 17:
                    console.log('WordRecord 数据迁移成功完成。');
                    return [3 /*break*/, 20];
                case 18:
                    error_3 = _e.sent();
                    console.error('WordRecord 数据迁移过程中发生错误:', error_3);
                    return [3 /*break*/, 20];
                case 19: return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    });
}
// --- 如何运行此脚本 ---
// 1. 确保 MongoDB 服务正在运行且可访问。
// 2. 在脚本顶部配置好 MongoDB 的连接字符串。
// 3. 如果需要生成 UUID，安装 `uuid` 包: `npm install uuid` 或 `yarn add uuid`，并取消注释相关导入。
// 4. 使用 ts-node 执行脚本: `npx ts-node src/scripts/migrate-wordrecords.ts`
//
// 调用迁移函数 (通常在脚本末尾，确保在连接建立后执行):
// migrateWordRecords()
//   .then(() => console.log('迁移脚本执行完毕。'))
//   .catch(e => console.error('迁移脚本执行失败:', e))
//   .finally(() => {
//     // 确保在所有操作完成后关闭连接（如果在此脚本中打开）
//     // mongoose.disconnect();
//   });
// 示例：直接调用（确保在 mongoose.connect 成功后）
// (async () => {
//   await mongoose.connect('YOUR_MONGO_URI'); // 替换为你的连接 URI
//   await migrateWordRecords();
//   await mongoose.disconnect();
// })();
