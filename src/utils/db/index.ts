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

class RecordDB extends Dexie {
  wordRecords!: Table<IWordRecord, number>; // id is the primary key (number)
  chapterRecords!: Table<IChapterRecord, number>;
  reviewRecords!: Table<IReviewRecord, number>;
  familiarWords!: Table<IFamiliarWord, number>;
  revisionDictRecords!: Table<IRevisionDictRecord, number>;
  revisionWordRecords!: Table<IWordRecord, number>;

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
        console.log("Upgrading Dexie schema to version 4...");
        const now = Date.now();
        // 返回Promise确保所有迁移操作完成
        return Promise.all([
          // 1. 迁移wordRecords表数据
          tx
            .table("wordRecords") // 获取wordRecords表的操作句柄
            .toCollection() // 获取表中所有记录的集合
            .modify((record) => {
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
      .upgrade((tx) => {
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
          // 确保旧记录中的字段存在，以避免运行时错误
          const word = oldRecord.word;
          const dict = oldRecord.dict;
          const timeStamp = oldRecord.timeStamp; // 旧字段
          const chapter = oldRecord.chapter; // 旧字段
          const timing = oldRecord.timing; // 旧字段
          const wrongCount = oldRecord.wrongCount; // 旧字段
          const mistakes = oldRecord.mistakes; // 旧字段
          const uuid = oldRecord.uuid;
          const sync_status = oldRecord.sync_status;
          const last_modified = oldRecord.last_modified;

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
            mistakes: mistakes || {},
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
  }
}

export const db = new RecordDB();

db.wordRecords.mapToClass(WordRecord);
db.chapterRecords.mapToClass(ChapterRecord);
db.reviewRecords.mapToClass(ReviewRecord);
db.familiarWords.mapToClass(FamiliarWord);

// 数据库版本检查和升级工具
export async function checkAndUpgradeDatabase() {
  try {
    // 打开数据库，这会触发自动升级
    await db.open();

    const currentVersion = db.verno;
    console.log(`数据库当前版本: ${currentVersion}`);

    // 检查是否是最新版本
    const expectedVersion = 7; // 当前最新版本
    if (currentVersion < expectedVersion) {
      console.warn(
        `数据库版本过旧 (当前: ${currentVersion}, 期望: ${expectedVersion})`
      );
      console.log("尝试强制升级数据库...");

      // 关闭数据库
      db.close();

      // 重新打开，强制触发升级
      await db.open();

      const newVersion = db.verno;
      if (newVersion === expectedVersion) {
        console.log(`数据库升级成功! 新版本: ${newVersion}`);
      } else {
        console.error(
          `数据库升级失败! 当前版本: ${newVersion}, 期望版本: ${expectedVersion}`
        );
      }
    } else {
      console.log("数据库版本正常");
    }

    return {
      success: true,
      currentVersion: db.verno,
      expectedVersion,
    };
  } catch (error) {
    console.error("数据库检查/升级失败:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// 重置数据库（仅在紧急情况下使用）
export async function resetDatabase() {
  try {
    console.warn("正在重置数据库...");
    await db.delete();
    console.log("数据库已删除，将在下次访问时重新创建");
    return { success: true };
  } catch (error) {
    console.error("重置数据库失败:", error);
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
        mistakes: letterMistake,
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

      // 5. 更新 UI
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
      try {
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
      } catch (error) {
        console.error("标记熟词时出错：", error);
        throw error;
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
