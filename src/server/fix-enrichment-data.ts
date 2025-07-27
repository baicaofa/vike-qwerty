import CustomWord from "./models/CustomWord";
import OfficialWordLibrary from "./models/OfficialWordLibrary";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

/**
 * 修复词汇补充数据的脚本
 * 处理sourceType为official但缺少officialWordId的记录
 */
async function fixEnrichmentData() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/qwerty"
    );
    console.log("数据库连接成功");

    // 1. 查找有问题的记录：sourceType为official但缺少officialWordId
    const problematicWords = await CustomWord.find({
      sourceType: "official",
      $or: [
        { officialWordId: { $exists: false } },
        { officialWordId: null },
        { officialWordId: "" },
      ],
    });

    console.log(`找到 ${problematicWords.length} 个有问题的记录`);

    if (problematicWords.length === 0) {
      console.log("没有需要修复的数据");
      return;
    }

    // 2. 提取单词名称
    const wordNames = problematicWords.map((word) =>
      word.name.toLowerCase().trim()
    );
    console.log("需要重新查询的单词:", wordNames.slice(0, 10));

    // 3. 批量查询官方词库
    const officialWords = await OfficialWordLibrary.find({
      name: { $in: wordNames },
    }).lean();

    console.log(`在官方词库中找到 ${officialWords.length} 个匹配的单词`);

    // 4. 创建映射表
    const wordMap = new Map(officialWords.map((w) => [w.name, w]));

    // 5. 修复数据
    let fixedCount = 0;
    let convertedToEmptyCount = 0;

    for (const word of problematicWords) {
      const cleanName = word.name.toLowerCase().trim();
      const officialWord = wordMap.get(cleanName);

      if (officialWord && officialWord.id) {
        // 找到了官方数据，更新officialWordId
        await CustomWord.findByIdAndUpdate(word._id, {
          officialWordId: officialWord.id,
          updatedAt: Date.now(),
        });
        fixedCount++;
        console.log(
          `修复单词 "${word.name}": 设置 officialWordId = ${officialWord.id}`
        );
      } else {
        // 没有找到官方数据，转换为empty类型
        await CustomWord.findByIdAndUpdate(word._id, {
          sourceType: "empty",
          officialWordId: undefined,
          isEmpty: true,
          updatedAt: Date.now(),
        });
        convertedToEmptyCount++;
        console.log(`转换单词 "${word.name}": sourceType = empty`);
      }
    }

    console.log(`\n修复完成:`);
    console.log(`- 成功修复: ${fixedCount} 个单词`);
    console.log(`- 转换为空白: ${convertedToEmptyCount} 个单词`);
  } catch (error) {
    console.error("修复失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行修复脚本
if (require.main === module) {
  fixEnrichmentData();
}

export { fixEnrichmentData };
