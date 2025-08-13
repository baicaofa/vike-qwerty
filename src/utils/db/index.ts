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
import { UpgradeStatusChecker, safeUpgradeOperation } from "./upgradeHelper";
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
      .upgrade((tx) => {
        const now = Date.now();
        // 返回Promise确保所有迁移操作完成
        return Promise.all([
          // 1. 迁移wordRecords表数据
          tx
            .table("wordRecords") // 获取wordRecords表的操作句柄
            .toCollection() // 获取表中所有记录的集合
            .modify((record) => {
              console.log("🔄 正在迁移wordRecord:", record.word);
              // 对每条记录进行修改
              // 如果记录没有uuid字段，则生成一个新的随机UUID
              if (record.uuid === undefined) record.uuid = generateUUID();

              // 如果记录没有sync_status字段，则设置为"local_new"(本地新建)
              // 这表示该记录是本地创建的，尚未同步到服务器
              if (record.sync_status === undefined)
                record.sync_status = "local_new";

              // 如果记录没有last_modified字段，则使用记录的timeStamp或当前时间
              if (record.last_modified === undefined)
                record.last_modified = record.timeStamp || now;
            }),
          // 2. 迁移chapterRecords表数据
          tx
            .table("chapterRecords")
            .toCollection()
            .modify((record) => {
              if (record.uuid === undefined) record.uuid = generateUUID();
              if (record.sync_status === undefined)
                record.sync_status = "local_new";
              if (record.last_modified === undefined)
                record.last_modified = record.timeStamp || now; // 使用timeStamp或当前时间
            }),
          // 3. 迁移reviewRecords表数据
          tx
            .table("reviewRecords")
            .toCollection()
            .modify((record) => {
              if (record.uuid === undefined) record.uuid = generateUUID();
              if (record.sync_status === undefined)
                record.sync_status = "local_new";
              if (record.last_modified === undefined)
                record.last_modified = record.createTime || now; // 使用createTime或当前时间
            }),
        ])
          .then(() => {
            console.log(
              "Dexie schema upgrade to version 4 completed successfully."
            );
          })
          .catch((err) => {
            console.error("Failed to upgrade Dexie schema to version 4:", err);
            throw err; // 抛出错误
          });
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
      .upgrade(() => {
        console.log("Upgrading Dexie schema to version 5...");
        // 版本5主要是添加了familiarWords表，不需要迁移现有数据
        // 但我们需要确保升级过程被正确记录
        return Promise.resolve()
          .then(() => {
            console.log(
              "Dexie schema upgrade to version 5 completed successfully."
            );
            console.log(
              "Added familiarWords table for storing familiar word records."
            );
          })
          .catch((err) => {
            console.error("Failed to upgrade Dexie schema to version 5:", err);
            throw err;
          });
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
        console.log(
          "Upgrading Dexie schema to version 6 for WordRecord restructuring..."
        );
        // 明确指定事务中的表类型
        const oldWordRecordsTable = tx.table<IWordRecord, number>(
          "wordRecords"
        );
        const oldRecordsArray = await oldWordRecordsTable.toArray();

        const newWordRecordsMap = new Map<string, IWordRecord>();

        for (const oldRecord of oldRecordsArray) {
          // 兼容旧表结构，允许访问旧字段
          const legacyRecord = oldRecord as IWordRecord & {
            timeStamp?: number;
            chapter?: number;
            timing?: number[];
            wrongCount?: number;
            mistakes?: Record<string, unknown>;
          };
          const word = legacyRecord.word;
          const dict = legacyRecord.dict;
          const timeStamp = legacyRecord.timeStamp; // 旧字段
          const chapter = legacyRecord.chapter; // 旧字段
          const timing = legacyRecord.timing; // 旧字段
          const wrongCount = legacyRecord.wrongCount; // 旧字段
          const mistakes = legacyRecord.mistakes; // 旧字段
          const uuid = legacyRecord.uuid;
          const sync_status = legacyRecord.sync_status;
          const last_modified = legacyRecord.last_modified;

          if (
            word === undefined ||
            dict === undefined ||
            timeStamp === undefined
          ) {
            console.warn(
              "Skipping old record due to missing essential fields:",
              oldRecord
            );
            continue;
          }

          const key = `${dict}-${word}`;

          const performanceEntry: IPerformanceEntry = {
            timeStamp: timeStamp,
            chapter: chapter !== undefined ? chapter : null,
            timing: timing || [],
            wrongCount: wrongCount || 0,
            mistakes: (mistakes || {}) as LetterMistakes,
          };

          let newRecord = newWordRecordsMap.get(key);

          if (newRecord) {
            newRecord.performanceHistory.push(performanceEntry);
            // 更新 lastPracticedAt (取最新的)
            if (timeStamp > (newRecord.lastPracticedAt || 0)) {
              newRecord.lastPracticedAt = timeStamp;
            }
            // 更新 firstSeenAt (取最早的)
            if (
              newRecord.firstSeenAt === undefined ||
              timeStamp < newRecord.firstSeenAt
            ) {
              newRecord.firstSeenAt = timeStamp;
            }
            // 对于 uuid, sync_status, last_modified，通常选择最新的记录的值
            if (last_modified > newRecord.last_modified) {
              newRecord.last_modified = last_modified;
              newRecord.uuid = uuid; // 使用最新记录的 uuid
              newRecord.sync_status = sync_status; // 使用最新记录的 sync_status
            }
          } else {
            // 创建一个新的 WordRecord 实例
            // 注意：这里的 WordRecord 构造函数是更新后的版本
            newRecord = new WordRecord(word, dict); // 构造函数会生成新的 uuid 和默认 sync_status
            newRecord.performanceHistory.push(performanceEntry);
            newRecord.firstSeenAt = timeStamp;
            newRecord.lastPracticedAt = timeStamp;
            // 初始时，使用当前记录的 uuid, sync_status, last_modified
            newRecord.uuid = uuid;
            newRecord.sync_status = sync_status;
            newRecord.last_modified = last_modified;

            newWordRecordsMap.set(key, newRecord);
          }
        }

        // 清空旧表并插入新数据
        await oldWordRecordsTable.clear();

        const recordsToPut: IWordRecord[] = [];
        Array.from(newWordRecordsMap.values()).forEach((record) => {
          // 确保 performanceHistory 按时间戳排序
          record.performanceHistory.sort((a, b) => a.timeStamp - b.timeStamp);
          // 重新设置 firstSeenAt 和 lastPracticedAt 以确保正确性
          if (record.performanceHistory.length > 0) {
            record.firstSeenAt = record.performanceHistory[0].timeStamp;
            record.lastPracticedAt =
              record.performanceHistory[
                record.performanceHistory.length - 1
              ].timeStamp;
          } else {
            // 如果没有历史记录，这些字段可以为 undefined 或特定值
            delete record.firstSeenAt;
            delete record.lastPracticedAt;
          }
          // 确保 sync_status 和 last_modified 是合理的
          // 如果合并了多个记录，我们已尝试保留最新的状态
          // 如果是 WordRecord 构造函数创建的，它有默认值
          recordsToPut.push(record);
        }); // <--- 在这里添加了缺失的圆括号

        if (recordsToPut.length > 0) {
          await oldWordRecordsTable.bulkPut(recordsToPut);
        }
        console.log(
          `Dexie schema upgrade to version 6 completed. Migrated ${recordsToPut.length} WordRecord(s).`
        );
      });

    // familiarWords 表加上 [dict+word] 复合索引的第7版
    this.version(7).stores({
      wordRecords:
        "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
      chapterRecords:
        "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
      reviewRecords: "++id, &uuid, dict, timeStamp, sync_status, last_modified",
      familiarWords:
        "++id, &uuid, dict, word, sync_status, last_modified, [dict+word]",
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
        return safeUpgradeOperation(
          async () => {
            console.log("🔄 开始升级到版本9: 添加间隔重复系统...");

            // 检查升级状态，避免重复升级
            const upgradeStatus = UpgradeStatusChecker.getUpgradeStatus();
            if (
              upgradeStatus?.version === 9 &&
              upgradeStatus?.status === "completed"
            ) {
              console.log("✅ 版本9升级已完成，跳过...");
              return;
            }

            // 获取新创建的表
            console.log("📋 获取reviewConfigs表...");
            const reviewConfigsTable = tx.table("reviewConfigs");

            // 检查是否已经有默认配置（避免重复创建）
            console.log("🔍 检查现有配置数量...");
            const existingConfigs = await reviewConfigsTable.count();
            console.log(`📊 现有配置数量: ${existingConfigs}`);

            if (existingConfigs === 0) {
              console.log("➕ 创建默认复习配置...");
              // 创建默认复习配置（整合版本10的简化配置）
              await reviewConfigsTable.add({
                uuid: generateUUID(),
                userId: "default", // 全局默认配置
                baseIntervals: [1, 3, 7, 15, 30, 60],
                enableNotifications: true,
                notificationTime: "09:00",
                sync_status: "local_new",
                last_modified: Date.now(),
              });
              console.log("✅ 默认复习配置创建成功");
            } else {
              console.log("ℹ️ 默认复习配置已存在，跳过创建");
            }

            // 确保这是最新的升级版本，直接包含版本10的功能
            console.log("✅ 版本9升级完成 - 已包含复习系统优化");

            // 清理 wordReviewRecords 表中的重复 uuid
            console.log("🧹 清理 wordReviewRecords 表中的重复 uuid...");
            const wordReviewRecordsTable = tx.table("wordReviewRecords");
            const allRecords = await wordReviewRecordsTable.toArray();

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

            // 处理重复的 uuid
            for (const [uuid, records] of uuidGroups) {
              if (records.length > 1) {
                console.log(
                  `发现重复 uuid: ${uuid}，记录数: ${records.length}`
                );

                // 按 last_modified 排序，保留最新的记录
                records.sort(
                  (a, b) => (b.last_modified || 0) - (a.last_modified || 0)
                );
                const keepRecord = records[0];
                const deleteRecords = records.slice(1);

                // 删除重复记录
                for (const record of deleteRecords) {
                  await wordReviewRecordsTable.delete(record.id);
                  console.log(
                    `删除重复记录: id=${record.id}, word=${record.word}`
                  );
                }

                console.log(
                  `保留记录: id=${keepRecord.id}, word=${keepRecord.word}`
                );
              }
            }

            console.log("✅ wordReviewRecords 表 uuid 清理完成");
          },
          "Version 9 upgrade",
          9
        );
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
      const expectedVersion = 9; // 当前最新版本（回退到版本9）

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
        // 创建新记录
        const newRecord = new FamiliarWord(word, dict, isFamiliar);
        const id = await db.familiarWords.add(newRecord);
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
