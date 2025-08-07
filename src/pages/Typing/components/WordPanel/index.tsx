import {
  findNextUnfamiliarIndex,
  findPrevUnfamiliarIndex,
  useFamiliarWords,
} from "../../hooks/useFamiliarWords";
import { TypingContext, TypingStateActionType } from "../../store";
import type { TypingState } from "../../store/type";
import PrevAndNextWord from "../PrevAndNextWord";
import Progress from "../Progress";
import DetailedTranslation from "./components/DetailedTranslation";
import Phonetic from "./components/Phonetic";
import Sentences from "./components/Sentences";
import Translation from "./components/Translation";
import WordComponent from "./components/Word";
import { usePrefetchPronunciationSound } from "@/hooks/usePronunciation";
import {
  isReviewModeAtom,
  isShowPrevAndNextWordAtom,
  isSkipFamiliarWordAtom,
  loopWordConfigAtom,
  phoneticConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from "@/store";
import type { Word, WordWithIndex } from "@/typings";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";

export interface WordPanelProps {
  mode?: "typing" | "review";
  onWordComplete?: (
    word: WordWithIndex,
    isCorrect: boolean,
    responseTime: number
  ) => void;
}

export default function WordPanel({
  mode = "typing",
  onWordComplete,
}: WordPanelProps = {}) {
  const { t } = useTranslation("typing");
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!;
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const isShowPrevAndNextWord = useAtomValue(isShowPrevAndNextWordAtom);
  const wordDictationConfig = useAtomValue(wordDictationConfigAtom);
  const [wordComponentKey, setWordComponentKey] = useState(0);
  const [currentWordExerciseCount, setCurrentWordExerciseCount] = useState(0);
  const { times: loopWordTimes } = useAtomValue(loopWordConfigAtom);
  const currentWord = state.chapterData.words[state.chapterData.index];
  const nextWord = state.chapterData.words[state.chapterData.index + 1] as
    | Word
    | undefined;

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const isSkipFamiliarWord = useAtomValue(isSkipFamiliarWordAtom);

  usePrefetchPronunciationSound(nextWord?.name);

  const reloadCurrentWordComponent = useCallback(() => {
    setWordComponentKey((old) => old + 1);
  }, []);

  const updateReviewRecord = useCallback(
    (state: TypingState) => {
      setReviewModeInfo((old) => ({
        ...old,
        reviewRecord: old.reviewRecord
          ? { ...old.reviewRecord, index: state.chapterData.index }
          : undefined,
      }));
    },
    [setReviewModeInfo]
  );

  const { familiarWords } = useFamiliarWords();

  // 复习模式的特殊逻辑
  const isInReviewMode = mode === "review";

  const onFinish = useCallback(
    (isCorrect?: boolean, responseTime?: number) => {
      // 复习模式下的特殊处理
      if (isInReviewMode && onWordComplete) {
        onWordComplete(currentWord, isCorrect || false, responseTime || 0);
        return;
      }
      if (
        state.chapterData.index < state.chapterData.words.length - 1 ||
        currentWordExerciseCount < loopWordTimes - 1
      ) {
        // 用户完成当前单词
        if (currentWordExerciseCount < loopWordTimes - 1) {
          setCurrentWordExerciseCount((old) => old + 1);
          dispatch({ type: TypingStateActionType.LOOP_CURRENT_WORD });
          reloadCurrentWordComponent();
        } else {
          setCurrentWordExerciseCount(0);
          let nextIndex;
          if (isSkipFamiliarWord) {
            // 跳过熟词，找到下一个未被标记为熟词的单词
            nextIndex = findNextUnfamiliarIndex(
              state.chapterData.words,
              familiarWords,
              state.chapterData.index
            );
          } else {
            // 不跳过熟词，顺序下一个
            nextIndex =
              state.chapterData.index + 1 < state.chapterData.words.length
                ? state.chapterData.index + 1
                : -1;
          }
          // 如果没有未熟词或到达末尾，直接完成章节
          if (nextIndex === -1) {
            dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
            if (isReviewMode) {
              setReviewModeInfo((old) => ({
                ...old,
                reviewRecord: old.reviewRecord
                  ? { ...old.reviewRecord, isFinished: true }
                  : undefined,
              }));
            }
            return;
          }
          dispatch({
            type: TypingStateActionType.SKIP_2_WORD_INDEX,
            newIndex: nextIndex,
          });
        }
      } else {
        // 用户完成当前章节
        dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
        if (isReviewMode) {
          setReviewModeInfo((old) => ({
            ...old,
            reviewRecord: old.reviewRecord
              ? { ...old.reviewRecord, isFinished: true }
              : undefined,
          }));
        }
      }
    },
    [
      state.chapterData.index,
      state.chapterData.words,
      state.chapterData.words.length,
      currentWordExerciseCount,
      loopWordTimes,
      isReviewMode,
      dispatch,
      updateReviewRecord,
      reloadCurrentWordComponent,
      familiarWords,
      setReviewModeInfo,
      isSkipFamiliarWord,
    ]
  );

  const onSkipWord = useCallback(
    (type: "prev" | "next") => {
      let newIndex = -1;
      if (type === "prev") {
        if (isSkipFamiliarWord) {
          newIndex = findPrevUnfamiliarIndex(
            state.chapterData.words,
            familiarWords,
            state.chapterData.index
          );
        } else {
          newIndex = state.chapterData.index - 1;
        }
      }
      if (type === "next") {
        if (isSkipFamiliarWord) {
          newIndex = findNextUnfamiliarIndex(
            state.chapterData.words,
            familiarWords,
            state.chapterData.index
          );
        } else {
          newIndex = state.chapterData.index + 1;
        }
      }
      if (newIndex !== -1 && newIndex < state.chapterData.words.length) {
        dispatch({
          type: TypingStateActionType.SKIP_2_WORD_INDEX,
          newIndex,
        });
      }
    },
    [
      dispatch,
      familiarWords,
      state.chapterData.words,
      state.chapterData.index,
      isSkipFamiliarWord,
    ]
  );

  useHotkeys(
    "Ctrl + Shift + ArrowLeft",
    (e) => {
      e.preventDefault();
      onSkipWord("prev");
    },
    { preventDefault: true }
  );

  useHotkeys(
    "Ctrl + Shift + ArrowRight",
    (e) => {
      e.preventDefault();
      onSkipWord("next");
    },
    { preventDefault: true }
  );
  const [isShowTranslation, setIsHoveringTranslation] = useState(false);

  const handleShowTranslation = useCallback((checked: boolean) => {
    setIsHoveringTranslation(checked);
  }, []);

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(true);
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys(
    "tab",
    () => {
      handleShowTranslation(false);
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    []
  );

  const shouldShowTranslation = useMemo(() => {
    // 复习模式下不显示翻译
    if (isInReviewMode) return false;
    return isShowTranslation || state.isTransVisible;
  }, [isShowTranslation, state.isTransVisible, isInReviewMode]);

  const shouldShowPhonetic = useMemo(() => {
    // 复习模式下不显示音标
    if (isInReviewMode) return false;
    return phoneticConfig.isOpen;
  }, [phoneticConfig.isOpen, isInReviewMode]);

  // 自动跳过当前为熟词的单词（防止异步加载时机错过）
  useEffect(() => {
    if (
      isSkipFamiliarWord &&
      state.chapterData.words.length > 0 &&
      familiarWords.has(state.chapterData.words[state.chapterData.index]?.name)
    ) {
      // 找到下一个未被标记为熟词的单词
      const nextIndex = findNextUnfamiliarIndex(
        state.chapterData.words,
        familiarWords,
        state.chapterData.index
      );
      if (nextIndex !== -1 && nextIndex < state.chapterData.words.length) {
        dispatch({
          type: TypingStateActionType.SKIP_2_WORD_INDEX,
          newIndex: nextIndex,
        });
      } else {
        // 如果全是熟词，直接完成章节
        dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
      }
    }
  }, [
    isSkipFamiliarWord,
    state.chapterData.index,
    state.chapterData.words,
    familiarWords,
    dispatch,
  ]);

  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <div className="container flex h-24 w-full shrink-0 grow-0 justify-between px-12 pt-10">
        {isShowPrevAndNextWord && state.isTyping && (
          <>
            <PrevAndNextWord type="prev" />
            <PrevAndNextWord type="next" />
          </>
        )}
      </div>
      <div className="container flex flex-grow flex-col items-center justify-center">
        {currentWord && (
          <div className="relative flex w-full justify-center">
            {!state.isTyping && (
              <div className="absolute flex h-full w-full justify-center">
                <div className="z-10 flex w-full items-center backdrop-blur-sm">
                  <p className="w-full select-none text-center text-xl text-gray-600 dark:text-gray-50">
                    {t("wordPanel.pressAnyKey", "按任意键", {
                      action: state.timerData.time
                        ? t("wordPanel.continue", "继续")
                        : t("wordPanel.start", "开始"),
                    })}
                  </p>
                </div>
              </div>
            )}
            <div className="flex w-full flex-col md:flex-row md:justify-between">
              <div className="flex-1 md:mr-4">
                <div className="relative">
                  <WordComponent
                    word={currentWord}
                    onFinish={onFinish}
                    key={wordComponentKey}
                  />
                  {shouldShowPhonetic && <Phonetic word={currentWord} />}
                  {/* 根据是否有详细翻译数据决定显示哪个组件 */}
                  {!isInReviewMode &&
                  currentWord.detailed_translations &&
                  Array.isArray(currentWord.detailed_translations) &&
                  currentWord.detailed_translations.length > 0 ? (
                    <DetailedTranslation
                      word={currentWord}
                      showDetailedTranslation={shouldShowTranslation}
                      onMouseEnter={() => handleShowTranslation(true)}
                      onMouseLeave={() => handleShowTranslation(false)}
                    />
                  ) : (
                    <Translation
                      trans={(() => {
                        // 回退到使用trans
                        return Array.isArray(currentWord.trans)
                          ? currentWord.trans
                              .map((t) =>
                                typeof t === "string"
                                  ? t
                                  : typeof t === "object" && t !== null
                                  ? (t as any).chinese ||
                                    (t as any).english ||
                                    JSON.stringify(t)
                                  : String(t)
                              )
                              .join("；")
                          : "";
                      })()}
                      showTrans={shouldShowTranslation}
                      onMouseEnter={() => handleShowTranslation(true)}
                      onMouseLeave={() => handleShowTranslation(false)}
                    />
                  )}
                </div>
              </div>
              {!isInReviewMode &&
                currentWord.sentences &&
                Array.isArray(currentWord.sentences) &&
                currentWord.sentences.length > 0 &&
                state.isSentencesVisible &&
                !wordDictationConfig.isOpen && (
                  <div className="mt-4 md:mt-0 md:w-2/5 lg:w-1/2">
                    <Sentences word={currentWord} showSentences={true} />
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <Progress
        className={`mb-10 mt-auto ${
          state.isTyping ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
