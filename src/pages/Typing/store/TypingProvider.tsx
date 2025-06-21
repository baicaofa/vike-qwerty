import {
  TypingContext,
  TypingStateActionType,
  initialState,
  typingReducer,
} from "./index";
import type { WordWithIndex } from "@/typings";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";

// WordWithIndex到string的转换函数
const wordToString = (word: WordWithIndex): string => word.name;

// string到WordWithIndex的转换函数
const stringToWord = (str: string, index: number): WordWithIndex => ({
  name: str,
  trans: [], // 空翻译
  index,
});

interface TypingProviderProps {
  children: ReactNode;
  initialWords: string[];
}

export function TypingProvider({
  children,
  initialWords,
}: TypingProviderProps) {
  const [state, dispatch] = useImmerReducer(typingReducer, initialState);
  const [errors, setErrors] = useState<number[]>([]);
  const [input, setInput] = useState("");

  // 当initialWords改变时设置章节数据
  useEffect(() => {
    if (initialWords.length > 0) {
      // 将字符串数组转换为WordWithIndex格式
      const wordObjects = initialWords.map((word, index) =>
        stringToWord(word, index)
      );

      // 设置章节数据
      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: {
          words: wordObjects,
          shouldShuffle: false,
        },
      });

      // 初始化错误数组
      setErrors(new Array(initialWords.length).fill(0));
    }
  }, [initialWords, dispatch]);

  // 更新错误状态
  useEffect(() => {
    if (state.chapterData.userInputLogs.length > 0) {
      const newErrors = state.chapterData.userInputLogs.map(
        (log) => log.wrongCount
      );
      setErrors(newErrors);
    }
  }, [state.chapterData.userInputLogs]);

  // 重启功能
  const restart = () => {
    dispatch({
      type: TypingStateActionType.REPEAT_CHAPTER,
      shouldShuffle: false,
    });
    setErrors(new Array(initialWords.length).fill(0));
  };

  // 获取当前单词
  const currentWord =
    state.chapterData.words.length > 0 &&
    state.chapterData.index < state.chapterData.words.length
      ? state.chapterData.words[state.chapterData.index]
      : null;

  // 判断是否完成所有单词
  const isCompleted =
    state.isFinished ||
    (state.chapterData.words.length > 0 &&
      state.chapterData.index >= state.chapterData.words.length);

  // 提取单词列表
  const words = state.chapterData.words.map(wordToString);

  return (
    <TypingContext.Provider
      value={{
        state,
        dispatch,
        words,
        stats: {
          accuracy: state.timerData.accuracy,
          wpm: state.timerData.wpm,
          time: state.timerData.time,
        },
        index: state.chapterData.index,
        currentWord,
        isCompleted,
        errors,
        restart,
        input,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
