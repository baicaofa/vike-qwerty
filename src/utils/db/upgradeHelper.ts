import type { Transaction } from "dexie";

/**
 * 数据库升级辅助工具
 * 提供安全的索引创建和升级检查功能
 */

export interface IndexInfo {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}

/**
 * 检查对象存储是否存在指定索引
 */
export function hasIndex(
  objectStore: IDBObjectStore,
  indexName: string
): boolean {
  try {
    return objectStore.indexNames.contains(indexName);
  } catch (error) {
    console.warn(`检查索引 ${indexName} 时出错:`, error);
    return false;
  }
}

/**
 * 安全创建索引
 */
export function safeCreateIndex(
  objectStore: IDBObjectStore,
  indexInfo: IndexInfo
): boolean {
  try {
    // 检查索引是否已存在
    if (hasIndex(objectStore, indexInfo.name)) {
      console.log(`索引 ${indexInfo.name} 已存在，跳过创建`);
      return true;
    }

    // 创建索引
    objectStore.createIndex(indexInfo.name, indexInfo.keyPath, {
      unique: indexInfo.unique || false,
      multiEntry: indexInfo.multiEntry || false,
    });

    console.log(`成功创建索引: ${indexInfo.name}`);
    return true;
  } catch (error) {
    console.error(`创建索引 ${indexInfo.name} 失败:`, error);
    return false;
  }
}

/**
 * 检查对象存储是否存在
 */
export function hasObjectStore(db: IDBDatabase, storeName: string): boolean {
  try {
    return db.objectStoreNames.contains(storeName);
  } catch (error) {
    console.warn(`检查对象存储 ${storeName} 时出错:`, error);
    return false;
  }
}

/**
 * 获取数据库版本信息
 */
export function getDatabaseInfo(db: IDBDatabase) {
  return {
    name: db.name,
    version: db.version,
    objectStoreNames: Array.from(db.objectStoreNames),
  };
}

/**
 * 验证表结构是否正确
 */
export function validateTableStructure(
  transaction: Transaction,
  tableName: string,
  expectedIndexes: IndexInfo[]
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const table = transaction.table(tableName);
      const objectStore = table.core.schema.primKey.src; // 获取原始对象存储

      let allValid = true;

      for (const indexInfo of expectedIndexes) {
        if (!hasIndex(objectStore as IDBObjectStore, indexInfo.name)) {
          console.warn(`表 ${tableName} 缺少索引: ${indexInfo.name}`);
          allValid = false;
        }
      }

      resolve(allValid);
    } catch (error) {
      console.error(`验证表结构失败 ${tableName}:`, error);
      resolve(false);
    }
  });
}

/**
 * 升级状态检查器
 */
export class UpgradeStatusChecker {
  private static readonly UPGRADE_STATUS_KEY = "db_upgrade_status";

  static setUpgradeStatus(
    version: number,
    status: "started" | "completed" | "failed"
  ) {
    try {
      const statusInfo = {
        version,
        status,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.UPGRADE_STATUS_KEY, JSON.stringify(statusInfo));
    } catch (error) {
      console.warn("无法保存升级状态:", error);
    }
  }

  static getUpgradeStatus(): {
    version: number;
    status: string;
    timestamp: number;
  } | null {
    try {
      const statusStr = localStorage.getItem(this.UPGRADE_STATUS_KEY);
      return statusStr ? JSON.parse(statusStr) : null;
    } catch (error) {
      console.warn("无法读取升级状态:", error);
      return null;
    }
  }

  static clearUpgradeStatus() {
    try {
      localStorage.removeItem(this.UPGRADE_STATUS_KEY);
    } catch (error) {
      console.warn("无法清除升级状态:", error);
    }
  }

  static isUpgradeInProgress(targetVersion: number): boolean {
    const status = this.getUpgradeStatus();
    return status?.version === targetVersion && status?.status === "started";
  }
}

/**
 * 数据库升级错误类型
 */
export class DatabaseUpgradeError extends Error {
  constructor(
    message: string,
    public version: number,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "DatabaseUpgradeError";
  }
}

/**
 * 安全执行升级操作
 */
export async function safeUpgradeOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  version: number
): Promise<T> {
  console.log(
    `🔧 safeUpgradeOperation开始: ${operationName} (版本 ${version})`
  );

  try {
    // 检查是否已经在进行中
    console.log(`🔍 检查升级状态...`);
    if (UpgradeStatusChecker.isUpgradeInProgress(version)) {
      console.log(
        `⚠️ 升级操作 ${operationName} (版本 ${version}) 已在进行中，跳过状态更新但继续执行`
      );
      const result = await operation(); // 仍然执行操作，但不更新状态
      console.log(`✅ 重复升级操作完成: ${operationName}`);
      return result;
    }

    console.log(`📝 设置升级状态为'started'`);
    UpgradeStatusChecker.setUpgradeStatus(version, "started");
    console.log(`🚀 开始执行升级操作: ${operationName} (版本 ${version})`);

    const result = await operation();

    console.log(`📝 设置升级状态为'completed'`);
    UpgradeStatusChecker.setUpgradeStatus(version, "completed");
    console.log(`✅ 升级操作完成: ${operationName} (版本 ${version})`);

    return result;
  } catch (error) {
    console.log(`📝 设置升级状态为'failed'`);
    UpgradeStatusChecker.setUpgradeStatus(version, "failed");
    console.error(`❌ 升级操作失败: ${operationName} (版本 ${version})`, error);

    // 检查是否为索引相关错误
    console.log(`🔍 分析错误类型...`);
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      console.log(`📋 错误消息: ${error.message}`);

      const isIndexError =
        errorMessage.includes("createindex") ||
        errorMessage.includes("constrainterror") ||
        (errorMessage.includes("index") && errorMessage.includes("exists"));

      if (isIndexError) {
        console.warn(
          `⚠️ 检测到索引创建错误，这可能是由于重复升级导致的: ${error.message}`
        );
        // 对于索引错误，我们可以尝试继续，因为索引可能已经存在
        console.log(`📝 忽略索引错误，设置升级状态为'completed'`);
        UpgradeStatusChecker.setUpgradeStatus(version, "completed");
        console.log(
          `✅ 忽略索引错误，标记升级为完成: ${operationName} (版本 ${version})`
        );
        return {} as T; // 返回空对象作为默认值
      }
    }

    throw new DatabaseUpgradeError(
      `升级操作失败: ${operationName}`,
      version,
      operationName,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * 检查并修复数据库状态
 */
export async function checkAndRepairDatabase(db: IDBDatabase): Promise<{
  success: boolean;
  issues: string[];
  repaired: string[];
}> {
  const issues: string[] = [];
  const repaired: string[] = [];

  try {
    // 检查升级状态
    const upgradeStatus = UpgradeStatusChecker.getUpgradeStatus();
    if (upgradeStatus?.status === "failed") {
      issues.push(`上次升级失败 (版本 ${upgradeStatus.version})`);

      // 尝试清除失败状态
      UpgradeStatusChecker.clearUpgradeStatus();
      repaired.push("清除了失败的升级状态");
    }

    // 检查基本表是否存在
    const requiredTables = [
      "wordRecords",
      "chapterRecords",
      "reviewRecords",
      "familiarWords",
      "wordReviewRecords",
      "reviewHistories",
      "reviewConfigs",
    ];

    for (const tableName of requiredTables) {
      if (!hasObjectStore(db, tableName)) {
        issues.push(`缺少必需的表: ${tableName}`);
      }
    }

    // 检查关键索引是否存在
    const criticalIndexes = [
      { table: "wordRecords", index: "uuid" },
      { table: "wordRecords", index: "[dict+word]" },
      { table: "chapterRecords", index: "uuid" },
      { table: "reviewConfigs", index: "uuid" },
    ];

    for (const { table, index } of criticalIndexes) {
      if (hasObjectStore(db, table)) {
        try {
          const transaction = db.transaction([table], "readonly");
          const objectStore = transaction.objectStore(table);
          if (!hasIndex(objectStore, index)) {
            issues.push(`表 ${table} 缺少索引: ${index}`);
          }
        } catch (error) {
          console.warn(`检查索引 ${table}.${index} 时出错:`, error);
        }
      }
    }

    return {
      success: issues.length === 0,
      issues,
      repaired,
    };
  } catch (error) {
    console.error("数据库检查失败:", error);
    return {
      success: false,
      issues: [`数据库检查失败: ${error}`],
      repaired: [],
    };
  }
}

/**
 * 诊断数据库问题
 */
export function diagnoseDatabaseError(error: Error): {
  type: "index" | "version" | "corruption" | "permission" | "unknown";
  suggestion: string;
  canAutoFix: boolean;
} {
  const message = error.message.toLowerCase();

  if (
    message.includes("createindex") ||
    message.includes("constrainterror") ||
    (message.includes("index") && message.includes("exists"))
  ) {
    return {
      type: "index",
      suggestion: "索引创建冲突，建议重置数据库或清除浏览器数据",
      canAutoFix: true,
    };
  }

  if (message.includes("version") || message.includes("upgrade")) {
    return {
      type: "version",
      suggestion: "数据库版本升级失败，建议重置数据库",
      canAutoFix: true,
    };
  }

  if (message.includes("corrupt") || message.includes("damaged")) {
    return {
      type: "corruption",
      suggestion: "数据库文件损坏，需要重置数据库",
      canAutoFix: true,
    };
  }

  if (message.includes("permission") || message.includes("access")) {
    return {
      type: "permission",
      suggestion: "数据库访问权限问题，请检查浏览器设置",
      canAutoFix: false,
    };
  }

  return {
    type: "unknown",
    suggestion: "未知错误，建议重置数据库或联系技术支持",
    canAutoFix: false,
  };
}
