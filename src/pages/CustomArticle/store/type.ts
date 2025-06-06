import type { Word } from "@/typings";

export interface CustomArticle {
  id?: number;
  uuid?: string;
  title: string;
  content: string;
  createdAt: number;
  lastPracticedAt?: number;
}

export interface ArticleWord
  extends Omit<Word, "trans" | "usphone" | "ukphone"> {
  originalIndex: number; // 在原文中的索引位置
  startPosition: number; // 在原文中的起始位置
  endPosition: number; // 在原文中的结束位置
  translation: string; // 用于替代Word类型中的trans
  phonetic: string; // 用于替代Word类型中的usphone和ukphone
}

export interface PreprocessSettings {
  removePunctuation: boolean;
}

export interface ArticleState {
  // 文章内容
  articleText: string;
  processedText: string;

  // 预处理设置
  preprocessSettings: PreprocessSettings;

  // 练习状态
  isTyping: boolean;
  isPaused: boolean;
  isFinished: boolean;
  enableSound: boolean; // 是否启用声音
  hasWrong: boolean; // 是否有输入错误

  // 练习数据
  words: ArticleWord[];
  currentWordIndex: number;
  userInput: string;
  errors: number;
  errorPositions: number[];

  // 当前单词状态
  currentLetterIndex: number;
  letterStates: ("normal" | "correct" | "wrong")[];
  letterTimeArray: number[];

  // 计时和统计
  startTime: number;
  pauseTime: number;
  totalPausedTime: number;
  elapsedTime: number;
  speed: number;
  accuracy: number;

  // 步骤控制
  currentStep: 1 | 2 | 3;

  // 保存状态
  isSaving: boolean;
  isSaved: boolean;

  // 历史记录视图
  viewHistory: boolean;

  // 是否从历史记录进入练习
  fromHistory: boolean;
}

export enum ArticleActionType {
  // 文本相关
  SET_ARTICLE_TEXT = "SET_ARTICLE_TEXT",
  PROCESS_TEXT = "PROCESS_TEXT",

  // 预处理设置
  UPDATE_PREPROCESS_SETTINGS = "UPDATE_PREPROCESS_SETTINGS",

  // 练习控制
  START_TYPING = "START_TYPING",
  PAUSE_TYPING = "PAUSE_TYPING",
  RESUME_TYPING = "RESUME_TYPING",
  FINISH_TYPING = "FINISH_TYPING",
  RESET_TYPING = "RESET_TYPING",
  SET_ENABLE_SOUND = "SET_ENABLE_SOUND", // 设置是否启用声音
  RESET_WRONG_INPUT = "RESET_WRONG_INPUT", // 重置错误输入

  // 练习数据更新
  UPDATE_USER_INPUT = "UPDATE_USER_INPUT",
  NEXT_WORD = "NEXT_WORD",
  ADD_ERROR = "ADD_ERROR",
  UPDATE_LETTER_STATE = "UPDATE_LETTER_STATE",

  // 计时
  TICK_TIMER = "TICK_TIMER",

  // 步骤控制
  SET_STEP = "SET_STEP",
  NEXT_STEP = "NEXT_STEP",
  PREV_STEP = "PREV_STEP",

  // 保存状态
  SET_SAVING = "SET_SAVING",
  SET_SAVED = "SET_SAVED",

  // 历史记录视图
  SET_VIEW_HISTORY = "SET_VIEW_HISTORY",

  // 设置是否从历史记录进入
  SET_FROM_HISTORY = "SET_FROM_HISTORY",
}

export type ArticleAction =
  | { type: ArticleActionType.SET_ARTICLE_TEXT; payload: string }
  | { type: ArticleActionType.PROCESS_TEXT }
  | {
      type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS;
      payload: Partial<PreprocessSettings>;
    }
  | { type: ArticleActionType.START_TYPING }
  | { type: ArticleActionType.PAUSE_TYPING }
  | { type: ArticleActionType.RESUME_TYPING }
  | { type: ArticleActionType.FINISH_TYPING }
  | { type: ArticleActionType.RESET_TYPING }
  | { type: ArticleActionType.SET_ENABLE_SOUND; payload: boolean } // 设置是否启用声音的action
  | { type: ArticleActionType.RESET_WRONG_INPUT }
  | { type: ArticleActionType.UPDATE_USER_INPUT; payload: string }
  | { type: ArticleActionType.NEXT_WORD }
  | { type: ArticleActionType.ADD_ERROR; payload: number }
  | {
      type: ArticleActionType.UPDATE_LETTER_STATE;
      payload: { index: number; state: "normal" | "correct" | "wrong" };
    }
  | { type: ArticleActionType.TICK_TIMER }
  | { type: ArticleActionType.SET_STEP; payload: 1 | 2 | 3 }
  | { type: ArticleActionType.NEXT_STEP }
  | { type: ArticleActionType.PREV_STEP }
  | { type: ArticleActionType.SET_SAVING; payload: boolean }
  | { type: ArticleActionType.SET_SAVED; payload: boolean }
  | { type: ArticleActionType.SET_VIEW_HISTORY; payload: boolean }
  | { type: ArticleActionType.SET_FROM_HISTORY; payload: boolean };
