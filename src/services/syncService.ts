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

  const tablesToSync = [
    "wordRecords",
    "chapterRecords",
    "reviewRecords",
    "familiarWords",
    "wordReviewRecords",
    "reviewHistories",
    "reviewConfigs",
  ];

  for (const tableName of tablesToSync) {
    const table = db.table(tableName);
    const records = await table
      .where("sync_status")
      .anyOf(["local_new", "local_modified", "local_deleted"])
      .toArray();

    for (const record of records) {
      changes.push({
        table: tableName,
        action:
          record.sync_status === "local_deleted"
            ? "delete"
            : record.sync_status === "local_new"
            ? "create"
            : "update",
        data: record,
      });
    }
  }

  return changes;
};

// 应用服务器变更到本地数据库
const applyServerChanges = async (serverChanges: any[]) => {
  let changesApplied = 0;

  console.log("开始应用服务器变更，总数:", serverChanges.length);

  // 验证服务器变更数据格式
  const invalidChanges = serverChanges.filter(
    (change) =>
      !change.table ||
      !change.action ||
      !change.data ||
      !change.data.uuid ||
      ![
        "wordRecords",
        "chapterRecords",
        "reviewRecords",
        "familiarWords",
        "wordReviewRecords",
        "reviewHistories",
        "reviewConfigs",
      ].includes(change.table) ||
      !["create", "update", "delete"].includes(change.action)
  );

  if (invalidChanges.length > 0) {
    console.error("发现无效的服务器变更数据:", invalidChanges);
    console.log("将跳过这些无效变更");
  }

  const validChanges = serverChanges.filter(
    (change) =>
      change.table &&
      change.action &&
      change.data &&
      change.data.uuid &&
      [
        "wordRecords",
        "chapterRecords",
        "reviewRecords",
        "familiarWords",
        "wordReviewRecords",
        "reviewHistories",
        "reviewConfigs",
      ].includes(change.table) &&
      ["create", "update", "delete"].includes(change.action)
  );

  console.log("有效变更数:", validChanges.length);

  for (const change of validChanges) {
    const { table, action, data } = change;
    console.log(`处理服务器变更: ${table} - ${action}`, data);

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
      case "familiarWords":
        dbTable = db.familiarWords;
        break;
      case "wordReviewRecords":
        dbTable = db.wordReviewRecords;
        break;
      case "reviewHistories":
        dbTable = db.reviewHistories;
        break;
      case "reviewConfigs":
        dbTable = db.reviewConfigs;
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

    console.log(`本地记录(${data.uuid})存在:`, !!localRecord);
    if (localRecord) {
      console.log("本地记录详情:", localRecord);
    }

    if (action === "delete") {
      // 如果是删除操作，且本地记录存在
      if (localRecord) {
        // 如果本地记录已被修改，且修改时间晚于服务器时间，保留本地修改
        if (
          localRecord.sync_status === "local_modified" &&
          localRecord.last_modified > new Date(data.serverModifiedAt).getTime()
        ) {
          // 保留本地修改，但更新其他字段
          console.log("本地修改时间晚于服务器，保留本地修改");
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        } else {
          // 否则，物理删除记录
          console.log("执行服务器删除操作");
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
          console.log("本地修改时间晚于服务器，保留本地修改");
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        } else {
          // 否则，接受服务器更新
          console.log("接受服务器更新");
          await dbTable.update(localRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
        }
      } else {
        // 如果本地记录不存在，创建新记录
        console.log("本地不存在，创建新记录");
        await dbTable.add({
          ...data,
          sync_status: "synced" as SyncStatus,
          last_modified: Date.now(),
        });
      }
      changesApplied++;
    }
  }

  console.log("服务器变更应用完成，总共:", changesApplied);
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
      case "familiarWords":
        dbTable = db.familiarWords;
        break;
      case "wordReviewRecords":
        dbTable = db.wordReviewRecords;
        break;
      case "reviewHistories":
        dbTable = db.reviewHistories;
        break;
      case "reviewConfigs":
        dbTable = db.reviewConfigs;
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

// 初始化时执行的云端到本地同步
export const syncFromCloud = async (): Promise<SyncResult> => {
  try {
    console.log("开始从云端同步到本地...");

    // 获取上次同步时间戳
    const lastSyncTimestamp = getLastSyncTimestamp();
    console.log("上次同步时间戳:", lastSyncTimestamp);

    // 获取认证令牌
    const token = getLocalStorageItem("token");
    if (!token) {
      console.log("未找到认证令牌");
      return {
        success: false,
        error: { message: "用户未登录" },
      };
    }

    // 设置请求头
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 从云端获取变更
    console.log("请求服务器变更...");
    const response = await axios.post(
      "/api/sync",
      {
        lastSyncTimestamp,
        changes: [], // 空数组表示只获取服务器变更
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("服务器响应状态:", response.status);

    const { newSyncTimestamp, serverChanges } = response.data;
    console.log("服务器变更数量:", serverChanges?.length || 0);

    if (!serverChanges || !Array.isArray(serverChanges)) {
      console.error("服务器返回的变更数据无效");
      return {
        success: false,
        error: { message: "服务器返回的变更数据无效" },
      };
    }

    // 应用服务器变更到本地
    const changesApplied = await applyServerChanges(serverChanges);
    console.log("应用的服务器变更数:", changesApplied);

    // 保存新的同步时间戳
    saveLastSyncTimestamp(newSyncTimestamp);
    console.log("同步完成，保存新时间戳:", newSyncTimestamp);

    return {
      success: true,
      changesApplied,
      serverChanges: serverChanges.length,
    };
  } catch (error) {
    console.error("从云端同步失败:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios错误:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // 处理特定的错误情况
      if (error.response?.status === 403) {
        return {
          success: false,
          error: {
            message: "需要验证邮箱才能同步数据",
            code: "EMAIL_NOT_VERIFIED",
          },
        };
      }
    }
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "未知错误",
      },
    };
  }
};

// 定时执行的本地到云端同步
export const syncToCloud = async (): Promise<SyncResult> => {
  try {
    console.log("开始从本地同步到云端...");

    // 获取本地变更
    const localChanges = await getLocalChanges();
    console.log("本地变更数量:", localChanges.length);

    // 如果没有本地变更，跳过同步
    if (localChanges.length === 0) {
      console.log("没有需要同步的本地变更");
      return { success: true, changesApplied: 0, serverChanges: 0 };
    }

    // 获取上次同步时间戳
    const lastSyncTimestamp = getLastSyncTimestamp();

    // 获取认证令牌
    const token = getLocalStorageItem("token");
    if (!token) {
      return {
        success: false,
        error: { message: "用户未登录" },
      };
    }

    // 设置请求头
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 发送本地变更到云端
    console.log("发送本地变更到云端...");
    const response = await axios.post(
      "/api/sync",
      {
        lastSyncTimestamp,
        changes: localChanges,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { newSyncTimestamp } = response.data;

    // 更新本地记录状态
    await updateLocalRecordStatus(localChanges);
    console.log("本地记录状态已更新");

    // 保存新的同步时间戳
    saveLastSyncTimestamp(newSyncTimestamp);
    console.log("同步完成，保存新时间戳:", newSyncTimestamp);

    return {
      success: true,
      changesApplied: localChanges.length,
      serverChanges: 0,
    };
  } catch (error) {
    console.error("同步到云端失败:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios错误:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // 处理特定的错误情况
      if (error.response?.status === 403) {
        return {
          success: false,
          error: {
            message: "需要验证邮箱才能同步数据",
            code: "EMAIL_NOT_VERIFIED",
          },
        };
      }
    }
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "未知错误",
      },
    };
  }
};

// 为保持兼容性，保留原始的syncData函数，但内部根据条件调用新函数
export const syncData = async (): Promise<SyncResult> => {
  try {
    // 先从云端同步到本地（仅在需要时），再从本地同步到云端
    const localChanges = await getLocalChanges();

    // 如果有本地变更，只执行本地到云端的同步
    if (localChanges.length > 0) {
      return syncToCloud();
    }

    // 如果没有本地变更，则执行完整的双向同步
    const cloudResult = await syncFromCloud();

    // 如果从云端同步失败，直接返回结果
    if (!cloudResult.success) {
      return cloudResult;
    }

    return cloudResult;
  } catch (error) {
    console.error("同步失败:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "未知错误",
      },
    };
  }
};

// 检查是否有需要同步的数据
export const hasPendingChanges = async (): Promise<boolean> => {
  const tablesToSync = [
    "wordRecords",
    "chapterRecords",
    "reviewRecords",
    "familiarWords",
    "wordReviewRecords",
    "reviewHistories",
    "reviewConfigs",
  ];

  for (const tableName of tablesToSync) {
    const count = await db
      .table(tableName)
      .where("sync_status")
      .anyOf(["local_new", "local_modified", "local_deleted"])
      .count();

    if (count > 0) {
      return true;
    }
  }

  return false;
};
