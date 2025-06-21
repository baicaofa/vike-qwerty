/**
 * 调试复习数据的工具函数
 */
import { db } from "./db";
import { syncWordPracticeToReview } from "./spaced-repetition/scheduleGenerator";

/**
 * 检查复习数据状态
 */
export async function debugReviewData() {
  console.log("=== 复习数据调试 ===");

  // 1. 检查复习记录数量
  const reviewRecords = await db.wordReviewRecords.toArray();
  console.log(`复习记录总数: ${reviewRecords.length}`);

  if (reviewRecords.length > 0) {
    console.log(
      "前5个复习记录:",
      reviewRecords.slice(0, 5).map((r) => ({
        word: r.word,
        nextReviewAt: new Date(r.nextReviewAt),
        isGraduated: r.isGraduated,
        currentIntervalIndex: r.currentIntervalIndex,
      }))
    );
  }

  // 2. 检查练习记录数量
  const wordRecords = await db.wordRecords.toArray();
  console.log(`练习记录总数: ${wordRecords.length}`);

  if (wordRecords.length > 0) {
    console.log(
      "前5个练习记录:",
      wordRecords.slice(0, 5).map((r) => ({
        word: r.word,
        dict: r.dict,
        performanceCount: r.performanceHistory.length,
      }))
    );
  }

  // 3. 检查需要复习的单词
  const now = Date.now();
  const dueWords = reviewRecords.filter(
    (r) => !r.isGraduated && r.nextReviewAt <= now
  );
  console.log(`需要复习的单词数: ${dueWords.length}`);

  return {
    totalReviewRecords: reviewRecords.length,
    totalWordRecords: wordRecords.length,
    dueWordsCount: dueWords.length,
    reviewRecords: reviewRecords.slice(0, 5),
    wordRecords: wordRecords.slice(0, 5),
  };
}

/**
 * 从练习记录创建复习记录
 */
export async function createReviewRecordsFromPractice() {
  console.log("=== 从练习记录创建复习记录 ===");

  const wordRecords = await db.wordRecords.toArray();
  console.log(`找到 ${wordRecords.length} 个练习记录`);

  if (wordRecords.length === 0) {
    console.log("没有找到练习记录，无法创建复习记录");
    return 0;
  }

  let created = 0;

  for (const wordRecord of wordRecords) {
    try {
      console.log(`处理单词: ${wordRecord.word} (词典: ${wordRecord.dict})`);

      // 检查是否已有复习记录
      const existingReview = await db.wordReviewRecords
        .where("word")
        .equals(wordRecord.word)
        .first();

      if (!existingReview) {
        console.log(`为单词 "${wordRecord.word}" 创建复习记录...`);

        // 创建复习记录
        await syncWordPracticeToReview(wordRecord.word, wordRecord.dict, {
          isCorrect: true, // 假设练习是正确的
          responseTime: 3000,
          timestamp: Date.now(),
        });
        created++;
        console.log(`✅ 为单词 "${wordRecord.word}" 创建了复习记录`);
      } else {
        console.log(`单词 "${wordRecord.word}" 已有复习记录，跳过`);
      }
    } catch (error) {
      console.error(`❌ 为单词 "${wordRecord.word}" 创建复习记录失败:`, error);
    }
  }

  console.log(`总共创建了 ${created} 个复习记录`);
  return created;
}

/**
 * 重置所有复习记录的时间（用于测试）
 */
export async function resetReviewTimes() {
  console.log("=== 重置复习时间 ===");

  const reviewRecords = await db.wordReviewRecords.toArray();
  let updated = 0;

  for (const record of reviewRecords) {
    try {
      // 设置为需要立即复习
      await db.wordReviewRecords.update(record.id!, {
        nextReviewAt: Date.now() - 1000, // 1秒前
        currentIntervalIndex: 0,
        isGraduated: false,
      });
      updated++;
    } catch (error) {
      console.error(`更新复习记录失败:`, error);
    }
  }

  console.log(`更新了 ${updated} 个复习记录`);
  return updated;
}

/**
 * 创建测试复习数据
 */
export async function createTestReviewData() {
  console.log("=== 创建测试复习数据 ===");

  const testWords = [
    {
      word: "hello",
      dict: "test-dict",
      trans: ["你好"],
      usphone: "həˈloʊ",
      ukphone: "həˈləʊ",
    },
    {
      word: "world",
      dict: "test-dict",
      trans: ["世界"],
      usphone: "wɜːrld",
      ukphone: "wɜːld",
    },
    {
      word: "test",
      dict: "test-dict",
      trans: ["测试"],
      usphone: "test",
      ukphone: "test",
    },
    {
      word: "example",
      dict: "test-dict",
      trans: ["例子"],
      usphone: "ɪɡˈzæmpl",
      ukphone: "ɪɡˈzɑːmpl",
    },
    {
      word: "practice",
      dict: "test-dict",
      trans: ["练习"],
      usphone: "ˈpræktɪs",
      ukphone: "ˈpræktɪs",
    },
  ];

  let created = 0;

  for (const testWord of testWords) {
    try {
      // 检查是否已有复习记录
      const existingReview = await db.wordReviewRecords
        .where("word")
        .equals(testWord.word)
        .first();

      if (!existingReview) {
        // 直接创建复习记录
        const { WordReviewRecord } = await import("./db/wordReviewRecord");
        const { getReviewConfig } = await import("./spaced-repetition/config");

        const config = await getReviewConfig();
        const reviewRecord = new WordReviewRecord(
          testWord.word,
          [testWord.dict],
          testWord.dict,
          config.baseIntervals,
          Date.now()
        );

        // 设置为需要立即复习
        reviewRecord.nextReviewAt = Date.now() - 1000;

        await db.wordReviewRecords.add(reviewRecord);
        created++;
        console.log(`✅ 创建测试复习记录: ${testWord.word}`);
      } else {
        console.log(`测试单词 "${testWord.word}" 已有复习记录，跳过`);
      }
    } catch (error) {
      console.error(`❌ 创建测试复习记录失败 "${testWord.word}":`, error);
    }
  }

  console.log(`总共创建了 ${created} 个测试复习记录`);
  return created;
}

/**
 * 直接测试复习数据查询
 */
export async function testReviewQuery() {
  console.log("=== 测试复习数据查询 ===");

  // 1. 直接查询数据库
  const allRecords = await db.wordReviewRecords.toArray();
  console.log(`数据库中总记录数: ${allRecords.length}`);

  if (allRecords.length > 0) {
    console.log(
      "前3个记录:",
      allRecords.slice(0, 3).map((r) => ({
        word: r.word,
        nextReviewAt: new Date(r.nextReviewAt),
        isGraduated: r.isGraduated,
        currentTime: new Date(),
      }))
    );
  }

  // 2. 测试筛选逻辑
  const now = Date.now();
  const dueWords = allRecords.filter(
    (r) => !r.isGraduated && r.nextReviewAt <= now
  );
  console.log(`应该需要复习的单词数: ${dueWords.length}`);

  // 3. 测试 generateDailyReviewPlan
  try {
    const { generateDailyReviewPlan } = await import(
      "./spaced-repetition/scheduleGenerator"
    );
    const plan = await generateDailyReviewPlan();
    console.log("生成的复习计划:", {
      reviewWords: plan.reviewWords.length,
      urgentWords: plan.urgentWords.length,
      normalWords: plan.normalWords.length,
      totalWords: plan.totalWords,
    });
  } catch (error) {
    console.error("生成复习计划失败:", error);
  }

  return {
    totalRecords: allRecords.length,
    dueWords: dueWords.length,
    records: allRecords.slice(0, 3),
  };
}
