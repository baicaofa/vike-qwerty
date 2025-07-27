import CustomWord from "../models/CustomWord";
import { dictionaryUploadService } from "../services/DictionaryUploadService";
import { wordQueryService } from "../services/WordQueryService";
import { generateUUID } from "../utils/uuid";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// 加载项目根目录的 .env 文件
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 测试新数据结构的脚本
 */
async function testNewStructure() {
  try {
    const mongoUri =
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR";
    await mongoose.connect(mongoUri);
    console.log("数据库连接成功");

    // 创建测试词库ID
    const testDictId = generateUUID();
    console.log(`测试词库ID: ${testDictId}`);

    // 1. 测试词汇上传功能
    console.log("\n=== 测试词汇上传功能 ===");
    const testWords = ["hello", "world", "test", "nonexistentword123"];

    const uploadResult = await dictionaryUploadService.processWordUpload(
      testWords,
      testDictId
    );
    console.log("上传结果:", {
      total: uploadResult.total,
      enriched: uploadResult.enriched,
      empty: uploadResult.empty,
      enrichmentRate: uploadResult.enrichmentRate,
    });

    // 2. 插入测试数据
    console.log("\n=== 插入测试数据 ===");
    const wordsToInsert = uploadResult.words.map((word, i) => ({
      ...word,
      index: i,
    }));

    const insertedWords = await CustomWord.insertMany(wordsToInsert);
    console.log(`成功插入 ${insertedWords.length} 个单词`);

    // 3. 验证数据结构
    console.log("\n=== 验证数据结构 ===");
    const savedWords = await CustomWord.find({ dictId: testDictId }).lean();

    for (const word of savedWords) {
      console.log(`单词: ${word.name}`);
      console.log(`  sourceType: ${word.sourceType}`);
      console.log(`  officialWordId: ${word.officialWordId || "undefined"}`);
      console.log(`  userData: ${word.userData ? "defined" : "undefined"}`);
      console.log(`  isUserModified: ${word.isUserModified}`);
      console.log(`  isEmpty: ${word.isEmpty}`);

      // 检查数据结构是否正确
      const hasCorrectStructure =
        word.sourceType &&
        (word.sourceType === "empty" ||
          word.sourceType === "official" ||
          word.sourceType === "user_custom") &&
        typeof word.isUserModified === "boolean" &&
        typeof word.isEmpty === "boolean";

      if (hasCorrectStructure) {
        console.log(`  ✅ 数据结构正确`);
      } else {
        console.log(`  ⚠️  数据结构有问题`);
      }
      console.log("");
    }

    // 4. 测试查询功能
    console.log("\n=== 测试查询功能 ===");
    const queryResult = await wordQueryService.getDictionaryWords(
      testDictId,
      1,
      10
    );
    console.log(`查询到 ${queryResult.words.length} 个单词`);

    for (const word of queryResult.words) {
      console.log(`单词: ${word.name}`);
      console.log(`  美音: ${word.usphone}`);
      console.log(`  英音: ${word.ukphone}`);
      console.log(`  例句数量: ${word.sentences.length}`);
      console.log(`  翻译数量: ${word.detailed_translations.length}`);
      console.log("");
    }

    // 5. 清理测试数据
    console.log("\n=== 清理测试数据 ===");
    const deleteResult = await CustomWord.deleteMany({ dictId: testDictId });
    console.log(`删除了 ${deleteResult.deletedCount} 条测试记录`);

    console.log("\n✅ 测试完成");
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行测试
if (require.main === module) {
  testNewStructure();
}

export { testNewStructure };
