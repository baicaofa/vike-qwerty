import CustomDictionary from "../models/CustomDictionary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// 加载项目根目录的 .env 文件
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 为 CustomDictionary 集合添加唯一索引的迁移脚本
 */
async function addDictionaryUniqueIndex() {
  try {
    const mongoUri =
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR";
    await mongoose.connect(mongoUri);
    console.log("数据库连接成功");

    const collection = mongoose.connection.db!.collection("customdictionaries");

    // 1. 检查现有索引
    console.log("\n=== 检查现有索引 ===");
    const existingIndexes = await collection.indexes();
    console.log("现有索引:");
    existingIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });

    // 2. 检查是否已存在唯一索引
    const uniqueIndexExists = existingIndexes.some(
      (index) => index.key.userId && index.key.name && index.unique
    );

    if (uniqueIndexExists) {
      console.log("\n✅ 唯一索引已存在，无需创建");
      return;
    }

    // 3. 检查是否有重复的词库名称
    console.log("\n=== 检查重复的词库名称 ===");
    const duplicates = await collection
      .aggregate([
        {
          $group: {
            _id: { userId: "$userId", name: "$name" },
            count: { $sum: 1 },
            docs: {
              $push: { id: "$id", name: "$name", createdAt: "$createdAt" },
            },
          },
        },
        {
          $match: { count: { $gt: 1 } },
        },
      ])
      .toArray();

    if (duplicates.length > 0) {
      console.log(`发现 ${duplicates.length} 组重复的词库名称:`);

      for (const duplicate of duplicates) {
        console.log(
          `\n用户 ${duplicate._id.userId} 的词库 "${duplicate._id.name}" 有 ${duplicate.count} 个重复:`
        );
        duplicate.docs.forEach((doc: any, index: number) => {
          console.log(
            `  ${index + 1}. ID: ${doc.id}, 创建时间: ${new Date(
              doc.createdAt
            ).toLocaleString()}`
          );
        });

        // 保留最早创建的，删除其他重复项
        const sortedDocs = duplicate.docs.sort(
          (a: any, b: any) => a.createdAt - b.createdAt
        );
        const toKeep = sortedDocs[0];
        const toDelete = sortedDocs.slice(1);

        console.log(`  保留: ${toKeep.id} (最早创建)`);

        for (const doc of toDelete) {
          console.log(`  删除: ${doc.id}`);
          await collection.deleteOne({ id: doc.id });
        }
      }

      console.log("\n✅ 重复词库清理完成");
    } else {
      console.log("✅ 没有发现重复的词库名称");
    }

    // 4. 创建唯一索引
    console.log("\n=== 创建唯一索引 ===");
    try {
      await collection.createIndex(
        { userId: 1, name: 1 },
        {
          unique: true,
          name: "userId_name_unique",
        }
      );
      console.log("✅ 唯一索引创建成功");
    } catch (error) {
      console.error("❌ 创建唯一索引失败:", error);
      throw error;
    }

    // 5. 验证索引创建
    console.log("\n=== 验证索引创建 ===");
    const newIndexes = await collection.indexes();
    const uniqueIndex = newIndexes.find(
      (index) => index.key.userId && index.key.name && index.unique
    );

    if (uniqueIndex) {
      console.log("✅ 唯一索引验证成功:", uniqueIndex.name);
    } else {
      console.log("❌ 唯一索引验证失败");
    }

    console.log("\n✅ 迁移完成");
  } catch (error) {
    console.error("迁移失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行迁移
if (require.main === module) {
  addDictionaryUniqueIndex();
}

export { addDictionaryUniqueIndex };
