import ChapterRecord from "../models/ChapterRecord";
import ReviewRecord from "../models/ReviewRecord";
import WordRecord from "../models/WordRecord";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { Model } from "mongoose";

// Define types for sync request and response
interface SyncChange {
  table: "wordRecords" | "chapterRecords" | "reviewRecords";
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
      return WordRecord;
    case "chapterRecords":
      return ChapterRecord;
    case "reviewRecords":
      return ReviewRecord;
    default:
      throw new Error(`Unknown table: ${table}`);
  }
};

// Helper function to format a record for sync response
const formatRecordForSync = (record: any, table: string): SyncChange => {
  return {
    table: table as "wordRecords" | "chapterRecords" | "reviewRecords",
    action: record.isDeleted ? "delete" : "update",
    data: record.toObject(),
  };
};

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

export const syncData = async (req: Request, res: Response) => {
  try {
    console.log("收到同步请求:", req.body);
    const { lastSyncTimestamp, changes } = req.body as SyncRequest;
    const userId = req.user?._id;
    console.log("用户ID:", userId);
    console.log("上次同步时间戳:", lastSyncTimestamp);
    console.log("变更数量:", changes.length);

    if (!userId) {
      throw new Error("用户未认证");
    }

    // Process client changes
    for (const change of changes) {
      const { table, action, data } = change;
      console.log(`处理变更: ${table} - ${action}`, data);

      const Model = getModel(table);
      const query = { uuid: data.uuid, userId };

      if (action === "create" || action === "update") {
        try {
          // 安全地处理日期字段
          const updateData = {
            ...data,
            userId,
            clientModifiedAt:
              safeParseDate(data.clientModifiedAt) || new Date(),
            serverModifiedAt: new Date(),
            last_modified: safeParseDate(data.last_modified) || new Date(),
            timeStamp: safeParseDate(data.timeStamp) || new Date(),
            createTime: safeParseDate(data.createTime),
          };

          // 移除未定义的字段
          Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
              delete updateData[key];
            }
          });

          await Model.findOneAndUpdate(query, updateData, {
            upsert: true,
          });
          console.log(
            `成功${action === "create" ? "创建" : "更新"}记录:`,
            data.uuid
          );
        } catch (error) {
          console.error(`处理${action}操作时出错:`, error);
          throw error;
        }
      } else if (action === "delete") {
        try {
          const record = await Model.findOne(query);
          if (record) {
            record.isDeleted = true;
            record.clientModifiedAt =
              safeParseDate(data.clientModifiedAt) || new Date();
            record.serverModifiedAt = new Date();
            await record.save();
            console.log("成功删除记录:", data.uuid);
          } else {
            console.log("未找到要删除的记录:", data.uuid);
          }
        } catch (error) {
          console.error("处理删除操作时出错:", error);
          throw error;
        }
      }
    }

    // Query server changes since last sync
    const serverChanges: SyncChange[] = [];
    const tables: ("wordRecords" | "chapterRecords" | "reviewRecords")[] = [
      "wordRecords",
      "chapterRecords",
      "reviewRecords",
    ];

    for (const table of tables) {
      try {
        const Model = getModel(table);

        // 查询所有更新的记录，包括已删除和未删除的
        const changes = await Model.find({
          userId,
          serverModifiedAt: { $gt: new Date(lastSyncTimestamp) },
        });

        console.log(`从${table}获取到${changes.length}条变更`);

        for (const change of changes) {
          serverChanges.push(formatRecordForSync(change, table));
        }
      } catch (error) {
        console.error(`查询${table}变更时出错:`, error);
        throw error;
      }
    }

    // Send response
    const deletedCount = serverChanges.filter(
      (c) => c.action === "delete"
    ).length;
    const updateCount = serverChanges.filter(
      (c) => c.action === "update"
    ).length;

    console.log("发送响应:", {
      newSyncTimestamp: new Date().toISOString(),
      totalChanges: serverChanges.length,
      statistics: {
        deleted: deletedCount,
        updated: updateCount,
      },
    });
    res.json({
      newSyncTimestamp: new Date().toISOString(),
      serverChanges,
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({
      message: "同步失败",
      error: error instanceof Error ? error.message : "未知错误",
    });
  }
};
