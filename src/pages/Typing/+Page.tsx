import BottomControlPanel from "../../components/BottomControlPanel";
import CustomArticleButton from "../../components/CustomArticleButton";
import Layout from "../../components/Layout";
import { DictChapterButton } from "./components/DictChapterButton";
import MarkWordButton from "./components/MarkWordButton";
import ResultScreen from "./components/ResultScreen";
import Speed from "./components/Speed";
import StartButton from "./components/StartButton";
import { UserAuthMenu } from "./components/UserAuthMenu";
import WordList from "./components/WordList";
import WordPanel from "./components/WordPanel";
import { useConfetti } from "./hooks/useConfetti";
import useMarkedWords from "./hooks/useMarkedWords";
import { useWordList } from "./hooks/useWordList";
import {
  TypingContext,
  TypingStateActionType,
  initialState,
  typingReducer,
} from "./store";
import { markedWordsAtom } from "./store/markedWordsAtom";
import { DonateCard } from "@/components/DonateCard";
import Header from "@/components/Header";
import StarCard from "@/components/StarCard";
import Tooltip from "@/components/Tooltip";
import UpdateNotification from "@/components/UpdateNotification";
import { idDictionaryMap } from "@/resources/dictionary";
import {
  currentChapterAtom,
  currentDictIdAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
} from "@/store";
import { IsDesktop, isLegal } from "@/utils";
import { useSaveChapterRecord } from "@/utils/db";
import { useMixPanelChapterLogUploader } from "@/utils/mixpanel";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useImmerReducer } from "use-immer";

export function Page() {
  const [state, dispatch] = useImmerReducer(
    typingReducer,
    structuredClone(initialState)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { words } = useWordList();

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const randomConfig = useAtomValue(randomConfigAtom);
  const chapterLogUploader = useMixPanelChapterLogUploader(state);
  const saveChapterRecord = useSaveChapterRecord();

  const reviewModeInfo = useAtomValue(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);

  const [markedWords, setMarkedWords] = useAtom(markedWordsAtom);
  const { isWordMarked, filterUnmarkedWords } = useMarkedWords();

  // 存储事件处理函数的引用
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useEffect(() => {
    // 检测用户设备
    if (!IsDesktop()) {
      setTimeout(() => {
        alert(
          " Keybr 目的为提高键盘工作者的英语输入效率，目前暂未适配移动端，希望您使用桌面端浏览器访问。如您使用的是 Ipad 等平板电脑设备，可以使用外接键盘使用本软件。"
        );
      }, 500);
    }
  }, []);

  // 在组件挂载和currentDictId改变时，检查当前字典是否存在，如果不存在，则将其重置为默认值
  useEffect(() => {
    const id = currentDictId;
    if (!(id in idDictionaryMap)) {
      setCurrentDictId("cet4");
      setCurrentChapter(0);
      return;
    }
  }, [currentDictId, setCurrentChapter, setCurrentDictId]);

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  useEffect(() => {
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
    };
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [dispatch]);

  useEffect(() => {
    state.chapterData.words?.length > 0
      ? setIsLoading(false)
      : setIsLoading(true);
  }, [state.chapterData.words]);

  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        // 检查当前是否在打字练习相关页面
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && !currentPath.startsWith("/typing")) {
          return;
        }

        if (
          !isLoading &&
          e.key !== "Enter" &&
          (isLegal(e.key) || e.key === " ") &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          dispatch({
            type: TypingStateActionType.SET_IS_TYPING,
            payload: true,
          });
        }
      };

      // 清理之前的事件监听器
      if (keydownHandlerRef.current) {
        window.removeEventListener("keydown", keydownHandlerRef.current);
      }

      // 设置新的事件监听器
      keydownHandlerRef.current = onKeyDown;
      window.addEventListener("keydown", onKeyDown);

      return () => {
        if (keydownHandlerRef.current === onKeyDown) {
          window.removeEventListener("keydown", keydownHandlerRef.current);
          keydownHandlerRef.current = null;
        }
      };
    }
  }, [state.isTyping, isLoading, dispatch]);

  useEffect(() => {
    if (words !== undefined) {
      const initialIndex =
        isReviewMode && reviewModeInfo.reviewRecord?.index
          ? reviewModeInfo.reviewRecord.index
          : 0;

      const filteredWords = filterUnmarkedWords(words);
      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: {
          words: filteredWords,
          shouldShuffle: randomConfig.isOpen,
          initialIndex,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, markedWords]);

  useEffect(() => {
    // 当用户完成章节后且完成 word Record 数据保存，记录 chapter Record 数据,
    if (state.isFinished && !state.isSavingRecord) {
      chapterLogUploader();
      saveChapterRecord(state);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isFinished, state.isSavingRecord]);

  useEffect(() => {
    // 启动计时器
    let intervalId: number;
    if (state.isTyping) {
      intervalId = window.setInterval(() => {
        dispatch({ type: TypingStateActionType.TICK_TIMER });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [state.isTyping, dispatch]);

  useConfetti(state.isFinished);

  // 确保在组件卸载时清理所有键盘事件监听器
  useEffect(() => {
    return () => {
      if (keydownHandlerRef.current) {
        window.removeEventListener("keydown", keydownHandlerRef.current);
        keydownHandlerRef.current = null;
      }
    };
  }, []);

  return (
    <TypingContext.Provider value={{ state: state, dispatch }}>
      <StarCard />
      {state.isFinished && <DonateCard />}
      {state.isFinished && <ResultScreen />}
      <UpdateNotification />
      <Layout>
        <Header>
          <DictChapterButton />
          <CustomArticleButton />
          <StartButton isLoading={isLoading} />
          <UserAuthMenu />
          <Tooltip content="跳过该词">
            <button
              type="button"
              className={`${
                state.isShowSkip
                  ? "bg-orange-400"
                  : "invisible w-0 bg-gray-300 px-0 opacity-0"
              } my-btn-primary transition-all duration-300 `}
              onClick={skipWord}
            >
              Skip
            </button>
          </Tooltip>
        </Header>
        <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
          <div className="container relative mx-auto flex h-full flex-col items-center">
            <div className="container flex flex-grow items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center ">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-indigo-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></div>
                </div>
              ) : (
                !state.isFinished && (
                  <WordPanel>
                    <MarkWordButton
                      word={state.currentWord}
                      isMarked={isWordMarked(state.currentWord)}
                    />
                  </WordPanel>
                )
              )}
            </div>
            <Speed />
            <BottomControlPanel />
          </div>
        </div>
      </Layout>
      <WordList />
    </TypingContext.Provider>
  );
}
