import { APP_DATA_VERSION } from "@/constants/app";
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
  severity?: "low" | "medium" | "high" | "critical";
  retryable?: boolean;
  details?: any;
}

// 同步状态监控
interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  lastSyncTime?: number;
  lastError?: SyncError;
  averageSyncTime: number;
  retryCount: number;
}

// 同步结果类型
export interface SyncResult {
  success: boolean;
  error?: SyncError;
  changesApplied?: number;
  serverChanges?: number;
  tempSyncTimestamp?: string; // 临时保存的时间戳，用于统一推进时机
  syncTime?: number; // 同步耗时
  retryable?: boolean; // 是否可重试
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

// 同步统计和监控
const syncStats: SyncStats = {
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  averageSyncTime: 0,
  retryCount: 0,
};

// 更新同步统计
const updateSyncStats = (result: SyncResult, syncTime: number) => {
  syncStats.totalSyncs++;
  syncStats.lastSyncTime = Date.now();

  if (result.success) {
    syncStats.successfulSyncs++;
    syncStats.retryCount = 0; // 成功时重置重试计数
  } else {
    syncStats.failedSyncs++;
    syncStats.lastError = result.error;
    if (result.retryable) {
      syncStats.retryCount++;
    }
  }

  // 计算平均同步时间
  const totalTime =
    syncStats.averageSyncTime * (syncStats.totalSyncs - 1) + syncTime;
  syncStats.averageSyncTime = totalTime / syncStats.totalSyncs;

  // 保存统计到本地存储
  setLocalStorageItem("syncStats", JSON.stringify(syncStats));
};

// 获取同步统计
export const getSyncStats = (): SyncStats => {
  const statsStr = getLocalStorageItem("syncStats");
  if (statsStr) {
    try {
      return JSON.parse(statsStr);
    } catch (error) {
      console.error("解析同步统计失败:", error);
    }
  }
  return syncStats;
};

// 错误分类和处理函数
const classifyAndHandleError = (error: any, context: string): SyncError => {
  const errorMessage = error.message?.toLowerCase() || "";
  const errorName = error.name || "UnknownError";

  // 网络相关错误
  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return {
      message: "网络连接失败，请检查网络设置",
      code: "NETWORK_ERROR",
      severity: "medium",
      retryable: true,
      details: { originalError: error.message },
    };
  }

  // 认证相关错误
  if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
    return {
      message: "用户认证失败，请重新登录",
      code: "AUTH_ERROR",
      severity: "high",
      retryable: false,
      details: { originalError: error.message },
    };
  }

  // 权限相关错误
  if (errorMessage.includes("forbidden") || errorMessage.includes("403")) {
    return {
      message: "权限不足，需要验证邮箱",
      code: "PERMISSION_ERROR",
      severity: "high",
      retryable: false,
      details: { originalError: error.message },
    };
  }

  // 服务器错误
  if (errorMessage.includes("500") || errorMessage.includes("server")) {
    return {
      message: "服务器内部错误，请稍后重试",
      code: "SERVER_ERROR",
      severity: "medium",
      retryable: true,
      details: { originalError: error.message },
    };
  }

  // 数据库相关错误
  if (errorMessage.includes("database") || errorMessage.includes("quota")) {
    return {
      message: "数据库操作失败，请检查存储空间",
      code: "DATABASE_ERROR",
      severity: "high",
      retryable: false,
      details: { originalError: error.message },
    };
  }

  // 超时错误
  if (errorMessage.includes("timeout")) {
    return {
      message: "操作超时，请检查网络连接",
      code: "TIMEOUT_ERROR",
      severity: "medium",
      retryable: true,
      details: { originalError: error.message },
    };
  }

  // 默认错误
  return {
    message: error instanceof Error ? error.message : "未知错误",
    code: "UNKNOWN_ERROR",
    severity: "medium",
    retryable: true,
    details: { originalError: error.message, context },
  };
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

interface IChapterRecord {
  uuid: string;
  timeStamp: number;
  dict: string;
  chapter: number | null;
  time: number;
  correctCount: number;
  wrongCount: number;
  wordCount: number;
  correctWordIndexes: number[];
  wordNumber: number;
  wordRecordIds: number[];
  sync_status: SyncStatus;
  last_modified: number;
}

interface IReviewRecord extends IBaseRecord {
  dict: string;
  createTime: number;
  isFinished: boolean;
}

interface IFamiliarWord extends IBaseRecord {
  word: string;
  dict: string;
}

interface IWordReviewRecord extends IBaseRecord {
  word: string;
  userId?: string;
  intervalSequence: number[];
  currentIntervalIndex: number;
  nextReviewAt: number;
  totalReviews: number;
  isGraduated: boolean;
  reviewHistory?: any[];
  consecutiveCorrect?: number;
  lastReviewedAt?: number;
  todayPracticeCount: number;
  lastPracticedAt: number;
  sourceDicts: string[];
  preferredDict: string;
  firstSeenAt: number;
}

interface IReviewHistory extends IBaseRecord {
  userId?: string;
  // v10 协议：上传/下载均使用 parentUuid 作为父关联（服务器内部使用 ObjectId 外键）
  parentUuid?: string;
  // 本地存储仍使用 wordReviewRecordId:number 关联本地行
  wordReviewRecordId: number;
  word: string;
  dict: string;
  reviewedAt: number;
  reviewResult: "correct" | "incorrect";
  responseTime: number;
  intervalProgressBefore: number;
  intervalProgressAfter: number;
  intervalIndexBefore: number;
  intervalIndexAfter: number;
  reviewType: "scheduled" | "manual" | "practice_triggered";
  sessionId?: string;
}

interface IReviewConfig extends IBaseRecord {
  userId?: string;
  config: any;
}

type IRecord =
  | IWordRecord
  | IChapterRecord
  | IReviewRecord
  | IFamiliarWord
  | IWordReviewRecord
  | IReviewHistory
  | IReviewConfig;

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

    // 对于 familiarWords 表，需要特殊处理，确保每个 [dict+word] 组合只有一条记录
    if (tableName === "familiarWords") {
      // 使用 Map 来存储每个 [dict+word] 组合的最新记录
      const dictWordMap = new Map();

      for (const record of records) {
        const key = `${record.dict}-${record.word}`;

        // 如果 Map 中已存在该 key，则比较 last_modified，保留最新的
        if (dictWordMap.has(key)) {
          const existingRecord = dictWordMap.get(key);
          if (record.last_modified > existingRecord.last_modified) {
            dictWordMap.set(key, record);
          }
        } else {
          dictWordMap.set(key, record);
        }
      }

      // 使用 Map 中的记录替换原始记录数组
      const uniqueRecords = Array.from(dictWordMap.values());

      for (const record of uniqueRecords) {
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
    } else if (tableName === "wordRecords") {
      // 特殊处理 wordRecords 表，确保 performanceHistory 中的每个条目都有 mistakes 字段
      for (const record of records) {
        // 深拷贝记录以避免修改原始数据
        const recordCopy = JSON.parse(JSON.stringify(record));

        // 确保 performanceHistory 存在且是数组
        if (
          recordCopy.performanceHistory &&
          Array.isArray(recordCopy.performanceHistory)
        ) {
          // 遍历每个 performanceEntry，确保 mistakes 字段存在
          recordCopy.performanceHistory = recordCopy.performanceHistory.map(
            (entry: any) => ({
              ...entry,
              mistakes: entry.mistakes || {}, // 如果 mistakes 不存在，设置为空对象
            })
          );
        }

        changes.push({
          table: tableName,
          action:
            recordCopy.sync_status === "local_deleted"
              ? "delete"
              : recordCopy.sync_status === "local_new"
              ? "create"
              : "update",
          data: recordCopy,
        });
      }
    } else if (tableName === "reviewHistories") {
      // v10：上传使用 parentUuid 关联父项（不上传本地 wordReviewRecordId）
      for (const record of records) {
        const recordCopy: any = JSON.parse(JSON.stringify(record));
        if (typeof recordCopy.wordReviewRecordId === "number") {
          const parent = await db.wordReviewRecords
            .where("id")
            .equals(recordCopy.wordReviewRecordId)
            .first();
          if (!parent || !parent.uuid) {
            console.warn(
              `跳过无父引用的 reviewHistory，localId=${recordCopy.wordReviewRecordId}`
            );
            continue;
          }
          recordCopy.parentUuid = parent.uuid;
          delete recordCopy.wordReviewRecordId;
        }

        changes.push({
          table: tableName,
          action:
            recordCopy.sync_status === "local_deleted"
              ? "delete"
              : recordCopy.sync_status === "local_new"
              ? "create"
              : "update",
          data: recordCopy,
        });
      }
    } else {
      // 其他表正常处理
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
  }

  return changes;
};

// 应用服务器变更到本地数据库（使用批处理优化）
const applyServerChanges = async (serverChanges: any[]) => {
  let changesApplied = 0;

  // 操作统计
  const stats = {
    total: 0,
    updated: 0,
    created: 0,
    deleted: 0,
    errors: 0,
    startTime: Date.now(),
  };

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

  // 按表分组变更
  const changesByTable = new Map<string, any[]>();
  for (const change of validChanges) {
    const { table } = change;
    if (!changesByTable.has(table)) {
      changesByTable.set(table, []);
    }
    changesByTable.get(table)!.push(change);
  }

  // 批处理函数：处理单个表的变更
  const processTableChanges = async (table: string, changes: any[]) => {
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
        return;
    }

    // v10：reviewHistories 使用 parentUuid → 本地 id 映射
    for (const change of changes) {
      const { data } = change as any;
      if (table === "reviewHistories" && data.parentUuid) {
        const parent = await db.wordReviewRecords
          .where("uuid")
          .equals(data.parentUuid)
          .first();
        if (!parent || parent.id == null) {
          console.warn(
            `跳过无本地父项的 reviewHistory，parentUuid=${data.parentUuid}`
          );
          const idx = changes.indexOf(change);
          if (idx > -1) changes.splice(idx, 1);
          continue;
        }
        data.wordReviewRecordId = parent.id;
        delete data.parentUuid;
      }
    }

    // 删除旧的 word→uuid 回填逻辑，不再通过 word 回填 uuid

    // 分离不同类型的操作
    const creates: any[] = [];
    const updates: any[] = [];
    const deletes: any[] = [];

    for (const change of changes) {
      const { action, data } = change;
      if (action === "delete") {
        deletes.push(data);
      } else if (action === "create") {
        creates.push(data);
      } else if (action === "update") {
        updates.push(data);
      }
    }

    // 批量处理删除操作
    if (deletes.length > 0) {
      try {
        const deleteIds: number[] = [];
        for (const data of deletes) {
          const localRecord = await (dbTable as any)
            .where("uuid")
            .equals(data.uuid)
            .first();
          if (localRecord && localRecord.id) {
            deleteIds.push(localRecord.id);
          }
        }

        if (deleteIds.length > 0) {
          await (dbTable as any).bulkDelete(deleteIds);
          stats.deleted += deleteIds.length;
          changesApplied += deleteIds.length;
        }
      } catch (error) {
        stats.errors++;
      }
    }

    // 批量处理创建和更新操作
    if (creates.length > 0 || updates.length > 0) {
      try {
        // 1. 批量查询本地记录，获取所有需要更新的记录的 ID
        const allUpsertData = [...creates, ...updates];
        const uuids = allUpsertData.map((data) => data.uuid);

        // 批量查询本地记录
        const localRecords = await (dbTable as any)
          .where("uuid")
          .anyOf(uuids)
          .toArray();

        // 创建 uuid 到本地记录的映射
        const localRecordMap = new Map<string, any>();
        for (const record of localRecords) {
          localRecordMap.set(record.uuid, record);
        }

        // 2. 准备 upsert 数据，合并服务器数据和本地数据
        const upserts: any[] = [];

        for (const data of allUpsertData) {
          const localRecord = localRecordMap.get(data.uuid);

          if (localRecord && localRecord.id) {
            // 更新操作：合并服务器数据和本地数据
            const mergedData = {
              ...localRecord, // 保留本地数据
              ...data, // 服务器数据覆盖本地数据
              id: localRecord.id, // 确保保留本地 ID
              sync_status: "synced" as SyncStatus,
              last_modified: Date.now(),
            };
            upserts.push(mergedData);
          } else {
            // 创建操作：直接使用服务器数据
            const newData = {
              ...data,
              sync_status: "synced" as SyncStatus,
              last_modified: Date.now(),
            };
            upserts.push(newData);
          }
        }

        // 3. 执行批量 upsert
        if (upserts.length > 0) {
          await (dbTable as any).bulkPut(upserts);
          stats.created += creates.length;
          stats.updated += updates.length;
          changesApplied += upserts.length;
        }
      } catch (error) {
        console.error(`批量 upsert ${table} 表失败:`, error);
        stats.errors++;

        // 回退到单个处理

        for (const data of [...creates, ...updates]) {
          try {
            // 查找本地记录
            const localRecord: any = await (dbTable as any)
              .where("uuid")
              .equals(data.uuid)
              .first();

            if (localRecord && localRecord.id) {
              // 更新操作：合并数据
              const mergedData = {
                ...localRecord,
                ...data,
                id: localRecord.id,
                sync_status: "synced" as SyncStatus,
                last_modified: Date.now(),
              };
              await (dbTable as any).put(mergedData);
            } else {
              // 创建操作
              const newData = {
                ...data,
                sync_status: "synced" as SyncStatus,
                last_modified: Date.now(),
              };
              await (dbTable as any).put(newData);
            }
            changesApplied++;
          } catch (singleError) {
            console.error(`单个 upsert 失败:`, singleError);
            stats.errors++;
          }
        }
      }
    }
  };

  // 按表并行处理变更
  const tablePromises = Array.from(changesByTable.entries()).map(
    ([table, changes]) => processTableChanges(table, changes)
  );

  await Promise.all(tablePromises);

  const totalTime = Date.now() - stats.startTime;
  console.log(
    `批量同步完成: 总耗时 ${totalTime}ms, 处理 ${changesApplied} 条记录 (创建: ${stats.created}, 更新: ${stats.updated}, 删除: ${stats.deleted}, 错误: ${stats.errors})`
  );

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
    const localRecord = await (dbTable as any)
      .where("uuid")
      .equals(data.uuid)
      .first();

    if (localRecord && localRecord.id) {
      if (action === "delete") {
        // 如果是删除操作，物理删除记录
        await (dbTable as any).delete(localRecord.id);
      } else {
        // 如果是创建或更新操作，更新同步状态
        await (dbTable as any).update(localRecord.id, {
          sync_status: "synced" as SyncStatus,
        });
      }
    } else if (
      action !== "delete" &&
      table === "familiarWords" &&
      data.dict &&
      data.word
    ) {
      // 对于 familiarWords 表，如果通过 uuid 找不到记录，尝试通过 [dict+word] 复合索引查找
      const existingByDictWord = await (dbTable as any)
        .where("[dict+word]")
        .equals([data.dict, data.word])
        .first();

      if (existingByDictWord && existingByDictWord.id) {
        console.log(`通过 [dict+word] 找到记录，更新同步状态`);
        await (dbTable as any).update(existingByDictWord.id, {
          sync_status: "synced" as SyncStatus,
        });
      }
    }
  }
};

// 初始化时执行的云端到本地同步
export const syncFromCloud = async (): Promise<SyncResult> => {
  const startTime = Date.now();

  try {
    console.log("开始从云端同步到本地...");

    // 获取上次同步时间戳
    const lastSyncTimestamp = getLastSyncTimestamp();
    console.log("上次同步时间戳:", lastSyncTimestamp);

    // 获取认证令牌
    const token = getLocalStorageItem("token");
    if (!token) {
      const error = classifyAndHandleError(
        new Error("用户未登录"),
        "syncFromCloud"
      );
      const result: SyncResult = {
        success: false,
        error,
        syncTime: Date.now() - startTime,
        retryable: false,
      };
      updateSyncStats(result, result.syncTime!);
      return result;
    }

    // 设置请求头
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      "/api/sync",
      {
        lastSyncTimestamp,
        changes: [], // 空数组表示只获取服务器变更
      },
      {
        headers: { "x-app-data-version": APP_DATA_VERSION },
        withCredentials: true,
        timeout: 300000, // 300秒超时
      }
    );

    const { newSyncTimestamp, serverChanges } = response.data;

    if (!serverChanges || !Array.isArray(serverChanges)) {
      const error = classifyAndHandleError(
        new Error("服务器返回的变更数据无效"),
        "syncFromCloud"
      );
      const result: SyncResult = {
        success: false,
        error,
        syncTime: Date.now() - startTime,
        retryable: true,
      };
      updateSyncStats(result, result.syncTime!);
      return result;
    }

    // 应用服务器变更到本地
    const changesApplied = await applyServerChanges(serverChanges);

    // 注意：不在这里推进时间戳，等待上传阶段完成后统一推进
    // 临时保存服务器返回的时间戳，供后续使用
    const tempSyncTimestamp = newSyncTimestamp;

    const result: SyncResult = {
      success: true,
      changesApplied,
      serverChanges: serverChanges.length,
      tempSyncTimestamp,
      syncTime: Date.now() - startTime,
      retryable: false,
    };

    updateSyncStats(result, result.syncTime!);
    return result;
  } catch (error) {
    const syncTime = Date.now() - startTime;
    const classifiedError = classifyAndHandleError(error, "syncFromCloud");

    if (axios.isAxiosError(error)) {
      console.error("Axios错误:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // 处理特定的错误情况
      if (error.response?.status === 403) {
        classifiedError.message = "需要验证邮箱才能同步数据";
        classifiedError.code = "EMAIL_NOT_VERIFIED";
        classifiedError.retryable = false;
      }
    }

    const result: SyncResult = {
      success: false,
      error: classifiedError,
      syncTime,
      retryable: classifiedError.retryable,
    };

    updateSyncStats(result, syncTime);
    return result;
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
    axios.defaults.withCredentials = true;

    // 发送本地变更到云端
    console.log("发送本地变更到云端...");
    const response = await axios.post(
      "/api/sync",
      {
        lastSyncTimestamp,
        changes: localChanges,
      },
      {
        headers: { "x-app-data-version": APP_DATA_VERSION },
        withCredentials: true,
      }
    );

    const { newSyncTimestamp, serverChanges } = response.data;

    // 如果有服务器回传的变更，应用它们
    if (
      serverChanges &&
      Array.isArray(serverChanges) &&
      serverChanges.length > 0
    ) {
      console.log("应用服务器回传的变更:", serverChanges.length);
      await applyServerChanges(serverChanges);
    }

    // 更新本地记录状态
    await updateLocalRecordStatus(localChanges);
    console.log("本地记录状态已更新");

    // 保存新的同步时间戳（统一推进时机）
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

// 实现"先下后上"同步策略的函数
export const syncData = async (): Promise<SyncResult> => {
  try {
    console.log("开始执行先下后上同步策略...");

    // 第一步：先下载（云→本地）
    const downloadResult = await syncFromCloud();
    if (!downloadResult.success) {
      console.log("下载失败，停止同步");
      return downloadResult;
    }
    console.log("下载成功，应用了", downloadResult.changesApplied, "条变更");

    // 第二步：重新扫描本地变更（下载可能改变了本地数据和待传集合）
    const hasLocalChanges = await hasPendingChanges();

    if (hasLocalChanges) {
      // 第三步：如果有本地变更，执行上传（本地→云）
      console.log("发现本地变更，开始上传");
      const uploadResult = await syncToCloud();
      if (!uploadResult.success) {
        console.log("上传失败");
        return uploadResult;
      }
      console.log("上传成功，上传了", uploadResult.changesApplied, "条变更");

      // 返回上传结果，因为它包含了最终的同步状态
      return uploadResult;
    } else {
      console.log("没有本地变更需要上传");
      // 返回下载结果
      return downloadResult;
    }
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

// 全局同步触发器（模拟triggerSync('both')的行为）
export const triggerGlobalSync = async (): Promise<SyncResult> => {
  try {
    console.log("触发全局同步（先下后上）...");

    // 第一步：先下载（云→本地）
    const downloadResult = await syncFromCloud();
    if (!downloadResult.success) {
      console.log("下载失败，停止同步");
      return downloadResult;
    }
    console.log("下载成功，应用了", downloadResult.changesApplied, "条变更");

    // 第二步：执行上传（本地→云，syncToCloud内部会检查是否有本地变更）
    console.log("开始上传本地变更");
    const uploadResult = await syncToCloud();
    if (!uploadResult.success) {
      console.log("上传失败");
      return uploadResult;
    }
    console.log("上传成功，上传了", uploadResult.changesApplied, "条变更");

    // 返回上传结果，因为它包含了最终的同步状态
    return uploadResult;
  } catch (error) {
    console.error("全局同步失败:", error);
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
