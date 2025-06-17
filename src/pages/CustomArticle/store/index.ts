import type { ArticleAction, ArticleState, ArticleWord } from "./type";
import { ArticleActionType } from "./type";
import { createContext } from "react";

// 初始状态
export const initialState: ArticleState = {
  // 文章内容
  articleText: "",
  processedText: "",

  // 预处理设置
  preprocessSettings: {
    removePunctuation: false,
  },

  // 练习状态
  isTyping: false,
  isPaused: false,
  isFinished: false,
  enableSound: false, // 默认不启用声音
  hasWrong: false, // 默认没有输入错误

  // 练习数据
  words: [],
  currentWordIndex: 0,
  userInput: "",
  errors: 0,
  errorPositions: [],

  // 当前单词状态
  currentLetterIndex: 0,
  letterStates: [],
  letterTimeArray: [],

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

  // 历史记录视图
  viewHistory: false,

  // 是否从历史记录进入练习
  fromHistory: false,
};

// 移除标点符号
const removePunctuation = (text: string): string => {
  // 保留字母、数字、空格，移除所有标点符号
  return text
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// 将文本转换为单词数组
const textToWords = (text: string): ArticleWord[] => {
  // 使用正则表达式匹配单词（包括标点符号）
  const wordRegex = /\S+/g;
  const words: ArticleWord[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    words.push({
      name: word,
      translation: "", // 替代trans字段
      phonetic: "", // 替代usphone和ukphone
      originalIndex: index,
      startPosition: match.index,
      endPosition: match.index + word.length,
    });
    index++;
  }

  return words;
};

// 处理文本，生成单词数组
const processText = (state: ArticleState): ArticleState => {
  const { articleText, preprocessSettings } = state;
  let processedText = articleText;

  // 如果需要移除标点符号
  if (preprocessSettings.removePunctuation) {
    processedText = removePunctuation(processedText);
  }

  // 将文本转换为单词数组
  const words = textToWords(processedText);

  return {
    ...state,
    processedText,
    words,
    letterStates: new Array(words[0]?.name.length || 0).fill("normal"),
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
  let currentWord: ArticleWord | undefined;
  let now: number;
  let elapsed: number;

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
        currentWordIndex: 0,
        currentLetterIndex: 0,
        letterStates: new Array(state.words[0]?.name.length || 0).fill(
          "normal"
        ),
        letterTimeArray: [],
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
      currentWord = state.words[state.currentWordIndex];
      if (!currentWord) return state;

      return {
        ...state,
        userInput: action.payload,
        currentLetterIndex: action.payload.length,
      };

    case ArticleActionType.UPDATE_LETTER_STATE: {
      const newLetterStates = [...state.letterStates];
      newLetterStates[action.payload.index] = action.payload.state;

      return {
        ...state,
        letterStates: newLetterStates,
        letterTimeArray:
          action.payload.state === "correct"
            ? [...state.letterTimeArray, Date.now()]
            : state.letterTimeArray,
      };
    }

    case ArticleActionType.NEXT_WORD: {
      if (state.currentWordIndex >= state.words.length - 1) {
        // 已完成所有单词
        return {
          ...state,
          isFinished: true,
        };
      }

      const nextWord = state.words[state.currentWordIndex + 1];

      return {
        ...state,
        currentWordIndex: state.currentWordIndex + 1,
        currentLetterIndex: 0,
        letterStates: new Array(nextWord?.name.length || 0).fill("normal"),
        letterTimeArray: [],
        userInput: "",
      };
    }

    case ArticleActionType.ADD_ERROR:
      return {
        ...state,
        errors: state.errors + 1,
        errorPositions: [...state.errorPositions, action.payload],
        hasWrong: true,
      };

    case ArticleActionType.TICK_TIMER: {
      if (!state.isTyping || state.isPaused) return state;

      now = Date.now();
      elapsed = (now - state.startTime - state.totalPausedTime) / 1000;

      // 计算已输入的文本长度
      let typedChars = 0;
      for (let i = 0; i < state.currentWordIndex; i++) {
        typedChars += state.words[i].name.length;
      }
      typedChars += state.userInput.length;

      return {
        ...state,
        elapsedTime: elapsed,
        speed: calculateSpeed(" ".repeat(typedChars), elapsed), // 使用空格替代实际文本，只计算字符数
        accuracy: calculateAccuracy(state.errors, typedChars),
      };
    }

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
        // 返回上一步时重置保存状态和历史记录标志
        isSaved: false,
        fromHistory: state.currentStep === 2 ? false : state.fromHistory,
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

    case ArticleActionType.SET_ENABLE_SOUND:
      return {
        ...state,
        enableSound: action.payload,
      };

    case ArticleActionType.RESET_WRONG_INPUT:
      return {
        ...state,
        userInput: "",
        letterStates: new Array(
          state.words[state.currentWordIndex]?.name.length || 0
        ).fill("normal"),
        hasWrong: false,
      };

    case ArticleActionType.SET_VIEW_HISTORY:
      return {
        ...state,
        viewHistory: action.payload,
      };

    case ArticleActionType.SET_FROM_HISTORY:
      return {
        ...state,
        fromHistory: action.payload,
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
