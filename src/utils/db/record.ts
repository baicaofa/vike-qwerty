import { getUTCUnixTimestamp } from "../index";
import { generateUUID } from "../uuid";
import type { Word } from "@/typings";

export type SyncStatus =
  // 已同步到服务器
  | "synced"
  // 本地新建，未同步
  | "local_new"
  // 本地修改，未同步
  | "local_modified"
  // 本地删除，未同步
  | "local_deleted";

export interface LetterMistakes {
  [index: number]: string[];
}

// 新增：IPerformanceEntry 接口，代表单次练习表现
export interface IPerformanceEntry {
  timeStamp: number; // 本次练习的时间戳
  chapter: number | null; // 本次练习所在的章节 (如果适用)
  timing: number[]; // 本次练习的字母间输入时间差
  wrongCount: number; // 本次练习的错误次数
  mistakes: LetterMistakes; // 本次练习的错误详情
}

export interface IWordRecord {
  id?: number; // Dexie auto-incrementing primary key
  uuid: string; // 全局唯一 ID，用于同步，标识这个 (word, dict) 的组合
  word: string;
  dict: string;
  // chapter: number | null; // 移除
  // timeStamp: number; // 移除
  // timing: number[]; // 移除
  // wrongCount: number; // 移除
  // mistakes: LetterMistakes; // 移除

  performanceHistory: IPerformanceEntry[]; // 新增：历史表现记录

  firstSeenAt?: number; // 新增：首次记录该单词的时间戳
  lastPracticedAt?: number; // 新增：最近一次练习该单词的时间戳

  sync_status: SyncStatus;
  last_modified: number; // 记录的最后修改时间戳
}

export class WordRecord implements IWordRecord {
  id?: number;
  uuid: string;
  word: string;
  dict: string;
  performanceHistory: IPerformanceEntry[];
  firstSeenAt?: number;
  lastPracticedAt?: number;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(
    word: string,
    dict: string,
    initialPerformanceEntry?: IPerformanceEntry // 可选的首次表现记录
  ) {
    this.uuid = generateUUID(); // 或者基于 word 和 dict 生成确定性 UUID
    this.word = word;
    this.dict = dict;
    this.performanceHistory = initialPerformanceEntry
      ? [initialPerformanceEntry]
      : [];
    const now = getUTCUnixTimestamp();
    if (initialPerformanceEntry) {
      this.firstSeenAt = initialPerformanceEntry.timeStamp;
      this.lastPracticedAt = initialPerformanceEntry.timeStamp;
    } else {
      // 如果没有初始表现，可以考虑将 firstSeenAt 设置为当前时间
      // this.firstSeenAt = now;
    }
    this.sync_status = "local_new";
    this.last_modified = Date.now(); // 使用 Date.now() 更符合 last_modified 的语义
  }

  // 方法来添加新的练习记录
  addPerformanceEntry(entry: IPerformanceEntry) {
    this.performanceHistory.push(entry);
    this.performanceHistory.sort((a, b) => a.timeStamp - b.timeStamp); // 保持有序
    this.lastPracticedAt = entry.timeStamp;
    this.last_modified = Date.now();
    if (this.sync_status === "synced") {
      this.sync_status = "local_modified";
    }
    // 如果是 LOCAL_NEW，保持 LOCAL_NEW
  }

  // get totalTime() { // 这个 getter 需要重新考虑，是计算所有历史的总时间还是最近一次的？
  //   // 例如，计算最后一次练习的总时间
  //   if (this.performanceHistory.length > 0) {
  //     const lastEntry = this.performanceHistory[this.performanceHistory.length - 1];
  //     return lastEntry.timing.reduce((acc, curr) => acc + curr, 0);
  //   }
  //   return 0;
  // }

  // 其他 getters (如 cumulativeWrongCount, averageTiming等) 可以根据需要添加
  // 例如，获取最新的练习表现
  get latestPerformance(): IPerformanceEntry | undefined {
    if (this.performanceHistory.length > 0) {
      return this.performanceHistory[this.performanceHistory.length - 1];
    }
    return undefined;
  }
}

export interface IChapterRecord {
  uuid: string; // 新增：全局唯一 ID
  // 正常章节为 dictKey, 其他功能则为对应的类型
  dict: string;
  // 在错题场景中为 -1
  chapter: number | null;
  timeStamp: number;
  // 单位为 s，章节的记录没必要到毫秒级
  time: number;
  // 正确按键次数，输对一个字母即记录
  correctCount: number;
  // 错误的按键次数。 出错会清空整个输入，但只记录一次错误
  wrongCount: number;
  // 用户输入的单词总数，可能会使用循环等功能使输入总数大于 20
  wordCount: number;
  // 一次打对未犯错的单词列表, 可以和 wordNumber 对比得出出错的单词 indexes
  correctWordIndexes: number[];
  // 章节总单词数
  wordNumber: number;
  // 单词 record 的 id 列表
  wordRecordIds: number[];
  sync_status: SyncStatus; // 新增：同步状态
  last_modified: number; // 新增：本地最后修改时间戳
}

export class ChapterRecord implements IChapterRecord {
  uuid: string;
  dict: string;
  chapter: number | null;
  timeStamp: number;
  time: number;
  correctCount: number;
  wrongCount: number;
  wordCount: number;
  correctWordIndexes: number[];
  wordNumber: number;
  wordRecordIds: number[];
  sync_status: SyncStatus;
  last_modified: number;

  constructor(
    dict: string,
    chapter: number | null,
    time: number,
    correctCount: number,
    wrongCount: number,
    wordCount: number,
    correctWordIndexes: number[],
    wordNumber: number,
    wordRecordIds: number[]
  ) {
    this.uuid = generateUUID(); // 使用新的 generateUUID 函数
    this.dict = dict;
    this.chapter = chapter;
    this.timeStamp = getUTCUnixTimestamp();
    this.time = time;
    this.correctCount = correctCount;
    this.wrongCount = wrongCount;
    this.wordCount = wordCount;
    this.correctWordIndexes = correctWordIndexes;
    this.wordNumber = wordNumber;
    this.wordRecordIds = wordRecordIds;
    this.sync_status = "local_new"; // 新增: 初始化同步状态
    this.last_modified = Date.now(); // 新增: 初始化修改时间
  }

  get wpm() {
    return Math.round((this.wordCount / this.time) * 60);
  }

  get inputAccuracy() {
    return Math.round(
      (this.correctCount / this.correctCount + this.wrongCount) * 100
    );
  }

  get wordAccuracy() {
    return Math.round((this.correctWordIndexes.length / this.wordNumber) * 100);
  }
}

export interface IReviewRecord {
  id?: number;
  uuid: string; // 新增：全局唯一 ID，用于同步
  dict: string;
  // 当前练习进度
  index: number;
  // 创建时间
  createTime: number;
  // 是否已经完成
  isFinished: boolean;
  // 单词列表, 根据复习算法生成和修改，可能会有重复值
  words: Word[];
  sync_status: SyncStatus; // 新增：同步状态
  last_modified: number; // 新增：本地最后修改时间戳
}

export class ReviewRecord implements IReviewRecord {
  id?: number;
  uuid: string;
  dict: string;
  index: number;
  createTime: number;
  isFinished: boolean;
  words: Word[];
  sync_status: SyncStatus;
  last_modified: number;

  constructor(dict: string, words: Word[]) {
    this.uuid = generateUUID(); // 使用 generateUUID 函数替代 crypto.randomUUID
    this.dict = dict;
    this.index = 0;
    this.createTime = getUTCUnixTimestamp();
    this.words = words;
    this.isFinished = false;
    this.sync_status = "local_new"; // 新增: 初始化同步状态
    this.last_modified = Date.now(); // 新增: 初始化修改时间
  }
}

export interface IRevisionDictRecord {
  dict: string;
  revisionIndex: number;
  createdTime: number;
}

export class RevisionDictRecord implements IRevisionDictRecord {
  dict: string;
  revisionIndex: number;
  createdTime: number;

  constructor(dict: string, revisionIndex: number, createdTime: number) {
    this.dict = dict;
    this.revisionIndex = revisionIndex;
    this.createdTime = createdTime;
  }
}

export interface IRevisionWordRecord {
  word: string;
  timeStamp: number;
  dict: string;
  errorCount: number;
}

export class RevisionWordRecord implements IRevisionWordRecord {
  word: string;
  timeStamp: number;
  dict: string;
  errorCount: number;

  constructor(word: string, dict: string, errorCount: number) {
    this.word = word;
    this.timeStamp = getUTCUnixTimestamp();
    this.dict = dict;
    this.errorCount = errorCount;
  }
}

export interface IFamiliarWord {
  id?: number;
  uuid: string;
  word: string;
  dict: string;
  isFamiliar: boolean;
  sync_status: SyncStatus;
  last_modified: number;
}

export class FamiliarWord implements IFamiliarWord {
  id?: number;
  uuid: string;
  word: string;
  dict: string;
  isFamiliar: boolean;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(word: string, dict: string, isFamiliar: boolean) {
    this.uuid = generateUUID();
    this.word = word;
    this.dict = dict;
    this.isFamiliar = isFamiliar;
    this.sync_status = "local_new";
    this.last_modified = Date.now();
  }
}
