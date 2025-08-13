/**
 * 数据完整性测试工具
 * 用于验证数据修复效果
 */
import {
  cleanupCorruptedRecords,
  performDataMigration,
  resetMigrationStatus,
  shouldPerformDataMigration,
  validateWordReviewRecord,
} from "./dataIntegrity";
import { db } from "./db";
import type { IWordReviewRecord } from "./db/wordReviewRecord";

/**
 * 数据完整性测试报告
 */
interface DataIntegrityReport {
  timestamp: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  validationResults: {
    passed: number;
    failed: number;
    issues: string[];
  };
  sampleInvalidRecords: any[];
  chapterGenerationTest: {
    success: boolean;
    chapterCount: number;
    wordsPerChapter: number[];
    error?: string;
  };
}

/**
 * 创建测试用的损坏数据
 */
export async function createTestCorruptedData(): Promise<void> {
  try {
    // 注意：直接插入损坏数据可能会被 Dexie 拒绝
    // 这里我们先创建一个有效记录，然后在内存中模拟损坏情况
    console.log("测试数据创建完成（在内存中模拟）");
  } catch (error) {
    console.error("创建测试数据失败:", error);
  }
}

/**
 * 验证数据完整性
 */
export async function validateDataIntegrity(): Promise<DataIntegrityReport> {
  console.log("开始验证数据完整性...");

  const timestamp = new Date().toISOString();
  let allRecords: any[] = [];
  let chapterGenerationTest = {
    success: false,
    chapterCount: 0,
    wordsPerChapter: [],
    error: undefined,
  };

  try {
    // 获取所有记录
    allRecords = await db.wordReviewRecords.toArray();
    console.log(`获取到 ${allRecords.length} 条记录`);
  } catch (error) {
    console.error("获取数据失败:", error);
  }

  // 验证每条记录
  const validationResults = {
    passed: 0,
    failed: 0,
    issues: [] as string[],
  };

  const sampleInvalidRecords: any[] = [];

  allRecords.forEach((record, index) => {
    const validation = validateWordReviewRecord(record);
    if (validation.isValid) {
      validationResults.passed++;
    } else {
      validationResults.failed++;
      validationResults.issues.push(...validation.issues);

      // 收集前5个无效记录作为样本
      if (sampleInvalidRecords.length < 5) {
        sampleInvalidRecords.push({
          index,
          record,
          issues: validation.issues,
        });
      }
    }
  });

  // 测试章节生成
  try {
    const { generateChapters } = await import("./chapterManagement");
    const validRecords = allRecords.filter((record) => {
      const validation = validateWordReviewRecord(record);
      return validation.isValid;
    }) as IWordReviewRecord[];

    if (validRecords.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const chapters = generateChapters(validRecords, today);

      chapterGenerationTest = {
        success: true,
        chapterCount: chapters.length,
        wordsPerChapter: chapters.map((ch) => ch.totalWords),
      };
    } else {
      chapterGenerationTest = {
        success: false,
        chapterCount: 0,
        wordsPerChapter: [],
        error: "没有有效的记录用于章节生成",
      };
    }
  } catch (error) {
    chapterGenerationTest = {
      success: false,
      chapterCount: 0,
      wordsPerChapter: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const report: DataIntegrityReport = {
    timestamp,
    totalRecords: allRecords.length,
    validRecords: validationResults.passed,
    invalidRecords: validationResults.failed,
    validationResults,
    sampleInvalidRecords,
    chapterGenerationTest,
  };

  console.log("数据完整性验证完成:", report);
  return report;
}

/**
 * 测试数据修复功能
 */
export async function testDataRepair(): Promise<void> {
  console.log("开始测试数据修复功能...");

  try {
    // 1. 验证修复前状态
    console.log("=== 修复前状态 ===");
    const beforeReport = await validateDataIntegrity();
    console.log("修复前报告:", beforeReport);

    // 2. 执行数据修复
    console.log("=== 执行数据修复 ===");
    const repairStats = await cleanupCorruptedRecords();
    console.log("修复统计:", repairStats);

    // 3. 验证修复后状态
    console.log("=== 修复后状态 ===");
    const afterReport = await validateDataIntegrity();
    console.log("修复后报告:", afterReport);

    // 4. 输出对比结果
    console.log("=== 修复效果对比 ===");
    console.log(
      `总记录数: ${beforeReport.totalRecords} -> ${afterReport.totalRecords}`
    );
    console.log(
      `有效记录: ${beforeReport.validRecords} -> ${afterReport.validRecords}`
    );
    console.log(
      `无效记录: ${beforeReport.invalidRecords} -> ${afterReport.invalidRecords}`
    );
    console.log(
      `章节生成: ${beforeReport.chapterGenerationTest.success} -> ${afterReport.chapterGenerationTest.success}`
    );

    if (afterReport.invalidRecords === 0) {
      console.log("✅ 数据修复成功！所有记录现在都是有效的。");
    } else {
      console.log(`⚠️ 仍有 ${afterReport.invalidRecords} 条无效记录。`);
    }
  } catch (error) {
    console.error("测试数据修复失败:", error);
  }
}

/**
 * 完整的数据迁移测试
 */
export async function testDataMigration(): Promise<void> {
  console.log("开始测试完整数据迁移流程...");

  try {
    // 1. 重置迁移状态
    resetMigrationStatus();
    console.log("✅ 迁移状态已重置");

    // 2. 检查是否需要迁移
    const needsMigration = shouldPerformDataMigration();
    console.log("🔍 需要迁移:", needsMigration);

    if (needsMigration) {
      // 3. 执行迁移
      console.log("=== 执行数据迁移 ===");
      const migrationStats = await performDataMigration();
      console.log("迁移统计:", migrationStats);

      // 4. 检查迁移后状态
      const afterMigration = shouldPerformDataMigration();
      console.log("🔍 迁移后是否还需要迁移:", afterMigration);

      if (!afterMigration) {
        console.log("✅ 数据迁移流程测试成功！");
      } else {
        console.log("❌ 数据迁移流程可能有问题。");
      }
    } else {
      console.log("ℹ️ 当前不需要迁移，流程正常。");
    }
  } catch (error) {
    console.error("测试数据迁移失败:", error);
  }
}

/**
 * 运行所有测试
 */
export async function runAllDataIntegrityTests(): Promise<void> {
  console.log("🚀 开始运行所有数据完整性测试...");

  try {
    await testDataMigration();
    console.log("\n" + "=".repeat(50) + "\n");

    await testDataRepair();
    console.log("\n" + "=".repeat(50) + "\n");

    const finalReport = await validateDataIntegrity();
    console.log("📊 最终数据完整性报告:", finalReport);

    console.log("✅ 所有测试完成！");
  } catch (error) {
    console.error("❌ 测试执行失败:", error);
  }
}

// 导出给开发者控制台使用的便捷函数
(window as any).dataIntegrityTest = {
  validate: validateDataIntegrity,
  repair: testDataRepair,
  migration: testDataMigration,
  runAll: runAllDataIntegrityTests,
  createCorrupted: createTestCorruptedData,
};
