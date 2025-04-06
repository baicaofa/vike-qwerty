import type {
  IChapterRecord,
  IReviewRecord,
  IRevisionDictRecord,
  IWordRecord,
  LetterMistakes,
} from "./record";
import { ChapterRecord, ReviewRecord, WordRecord } from "./record";
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
  wordRecords!: Table<IWordRecord, number>;
  chapterRecords!: Table<IChapterRecord, number>;
  reviewRecords!: Table<IReviewRecord, number>;

  revisionDictRecords!: Table<IRevisionDictRecord, number>;
  revisionWordRecords!: Table<IWordRecord, number>;

  constructor() {
    super("RecordDB");
    this.version(1).stores({
      wordRecords: "++id,word,timeStamp,dict,chapter,errorCount,[dict+chapter]",
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
    });
    this.version(2).stores({
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
    });
    this.version(3).stores({
      wordRecords: "++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]",
      chapterRecords: "++id,timeStamp,dict,chapter,time,[dict+chapter]",
      reviewRecords: "++id,dict,createTime,isFinished",
    });
    this.version(4)
      .stores({
        // 为 wordRecords 添加同步字段
        wordRecords:
          "++id, &uuid, word, timeStamp, dict, chapter, wrongCount, [dict+chapter], sync_status, last_modified",
        // 为 chapterRecords 添加同步字段
        chapterRecords:
          "++id, &uuid, timeStamp, dict, chapter, time, [dict+chapter], sync_status, last_modified",
        // 为 reviewRecords 添加同步字段
        reviewRecords:
          "++id, &uuid, dict, createTime, isFinished, sync_status, last_modified",
        // revision* 表保持不变 (假设它们不需要同步)
      })
      .upgrade((tx) => {
        console.log("Upgrading Dexie schema to version 4...");
        const now = Date.now();
        // 必须返回一个 Promise，确保所有修改完成
        return Promise.all([
          // 1. 迁移 wordRecords
          tx
            .table("wordRecords")
            .toCollection()
            .modify((record) => {
              if (record.uuid === undefined) record.uuid = crypto.randomUUID();
              if (record.sync_status === undefined)
                record.sync_status = "synced";
              if (record.last_modified === undefined)
                record.last_modified = record.timeStamp || now; // 使用 timeStamp 或当前时间
            }),
          // 2. 迁移 chapterRecords
          tx
            .table("chapterRecords")
            .toCollection()
            .modify((record) => {
              if (record.uuid === undefined) record.uuid = crypto.randomUUID();
              if (record.sync_status === undefined)
                record.sync_status = "synced";
              if (record.last_modified === undefined)
                record.last_modified = record.timeStamp || now; // 使用 timeStamp 或当前时间
            }),
          // 3. 迁移 reviewRecords
          tx
            .table("reviewRecords")
            .toCollection()
            .modify((record) => {
              if (record.uuid === undefined) record.uuid = crypto.randomUUID();
              if (record.sync_status === undefined)
                record.sync_status = "synced";
              if (record.last_modified === undefined)
                record.last_modified = record.createTime || now; // 使用 createTime 或当前时间
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
  }
}

export const db = new RecordDB();

db.wordRecords.mapToClass(WordRecord);
db.chapterRecords.mapToClass(ChapterRecord);
db.reviewRecords.mapToClass(ReviewRecord);

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

      const wordRecord = new WordRecord(
        word,
        dictID,
        isRevision ? -1 : currentChapter,
        timing,
        wrongCount,
        letterMistake
      );

      let dbID = -1;
      try {
        dbID = await db.wordRecords.add(wordRecord);
      } catch (e) {
        console.error(e);
      }
      if (dispatch) {
        dbID > 0 &&
          dispatch({
            type: TypingStateActionType.ADD_WORD_RECORD_ID,
            payload: dbID,
          });
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
      // 先查找记录
      const records = await db.wordRecords.where({ word, dict }).toArray();

      // 更新记录的sync_status为local_deleted
      for (const record of records) {
        record.sync_status = "local_deleted";
        record.last_modified = Date.now();
        await db.wordRecords.put(record);
      }

      // 返回更新的记录数量
      return records.length;
    } catch (error) {
      console.error(`删除单词记录时出错：`, error);
      return 0;
    }
  }, []);

  return { deleteWordRecord };
}
