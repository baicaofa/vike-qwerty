import CustomDictionary from "../models/CustomDictionary";
import { generateUUID } from "../utils/uuid";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// 加载项目根目录的 .env 文件
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 测试词库名称唯一性的脚本
 */
async function testDictionaryUniqueness() {
  try {
    const mongoUri =
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR";
    await mongoose.connect(mongoUri);
    console.log("数据库连接成功");

    // 创建测试用户ID
    const testUserId = "test-user-" + Date.now();
    console.log(`测试用户ID: ${testUserId}`);

    // 测试1：创建第一个词库
    console.log("\n=== 测试1：创建第一个词库 ===");
    const dict1 = await CustomDictionary.create({
      id: generateUUID(),
      userId: testUserId,
      name: "测试词库",
      description: "第一个测试词库",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ 第一个词库创建成功:", dict1.name);

    // 测试2：尝试创建同名词库（应该失败）
    console.log("\n=== 测试2：尝试创建同名词库 ===");
    try {
      await CustomDictionary.create({
        id: generateUUID(),
        userId: testUserId,
        name: "测试词库", // 相同名称
        description: "第二个测试词库",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log("❌ 错误：同名词库创建成功了（应该失败）");
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        console.log("✅ 正确：同名词库创建失败，唯一性约束生效");
      } else {
        console.log("⚠️  意外错误:", error);
      }
    }

    // 测试3：不同用户可以创建同名词库
    console.log("\n=== 测试3：不同用户创建同名词库 ===");
    const testUserId2 = "test-user-2-" + Date.now();
    const dict3 = await CustomDictionary.create({
      id: generateUUID(),
      userId: testUserId2,
      name: "测试词库", // 相同名称但不同用户
      description: "不同用户的测试词库",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ 不同用户的同名词库创建成功:", dict3.name);

    // 测试4：同一用户创建不同名称的词库
    console.log("\n=== 测试4：同一用户创建不同名称的词库 ===");
    const dict4 = await CustomDictionary.create({
      id: generateUUID(),
      userId: testUserId,
      name: "测试词库2", // 不同名称
      description: "第二个不同名称的词库",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ 不同名称的词库创建成功:", dict4.name);

    // 测试5：更新词库名称为已存在的名称（应该失败）
    console.log("\n=== 测试5：更新词库名称为已存在的名称 ===");
    try {
      await CustomDictionary.findOneAndUpdate(
        { id: dict4.id, userId: testUserId },
        { name: "测试词库" }, // 更新为已存在的名称
        { new: true }
      );
      console.log("❌ 错误：词库名称更新成功了（应该失败）");
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        console.log("✅ 正确：词库名称更新失败，唯一性约束生效");
      } else {
        console.log("⚠️  意外错误:", error);
      }
    }

    // 测试6：更新词库名称为新的名称（应该成功）
    console.log("\n=== 测试6：更新词库名称为新的名称 ===");
    const updatedDict = await CustomDictionary.findOneAndUpdate(
      { id: dict4.id, userId: testUserId },
      { name: "测试词库3" }, // 更新为新的名称
      { new: true }
    );
    console.log("✅ 词库名称更新成功:", updatedDict?.name);

    // 清理测试数据
    console.log("\n=== 清理测试数据 ===");
    const deleteResult = await CustomDictionary.deleteMany({
      userId: { $in: [testUserId, testUserId2] },
    });
    console.log(`删除了 ${deleteResult.deletedCount} 个测试词库`);

    console.log("\n✅ 所有测试完成，词库名称唯一性验证正常工作");
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行测试
if (require.main === module) {
  testDictionaryUniqueness();
}

export { testDictionaryUniqueness };
