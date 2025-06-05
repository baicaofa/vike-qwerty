import type { ArticleAction, ArticleState, SegmentationType } from "./type";
import { ArticleActionType } from "./type";
import { createContext } from "react";

// 初始状态
export const initialState: ArticleState = {
  // 文章内容
  articleText: "",
  processedText: "",

  // 预处理设置
  preprocessSettings: {
    segmentationType: "paragraph" as SegmentationType,
    customSegmentLength: 100,
    repetitionEnabled: false,
    repetitionCount: 1,
    speedTarget: undefined,
    focusMode: false,
    simplifyPunctuation: false,
  },

  // 练习状态
  isTyping: false,
  isPaused: false,
  isFinished: false,

  // 练习数据
  segments: [],
  currentSegmentIndex: 0,
  currentPosition: 0,
  userInput: "",
  errors: 0,
  errorPositions: [],

  // 计时和统计
  startTime: 0,
  pauseTime: 0,
  totalPausedTime: 0,
  elapsedTime: 0,
  speed: 0,
  accuracy: 100,

  // 步骤控制
  currentStep: 1,

  // 保存状态
  isSaving: false,
  isSaved: false,
};

// 文本分段处理函数
const segmentText = (
  text: string,
  type: SegmentationType,
  customLength?: number
): string[] => {
  switch (type) {
    case "sentence":
      // 按句子分割（以句号、问号、感叹号结尾）
      return text.split(/(?<=[.!?])\s+/);
    case "paragraph":
      // 按段落分割（以换行符分割）
      return text.split(/\n+/).filter((p) => p.trim().length > 0);
    case "custom": {
      if (!customLength || customLength <= 0) return [text];
      // 按自定义长度分割
      const segments: string[] = [];
      for (let i = 0; i < text.length; i += customLength) {
        segments.push(text.substring(i, i + customLength));
      }
      return segments;
    }
    default:
      return [text];
  }
};

// 处理标点符号
const simplifyPunctuation = (text: string): string => {
  // 简化连续的标点符号，保留基本标点
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[…]/g, "...")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
};

// 处理文本，生成分段
const processText = (state: ArticleState): ArticleState => {
  const { articleText, preprocessSettings } = state;
  let processedText = articleText;

  // 如果需要简化标点
  if (preprocessSettings.simplifyPunctuation) {
    processedText = simplifyPunctuation(processedText);
  }

  // 分段处理
  const textSegments = segmentText(
    processedText,
    preprocessSettings.segmentationType,
    preprocessSettings.customSegmentLength
  );

  // 创建段落对象数组
  const segments = textSegments.map((text, index) => ({
    text,
    index,
  }));

  // 如果启用重复练习，对每个段落重复指定次数
  if (
    preprocessSettings.repetitionEnabled &&
    preprocessSettings.repetitionCount > 1
  ) {
    const repeatedSegments = [];
    for (const segment of segments) {
      for (let i = 0; i < preprocessSettings.repetitionCount; i++) {
        repeatedSegments.push({ ...segment });
      }
    }
    return {
      ...state,
      processedText,
      segments: repeatedSegments,
    };
  }

  return {
    ...state,
    processedText,
    segments,
  };
};

// 计算打字速度（WPM - Words Per Minute）
const calculateSpeed = (text: string, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0;
  // 假设平均每5个字符为一个单词
  const words = text.length / 5;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
};

// 计算准确率
const calculateAccuracy = (errors: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  const accuracy = ((totalChars - errors) / totalChars) * 100;
  return Math.max(0, Math.round(accuracy * 100) / 100);
};

// Reducer 函数
export const articleReducer = (
  state: ArticleState,
  action: ArticleAction
): ArticleState => {
  let currentTime: number;
  let totalTime: number;
  let currentSegment: any;
  let targetText: string;
  let newErrors: number;
  let newErrorPositions: number[];
  let now: number;
  let elapsed: number;
  let typedText: string;

  switch (action.type) {
    case ArticleActionType.SET_ARTICLE_TEXT:
      return {
        ...state,
        articleText: action.payload,
      };

    case ArticleActionType.PROCESS_TEXT:
      return processText(state);

    case ArticleActionType.UPDATE_PREPROCESS_SETTINGS:
      return {
        ...state,
        preprocessSettings: {
          ...state.preprocessSettings,
          ...action.payload,
        },
      };

    case ArticleActionType.START_TYPING:
      return {
        ...state,
        isTyping: true,
        isPaused: false,
        startTime: Date.now(),
        totalPausedTime: 0,
      };

    case ArticleActionType.PAUSE_TYPING:
      return {
        ...state,
        isPaused: true,
        pauseTime: Date.now(),
      };

    case ArticleActionType.RESUME_TYPING:
      return {
        ...state,
        isPaused: false,
        totalPausedTime: state.totalPausedTime + (Date.now() - state.pauseTime),
      };

    case ArticleActionType.FINISH_TYPING:
      currentTime = Date.now();
      totalTime =
        (currentTime - state.startTime - state.totalPausedTime) / 1000;

      return {
        ...state,
        isTyping: false,
        isFinished: true,
        elapsedTime: totalTime,
        speed: calculateSpeed(state.processedText, totalTime),
        accuracy: calculateAccuracy(state.errors, state.processedText.length),
      };

    case ArticleActionType.RESET_TYPING:
      return {
        ...state,
        isTyping: false,
        isPaused: false,
        isFinished: false,
        currentSegmentIndex: 0,
        currentPosition: 0,
        userInput: "",
        errors: 0,
        errorPositions: [],
        startTime: 0,
        pauseTime: 0,
        totalPausedTime: 0,
        elapsedTime: 0,
        speed: 0,
        accuracy: 100,
      };

    case ArticleActionType.UPDATE_USER_INPUT:
      currentSegment = state.segments[state.currentSegmentIndex];
      targetText =
        currentSegment?.text.substring(0, action.payload.length) || "";

      // 计算错误
      newErrors = state.errors;
      newErrorPositions = [...state.errorPositions];

      for (let i = 0; i < action.payload.length; i++) {
        if (action.payload[i] !== targetText[i]) {
          if (!newErrorPositions.includes(i)) {
            newErrorPositions.push(i);
            newErrors++;
          }
        }
      }

      return {
        ...state,
        userInput: action.payload,
        errors: newErrors,
        errorPositions: newErrorPositions,
      };

    case ArticleActionType.NEXT_SEGMENT:
      if (state.currentSegmentIndex >= state.segments.length - 1) {
        // 已完成所有段落
        return {
          ...state,
          isFinished: true,
        };
      }

      return {
        ...state,
        currentSegmentIndex: state.currentSegmentIndex + 1,
        currentPosition: 0,
        userInput: "",
      };

    case ArticleActionType.ADD_ERROR:
      return {
        ...state,
        errors: state.errors + 1,
        errorPositions: [...state.errorPositions, action.payload],
      };

    case ArticleActionType.TICK_TIMER:
      if (!state.isTyping || state.isPaused) return state;

      now = Date.now();
      elapsed = (now - state.startTime - state.totalPausedTime) / 1000;
      typedText =
        state.segments
          .slice(0, state.currentSegmentIndex)
          .map((s) => s.text)
          .join("") + state.userInput;

      return {
        ...state,
        elapsedTime: elapsed,
        speed: calculateSpeed(typedText, elapsed),
        accuracy: calculateAccuracy(state.errors, typedText.length),
      };

    case ArticleActionType.SET_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };

    case ArticleActionType.NEXT_STEP:
      if (state.currentStep >= 3) return state;

      // 如果从步骤1到步骤2，处理文本
      if (state.currentStep === 1) {
        const newState = processText({
          ...state,
          currentStep: 2,
        });
        return newState;
      }

      return {
        ...state,
        currentStep: (state.currentStep + 1) as 1 | 2 | 3,
      };

    case ArticleActionType.PREV_STEP:
      if (state.currentStep <= 1) return state;

      return {
        ...state,
        currentStep: (state.currentStep - 1) as 1 | 2 | 3,
      };

    case ArticleActionType.SET_SAVING:
      return {
        ...state,
        isSaving: action.payload,
      };

    case ArticleActionType.SET_SAVED:
      return {
        ...state,
        isSaved: action.payload,
      };

    default:
      return state;
  }
};

// 创建上下文
export const ArticleContext = createContext<{
  state: ArticleState;
  dispatch: React.Dispatch<ArticleAction>;
}>({
  state: initialState,
  dispatch: () => null,
});
