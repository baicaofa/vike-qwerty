import { db } from "./index";

/**
 * 修复指定表中的 uuid 约束错误
 * 删除重复的 uuid 记录，保留最新的记录
 */
async function fixTableUuidConstraint(tableName: string): Promise<number> {
  const table = db.table(tableName);
  const allRecords = await table.toArray();
  console.log(`📊 ${tableName} 总记录数: ${allRecords.length}`);

  // 按 uuid 分组，找出重复的记录
  const uuidGroups = new Map<string, any[]>();
  for (const record of allRecords) {
    if (record.uuid) {
      if (!uuidGroups.has(record.uuid)) {
        uuidGroups.set(record.uuid, []);
      }
      uuidGroups.get(record.uuid)!.push(record);
    }
  }

  let deletedCount = 0;

  // 处理重复的 uuid
  for (const [uuid, records] of Array.from(uuidGroups.entries())) {
    if (records.length > 1) {
      console.log(`发现重复 uuid: ${uuid}，记录数: ${records.length}`);

      // 按 last_modified 排序，保留最新的记录
      records.sort(
        (a: any, b: any) => (b.last_modified || 0) - (a.last_modified || 0)
      );
      const keepRecord = records[0];
      const deleteRecords = records.slice(1);

      // 删除重复记录
      for (const record of deleteRecords) {
        await table.delete(record.id);
        deletedCount++;
        console.log(`删除重复记录: id=${record.id}`);
      }

      console.log(`保留记录: id=${keepRecord.id}`);
    }
  }

  return deletedCount;
}

/**
 * 修复所有表中的 uuid 约束错误
 */
export async function fixAllUuidConstraints(): Promise<void> {
  try {
    console.log("🔧 开始修复所有表的 uuid 约束错误...");

    const tablesToFix = [
      "wordRecords",
      "chapterRecords",
      "reviewRecords",
      "familiarWords",
      "wordReviewRecords",
      "reviewHistories",
      "reviewConfigs",
      "articleRecords",
    ];

    let totalDeleted = 0;

    for (const tableName of tablesToFix) {
      try {
        console.log(`🔍 检查表: ${tableName}`);
        const deletedCount = await fixTableUuidConstraint(tableName);
        totalDeleted += deletedCount;
        if (deletedCount > 0) {
          console.log(
            `✅ ${tableName} 修复完成，删除了 ${deletedCount} 条重复记录`
          );
        }
      } catch (error) {
        console.warn(`⚠️ 修复表 ${tableName} 时出错:`, error);
      }
    }

    console.log(
      `✅ 所有表 uuid 约束错误修复完成，总共删除了 ${totalDeleted} 条重复记录`
    );
  } catch (error) {
    console.error("❌ 修复 uuid 约束错误时发生错误:", error);
    throw error;
  }
}

/**
 * 检查指定表是否存在 uuid 约束错误
 */
async function checkTableUuidConstraintError(
  tableName: string
): Promise<boolean> {
  try {
    const table = db.table(tableName);
    await table.count();
    return false; // 没有错误
  } catch (error: any) {
    if (error.name === "ConstraintError" && error.message.includes("uuid")) {
      return true; // 存在 uuid 约束错误
    }
    throw error; // 其他错误
  }
}

/**
 * 检查所有表是否存在 uuid 约束错误
 */
export async function checkAllUuidConstraintErrors(): Promise<string[]> {
  const tablesToCheck = [
    "wordRecords",
    "chapterRecords",
    "reviewRecords",
    "familiarWords",
    "wordReviewRecords",
    "reviewHistories",
    "reviewConfigs",
    "articleRecords",
  ];

  const tablesWithErrors: string[] = [];

  for (const tableName of tablesToCheck) {
    try {
      const hasError = await checkTableUuidConstraintError(tableName);
      if (hasError) {
        tablesWithErrors.push(tableName);
      }
    } catch (error) {
      console.warn(`检查表 ${tableName} 时出错:`, error);
    }
  }

  return tablesWithErrors;
}

/**
 * 自动修复所有表的 uuid 约束错误（如果存在）
 */
export async function autoFixAllUuidConstraints(): Promise<void> {
  const tablesWithErrors = await checkAllUuidConstraintErrors();

  if (tablesWithErrors.length > 0) {
    console.log(
      `🔍 检测到以下表的 uuid 约束错误: ${tablesWithErrors.join(", ")}`
    );
    console.log("开始自动修复...");
    await fixAllUuidConstraints();
  } else {
    console.log("✅ 未检测到 uuid 约束错误");
  }
}

// 保持向后兼容的函数名
export const fixWordReviewRecordsUuidConstraint = fixAllUuidConstraints;
export const checkUuidConstraintError = checkAllUuidConstraintErrors;
export const autoFixUuidConstraint = autoFixAllUuidConstraints;
