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

export interface IWordRecord {
  word: string;
  uuid: string; // 新增：全局唯一 ID，用于同步
  timeStamp: number;
  // 正常章节为 dictKey, 其他功能则为对应的类型
  dict: string;
  // 用户可能是在 错题/其他类似组件中 进行的练习则为 null, start from 0
  chapter: number | null;
  // 正确次数中输入每个字母的时间差，可以据此计算出总时间
  timing: number[];
  // 出错的次数
  wrongCount: number;
  // 每个字母被错误输入成什么, index 为字母的索引, 数组内为错误的 e.key
  mistakes: LetterMistakes;
  sync_status: SyncStatus; // 新增：同步状态
  last_modified: number; // 新增：本地最后修改时间戳
}

export interface LetterMistakes {
  // 每个字母被错误输入成什么, index 为字母的索引, 数组内为错误的 e.key
  [index: number]: string[];
}

export class WordRecord implements IWordRecord {
  uuid: string;

  word: string;
  timeStamp: number;
  dict: string;
  chapter: number | null;
  timing: number[];
  wrongCount: number;
  mistakes: LetterMistakes;
  sync_status: SyncStatus;
  last_modified: number;

  constructor(
    word: string,
    dict: string,
    chapter: number | null,
    timing: number[],
    wrongCount: number,
    mistakes: LetterMistakes
  ) {
    this.uuid = generateUUID(); // 使用新的 generateUUID 函数
    this.word = word;
    this.timeStamp = getUTCUnixTimestamp();
    this.dict = dict;
    this.chapter = chapter;
    this.timing = timing;
    this.wrongCount = wrongCount;
    this.mistakes = mistakes;
    this.sync_status = "local_new"; // 新增: 初始化同步状态
    this.last_modified = Date.now(); // 新增: 初始化修改时间
  }

  get totalTime() {
    return this.timing.reduce((acc, curr) => acc + curr, 0);
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
    this.uuid = crypto.randomUUID(); // 新增: 初始化 UUID
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
