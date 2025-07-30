import BottomControlPanel from "../../components/BottomControlPanel";
import CustomArticleButton from "../../components/CustomArticleButton";
import Layout from "../../components/Layout";
import { WebsiteLanguageSwitcher } from "../../components/WebsiteLanguageSwitcher";
import { DictChapterButton } from "./components/DictChapterButton";
import ResultScreen from "./components/ResultScreen";
import Speed from "./components/Speed";
import StartButton from "./components/StartButton";
import WordList from "./components/WordList";
import WordPanel from "./components/WordPanel";
import { useConfetti } from "./hooks/useConfetti";
import { useWordList } from "./hooks/useWordList";
import {
  TypingContext,
  TypingStateActionType,
  initialState,
  typingReducer,
} from "./store";
import { DonateCard } from "@/components/DonateCard";
import Header from "@/components/Header";
import { ReviewStatusIndicator } from "@/components/ReviewStatusIndicator";
import StarCard from "@/components/StarCard";
import Tooltip from "@/components/Tooltip";
import TypingPracticeButton from "@/components/TypingPracticeButton";
import { useCustomDictionaryAPI } from "@/hooks/useCustomDictionary";
import { idDictionaryMap } from "@/resources/dictionary";
import {
  currentChapterAtom,
  currentDictIdAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
} from "@/store";
import { isCustomDictionary } from "@/store/customDictionary";
import { customDictionariesAtom } from "@/store/customDictionary";
import { IsDesktop, isLegal } from "@/utils";
import { useSaveChapterRecord } from "@/utils/db";
import { useMixPanelChapterLogUploader } from "@/utils/mixpanel";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmerReducer } from "use-immer";
import { usePageContext } from "vike-react/usePageContext";

export function Page({ pageContext: pageContextProp }: { pageContext?: any }) {
  const [state, dispatch] = useImmerReducer(
    typingReducer,
    structuredClone(initialState)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || pageContextProp;

  // pageContext回退机制：优先使用hook，如果不可用则使用props
  const { words } = useWordList();
  const { t } = useTranslation("typing");

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const randomConfig = useAtomValue(randomConfigAtom);
  const chapterLogUploader = useMixPanelChapterLogUploader(state);
  const saveChapterRecord = useSaveChapterRecord();
  const [customDictionaries, setCustomDictionaries] = useAtom(
    customDictionariesAtom
  );
  const { getDictionaries } = useCustomDictionaryAPI();

  const reviewModeInfo = useAtomValue(reviewModeInfoAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);

  // 存储事件处理函数的引用
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  // 优化：缓存路径标准化函数
  const normalizePath = useCallback((path: string): string => {
    if (path.startsWith("/en/")) return path.substring(3) || "/";
    if (path.startsWith("/zh/")) return path.substring(3) || "/";
    if (path === "/en" || path === "/zh") return "/";
    return path;
  }, []);

  // 优化：缓存当前路径
  const currentPath = useMemo(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname;
  }, []);

  const logicalPath = useMemo(() => {
    return pageContext
      ? (pageContext as any).urlLogical
      : normalizePath(currentPath);
  }, [pageContext, normalizePath, currentPath]);

  // 优化：缓存是否在打字页面的判断
  const isOnTypingPage = useMemo(() => {
    return logicalPath === "/" || logicalPath.startsWith("/typing");
  }, [logicalPath]);

  // 加载用户的自定义词典列表
  useEffect(() => {
    // 如果当前选择的是自定义词典，但自定义词典列表为空，则加载自定义词典列表
    if (isCustomDictionary(currentDictId) && customDictionaries.length === 0) {
      const fetchCustomDictionaries = async () => {
        try {
          const result = await getDictionaries();
          if (result.success && result.dictionaries) {
            setCustomDictionaries(result.dictionaries);
          }
        } catch (error) {
          console.error("获取自定义词典列表失败:", error);
        }
      };

      fetchCustomDictionaries();
    }
  }, [
    currentDictId,
    customDictionaries.length,
    getDictionaries,
    setCustomDictionaries,
  ]);

  // 优化：合并设备检测和字典检查
  useEffect(() => {
    // 检测用户设备
    if (!IsDesktop()) {
      const timer = setTimeout(() => {
        alert(t("messages.mobileNotSupported"));
      }, 500);
      return () => clearTimeout(timer);
    }

    // 检查当前字典是否存在
    const id = currentDictId;
    if (!isCustomDictionary(id) && !(id in idDictionaryMap)) {
      setCurrentDictId("cet4");
      setCurrentChapter(0);
    }
  }, [currentDictId, setCurrentChapter, setCurrentDictId, t]);

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  // 优化：合并窗口事件监听器
  useEffect(() => {
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
    };
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [dispatch]);

  // 优化：简化加载状态检查
  useEffect(() => {
    setIsLoading(!state.chapterData.words?.length);
  }, [state.chapterData.words?.length]);

  // 优化：合并键盘事件处理
  useEffect(() => {
    if (!state.isTyping && !isLoading) {
      const onKeyDown = (e: KeyboardEvent) => {
        // 检查当前是否在打字练习相关页面
        if (!isOnTypingPage) {
          return;
        }

        if (
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
  }, [state.isTyping, isLoading, dispatch, isOnTypingPage]);

  // 优化：简化章节设置
  useEffect(() => {
    if (words !== undefined) {
      const initialIndex =
        isReviewMode && reviewModeInfo.reviewRecord?.index
          ? reviewModeInfo.reviewRecord.index
          : 0;

      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: {
          words: words,
          shouldShuffle: randomConfig.isOpen,
          initialIndex,
        },
      });
    }
  }, [
    words,
    isReviewMode,
    reviewModeInfo.reviewRecord?.index,
    randomConfig.isOpen,
    dispatch,
  ]);

  // 优化：简化完成状态处理
  useEffect(() => {
    if (state.isFinished && !state.isSavingRecord) {
      chapterLogUploader();
      saveChapterRecord(state);
    }
  }, [
    state.isFinished,
    state.isSavingRecord,
    chapterLogUploader,
    saveChapterRecord,
    state,
  ]);

  // 优化：简化计时器
  useEffect(() => {
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

  // 优化：缓存上下文值
  const typingContextValue = useMemo(
    () => ({
      state: state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <TypingContext.Provider value={typingContextValue}>
      <StarCard />
      {state.isFinished && <DonateCard />}
      {state.isFinished && <ResultScreen />}

      <Layout>
        <Header pageContext={pageContext}>
          <TypingPracticeButton />
          <DictChapterButton pageContext={pageContext} />
          <CustomArticleButton pageContext={pageContext} />
          <StartButton isLoading={isLoading} />

          <Tooltip content={t("tooltips.skipWord")}>
            <button
              type="button"
              className={`${
                state.isShowSkip
                  ? "bg-orange-400"
                  : "invisible w-0 bg-gray-300 px-0 opacity-0"
              } my-btn-primary transition-all duration-300 `}
              onClick={skipWord}
            >
              {t("buttons.skip")}
            </button>
          </Tooltip>
          <ReviewStatusIndicator pageContext={pageContext} />

          {/* 网站语言切换组件 - 只在 Typing 页面显示 */}
          <div className="ml-auto">
            <WebsiteLanguageSwitcher
              showLabel={false}
              pageContext={pageContext}
            />
          </div>
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
                  <>
                    <WordPanel />
                  </>
                )
              )}
            </div>
            <Speed />
            <BottomControlPanel pageContext={pageContext} />
          </div>
        </div>
      </Layout>
      <WordList />
    </TypingContext.Provider>
  );
}
