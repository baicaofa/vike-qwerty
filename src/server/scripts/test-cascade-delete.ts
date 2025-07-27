import CustomDictionary from "../models/CustomDictionary";
import CustomWord from "../models/CustomWord";
import { generateUUID } from "../utils/uuid";
import mongoose from "mongoose";

/**
 * 测试级联删除功能的脚本
 */
async function testCascadeDelete() {
  try {
    console.log("连接数据库...");
    const mongoUri =
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR";
    await mongoose.connect(mongoUri);
    console.log("数据库连接成功");

    // 创建测试用户ID
    const testUserId = "test_user_" + Date.now();
    const testDictId = generateUUID();

    console.log("\n=== 创建测试数据 ===");

    // 1. 创建测试词典
    const testDict = new CustomDictionary({
      id: testDictId,
      userId: testUserId,
      name: "测试词典_" + Date.now(),
      description: "用于测试级联删除的词典",
      category: "测试",
      tags: ["test"],
      length: 0,
      language: "en",
      languageCategory: "en",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: false,
      version: 1,
    });

    await testDict.save();
    console.log(`创建测试词典: ${testDict.name} (ID: ${testDictId})`);

    // 2. 创建测试单词
    const testWords = [];
    for (let i = 0; i < 5; i++) {
      const word = new CustomWord({
        id: generateUUID(),
        dictId: testDictId,
        name: `testword${i}`,
        index: i,
        sourceType: "user_custom",
        userData: {
          usphone: `test${i}`,
          ukphone: `test${i}`,
          sentences: [],
          detailed_translations: [
            {
              pos: "n",
              chinese: `测试单词${i}`,
              english: `test word ${i}`,
            },
          ],
        },
        isUserModified: true,
        isEmpty: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await word.save();
      testWords.push(word);
      console.log(`创建测试单词: ${word.name} (ID: ${word.id})`);
    }

    // 3. 验证数据创建成功
    const dictCount = await CustomDictionary.countDocuments({ id: testDictId });
    const wordCount = await CustomWord.countDocuments({ dictId: testDictId });
    console.log(`\n创建完成 - 词典数量: ${dictCount}, 单词数量: ${wordCount}`);

    // 4. 测试级联删除
    console.log("\n=== 测试级联删除 ===");

    // 删除所有关联的单词记录
    const deleteWordsResult = await CustomWord.deleteMany({
      dictId: testDictId,
    });
    console.log(`删除了 ${deleteWordsResult.deletedCount} 个关联单词`);

    // 删除词典记录
    const deleteDictResult = await CustomDictionary.findOneAndDelete({
      id: testDictId,
      userId: testUserId,
    });

    if (!deleteDictResult) {
      throw new Error("删除词典失败");
    }

    console.log(`删除词典: ${deleteDictResult.name}`);

    // 5. 验证删除结果
    console.log("\n=== 验证删除结果 ===");
    const remainingDictCount = await CustomDictionary.countDocuments({
      id: testDictId,
    });
    const remainingWordCount = await CustomWord.countDocuments({
      dictId: testDictId,
    });

    console.log(
      `删除后 - 词典数量: ${remainingDictCount}, 单词数量: ${remainingWordCount}`
    );

    if (remainingDictCount === 0 && remainingWordCount === 0) {
      console.log("✅ 级联删除测试成功！");
    } else {
      console.log("❌ 级联删除测试失败！");
    }
  } catch (error) {
    console.error("测试失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行测试
if (require.main === module) {
  testCascadeDelete();
}

export { testCascadeDelete };
