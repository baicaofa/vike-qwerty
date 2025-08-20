import { syncWordPracticeToReview } from "../spaced-repetition/scheduleGenerator";
import { generateUUID } from "../uuid";
import type {
  IChapterRecord,
  IFamiliarWord,
  IPerformanceEntry,
  IReviewRecord,
  IRevisionDictRecord,
  IWordRecord,
  LetterMistakes, // 如果 IPerformanceEntry 也在此文件中使用，确保它也被导入
} from "./record";
import {
  ChapterRecord,
  FamiliarWord,
  ReviewRecord,
  WordRecord,
} from "./record";
import type { IReviewConfig } from "./reviewConfig";
import { ReviewConfig } from "./reviewConfig";
import type { IReviewHistory } from "./reviewHistory";
import { ReviewHistory } from "./reviewHistory";
import { UpgradeStatusChecker } from "./upgradeHelper";
import type { IWordReviewRecord } from "./wordReviewRecord";
import { WordReviewRecord } from "./wordReviewRecord";
import { TypingContext, TypingStateActionType } from "@/pages/Typing/store";
import type { TypingState } from "@/pages/Typing/store/type";
import {
  currentChapterAtom,
  currentDictIdAtom,
  isReviewModeAtom,
} from "@/store";
import type { Table } from "dexie";
import Dexie from "dexie";
import { useAtomValue } from "jotai";
import { useCallback, useContext } from "react";

export class RecordDB extends Dexie {
  wordRecords!: Table<IWordRecord, number>; // id is the primary key (number)
  chapterRecords!: Table<IChapterRecord, number>;
  reviewRecords!: Table<IReviewRecord, number>;
  familiarWords!: Table<IFamiliarWord, number>;
  revisionDictRecords!: Table<IRevisionDictRecord, number>;
  revisionWordRecords!: Table<IWordRecord, number>;
  articleRecords!: Table<unknown, number>; // any -> unknown
  // 新增复习相关表
  wordReviewRecords!: Table<IWordReviewRecord, number>;
  reviewHistories!: Table<IReviewHistory, number>;
  reviewConfigs!: Table<IReviewConfig, number>;

  constructor() {
    super("RecordDB");
    // 版本1的数据库模式定义
    this.version(1).stores({
      // wordRecords表结构定义
      wordRecords: "++id,word,timeStamp,dict,chapter,errorCount,[dict+chapter]",
      // chapterRecords表结构定义
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
    });

    // 版本2的数据库模式更新
    this.version(2).stores({
      // 将errorCount字段重命名为wrongCount
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
    });

    // 版本3的数据库模式更新

    this.version(3).stores({
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      // 新增reviewRecords表
      reviewRecords: "++id,dict,createTime,isFinished",
    });

    // 版本4的数据库模式更新（添加同步相关字段）

    this.version(4)
      .stores({
        // wordRecords表添加uuid、sync_status和last_modified字段
        wordRecords:
          "++id, &uuid, word, timeStamp, dict, chapter, wrongCount, [dict+chapter], sync_status, last_modified",
        // chapterRecords表添加uuid、sync_status和last_modified字段
        chapterRecords:
          "++id, &uuid, timeStamp, dict, chapter, time, [dict+chapter], sync_status, last_modified",
        // reviewRecords表添加uuid、sync_status和last_modified字段
        reviewRecords:
          "++id, &uuid, dict, createTime, isFinished, sync_status, last_modified",
        // revision* 表保持不变 (假设它们不需要同步)
      })
      .upgrade(async (tx) => {
        // 清空 v3 数据（wordRecords/chapterRecords/reviewRecords）
        await Promise.all([
          tx.table("wordRecords").clear(),
          tx.table("chapterRecords").clear(),
          tx.table("reviewRecords").clear(),
        ]);
        console.log("✅ v4 升级：清空 v3 数据完成");
      });

    // 版本5的数据库模式更新（添加熟词表）
    this.version(5)
      .stores({
        wordRecords:
          "++id, &uuid, word, timeStamp, dict, chapter, wrongCount, [dict+chapter], sync_status, last_modified",
        chapterRecords:
          "++id, &uuid, timeStamp, dict, chapter, time, [dict+chapter], sync_status, last_modified",
        reviewRecords:
          "++id, &uuid, dict, createTime, isFinished, sync_status, last_modified",
        familiarWords:
          "++id, &uuid, word, dict, isFamiliar, sync_status, last_modified, [dict+word]",
        revisionDictRecords: "++id",
        revisionWordRecords: "++id",
      })
      .upgrade(async (tx) => {
        // 清空 v4 数据
        await Promise.all([
          tx.table("wordRecords").clear(),
          tx.table("chapterRecords").clear(),
          tx.table("reviewRecords").clear(),
        ]);
        console.log("✅ v5 升级：清空 v4 数据完成");
      });
    // 新版本，用于 WordRecord 结构调整
    this.version(6)
      .stores({
        // wordRecords 的主键仍然是 ++id，uuid 是唯一索引。
        // 添加 [dict+word] 复合索引用于快速查找特定单词记录。
        // lastPracticedAt 用于按练习时间排序或查询。
        wordRecords:
          "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
        // 其他表结构保持不变，但需要在这里重新声明，否则它们会被移除
        chapterRecords:
          "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
        reviewRecords:
          "++id, &uuid, dict, timeStamp, sync_status, last_modified",
        familiarWords:
          "++id, &uuid, dict, word, sync_status, last_modified,[dict+word]",
      })
      .upgrade(async (tx) => {
        // 清空 v5 数据
        await Promise.all([
          tx.table("wordRecords").clear(),
          tx.table("chapterRecords").clear(),
          tx.table("reviewRecords").clear(),
          tx.table("familiarWords").clear(),
        ]);
        console.log("✅ v6 升级：清空 v5 数据完成");
      });

    // familiarWords 表加上 [dict+word] 复合索引的第7版
    this.version(7).stores({
      wordRecords:
        "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
      chapterRecords:
        "++id, &uuid, dict, chapter, createTime, sync_status, last_modified",
      reviewRecords:
        "++id, &uuid, dict, createTime, sync_status, last_modified",
      familiarWords:
        "++id, &uuid, dict, word, sync_status, last_modified, &[dict+word]",
    });

    // 添加自定义文章表的第8版
    this.version(8).stores({
      wordRecords:
        "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
      chapterRecords:
        "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
      reviewRecords: "++id, &uuid, dict, timeStamp, sync_status, last_modified",
      familiarWords:
        "++id, &uuid, dict, word, sync_status, last_modified, [dict+word]",
      // 添加文章记录表
      articleRecords: "++id, &uuid, title, content, createdAt, lastPracticedAt",
    });

    // 添加智能复习系统的第9版

    this.version(9)
      .stores({
        // 现有表保持不变
        wordRecords:
          "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
        chapterRecords:
          "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
        reviewRecords:
          "++id, &uuid, dict, timeStamp, sync_status, last_modified",
        familiarWords:
          "++id, &uuid, dict, word, sync_status, last_modified, [dict+word]",
        articleRecords:
          "++id, &uuid, title, content, createdAt, lastPracticedAt",

        // 新增复习相关表 -
        wordReviewRecords:
          "++id, &uuid, &word, nextReviewAt, currentIntervalIndex, isGraduated, todayPracticeCount, lastPracticedAt, lastReviewedAt, sync_status, last_modified",
        reviewHistories:
          "++id, &uuid, wordReviewRecordId, word, reviewedAt, sync_status, last_modified",
        reviewConfigs: "++id, &uuid, userId, sync_status, last_modified",
      })
      .upgrade(async (tx) => {
        // 清空 v8 数据（wordRecords/chapterRecords/reviewRecords/familiarWords/articleRecords）
        await Promise.all([
          tx.table("wordRecords").clear(),
          tx.table("chapterRecords").clear(),
          tx.table("reviewRecords").clear(),
          tx.table("familiarWords").clear(),
          tx.table("articleRecords").clear(),
        ]);
        console.log("✅ v9 升级：清空 v8 数据完成");
      });

    // 版本10：基座升级（声明 stores + 清空两表）
    this.version(10)
      .stores({
        wordRecords:
          "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
        chapterRecords:
          "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
        reviewRecords:
          "++id, &uuid, dict, timeStamp, sync_status, last_modified",
        familiarWords:
          "++id, &uuid, dict, word, sync_status, last_modified, [dict+word]",
        articleRecords:
          "++id, &uuid, title, content, createdAt, lastPracticedAt",
        wordReviewRecords:
          "++id, &uuid, &word, nextReviewAt, currentIntervalIndex, isGraduated, todayPracticeCount, lastPracticedAt, lastReviewedAt, sync_status, last_modified",
        reviewHistories:
          "++id, &uuid, word, wordReviewRecordId, reviewedAt, sync_status, last_modified",
        reviewConfigs: "++id, &uuid, userId, sync_status, last_modified",
      })
      .upgrade(async (tx) => {
        // PR-2: 清空本地 wordReviewRecords 与 reviewHistories
        try {
          await tx.table("wordReviewRecords").clear();
        } catch (e) {
          console.warn("v10 升级清空 wordReviewRecords 失败", e);
        }
        try {
          await tx.table("reviewHistories").clear();
        } catch (e) {
          console.warn("v10 升级清空 reviewHistories 失败", e);
        }

        // PR-3: 在线迁移 wordRecords - 补齐 entryUuid/mistakes，去重 [dict+word]
        try {
          const table = tx.table("wordRecords");
          const all = await table.toArray();
          const byKey = new Map<string, any>();
          const updated: any[] = [];
          for (const rec of all) {
            // 补齐 performanceHistory
            if (Array.isArray(rec.performanceHistory)) {
              rec.performanceHistory = rec.performanceHistory.map((e: any) => ({
                ...e,
                mistakes:
                  e?.mistakes && typeof e.mistakes === "object"
                    ? e.mistakes
                    : {},
                entryUuid:
                  typeof e?.entryUuid === "string" && e.entryUuid
                    ? e.entryUuid
                    : generateUUID(),
              }));
              // 排序与 first/last 时间
              rec.performanceHistory.sort(
                (a: any, b: any) => (a.timeStamp || 0) - (b.timeStamp || 0)
              );
              if (rec.performanceHistory.length > 0) {
                rec.firstSeenAt = rec.performanceHistory[0].timeStamp;
                rec.lastPracticedAt =
                  rec.performanceHistory[
                    rec.performanceHistory.length - 1
                  ].timeStamp;
              } else {
                delete rec.firstSeenAt;
                delete rec.lastPracticedAt;
              }
            } else {
              rec.performanceHistory = [];
              delete rec.firstSeenAt;
              delete rec.lastPracticedAt;
            }

            const key = `${rec.dict}-${rec.word}`;
            const existed = byKey.get(key);
            if (!existed) {
              byKey.set(key, rec);
            } else {
              // 去重：保留 last_modified 较新的记录，并合并历史
              const keep =
                (existed.last_modified || 0) >= (rec.last_modified || 0)
                  ? existed
                  : rec;
              const drop = keep === existed ? rec : existed;
              // 合并 performanceHistory（entryUuid 去重）
              const allEntries = [
                ...(keep.performanceHistory || []),
                ...(drop.performanceHistory || []),
              ];
              const seen = new Map<string, any>();
              for (const e of allEntries) {
                if (
                  !seen.has(e.entryUuid) ||
                  (seen.get(e.entryUuid)?.timeStamp || 0) <= (e.timeStamp || 0)
                ) {
                  seen.set(e.entryUuid, e);
                }
              }
              keep.performanceHistory = Array.from(seen.values()).sort(
                (a: any, b: any) => (a.timeStamp || 0) - (b.timeStamp || 0)
              );
              if (keep.performanceHistory.length > 0) {
                keep.firstSeenAt = keep.performanceHistory[0].timeStamp;
                keep.lastPracticedAt =
                  keep.performanceHistory[
                    keep.performanceHistory.length - 1
                  ].timeStamp;
              } else {
                delete keep.firstSeenAt;
                delete keep.lastPracticedAt;
              }
              byKey.set(key, keep);
            }
          }

          byKey.forEach((v) => updated.push(v));
          if (updated.length > 0) {
            await table.clear();
            await table.bulkAdd(updated);
          }
        } catch (e) {
          console.warn("v10 升级迁移 wordRecords 失败", e);
        }

        // PR-5: familiarWords 去重（按 [dict+word] 保留 last_modified 新者）
        try {
          const table = tx.table("familiarWords");
          const all = await table.toArray();
          const groups = new Map<string, any[]>();
          for (let i = 0; i < all.length; i++) {
            const r = all[i];
            const key = `${r.dict}-${r.word}`;
            const arr = groups.get(key);
            if (arr) arr.push(r);
            else groups.set(key, [r]);
          }
          const deleteIds: number[] = [];
          groups.forEach((records) => {
            if (records.length <= 1) return;
            records.sort(
              (a: any, b: any) =>
                (b.last_modified || 0) - (a.last_modified || 0)
            );
            const keep = records[0];
            for (let i = 1; i < records.length; i++) {
              if (records[i].id != null) deleteIds.push(records[i].id);
            }
          });
          if (deleteIds.length > 0) {
            // 分批删除，避免大事务压力
            const batch = 200;
            for (let i = 0; i < deleteIds.length; i += batch) {
              await table.bulkDelete(deleteIds.slice(i, i + batch));
            }
          }
        } catch (e) {
          console.warn("v10 升级去重 familiarWords 失败", e);
        }
      });
  }
}

export const db = new RecordDB();

// 映射数据库表到类
db.wordRecords.mapToClass(WordRecord);
db.chapterRecords.mapToClass(ChapterRecord);
db.reviewRecords.mapToClass(ReviewRecord);
db.familiarWords.mapToClass(FamiliarWord);
db.wordReviewRecords.mapToClass(WordReviewRecord);
db.reviewHistories.mapToClass(ReviewHistory);
db.reviewConfigs.mapToClass(ReviewConfig);

// 数据库版本检查和升级工具
export async function checkAndUpgradeDatabase() {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!db.isOpen()) {
        await db.open();
      }

      // 检查并处理可能的 IndexedDB 错误
      const status = await Dexie.getDatabaseNames();
      if (!status.includes("RecordDB")) {
        console.warn(
          "Database 'RecordDB' not found. This might be a fresh install."
        );
        // 对于新安装，不需要执行升级检查
        return;
      }

      // 尝试访问数据库以检查约束错误
      try {
        await db.wordReviewRecords.count();
      } catch (constraintError: any) {
        if (
          constraintError.name === "ConstraintError" &&
          constraintError.message.includes("uuid")
        ) {
          console.error("检测到 uuid 约束错误，需要重置数据库");
          console.error("错误详情:", constraintError.message);

          // 提示用户重置数据库
          if (
            confirm(
              "检测到数据库约束错误，需要重置数据库。这将清除所有本地数据，但不会影响云端数据。是否继续？"
            )
          ) {
            await db.delete();
            console.log("数据库已重置，请刷新页面");
            window.location.reload();
            return;
          } else {
            throw new Error("用户取消了数据库重置");
          }
        }
        throw constraintError;
      }

      const upgradeChecker = new UpgradeStatusChecker();

      // 获取数据库版本和期望版本
      const currentVersion = db.verno;
      const expectedVersion = 10; // 当前最新版本 v10 基座

      if (currentVersion < expectedVersion) {
        console.warn(
          `Database version ${currentVersion} is lower than expected version ${expectedVersion}. An upgrade might be pending or failed.`
        );
        // 关闭数据库
        db.close();
        // 重新打开，强制触发升级
        await db.open();

        const newVersion = db.verno;

        if (newVersion === expectedVersion) {
          UpgradeStatusChecker.clearUpgradeStatus(); // 清除升级状态
        } else {
          throw new Error(
            `数据库升级失败: 期望版本 ${expectedVersion}, 实际版本 ${newVersion}`
          );
        }
      }

      // v10 后置迁移：当本地已是 v10 但此前未执行清空/迁移时，补偿执行一次（幂等）
      try {
        const markerKey = "v10_post_migration_completed";
        const marked = localStorage.getItem(markerKey);
        if (currentVersion >= 10 && !marked) {
          console.log("🔧 执行 v10 后置迁移（补偿清空/迁移）...");
          await db.transaction(
            "rw",
            db.wordReviewRecords,
            db.reviewHistories,
            db.wordRecords,
            db.familiarWords,
            async () => {
              // 1) 清空两表
              try {
                await db.wordReviewRecords.clear();
              } catch {
                // 忽略清空失败
              }
              try {
                await db.reviewHistories.clear();
              } catch {
                // 忽略清空失败
              }

              // 2) 迁移 wordRecords（与 v10 升级内逻辑保持一致的轻量版）
              const all = await db.wordRecords.toArray();
              const byKey = new Map<string, any>();
              for (const rec of all) {
                if (!Array.isArray(rec.performanceHistory))
                  rec.performanceHistory = [];
                rec.performanceHistory = rec.performanceHistory.map(
                  (e: any) => ({
                    ...e,
                    mistakes:
                      e?.mistakes && typeof e.mistakes === "object"
                        ? e.mistakes
                        : {},
                    entryUuid:
                      typeof e?.entryUuid === "string" && e.entryUuid
                        ? e.entryUuid
                        : generateUUID(),
                  })
                );
                rec.performanceHistory.sort(
                  (a: any, b: any) => (a.timeStamp || 0) - (b.timeStamp || 0)
                );
                if (rec.performanceHistory.length > 0) {
                  rec.firstSeenAt = rec.performanceHistory[0].timeStamp;
                  rec.lastPracticedAt =
                    rec.performanceHistory[
                      rec.performanceHistory.length - 1
                    ].timeStamp;
                } else {
                  delete rec.firstSeenAt;
                  delete rec.lastPracticedAt;
                }
                const key = `${rec.dict}-${rec.word}`;
                const existed = byKey.get(key);
                if (!existed) byKey.set(key, rec);
                else {
                  const keep =
                    (existed.last_modified || 0) >= (rec.last_modified || 0)
                      ? existed
                      : rec;
                  const drop = keep === existed ? rec : existed;
                  const allEntries = [
                    ...(keep.performanceHistory || []),
                    ...(drop.performanceHistory || []),
                  ];
                  const seen = new Map<string, any>();
                  for (const e of allEntries) {
                    if (
                      !seen.has(e.entryUuid) ||
                      (seen.get(e.entryUuid)?.timeStamp || 0) <=
                        (e.timeStamp || 0)
                    ) {
                      seen.set(e.entryUuid, e);
                    }
                  }
                  keep.performanceHistory = Array.from(seen.values()).sort(
                    (a: any, b: any) => (a.timeStamp || 0) - (b.timeStamp || 0)
                  );
                  if (keep.performanceHistory.length > 0) {
                    keep.firstSeenAt = keep.performanceHistory[0].timeStamp;
                    keep.lastPracticedAt =
                      keep.performanceHistory[
                        keep.performanceHistory.length - 1
                      ].timeStamp;
                  } else {
                    delete keep.firstSeenAt;
                    delete keep.lastPracticedAt;
                  }
                  byKey.set(key, keep);
                }
              }
              const updated: any[] = [];
              byKey.forEach((v) => updated.push(v));
              if (updated.length > 0) {
                await db.wordRecords.clear();
                await db.wordRecords.bulkAdd(updated);
              }

              // 3) familiarWords 去重
              const allFam = await db.familiarWords.toArray();
              const groups = new Map<string, any[]>();
              for (const r of allFam) {
                const k = `${r.dict}-${r.word}`;
                const arr = groups.get(k);
                if (arr) arr.push(r);
                else groups.set(k, [r]);
              }
              groups.forEach(async (arr) => {
                if (arr.length <= 1) return;
                arr.sort(
                  (a: any, b: any) =>
                    (b.last_modified || 0) - (a.last_modified || 0)
                );
                const toDelete = arr
                  .slice(1)
                  .map((x: any) => x.id)
                  .filter((id: any) => id != null);
                if (toDelete.length)
                  await db.familiarWords.bulkDelete(toDelete);
              });
            }
          );
          localStorage.setItem(markerKey, String(Date.now()));
          console.log("✅ v10 后置迁移完成");
        }
      } catch (e) {
        console.warn("v10 后置迁移失败或已执行", e);
      }

      // 数据库升级成功后，简单清理重复数据
      console.log("🔄 数据库升级完成，开始清理重复数据...");
      const cleanResult = await cleanDuplicateWordReviewRecords();
      if (cleanResult.success) {
        console.log(
          `✅ 清理完成，删除了 ${cleanResult.deletedCount} 条重复记录`
        );
      } else {
        console.warn("⚠️ 清理失败:", cleanResult.error);
      }

      return {
        success: true,
        currentVersion: db.verno,
        expectedVersion,
        cleanedRecords: cleanResult.deletedCount,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Unknown error",
  };
}

// 清理重复的单词复习记录
export async function cleanDuplicateWordReviewRecords(): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> {
  try {
    console.log("🧹 开始清理重复的单词复习记录...");

    // 🔧 改进：检查表是否存在，避免在表不存在时出错
    if (!db.wordReviewRecords) {
      console.log("ℹ️ wordReviewRecords 表不存在，跳过清理");
      return {
        success: true,
        deletedCount: 0,
      };
    }

    const allRecords = await db.wordReviewRecords.toArray();
    console.log(`📊 总共找到 ${allRecords.length} 条复习记录`);

    // 按单词分组，找出重复记录
    const wordGroups = new Map<string, IWordReviewRecord[]>();
    allRecords.forEach((record) => {
      const word = record.word;
      if (!word || typeof word !== "string") {
        console.warn("⚠️ 发现无效的单词记录:", record);
        return; // 跳过无效记录
      }
      if (!wordGroups.has(word)) {
        wordGroups.set(word, []);
      }
      wordGroups.get(word)!.push(record);
    });

    // 处理重复记录
    const recordsToDelete: number[] = [];
    let duplicateWordsCount = 0;

    for (const word of Array.from(wordGroups.keys())) {
      const records = wordGroups.get(word)!;
      if (records.length > 1) {
        duplicateWordsCount++;
        console.log(`🔍 发现重复单词 "${word}"，共 ${records.length} 条记录`);

        // 🔧 改进排序逻辑：优先保留有ID的记录，然后按 last_modified 排序
        records.sort((a: IWordReviewRecord, b: IWordReviewRecord) => {
          // 优先保留有ID的记录
          if (a.id && !b.id) return -1;
          if (!a.id && b.id) return 1;

          // 然后按 last_modified 排序，保留最新的记录
          const aTime = a.last_modified || 0;
          const bTime = b.last_modified || 0;
          return bTime - aTime;
        });

        const duplicateRecords = records.slice(1);

        // 标记要删除的记录
        duplicateRecords.forEach((record: IWordReviewRecord) => {
          if (record.id) {
            recordsToDelete.push(record.id);
          } else {
            console.warn("⚠️ 重复记录没有ID，无法删除:", record);
          }
        });
      }
    }

    // 批量删除重复记录
    if (recordsToDelete.length > 0) {
      console.log(`🗑️ 批量删除 ${recordsToDelete.length} 条重复记录...`);

      // 🔧 改进：分批删除，避免一次性删除过多记录
      const batchSize = 100;
      for (let i = 0; i < recordsToDelete.length; i += batchSize) {
        const batch = recordsToDelete.slice(i, i + batchSize);
        await db.wordReviewRecords.bulkDelete(batch);
      }
    } else {
      console.log("✅ 没有发现重复记录");
    }

    return {
      success: true,
      deletedCount: recordsToDelete.length,
    };
  } catch (error) {
    console.error("清理重复记录失败:", error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// 重置数据库（仅在紧急情况下使用）
export async function resetDatabase() {
  try {
    await db.delete();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function useSaveChapterRecord() {
  const currentChapter = useAtomValue(currentChapterAtom);
  const isRevision = useAtomValue(isReviewModeAtom);
  const dictID = useAtomValue(currentDictIdAtom);

  const saveChapterRecord = useCallback(
    async (typingState: TypingState) => {
      const {
        chapterData: {
          correctCount,
          wrongCount,
          userInputLogs,
          wordCount,
          words,
          wordRecordIds,
        },
        timerData: { time },
      } = typingState;
      const correctWordIndexes = userInputLogs
        .filter((log) => log.correctCount > 0 && log.wrongCount === 0)
        .map((log) => log.index);

      const chapterRecord = new ChapterRecord(
        dictID,
        isRevision ? -1 : currentChapter,
        time,
        correctCount,
        wrongCount,
        wordCount,
        correctWordIndexes,
        words.length,
        wordRecordIds ?? []
      );

      // 确保last_modified字段是最新的
      chapterRecord.last_modified = Date.now();

      await db.chapterRecords.add(chapterRecord);
    },
    [currentChapter, dictID, isRevision]
  );

  return saveChapterRecord;
}

export type WordKeyLogger = {
  letterTimeArray: number[];
  letterMistake: LetterMistakes;
};

export function useSaveWordRecord() {
  const isRevision = useAtomValue(isReviewModeAtom);
  const currentChapter = useAtomValue(currentChapterAtom);
  const dictID = useAtomValue(currentDictIdAtom);

  const { dispatch } = useContext(TypingContext) ?? {};

  const saveWordRecord = useCallback(
    async ({
      word,
      wrongCount,
      letterTimeArray,
      letterMistake,
    }: {
      word: string;
      wrongCount: number;
      letterTimeArray: number[];
      letterMistake: LetterMistakes;
    }) => {
      const timing = [];
      for (let i = 1; i < letterTimeArray.length; i++) {
        const diff = letterTimeArray[i] - letterTimeArray[i - 1];
        timing.push(diff);
      }

      // 1. 创建 IPerformanceEntry
      const performanceEntry: IPerformanceEntry = {
        timeStamp: Date.now(), // 使用当前时间戳
        chapter: isRevision ? null : currentChapter, // 根据是否复习模式设置章节
        timing: timing,
        wrongCount: wrongCount,
        mistakes: letterMistake || {}, // 确保 mistakes 不为 undefined 或 null
        entryUuid: generateUUID(),
      };

      let dbID = -1;
      try {
        // 2. 查找现有的 WordRecord
        const existingRecord = await db.wordRecords
          .where({ dict: dictID, word: word })
          .first();

        if (existingRecord) {
          // 3. 如果存在，更新记录
          // 添加新的性能记录到历史记录中
          existingRecord.performanceHistory.push(performanceEntry);
          // 更新最后练习时间
          existingRecord.lastPracticedAt = performanceEntry.timeStamp;
          // 如果是首次记录或更早的记录，更新首次见到时间
          if (
            !existingRecord.firstSeenAt ||
            performanceEntry.timeStamp < existingRecord.firstSeenAt
          ) {
            existingRecord.firstSeenAt = performanceEntry.timeStamp;
          }
          // 确保 sync_status 正确更新
          if (existingRecord.sync_status === "synced") {
            existingRecord.sync_status = "local_modified";
          }
          existingRecord.last_modified = Date.now();
          if (existingRecord.id !== undefined) {
            // 确保 id 存在才更新
            await db.wordRecords.put(existingRecord);
            dbID = existingRecord.id;
          } else {
            // 如果 existingRecord.id 未定义，这通常不应该发生，但作为回退
            console.warn(
              "Existing record found without an ID, attempting to add as new:",
              existingRecord
            );
            const newWordRecord = new WordRecord(
              word,
              dictID,
              performanceEntry
            );
            dbID = await db.wordRecords.add(newWordRecord);
          }
        } else {
          // 4. 如果不存在，创建新记录
          const newWordRecord = new WordRecord(word, dictID, performanceEntry);
          // newWordRecord 的构造函数已设置 sync_status = LOCAL_NEW 和 last_modified
          dbID = await db.wordRecords.add(newWordRecord);
        }
      } catch (e) {
        console.error("Error saving word record:", e);
      }

      // 5. 同步到复习系统
      try {
        // 计算练习结果
        const isCorrect = wrongCount === 0;
        const totalTime =
          letterTimeArray.length > 1
            ? letterTimeArray[letterTimeArray.length - 1] - letterTimeArray[0]
            : 3000; // 默认3秒

        await syncWordPracticeToReview(word, dictID, {
          isCorrect,
          responseTime: totalTime,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Failed to sync to review system:", error);
        // 不阻塞主流程，只记录错误
      }

      // 6. 更新 UI
      if (dispatch) {
        if (dbID > 0) {
          // 确保 dbID 有效
          dispatch({
            type: TypingStateActionType.ADD_WORD_RECORD_ID,
            payload: dbID, // 这个 payload 可能需要重新考虑其含义，因为现在是更新或创建
          });
        }
        dispatch({
          type: TypingStateActionType.SET_IS_SAVING_RECORD,
          payload: false,
        });
      }
    },
    [currentChapter, dictID, dispatch, isRevision]
  );

  return saveWordRecord;
}

export function useDeleteWordRecord() {
  const deleteWordRecord = useCallback(async (word: string, dict: string) => {
    try {
      // 查找记录，因为 [dict+word] 是唯一索引，所以最多只会有一条记录
      const record = await db.wordRecords
        .where({ dict: dict, word: word })
        .first();

      if (record && record.id !== undefined) {
        // 更新记录的sync_status为local_deleted
        record.sync_status = "local_deleted"; // 使用字符串常量表示同步状态
        record.last_modified = Date.now();
        await db.wordRecords.put(record);
        return 1; // 表示成功标记了一条记录
      }
      return 0; // 没有找到记录或记录没有id
    } catch (error) {
      console.error(`删除单词记录时出错：`, error);
      return 0;
    }
  }, []);

  return { deleteWordRecord };
}

export function useMarkFamiliarWord() {
  const markFamiliarWord = useCallback(
    async (word: string, dict: string, isFamiliar: boolean) => {
      // 查找是否已存在记录
      const existingRecord = await db.familiarWords
        .where("[dict+word]")
        .equals([dict, word])
        .first();

      if (existingRecord) {
        // 更新现有记录
        existingRecord.isFamiliar = isFamiliar;
        existingRecord.sync_status = "local_modified";
        existingRecord.last_modified = Date.now();
        await db.familiarWords.put(existingRecord);
        return existingRecord;
      } else {
        // 创建新记录（严格 upsert，避免重复）
        const newRecord = new FamiliarWord(word, dict, isFamiliar);
        const existingByPair = await db.familiarWords
          .where("[dict+word]")
          .equals([dict, word])
          .first();
        if (existingByPair && existingByPair.id) {
          newRecord.id = existingByPair.id;
        }
        const id = await db.familiarWords.put(newRecord);
        newRecord.id = id;
        return newRecord;
      }
    },
    []
  );

  return { markFamiliarWord };
}

export function useDeleteFamiliarWord() {
  const deleteFamiliarWord = useCallback(async (word: string, dict: string) => {
    try {
      // 查找记录
      const record = await db.familiarWords
        .where("[dict+word]")
        .equals([dict, word])
        .first();

      if (record) {
        // 更新记录的sync_status为local_deleted
        record.sync_status = "local_deleted";
        record.last_modified = Date.now();
        await db.familiarWords.put(record);
        return true;
      }
      return false;
    } catch (error) {
      console.error("删除熟词记录时出错：", error);
      throw error;
    }
  }, []);

  return { deleteFamiliarWord };
}

export function useGetFamiliarWords() {
  const getFamiliarWords = useCallback(async (dict: string) => {
    try {
      return await db.familiarWords
        .where("dict")
        .equals(dict)
        .and((record) => record.sync_status !== "local_deleted")
        .and((record) => record.isFamiliar === true)
        .toArray();
    } catch (error) {
      console.error("获取熟词列表时出错：", error);
      throw error;
    }
  }, []);

  return { getFamiliarWords };
}
