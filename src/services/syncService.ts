import useAuthStore from "@/store/auth";
import { db } from "@/utils/db";
import type { SyncStatus } from "@/utils/db/record";
import axios from "axios";

// 检查是否在浏览器环境中
const isBrowser = typeof window !== "undefined";

// 安全地获取 localStorage 中的值
const getLocalStorageItem = (key: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

// 安全地设置 localStorage 中的值
const setLocalStorageItem = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

// 同步状态类型
export type SyncState = "idle" | "syncing" | "error" | "success";

// 同步错误类型
export interface SyncError {
  message: string;
  code?: string;
}

// 同步结果类型
export interface SyncResult {
  success: boolean;
  error?: SyncError;
  changesApplied?: number;
  serverChanges?: number;
}

// 从本地存储获取上次同步时间戳
const getLastSyncTimestamp = (): string => {
  const timestamp = getLocalStorageItem("lastSyncTimestamp");
  return timestamp || new Date(0).toISOString(); // 如果没有，返回1970年时间戳
};

// 保存同步时间戳到本地存储
const saveLastSyncTimestamp = (timestamp: string): void => {
  setLocalStorageItem("lastSyncTimestamp", timestamp);
};

interface IBaseRecord {
  id?: number;
  uuid: string;
  sync_status: SyncStatus;
  last_modified: number;
}

interface IWordRecord extends IBaseRecord {
  word: string;
  timeStamp: number;
  dict: string;
  chapter: string;
  wrongCount: number;
}

interface IChapterRecord extends IBaseRecord {
  timeStamp: number;
  dict: string;
  chapter: string;
  time: number;
}

interface IReviewRecord extends IBaseRecord {
  dict: string;
  createTime: number;
  isFinished: boolean;
}

type IRecord = IWordRecord | IChapterRecord | IReviewRecord;

// 获取需要同步的本地变更
const getLocalChanges = async () => {
  const changes = [];

  // 获取 wordRecords 的变更
  const wordRecords = await db.wordRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .toArray();

  for (const record of wordRecords) {
    changes.push({
      table: "wordRecords",
      action:
        record.sync_status === "local_deleted"
          ? "delete"
          : record.sync_status === "local_new"
          ? "create"
          : "update",
      data: record,
    });
  }

  // 获取 chapterRecords 的变更
  const chapterRecords = await db.chapterRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .toArray();

  for (const record of chapterRecords) {
    changes.push({
      table: "chapterRecords",
      action:
        record.sync_status === "local_deleted"
          ? "delete"
          : record.sync_status === "local_new"
          ? "create"
          : "update",
      data: record,
    });
  }

  // 获取 reviewRecords 的变更
  const reviewRecords = await db.reviewRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .toArray();

  for (const record of reviewRecords) {
    changes.push({
      table: "reviewRecords",
      action:
        record.sync_status === "local_deleted"
          ? "delete"
          : record.sync_status === "local_new"
          ? "create"
          : "update",
      data: record,
    });
  }

  return changes;
};

// 应用服务器变更到本地数据库
const applyServerChanges = async (serverChanges: any[]) => {
  let changesApplied = 0;

  for (const change of serverChanges) {
    const { table, action, data } = change;

    // 根据表名选择对应的数据库表
    let dbTable;
    switch (table) {
      case "wordRecords":
        dbTable = db.wordRecords;
        break;
      case "chapterRecords":
        dbTable = db.chapterRecords;
        break;
      case "reviewRecords":
        dbTable = db.reviewRecords;
        break;
      default:
        console.warn(`未知的表名: ${table}`);
        continue;
    }

    // 查找本地是否存在该记录
    const localRecord = (await dbTable
      .where("uuid")
      .equals(data.uuid)
      .first()) as IRecord | undefined;

    if (action === "delete") {
      // 如果是删除操作，且本地记录存在
      if (localRecord) {
        // 如果本地记录已被修改，且修改时间晚于服务器时间，保留本地修改
        if (
          localRecord.sync_status === "local_modified" &&
          localRecord.last_modified > new Date(data.serverModifiedAt).getTime()
        ) {
          // 保留本地修改，但更新其他字段
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        } else {
          // 否则，物理删除记录
          await dbTable.delete(localRecord.id!);
        }
        changesApplied++;
      }
    } else {
      // 如果是创建或更新操作
      if (localRecord) {
        // 如果本地记录存在，且本地修改时间晚于服务器时间，保留本地修改
        if (
          localRecord.sync_status === "local_modified" &&
          localRecord.last_modified > new Date(data.serverModifiedAt).getTime()
        ) {
          // 保留本地修改，但更新其他字段
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        } else {
          // 否则，接受服务器更新
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        }
      } else {
        // 如果本地记录不存在，创建新记录
        await dbTable.add({
          ...data,
          sync_status: "synced" as SyncStatus,
          last_modified: Date.now(),
        });
      }
      changesApplied++;
    }
  }

  return changesApplied;
};

// 更新本地记录状态
const updateLocalRecordStatus = async (changes: any[]) => {
  for (const change of changes) {
    const { table, action, data } = change;

    // 根据表名选择对应的数据库表
    let dbTable;
    switch (table) {
      case "wordRecords":
        dbTable = db.wordRecords;
        break;
      case "chapterRecords":
        dbTable = db.chapterRecords;
        break;
      case "reviewRecords":
        dbTable = db.reviewRecords;
        break;
      default:
        continue;
    }

    // 查找本地记录
    const localRecord = (await dbTable
      .where("uuid")
      .equals(data.uuid)
      .first()) as IRecord | undefined;

    if (localRecord) {
      if (action === "delete") {
        // 如果是删除操作，物理删除记录
        await dbTable.delete(localRecord.id!);
      } else {
        // 如果是创建或更新操作，更新同步状态
        await dbTable.update(localRecord.id!, {
          sync_status: "synced" as SyncStatus,
        });
      }
    }
  }
};

// 执行同步
export const syncData = async (): Promise<SyncResult> => {
  try {
    console.log("开始同步...");
    // 获取本地变更
    const changes = await getLocalChanges();
    console.log("本地变更:", changes);
    // 如果没有变更，直接返回成功
    if (changes.length === 0) {
      console.log("没有需要同步的变更");
      return { success: true, changesApplied: 0, serverChanges: 0 };
    }

    // 获取上次同步时间戳
    const lastSyncTimestamp = getLastSyncTimestamp();
    console.log("上次同步时间戳:", lastSyncTimestamp);

    // 获取认证令牌
    const token = getLocalStorageItem("token");
    if (!token) {
      console.log("未找到认证令牌");
      return {
        success: false,
        error: {
          message: "用户未登录",
        },
      };
    }
    console.log("发送同步请求...");
    // 调用同步 API
    try {
      const response = await axios.post(
        "/api/sync",
        {
          lastSyncTimestamp,
          changes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("同步请求响应:", response.data);
      const { newSyncTimestamp, serverChanges } = response.data;

      // 应用服务器变更
      const changesApplied = await applyServerChanges(serverChanges);
      console.log("服务器变更应用:", changesApplied);
      // 更新本地记录状态
      await updateLocalRecordStatus(changes);
      console.log("本地记录状态更新:", changes);

      // 保存新的同步时间戳
      saveLastSyncTimestamp(newSyncTimestamp);
      console.log("新的同步时间戳保存:", newSyncTimestamp);

      return {
        success: true,
        changesApplied,
        serverChanges: serverChanges.length,
      };
    } catch (axiosError) {
      console.error("同步请求失败:", axiosError);
      if (axios.isAxiosError(axiosError)) {
        console.error("状态码:", axiosError.response?.status);
        console.error("响应数据:", axiosError.response?.data);
      }
      throw axiosError;
    }
  } catch (error) {
    console.error("同步失败:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "未知错误",
        code: axios.isAxiosError(error) ? error.code : undefined,
      },
    };
  }
};

// 检查是否有需要同步的数据
export const hasPendingChanges = async (): Promise<boolean> => {
  const wordRecordsCount = await db.wordRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .count();

  const chapterRecordsCount = await db.chapterRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .count();

  const reviewRecordsCount = await db.reviewRecords
    .where("sync_status")
    .anyOf(["local_new", "local_modified", "local_deleted"])
    .count();

  return wordRecordsCount + chapterRecordsCount + reviewRecordsCount > 0;
};
