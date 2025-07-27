import ChapterRecord from "../models/ChapterRecord";
import FamiliarWord from "../models/FamiliarWord";
import ReviewConfigModel from "../models/ReviewConfig";
import ReviewHistoryModel from "../models/ReviewHistory";
import ReviewRecord from "../models/ReviewRecord";
import WordRecordModel, { // 统一使用这个导入
  type IWordRecord,
  type IPerformanceEntry as ServerPerformanceEntry,
} from "../models/WordRecord";
import WordReviewRecordModel from "../models/WordReviewRecord";
// WordRecord 将从下面的 WordRecordModel 导入中统一处理
import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { Model } from "mongoose";

// Define types for sync request and response
interface SyncChange {
  table:
    | "wordRecords"
    | "wordrecords" // 添加小写版本
    | "chapterRecords"
    | "reviewRecords"
    | "familiarWords"
    | "wordReviewRecords"
    | "reviewHistories"
    | "reviewConfigs"
    | "reviewconfigs"; // 添加小写版本
  action: "create" | "update" | "delete";
  data: any;
}

interface SyncRequest {
  lastSyncTimestamp: string;
  changes: SyncChange[];
}

interface SyncResponse {
  newSyncTimestamp: string;
  serverChanges: SyncChange[];
}

// Helper function to get the appropriate model based on table name
const getModel = (table: string): Model<any> => {
  switch (table) {
    case "wordRecords":
    case "wordrecords": // 添加小写版本
      return WordRecordModel; // <--- 确保使用 WordRecordModel
    case "chapterRecords":
      return ChapterRecord;
    case "reviewRecords":
      return ReviewRecord;
    case "familiarWords":
      return FamiliarWord;
    case "wordReviewRecords":
      return WordReviewRecordModel;
    case "reviewHistories":
      return ReviewHistoryModel;
    case "reviewConfigs":
    case "reviewconfigs": // 添加小写版本
      return ReviewConfigModel;
    default:
      throw new Error(`Unknown table: ${table}`);
  }
};

// Helper function to format a record for sync response (旧的，将被移除)
/*
const formatRecordForSync = (record: any, table: string): SyncChange => {
  return {
    table: table as
      | "wordRecords"
      | "chapterRecords"
      | "reviewRecords"
      | "familiarWords",
    action: record.isDeleted ? "delete" : "update",
    data: record.toObject(),
  };
};
*/

// 辅助函数：安全地转换日期
const safeParseDate = (dateValue: any): Date | undefined => {
  if (!dateValue) return undefined;

  // 如果已经是日期对象，直接返回
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? undefined : dateValue;
  }

  // 尝试解析日期字符串
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? undefined : date;
};

// 辅助函数：合并 Performance History 数组
// 注意：服务器端的 IPerformanceEntry 使用 Date 类型的时间戳
function mergePerformanceHistories(
  serverHistory: ServerPerformanceEntry[],
  clientHistory: ServerPerformanceEntry[] // 假设客户端传来的时间戳已转换为 Date
): ServerPerformanceEntry[] {
  const map = new Map<string, ServerPerformanceEntry>();

  // 为确保唯一性，可以使用 timeStamp.toISOString() 或一个专门的 entryUuid
  // 这里我们简单使用 timeStamp.getTime() 作为键，假设同一毫秒内不会有重复练习记录
  // 更健壮的做法是为 IPerformanceEntry 添加一个客户端生成的唯一 entryUuid
  const getKey = (entry: ServerPerformanceEntry) =>
    entry.timeStamp.getTime().toString();

  for (const entry of serverHistory) {
    map.set(getKey(entry), entry);
  }
  for (const entry of clientHistory) {
    // 如果键已存在，并且内容不同，可以根据业务逻辑决定是否覆盖
    // 对于练习历史，通常不同的练习应该有不同的时间戳，所以直接添加或更新
    map.set(getKey(entry), entry); // 简单覆盖，或添加更复杂的比较逻辑
  }
  return Array.from(map.values()).sort(
    (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
  );
}

export const syncData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { changes, lastSyncTimestamp: clientLastSyncTimestampStr } = req.body;
    const clientLastSyncTimestamp =
      safeParseDate(clientLastSyncTimestampStr) || new Date(0);

    // Process client changes
    for (const change of changes) {
      const { table, action, data: clientRecordData } = change;

      if (table === "wordRecords") {
        const {
          uuid, // 客户端生成的 uuid
          dict,
          word,
          performanceHistory: clientPerformanceHistoryData, // 客户端传来的 performanceHistory
          firstSeenAt: clientFirstSeenAt,
          lastPracticedAt: clientLastPracticedAt,
          last_modified: clientLastModified, // 客户端的 Unix timestamp
          sync_status: clientSyncStatus, // 客户端的 sync_status
          // ...其他可能从客户端传来的字段 (如 isDeleted for delete action)
        } = clientRecordData as IWordRecord & { performanceHistory: any[] }; // 类型断言，因为客户端传来的时间戳是 number

        const query = { userId, dict, word };

        // 将客户端的 performanceHistory 中的 timeStamp (number) 转换为 Date
        const clientPerformanceHistory: ServerPerformanceEntry[] = (
          clientPerformanceHistoryData || []
        ).map((entry) => ({
          ...entry,
          mistakes: entry.mistakes || {}, // 如果客户端没有传，设为空对象，避免 validation 错误
          timeStamp: safeParseDate(entry.timeStamp) || new Date(), // 转换时间戳
        }));

        if (action === "create" || action === "update") {
          let serverRecord = await WordRecordModel.findOne(query);

          const clientFirstSeenAtDate = safeParseDate(clientFirstSeenAt);
          const clientLastPracticedAtDate = safeParseDate(
            clientLastPracticedAt
          );

          if (serverRecord) {
            // Update existing record
            const mergedHistory = mergePerformanceHistories(
              serverRecord.performanceHistory,
              clientPerformanceHistory
            );
            serverRecord.performanceHistory = mergedHistory;

            // 更新 firstSeenAt (取两者中较早的)
            if (
              clientFirstSeenAtDate &&
              (!serverRecord.firstSeenAt ||
                clientFirstSeenAtDate < serverRecord.firstSeenAt)
            ) {
              serverRecord.firstSeenAt = clientFirstSeenAtDate;
            }
            // 更新 lastPracticedAt (取两者中较晚的)
            if (
              clientLastPracticedAtDate &&
              (!serverRecord.lastPracticedAt ||
                clientLastPracticedAtDate > serverRecord.lastPracticedAt)
            ) {
              serverRecord.lastPracticedAt = clientLastPracticedAtDate;
            }
            // 如果 performanceHistory 为空，确保 firstSeenAt 和 lastPracticedAt 也被清除或设为合理值
            if (serverRecord.performanceHistory.length === 0) {
              serverRecord.firstSeenAt = undefined;
              serverRecord.lastPracticedAt = undefined;
            } else {
              // 确保 firstSeenAt 和 lastPracticedAt 基于合并后的历史
              serverRecord.firstSeenAt =
                serverRecord.performanceHistory[0]?.timeStamp;
              serverRecord.lastPracticedAt =
                serverRecord.performanceHistory[
                  serverRecord.performanceHistory.length - 1
                ]?.timeStamp;
            }

            serverRecord.last_modified =
              clientLastModified || serverRecord.last_modified; // 保留客户端的或用现有的
            serverRecord.clientModifiedAt =
              safeParseDate(clientLastModified) ||
              serverRecord.clientModifiedAt;
            serverRecord.sync_status =
              clientSyncStatus || serverRecord.sync_status; // 保留客户端的或用现有的
            // uuid 理论上不应改变，如果改变了，以客户端为准
            if (uuid && serverRecord.uuid !== uuid) {
              console.warn(
                `UUID mismatch for ${dict}-${word}. Client: ${uuid}, Server: ${serverRecord.uuid}. Updating to client UUID.`
              );
              serverRecord.uuid = uuid;
            }
            serverRecord.isDeleted =
              clientRecordData.isDeleted !== undefined
                ? clientRecordData.isDeleted
                : serverRecord.isDeleted;
          } else {
            // Create new record
            serverRecord = new WordRecordModel({
              ...query, // userId, dict, word
              uuid: uuid, // 使用客户端的 uuid，如果没有则生成一个新的
              performanceHistory: clientPerformanceHistory,
              firstSeenAt:
                clientFirstSeenAtDate ||
                (clientPerformanceHistory.length > 0
                  ? clientPerformanceHistory[0].timeStamp
                  : new Date()),
              lastPracticedAt:
                clientLastPracticedAtDate ||
                (clientPerformanceHistory.length > 0
                  ? clientPerformanceHistory[
                      clientPerformanceHistory.length - 1
                    ].timeStamp
                  : new Date()),
              last_modified: clientLastModified || Date.now(),
              clientModifiedAt: safeParseDate(clientLastModified) || new Date(),
              sync_status: clientSyncStatus || "synced", // 如果客户端没传，默认为 synced
              isDeleted: clientRecordData.isDeleted || false,
            });
          }
          await serverRecord.save();
        } else if (action === "delete") {
          const serverRecord = await WordRecordModel.findOne(query);
          if (serverRecord) {
            serverRecord.isDeleted = true;
            serverRecord.last_modified = clientLastModified || Date.now();
            serverRecord.clientModifiedAt =
              safeParseDate(clientLastModified) || new Date();
            // serverModifiedAt (updatedAt) 会自动更新
            await serverRecord.save();
          } else {
            // 如果服务器上没有这条记录，但客户端要求删除，可以考虑创建一个已删除的记录标记
            // 或者直接忽略，因为没有可删除的。这里选择忽略。
            console.log(
              `Client requested delete for non-existing WordRecord: ${dict}-${word}`
            );
          }
        }
      } else if (table === "wordReviewRecords") {
        // 特殊处理 WordReviewRecord 表，使用 (userId, word) 作为唯一标识
        // 需要进行字段映射和类型转换
        const {
          uuid,
          word,
          // 时间戳字段（需要转换 number → Date）
          firstSeenAt: clientFirstSeenAt,
          lastReviewedAt: clientLastReviewedAt,
          nextReviewAt: clientNextReviewAt,
          lastPracticedAt: clientLastPracticedAt,
          // 其他字段
          sourceDicts,
          preferredDict,
          consecutiveCorrect,
          last_modified: clientLastModified,
          sync_status: clientSyncStatus,
          isDeleted: clientIsDeleted,
          // 客户端独有字段（忽略）
          // intervalSequence, currentIntervalIndex, totalReviews, etc.
        } = clientRecordData;

        const query = { userId, word };

        if (action === "create" || action === "update") {
          // 时间戳转换和默认值处理
          const firstSeenAtDate =
            safeParseDate(clientFirstSeenAt) || new Date();
          const lastReviewedAtDate =
            safeParseDate(clientLastReviewedAt) ||
            safeParseDate(clientLastPracticedAt) ||
            firstSeenAtDate;
          const nextReviewAtDate =
            safeParseDate(clientNextReviewAt) || new Date();

          // 必需字段默认值
          const forgettingFactor = 0.5;
          const reviewLevel = 0;
          const consecutiveCorrectValue = consecutiveCorrect || 0;
          const lastReviewResult = null;

          let serverRecord = await WordReviewRecordModel.findOne(query);

          if (serverRecord) {
            // 更新现有记录
            serverRecord.uuid = uuid || serverRecord.uuid;
            serverRecord.firstSeenAt = firstSeenAtDate;
            serverRecord.lastReviewedAt = lastReviewedAtDate;
            serverRecord.nextReviewAt = nextReviewAtDate;
            serverRecord.forgettingFactor = forgettingFactor;
            serverRecord.reviewLevel = reviewLevel;
            serverRecord.consecutiveCorrect = consecutiveCorrectValue;
            serverRecord.lastReviewResult = lastReviewResult;
            serverRecord.sourceDicts =
              sourceDicts || serverRecord.sourceDicts || [];
            serverRecord.preferredDict =
              preferredDict || serverRecord.preferredDict || "";
            serverRecord.sync_status = "synced";
            serverRecord.last_modified = clientLastModified || Date.now();
            serverRecord.clientModifiedAt =
              safeParseDate(clientLastModified) || new Date();
            serverRecord.isDeleted = clientIsDeleted || false;

            await serverRecord.save();
          } else {
            // 创建新记录
            serverRecord = new WordReviewRecordModel({
              ...query, // userId, word
              uuid: uuid,
              firstSeenAt: firstSeenAtDate,
              lastReviewedAt: lastReviewedAtDate,
              nextReviewAt: nextReviewAtDate,
              forgettingFactor,
              reviewLevel,
              consecutiveCorrect: consecutiveCorrectValue,
              lastReviewResult,
              sourceDicts: sourceDicts || [],
              preferredDict: preferredDict || "",
              sync_status: "synced",
              last_modified: clientLastModified || Date.now(),
              clientModifiedAt: safeParseDate(clientLastModified) || new Date(),
              isDeleted: clientIsDeleted || false,
            });

            await serverRecord.save();
          }
        } else if (action === "delete") {
          const serverRecord = await WordReviewRecordModel.findOne(query);
          if (serverRecord) {
            if ("isDeleted" in WordReviewRecordModel.schema.paths) {
              serverRecord.isDeleted = true;
              serverRecord.last_modified =
                clientRecordData.last_modified || Date.now();
              serverRecord.clientModifiedAt =
                safeParseDate(clientRecordData.last_modified) || new Date();
              await serverRecord.save();
            } else {
              await WordReviewRecordModel.findOneAndDelete(query);
            }
          }
        }
      } else if (table === "familiarWords") {
        // 特殊处理 FamiliarWord 表，使用 (userId, dict, word) 作为唯一标识
        const { word, dict, uuid } = clientRecordData;
        const query = { userId, dict, word };

        if (action === "create" || action === "update") {
          const { _id, ...updateData } = clientRecordData;

          let serverRecord = await FamiliarWord.findOne(query);

          if (serverRecord) {
            // 更新现有记录，保持原有的 uuid
            Object.assign(serverRecord, updateData);
            serverRecord.last_modified =
              clientRecordData.last_modified || Date.now();
            serverRecord.clientModifiedAt =
              safeParseDate(clientRecordData.last_modified) || new Date();
            serverRecord.serverModifiedAt = new Date(); // 服务器修改时间
            await serverRecord.save();
          } else {
            // 创建新记录，使用客户端的 uuid
            serverRecord = new FamiliarWord({
              ...query, // userId, dict, word
              uuid: uuid, // 使用客户端的 uuid
              ...updateData,
              last_modified: clientRecordData.last_modified || Date.now(),
              clientModifiedAt:
                safeParseDate(clientRecordData.last_modified) || new Date(),
              serverModifiedAt: new Date(), // 服务器修改时间
            });
            await serverRecord.save();
          }
        } else if (action === "delete") {
          const serverRecord = await FamiliarWord.findOne(query);
          if (serverRecord) {
            if ("isDeleted" in FamiliarWord.schema.paths) {
              serverRecord.isDeleted = true;
              serverRecord.last_modified =
                clientRecordData.last_modified || Date.now();
              serverRecord.clientModifiedAt =
                safeParseDate(clientRecordData.last_modified) || new Date();
              serverRecord.serverModifiedAt = new Date(); // 服务器修改时间
              await serverRecord.save();
            } else {
              await FamiliarWord.findOneAndDelete(query);
            }
          }
        }
      } else {
        // Generic handling for other tables
        const Model = getModel(table);
        const { uuid } = clientRecordData;
        const query = { userId, uuid };

        if (action === "create" || action === "update") {
          // Use a flexible data object, excluding reserved fields from client
          const { _id, ...updateData } = clientRecordData;

          // 特殊处理 ReviewHistory 表中的 wordReviewRecordId 字段
          if (table === "reviewHistories" && updateData.wordReviewRecordId) {
            // 检查 wordReviewRecordId 是否是数字或不是有效的 ObjectId
            if (
              typeof updateData.wordReviewRecordId === "number" ||
              (typeof updateData.wordReviewRecordId === "string" &&
                !mongoose.isValidObjectId(updateData.wordReviewRecordId))
            ) {
              // 查找相应的 WordReviewRecord，获取其正确的 ObjectId
              try {
                const wordReviewRecord = await WordReviewRecordModel.findOne({
                  userId,
                  word: updateData.word,
                });

                if (wordReviewRecord) {
                  // 使用找到的记录的 ObjectId
                  updateData.wordReviewRecordId = wordReviewRecord._id;
                  console.log(
                    `找到并转换 wordReviewRecordId: ${updateData.word} -> ${wordReviewRecord._id}`
                  );
                } else {
                  console.warn(
                    `找不到 WordReviewRecord，无法转换 wordReviewRecordId，word: ${updateData.word}`
                  );
                  // 可选：跳过此记录
                  continue;
                }
              } catch (err) {
                console.error(`查找 WordReviewRecord 时出错: ${err}`);
                // 可选：跳过此记录
                continue;
              }
            }
          }

          await Model.findOneAndUpdate(
            query,
            { ...updateData, userId },
            {
              upsert: true, // Create if doesn't exist
              new: true, // Return the updated document
              setDefaultsOnInsert: true,
            }
          );
        } else if (action === "delete") {
          // For most tables, we physically delete. For tables with `isDeleted`, we mark them.
          if ("isDeleted" in Model.schema.paths) {
            await Model.findOneAndUpdate(query, {
              isDeleted: true,
              last_modified: clientRecordData.last_modified || Date.now(),
            });
          } else {
            await Model.findOneAndDelete(query);
          }
        }
      }
    }

    // Query server changes since last client sync
    const serverChangesResponse: SyncChange[] = [];
    const tables: (
      | "wordRecords"
      | "wordrecords"
      | "chapterRecords"
      | "reviewRecords"
      | "familiarWords"
      | "wordReviewRecords"
      | "reviewHistories"
      | "reviewConfigs"
      | "reviewconfigs"
    )[] = [
      "wordRecords",
      "chapterRecords",
      "reviewRecords",
      "familiarWords",
      "wordReviewRecords",
      "reviewHistories",
      "reviewConfigs",
    ];

    for (const table of tables) {
      const Model = getModel(table);
      if (!Model) continue;

      const serverModifiedRecords = await Model.find({
        userId,
        updatedAt: { $gt: clientLastSyncTimestamp }, // 使用 updatedAt 作为 serverModifiedAt
      }).lean(); // .lean() for plain JS objects, faster

      for (const record of serverModifiedRecords) {
        // formatRecordForSync 需要能正确处理新的 WordRecord 结构（包含 performanceHistory）
        // 和旧的其他表结构
        serverChangesResponse.push(formatRecordForSync(record, table));
      }
    }

    res.json({
      newSyncTimestamp: new Date().toISOString(),
      serverChanges: serverChangesResponse,
    });
  } catch (error) {
    console.error("Sync error:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Sync failed", error: error.message });
    } else {
      res.status(500).json({ message: "Sync failed", error: "Unknown error" });
    }
  }
};

// 确保 formatRecordForSync 能够正确处理 WordRecord 的 performanceHistory 中的 Date 对象
// 将 Date 对象转换为客户端期望的 number (Unix timestamp)
function formatRecordForSync(
  record: any,
  table:
    | "wordRecords"
    | "wordrecords"
    | "chapterRecords"
    | "reviewRecords"
    | "familiarWords"
    | "wordReviewRecords"
    | "reviewHistories"
    | "reviewConfigs"
    | "reviewconfigs"
): SyncChange {
  const data = { ...record };
  delete data._id; // Remove MongoDB _id
  delete data.__v; // Remove Mongoose version key
  // delete data.userId; // userId is implicit or handled by client

  if (table === "wordRecords" && data.performanceHistory) {
    data.performanceHistory = data.performanceHistory.map(
      (entry: ServerPerformanceEntry) => ({
        ...entry,
        timeStamp:
          entry.timeStamp instanceof Date
            ? entry.timeStamp.getTime()
            : entry.timeStamp,
      })
    );
  }

  // 特殊处理 ReviewHistories 表中的 wordReviewRecordId 字段
  if (table === "reviewHistories" && data.wordReviewRecordId) {
    // 将 ObjectId 转换为字符串，客户端可以在下次同步时使用
    data.wordReviewRecordId = data.wordReviewRecordId.toString();
  }

  // Convert other Date fields to Unix timestamps (numbers) for client
  for (const key in data) {
    if (data[key] instanceof Date) {
      data[key] = data[key].getTime();
    } else if (data[key] instanceof mongoose.Types.ObjectId) {
      // 将所有 ObjectId 类型转换为字符串
      data[key] = data[key].toString();
    } else if (data[key] && typeof data[key] === "object") {
      // 递归处理嵌套对象中的日期或ObjectId
      if (Array.isArray(data[key])) {
        data[key] = data[key].map((item: any) => {
          if (item instanceof Date) {
            return item.getTime();
          } else if (item instanceof mongoose.Types.ObjectId) {
            return item.toString();
          }
          return item;
        });
      }
    }
  }

  return {
    table,
    action: data.isDeleted ? "delete" : "update", // Or determine action based on createdAt vs updatedAt
    data,
  };
}
