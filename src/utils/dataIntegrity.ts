/**
 * 数据完整性管理模块
 * 负责验证、修复和清理 IWordReviewRecord 数据
 */
import { db } from "./db";
import type { IWordReviewRecord } from "./db/wordReviewRecord";
import { getLocalStorageItem, setLocalStorageItem } from "./localStorage";
import { generateUUID } from "./uuid";

// 常量定义
const DATA_MIGRATION_VERSION = "1.0.0";
const MIGRATION_STATUS_KEY = "data_integrity_migration_status";

/**
 * 数据验证结果
 */
interface ValidationResult {
  isValid: boolean;
  issues: string[];
  canRepair: boolean;
}

/**
 * 修复统计信息
 */
interface RepairStats {
  totalRecords: number;
  validRecords: number;
  repairedRecords: number;
  removedRecords: number;
  issues: {
    missingWord: number;
    missingTimestamp: number;
    invalidType: number;
    missingUuid: number;
    missingPracticeCount: number;
  };
}

/**
 * 验证单个 WordReviewRecord 的数据完整性
 */
export function validateWordReviewRecord(record: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    issues: [],
    canRepair: true,
  };

  // 检查记录是否存在且为对象
  if (!record || typeof record !== "object") {
    result.isValid = false;
    result.canRepair = false;
    result.issues.push("记录不存在或不是对象");
    return result;
  }

  // 检查必需的字符串字段
  if (
    !record.word ||
    typeof record.word !== "string" ||
    record.word.trim() === ""
  ) {
    result.isValid = false;
    result.canRepair = false; // word字段无法修复，这是关键标识
    result.issues.push("缺少有效的单词字段");
  }

  // 检查UUID
  if (!record.uuid || typeof record.uuid !== "string") {
    result.isValid = false;
    result.issues.push("缺少或无效的UUID");
  }

  // 检查时间戳字段
  if (typeof record.lastPracticedAt !== "number") {
    result.isValid = false;
    result.issues.push("lastPracticedAt字段缺失或类型错误");
  }

  if (typeof record.firstSeenAt !== "number") {
    result.isValid = false;
    result.issues.push("firstSeenAt字段缺失或类型错误");
  }

  // 检查计数字段
  if (typeof record.todayPracticeCount !== "number") {
    result.isValid = false;
    result.issues.push("todayPracticeCount字段缺失或类型错误");
  }

  if (typeof record.totalReviews !== "number") {
    result.isValid = false;
    result.issues.push("totalReviews字段缺失或类型错误");
  }

  if (typeof record.currentIntervalIndex !== "number") {
    result.isValid = false;
    result.issues.push("currentIntervalIndex字段缺失或类型错误");
  }

  // 检查必需的数组字段
  if (!Array.isArray(record.intervalSequence)) {
    result.isValid = false;
    result.issues.push("intervalSequence字段缺失或不是数组");
  }

  if (!Array.isArray(record.sourceDicts)) {
    result.isValid = false;
    result.issues.push("sourceDicts字段缺失或不是数组");
  }

  // 检查必需的字符串字段
  if (!record.preferredDict || typeof record.preferredDict !== "string") {
    result.isValid = false;
    result.issues.push("preferredDict字段缺失或类型错误");
  }

  // 检查布尔字段
  if (typeof record.isGraduated !== "boolean") {
    result.isValid = false;
    result.issues.push("isGraduated字段缺失或类型错误");
  }

  return result;
}

/**
 * 修复单个 WordReviewRecord
 */
export function repairWordReviewRecord(record: any): IWordReviewRecord | null {
  const validation = validateWordReviewRecord(record);

  // 如果无法修复（通常是缺少word字段），返回null
  if (!validation.canRepair) {
    console.warn("无法修复的记录:", record, "问题:", validation.issues);
    return null;
  }

  // 如果已经有效，直接返回
  if (validation.isValid) {
    return record as IWordReviewRecord;
  }

  console.log(
    `修复记录: ${record.word || "unknown"}`,
    "问题:",
    validation.issues
  );

  // 开始修复
  const now = Date.now();
  const repaired: IWordReviewRecord = { ...record };

  // 修复UUID
  if (!repaired.uuid || typeof repaired.uuid !== "string") {
    repaired.uuid = generateUUID();
  }

  // 修复时间戳字段
  if (typeof repaired.lastPracticedAt !== "number") {
    repaired.lastPracticedAt = now;
  }

  if (typeof repaired.firstSeenAt !== "number") {
    repaired.firstSeenAt = now;
  }

  if (typeof repaired.nextReviewAt !== "number") {
    repaired.nextReviewAt = now;
  }

  // 修复计数字段
  if (typeof repaired.todayPracticeCount !== "number") {
    repaired.todayPracticeCount = 0;
  }

  if (typeof repaired.totalReviews !== "number") {
    repaired.totalReviews = 0;
  }

  if (typeof repaired.currentIntervalIndex !== "number") {
    repaired.currentIntervalIndex = 0;
  }

  if (typeof repaired.consecutiveCorrect !== "number") {
    repaired.consecutiveCorrect = 0;
  }

  // 修复数组字段
  if (!Array.isArray(repaired.intervalSequence)) {
    repaired.intervalSequence = [1, 3, 7, 15, 30, 60]; // 默认间隔序列
  }

  if (!Array.isArray(repaired.sourceDicts)) {
    repaired.sourceDicts = ["default"]; // 默认词典
  }

  if (!Array.isArray(repaired.reviewHistory)) {
    repaired.reviewHistory = [];
  }

  // 修复字符串字段
  if (!repaired.preferredDict || typeof repaired.preferredDict !== "string") {
    repaired.preferredDict = repaired.sourceDicts[0] || "default";
  }

  // 修复布尔字段
  if (typeof repaired.isGraduated !== "boolean") {
    repaired.isGraduated = false;
  }

  return repaired;
}

/**
 * 批量验证和修复 WordReviewRecord 数组
 */
export function repairWordReviewRecords(records: any[]): {
  validRecords: IWordReviewRecord[];
  stats: RepairStats;
} {
  const stats: RepairStats = {
    totalRecords: records.length,
    validRecords: 0,
    repairedRecords: 0,
    removedRecords: 0,
    issues: {
      missingWord: 0,
      missingTimestamp: 0,
      invalidType: 0,
      missingUuid: 0,
      missingPracticeCount: 0,
    },
  };

  const validRecords: IWordReviewRecord[] = [];

  for (const record of records) {
    const validation = validateWordReviewRecord(record);

    if (validation.isValid) {
      validRecords.push(record as IWordReviewRecord);
      stats.validRecords++;
    } else if (validation.canRepair) {
      const repaired = repairWordReviewRecord(record);
      if (repaired) {
        validRecords.push(repaired);
        stats.repairedRecords++;

        // 统计修复的问题类型
        validation.issues.forEach((issue) => {
          if (issue.includes("UUID")) stats.issues.missingUuid++;
          if (issue.includes("Timestamp") || issue.includes("PracticedAt"))
            stats.issues.missingTimestamp++;
          if (issue.includes("PracticeCount"))
            stats.issues.missingPracticeCount++;
        });
      } else {
        stats.removedRecords++;
      }
    } else {
      stats.removedRecords++;
      if (validation.issues.some((issue) => issue.includes("单词字段"))) {
        stats.issues.missingWord++;
      }
      if (validation.issues.some((issue) => issue.includes("不是对象"))) {
        stats.issues.invalidType++;
      }
    }
  }

  return { validRecords, stats };
}

/**
 * 清理数据库中的损坏记录
 */
export async function cleanupCorruptedRecords(): Promise<RepairStats> {
  console.log("开始清理数据库中的损坏记录...");

  try {
    // 获取所有记录
    const allRecords = await db.wordReviewRecords.toArray();
    console.log(`发现 ${allRecords.length} 条记录`);

    // 验证和修复
    const { validRecords, stats } = repairWordReviewRecords(allRecords);

    console.log("数据修复统计:", stats);

    // 如果有修复或删除的记录，更新数据库
    if (stats.repairedRecords > 0 || stats.removedRecords > 0) {
      console.log("更新数据库...");

      // 清空数据库
      await db.wordReviewRecords.clear();

      // 重新插入有效记录
      if (validRecords.length > 0) {
        await db.wordReviewRecords.bulkAdd(validRecords);
      }

      console.log(`数据库更新完成: ${validRecords.length} 条有效记录`);
    }

    return stats;
  } catch (error) {
    console.error("清理损坏记录时出错:", error);
    throw error;
  }
}

/**
 * 检查是否需要进行数据迁移
 */
export function shouldPerformDataMigration(): boolean {
  const migrationStatus = getLocalStorageItem(MIGRATION_STATUS_KEY);
  return migrationStatus !== DATA_MIGRATION_VERSION;
}

/**
 * 执行一次性数据迁移
 */
export async function performDataMigration(): Promise<RepairStats> {
  console.log("开始执行数据迁移...");

  try {
    const stats = await cleanupCorruptedRecords();

    // 标记迁移完成
    setLocalStorageItem(MIGRATION_STATUS_KEY, DATA_MIGRATION_VERSION);

    console.log("数据迁移完成:", stats);
    return stats;
  } catch (error) {
    console.error("数据迁移失败:", error);
    throw error;
  }
}

/**
 * 重置迁移状态（用于测试）
 */
export function resetMigrationStatus(): void {
  setLocalStorageItem(MIGRATION_STATUS_KEY, "");
}
