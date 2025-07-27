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
            (entry) => ({
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

// 应用服务器变更到本地数据库
const applyServerChanges = async (serverChanges: any[]) => {
  let changesApplied = 0;

  console.log("开始应用服务器变更，总数:", serverChanges.length);

  // 操作统计
  const stats = {
    total: 0,
    updated: 0,
    created: 0,
    errors: 0,
    constraintErrors: 0,
    fallbackSuccess: 0,
    startTime: Date.now(),
  };

  // 错误诊断辅助函数
  const diagnoseSyncError = (error: any, table: string, data: any) => {
    const errorMessage = error.message?.toLowerCase() || "";
    const errorName = error.name || "UnknownError";

    if (
      errorName === "ConstraintError" ||
      errorMessage.includes("constrainterror")
    ) {
      return {
        type: "constraint",
        severity: "warning",
        suggestion: `表 ${table} 存在唯一约束冲突，将尝试回退策略`,
        canAutoFix: true,
      };
    }

    if (errorMessage.includes("database") && errorMessage.includes("locked")) {
      return {
        type: "database_locked",
        severity: "error",
        suggestion: "数据库被锁定，请稍后重试",
        canAutoFix: false,
      };
    }

    if (errorMessage.includes("quota") || errorMessage.includes("storage")) {
      return {
        type: "storage_quota",
        severity: "error",
        suggestion: "存储空间不足，请清理数据或增加存储空间",
        canAutoFix: false,
      };
    }

    return {
      type: "unknown",
      severity: "error",
      suggestion: "未知错误，请检查数据格式和网络连接",
      canAutoFix: false,
    };
  };

  // 增强的 upsert 辅助函数：处理不同表的插入逻辑
  const upsertRecord = async (
    table: string,
    data: any,
    dbTable: any
  ): Promise<void> => {
    const startTime = Date.now();
    const dataIdentifier =
      table === "wordRecords" || table === "familiarWords"
        ? `${data.dict}/${data.word}`
        : data.uuid;

    stats.total++;

    console.log(`[UPSERT] 开始处理: ${table} - ${dataIdentifier}`);

    try {
      // 特殊处理需要复合索引查询的表
      if (table === "wordRecords" || table === "familiarWords") {
        // 使用 [dict+word] 复合索引查询现有记录
        const queryStartTime = Date.now();
        const existingRecord = await dbTable
          .where("[dict+word]")
          .equals([data.dict, data.word])
          .first();

        const queryTime = Date.now() - queryStartTime;
        console.log(`[UPSERT] 查询耗时: ${queryTime}ms - ${table}`);

        if (existingRecord) {
          // 更新现有记录
          const updateStartTime = Date.now();
          await dbTable.update(existingRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
          const updateTime = Date.now() - updateStartTime;
          stats.updated++;
          console.log(
            `[UPSERT] ✅ 更新成功 (${updateTime}ms): ${table} - ${dataIdentifier}`
          );
        } else {
          // 创建新记录
          const createStartTime = Date.now();
          await dbTable.add({
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
          const createTime = Date.now() - createStartTime;
          stats.created++;
          console.log(
            `[UPSERT] ✅ 创建成功 (${createTime}ms): ${table} - ${dataIdentifier}`
          );
        }
      } else {
        // 其他表基于 uuid 查询现有记录
        const queryStartTime = Date.now();
        const existingRecord = await dbTable
          .where("uuid")
          .equals(data.uuid)
          .first();

        const queryTime = Date.now() - queryStartTime;
        console.log(`[UPSERT] 查询耗时: ${queryTime}ms - ${table}`);

        if (existingRecord) {
          // 更新现有记录
          const updateStartTime = Date.now();
          await dbTable.update(existingRecord.id!, {
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
          const updateTime = Date.now() - updateStartTime;
          stats.updated++;
          console.log(
            `[UPSERT] ✅ 更新成功 (${updateTime}ms): ${table} - ${dataIdentifier}`
          );
        } else {
          // 创建新记录
          const createStartTime = Date.now();
          await dbTable.add({
            ...data,
            sync_status: "synced" as SyncStatus,
            last_modified: Date.now(),
          });
          const createTime = Date.now() - createStartTime;
          stats.created++;
          console.log(
            `[UPSERT] ✅ 创建成功 (${createTime}ms): ${table} - ${dataIdentifier}`
          );
        }
      }

      const totalTime = Date.now() - startTime;
      console.log(`[UPSERT] 操作完成，总耗时: ${totalTime}ms`);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      stats.errors++;

      // 使用错误诊断函数
      const diagnosis = diagnoseSyncError(error, table, data);

      if (diagnosis.type === "constraint" && diagnosis.canAutoFix) {
        stats.constraintErrors++;
        console.warn(
          `[UPSERT] 🔄 ${diagnosis.suggestion}: ${table} - ${dataIdentifier}`
        );

        try {
          // 回退策略：强制查询并更新
          const fallbackStartTime = Date.now();
          let existingRecord;

          // 根据表类型使用不同的查询策略
          if (table === "wordRecords" || table === "familiarWords") {
            // 使用 [dict+word] 复合索引
            existingRecord = await dbTable
              .where("[dict+word]")
              .equals([data.dict, data.word])
              .first();
          } else {
            // 其他表使用 uuid 查询
            existingRecord = await dbTable
              .where("uuid")
              .equals(data.uuid)
              .first();
          }

          if (existingRecord) {
            await dbTable.update(existingRecord.id!, {
              ...data,
              sync_status: "synced" as SyncStatus,
              last_modified: Date.now(),
            });
            const fallbackTime = Date.now() - fallbackStartTime;
            stats.fallbackSuccess++;
            stats.errors--; // 回退成功，减少错误计数
            console.log(
              `[UPSERT] ✅ 回退策略成功 (${fallbackTime}ms): ${table} - ${dataIdentifier}`
            );
          } else {
            // 如果通过索引找不到记录，尝试通过uuid直接查找
            console.warn(
              `[UPSERT] 🔍 通过索引未找到记录，尝试uuid查找: ${table} - ${dataIdentifier}`
            );
            const recordByUuid = await dbTable
              .where("uuid")
              .equals(data.uuid)
              .first();

            if (recordByUuid) {
              console.log(
                `[UPSERT] 🔍 通过uuid找到记录，执行更新: ${table} - ${dataIdentifier}`
              );
              await dbTable.update(recordByUuid.id!, {
                ...data,
                sync_status: "synced" as SyncStatus,
                last_modified: Date.now(),
              });
              const fallbackTime = Date.now() - fallbackStartTime;
              stats.fallbackSuccess++;
              stats.errors--; // 回退成功，减少错误计数
              console.log(
                `[UPSERT] ✅ UUID回退策略成功 (${fallbackTime}ms): ${table} - ${dataIdentifier}`
              );
            } else {
              // 最后的回退：强制使用put操作
              console.warn(
                `[UPSERT] 🔄 最后回退：使用put操作强制更新: ${table} - ${dataIdentifier}`
              );
              try {
                await dbTable.put({
                  ...data,
                  sync_status: "synced" as SyncStatus,
                  last_modified: Date.now(),
                });
                const fallbackTime = Date.now() - fallbackStartTime;
                stats.fallbackSuccess++;
                stats.errors--; // 回退成功，减少错误计数
                console.log(
                  `[UPSERT] ✅ PUT回退策略成功 (${fallbackTime}ms): ${table} - ${dataIdentifier}`
                );
              } catch (putError) {
                console.error(
                  `[UPSERT] ❌ 所有回退策略失败 (${totalTime}ms): ${table} - ${dataIdentifier}`,
                  {
                    originalError: error.message,
                    putError: putError.message,
                    data: { dict: data.dict, word: data.word, uuid: data.uuid },
                  }
                );
                throw error;
              }
            }
          }
        } catch (fallbackError) {
          console.error(
            `[UPSERT] ❌ 回退策略执行失败 (${totalTime}ms): ${table} - ${dataIdentifier}`,
            {
              originalError: error.message,
              fallbackError: fallbackError.message,
              data: { dict: data.dict, word: data.word, uuid: data.uuid },
            }
          );
          throw fallbackError;
        }
      } else {
        console.error(
          `[UPSERT] ❌ ${diagnosis.severity.toUpperCase()} (${totalTime}ms): ${table} - ${dataIdentifier}`,
          {
            type: diagnosis.type,
            suggestion: diagnosis.suggestion,
            canAutoFix: diagnosis.canAutoFix,
            error: error.message,
            data: { dict: data.dict, word: data.word, uuid: data.uuid },
          }
        );
        throw error;
      }
    }
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

  console.log("有效变更数:", validChanges.length);

  for (const change of validChanges) {
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
        // 如果本地记录不存在，使用 upsert 逻辑创建新记录
        console.log("本地不存在，使用 upsert 创建记录");
        await upsertRecord(table, data, dbTable);
      }
      changesApplied++;
    }
  }

  // 输出详细的操作统计
  const totalTime = Date.now() - stats.startTime;
  const successRate =
    stats.total > 0
      ? (((stats.total - stats.errors) / stats.total) * 100).toFixed(1)
      : "100.0";

  console.log("=== 服务器变更应用完成 ===");
  console.log(`📊 操作统计:`);
  console.log(`  • 总处理数: ${stats.total}`);
  console.log(`  • 更新记录: ${stats.updated}`);
  console.log(`  • 创建记录: ${stats.created}`);
  console.log(`  • 错误数量: ${stats.errors}`);
  console.log(`  • 约束冲突: ${stats.constraintErrors}`);
  console.log(`  • 回退成功: ${stats.fallbackSuccess}`);
  console.log(`  • 成功率: ${successRate}%`);
  console.log(`  • 总耗时: ${totalTime}ms`);
  console.log(
    `  • 平均耗时: ${
      stats.total > 0 ? (totalTime / stats.total).toFixed(1) : "0"
    }ms/操作`
  );
  console.log("========================");

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
    } else if (
      action !== "delete" &&
      table === "familiarWords" &&
      data.dict &&
      data.word
    ) {
      // 对于 familiarWords 表，如果通过 uuid 找不到记录，尝试通过 [dict+word] 复合索引查找
      const existingByDictWord = await dbTable
        .where("[dict+word]")
        .equals([data.dict, data.word])
        .first();

      if (existingByDictWord) {
        console.log(`通过 [dict+word] 找到记录，更新同步状态`);
        await dbTable.update(existingByDictWord.id!, {
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
