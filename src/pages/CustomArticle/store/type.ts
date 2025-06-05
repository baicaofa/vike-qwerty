import { Word } from "@/typings";

export interface CustomArticle {
  id?: number;
  uuid?: string;
  title: string;
  content: string;
  createdAt: number;
  lastPracticedAt?: number;
}

export interface ArticleSegment {
  text: string;
  index: number;
}

export type SegmentationType = "sentence" | "paragraph" | "custom";

export interface PreprocessSettings {
  segmentationType: SegmentationType;
  customSegmentLength?: number;
  repetitionEnabled: boolean;
  repetitionCount: number;
  speedTarget?: number;
  focusMode: boolean;
  simplifyPunctuation: boolean;
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

  // 练习数据
  segments: ArticleSegment[];
  currentSegmentIndex: number;
  currentPosition: number;
  userInput: string;
  errors: number;
  errorPositions: number[];

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

  // 练习数据更新
  UPDATE_USER_INPUT = "UPDATE_USER_INPUT",
  NEXT_SEGMENT = "NEXT_SEGMENT",
  ADD_ERROR = "ADD_ERROR",

  // 计时
  TICK_TIMER = "TICK_TIMER",

  // 步骤控制
  SET_STEP = "SET_STEP",
  NEXT_STEP = "NEXT_STEP",
  PREV_STEP = "PREV_STEP",

  // 保存状态
  SET_SAVING = "SET_SAVING",
  SET_SAVED = "SET_SAVED",
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
  | { type: ArticleActionType.UPDATE_USER_INPUT; payload: string }
  | { type: ArticleActionType.NEXT_SEGMENT }
  | { type: ArticleActionType.ADD_ERROR; payload: number }
  | { type: ArticleActionType.TICK_TIMER }
  | { type: ArticleActionType.SET_STEP; payload: 1 | 2 | 3 }
  | { type: ArticleActionType.NEXT_STEP }
  | { type: ArticleActionType.PREV_STEP }
  | { type: ArticleActionType.SET_SAVING; payload: boolean }
  | { type: ArticleActionType.SET_SAVED; payload: boolean };
