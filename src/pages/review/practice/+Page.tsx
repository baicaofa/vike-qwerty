/**
 * 复习练习页面 - 章节化版本 (+Page.tsx)
 *
 * 本组件实现章节化复习功能，将当天需要复习的单词按章节组织。
 * 每章固定20个单词，按原始顺序排列章节内容。
 *
 * 主要功能：
 * 1. 显示章节列表，每章20个单词
 * 2. 支持章节选择和进度跟踪
 * 3. 章节完成后显示结果弹窗
 * 4. 复用现有TypingProvider/WordPanel组件架构
 *
 * 依赖的主要组件和hooks：
 * - WordPanel: Typing页面的单词面板组件，用于显示和处理打字练习
 * - TypingProvider/TypingContext: 提供打字状态和控制功能的上下文
 * - useTodayReviews: 获取今日需要复习的单词
 * - ChapterResultScreen: 章节完成结果展示组件
 */
import ChapterResultScreen from "./components/ChapterResultScreen";
import { ChapterErrorBoundary } from "./components/ErrorBoundary";
import { Link } from "@/components/ui/Link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTodayReviews } from "@/hooks/useSpacedRepetition";
import Setting from "@/pages/Typing/components/Setting";
import WordPanel from "@/pages/Typing/components/WordPanel";
import {
  TypingContext,
  TypingProvider,
  TypingStateActionType,
} from "@/pages/Typing/store/";
import type { WordWithIndex } from "@/typings";
import type { Chapter, ChapterStats } from "@/typings/chapter";
import { isChineseSymbol, isLegal } from "@/utils";
import {
  cleanupExpiredChapterData,
  generateChapters,
  shouldCleanupChapterData,
  updateChapterPracticeCount,
} from "@/utils/chapterManagement";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import {
  adaptReviewWordsToTypingWords,
  extractWordNameFromTypingWord,
} from "@/utils/reviewToTypingAdapter";
import { completeWordReview } from "@/utils/spaced-repetition";
import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * localStorage工具函数 - 用于记忆用户最后练习的章节
 */
const LAST_CHAPTER_KEY = "review-practice-last-chapter";

// 保存最后练习的章节（按日期存储）
const saveLastChapter = (chapterNumber: number) => {
  const today = new Date().toISOString().split("T")[0];
  const data = {
    date: today,
    chapter: chapterNumber,
  };
  localStorage.setItem(LAST_CHAPTER_KEY, JSON.stringify(data));
};

// 获取最后练习的章节（如果不是今天的记录则返回null）
const getLastChapter = (): number | null => {
  try {
    const stored = localStorage.getItem(LAST_CHAPTER_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const today = new Date().toISOString().split("T")[0];

    // 只有今天的记录才有效
    if (data.date === today && typeof data.chapter === "number") {
      return data.chapter;
    }

    return null;
  } catch (error) {
    console.warn("读取最后章节失败:", error);
    return null;
  }
};

/**
 * 打字练习组件
 * 包装TypingProvider并处理打字相关逻辑
 */
function TypingPractice({
  typingWords,
  onWordComplete,
  onTypingComplete,
}: {
  typingWords: string[];
  onWordComplete: (word: string, isCorrect: boolean) => void;
  onTypingComplete: (stats: {
    accuracy: number;
    wpm: number;
    time: number;
    wrongWords: IWordReviewRecord[];
    correctWords: IWordReviewRecord[];
  }) => void;
}) {
  const [providerKey, setProviderKey] = useState(0);

  // 当章节单词改变时，重置Provider以确保状态清洁
  useEffect(() => {
    setProviderKey((prev) => prev + 1);
  }, [typingWords]);

  return (
    <TypingProvider initialWords={typingWords} key={providerKey}>
      <TypingContent
        onWordComplete={onWordComplete}
        onTypingComplete={onTypingComplete}
      />
    </TypingProvider>
  );
}

/**
 * 打字内容组件
 * 使用useContext获取打字状态
 */
function TypingContent({
  onWordComplete,
  onTypingComplete,
}: {
  onWordComplete: (word: string, isCorrect: boolean) => void;
  onTypingComplete: (stats: {
    accuracy: number;
    wpm: number;
    time: number;
    wrongWords: IWordReviewRecord[];
    correctWords: IWordReviewRecord[];
  }) => void;
}) {
  const typingContext = useContext(TypingContext);
  const [wrongWords, setWrongWords] = useState<IWordReviewRecord[]>([]);
  const [correctWords, setCorrectWords] = useState<IWordReviewRecord[]>([]);
  const [hasCompletedChapter, setHasCompletedChapter] = useState(false);

  const {
    state = { isTyping: false },
    dispatch = () => {},
    words = [],
    stats = { accuracy: 0, wpm: 0, time: 0 },
    index = 0,
    isCompleted = false,
  } = typingContext || {};

  // 监听完成状态
  useEffect(() => {
    if (isCompleted && stats && !hasCompletedChapter) {
      setHasCompletedChapter(true); // 标记已完成，防止重复调用
      onTypingComplete({
        accuracy: stats.accuracy,
        wpm: stats.wpm,
        time: stats.time,
        wrongWords,
        correctWords,
      });
    }
  }, [isCompleted, stats, onTypingComplete, hasCompletedChapter]);

  // 计时器逻辑 - 复制自 Typing 页面
  useEffect(() => {
    let intervalId: number;
    if (state && state.isTyping && dispatch) {
      intervalId = window.setInterval(() => {
        dispatch({ type: TypingStateActionType.TICK_TIMER });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [state?.isTyping, dispatch]);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key;

      if (isChineseSymbol(char)) {
        alert("您正在使用输入法，请关闭输入法。");
        return;
      }

      if (
        state &&
        !state.isTyping &&
        (isLegal(e.key) || e.key === " ") &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        if (dispatch) {
          dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state, dispatch]);

  // 处理单词完成事件
  const handleWordFinish = useCallback(
    (word: WordWithIndex, isCorrect: boolean, _responseTime: number) => {
      if (!word) return;

      const wordName = extractWordNameFromTypingWord(word.name);

      // 追踪错误和正确的单词
      // 这里需要找到对应的 IWordReviewRecord，暂时创建简单的记录
      const wordRecord: IWordReviewRecord = {
        uuid: "",
        word: wordName,
        intervalSequence: [1, 3, 7, 15, 30, 60],
        currentIntervalIndex: 0,
        nextReviewAt: Date.now(),
        totalReviews: 0,
        isGraduated: false,
        todayPracticeCount: 0,
        lastPracticedAt: Date.now(),
        sourceDicts: [],
        preferredDict: "",
        firstSeenAt: Date.now(),
        sync_status: "local_new",
        last_modified: Date.now(),
      };

      if (isCorrect) {
        setCorrectWords((prev) => [...prev, wordRecord]);
      } else {
        setWrongWords((prev) => [...prev, wordRecord]);
      }

      // 更新统计数据
      if (isCorrect) {
        dispatch({
          type: TypingStateActionType.REPORT_CORRECT_WORD,
        });
      } else {
        dispatch({
          type: TypingStateActionType.REPORT_WRONG_WORD,
          payload: { letterMistake: [] }, // 复习模式下简化错误统计
        });
      }

      onWordComplete(wordName, isCorrect);

      // 移动到下一个单词
      if (index < words.length - 1) {
        dispatch({
          type: TypingStateActionType.NEXT_WORD,
        });
      } else {
        dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
      }
    },
    [dispatch, index, words.length, onWordComplete]
  );

  if (!typingContext) {
    return <div>加载中...</div>;
  }

  const progressPercentage =
    words.length > 0 ? (index / words.length) * 100 : 0;

  return (
    <>
      {/* 进度条 */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-300 ${
            progressPercentage > 75
              ? "bg-green-500"
              : progressPercentage > 50
              ? "bg-blue-500"
              : progressPercentage > 25
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 主体内容 */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* 主要练习区域 */}
        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          <div className="flex-grow flex flex-col max-w-3xl mx-auto w-full">
            {/* 当前练习状态信息 */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    进度:{" "}
                    <span className="font-medium">
                      {index}/{words.length}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    正确率:{" "}
                    <span className="font-medium">
                      {stats?.accuracy ? stats.accuracy.toFixed(1) : 0}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    速度:{" "}
                    <span className="font-medium">{stats?.wpm || 0} WPM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 单词显示面板 */}
            <div className="relative">
              <WordPanel mode="review" onWordComplete={handleWordFinish} />
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="hidden md:block w-64 border-l p-4 overflow-y-auto">
          <div className="flex flex-col space-y-6">
            <Setting />

            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">练习进度</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">完成:</span>
                  <span className="font-medium">
                    {index}/{words.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">正确率:</span>
                  <span className="font-medium">
                    {stats?.accuracy ? stats.accuracy.toFixed(1) : 0}%
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="text-sm text-gray-500">进度</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        progressPercentage > 75
                          ? "bg-green-500"
                          : progressPercentage > 50
                          ? "bg-blue-500"
                          : progressPercentage > 25
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 章节选择器组件
 */
function ChapterSelector({
  chapters,
  currentChapter,
  onChapterChange,
}: {
  chapters: Chapter[];
  currentChapter: number;
  onChapterChange: (chapterNumber: number) => void;
}) {
  const { t } = useTranslation("review");

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="chapter-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        选择章节:
      </label>
      <select
        id="chapter-select"
        value={currentChapter}
        onChange={(e) => onChapterChange(parseInt(e.target.value))}
        className="pr-8 pl-2 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {chapters.map((chapter) => (
          <option
            key={chapter.chapterNumber}
            value={chapter.chapterNumber}
            style={{
              color: chapter.practiceCount > 0 ? "#10b981" : "#ef4444",
              fontWeight: chapter.practiceCount > 0 ? "500" : "normal",
            }}
          >
            {t("chapter.number", "第{{number}}章", {
              number: chapter.chapterNumber,
            })}
            {chapter.practiceCount > 0 ? " ✅ 已练习" : " ❌ 未练习"}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 复习练习页面组件 - 章节化版本
 */
export default function ReviewPracticePage() {
  const { t } = useTranslation("review");

  // 数据状态
  const { reviews, refreshTodayReviews } = useTodayReviews();

  // 章节相关状态
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(1); // 默认第一章
  const [typingWords, setTypingWords] = useState<string[]>([]);
  const [chapterStats, setChapterStats] = useState<ChapterStats | null>(null);

  // 界面状态
  const [isLoading, setIsLoading] = useState(true);
  const [showChapterResult, setShowChapterResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // 章节练习进度暂存（内存中暂存，章节完成时批量保存）
  const [chapterProgress, setChapterProgress] = useState<{
    completedWords: Set<string>;
    wordStats: Map<
      string,
      {
        practiceCount: number;
        lastPracticedAt: number;
        isCorrect: boolean;
      }
    >;
  }>({
    completedWords: new Set(),
    wordStats: new Map(),
  });

  // 数据清理（应用启动时）
  useEffect(() => {
    if (shouldCleanupChapterData()) {
      cleanupExpiredChapterData();
    }
  }, []);

  // 淡入效果
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setFadeIn(true);
      }, 100);
    } else {
      setFadeIn(false);
    }
  }, [isLoading]);

  // 生成章节数据
  useEffect(() => {
    const generateChapterData = async () => {
      setIsLoading(true);
      setError(null);

      if (reviews.length === 0) {
        setChapters([]);
        setIsLoading(false);
        return;
      }

      try {
        // 添加小延迟，让用户感受到加载过程
        await new Promise((resolve) => setTimeout(resolve, 300));

        const today = new Date().toISOString().split("T")[0];
        const chapterList = generateChapters(reviews, today);

        // 验证生成的章节数据
        if (!Array.isArray(chapterList)) {
          throw new Error("章节数据格式不正确");
        }

        setChapters(chapterList);

        // 智能设置当前章节：优先使用上次章节，否则使用第一章
        const lastChapter = getLastChapter();
        const targetChapter =
          lastChapter && lastChapter <= chapterList.length ? lastChapter : 1;
        setCurrentChapter(targetChapter);

        // 自动开始该章节的练习
        const chapter = chapterList.find(
          (c) => c.chapterNumber === targetChapter
        );
        if (chapter && chapter.words && chapter.words.length > 0) {
          const adaptedWords = adaptReviewWordsToTypingWords(chapter.words);
          setTypingWords(adaptedWords);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("生成章节失败:", error);
        setError(t("chapter.status.error", "生成章节失败"));
        setChapters([]);
        setIsLoading(false);
      }
    };

    generateChapterData();
  }, [reviews, t]);

  // 开始章节练习
  const startChapter = useCallback(
    (chapterNumber: number) => {
      try {
        const chapter = chapters.find((c) => c.chapterNumber === chapterNumber);

        if (!chapter) {
          console.error(`章节 ${chapterNumber} 不存在`);
          setError(t("chapter.status.error", "章节不存在"));
          return;
        }

        if (!chapter.words || chapter.words.length === 0) {
          console.error(`章节 ${chapterNumber} 没有单词`);
          setError(t("chapter.status.error", "章节没有单词"));
          return;
        }

        setCurrentChapter(chapterNumber);
        setError(null); // 清除之前的错误

        // 清空暂存的章节进度数据（重新开始章节）
        setChapterProgress({
          completedWords: new Set(),
          wordStats: new Map(),
        });

        // 保存当前章节到localStorage
        saveLastChapter(chapterNumber);

        const adaptedWords = adaptReviewWordsToTypingWords(chapter.words);
        setTypingWords(adaptedWords);
      } catch (error) {
        console.error("开始章节失败:", error);
        setError(t("chapter.status.error", "开始章节失败"));
      }
    },
    [chapters, t]
  );

  // 处理单词完成 - 使用内存暂存，章节完成时批量保存
  const handleWordComplete = useCallback((word: string, isCorrect: boolean) => {
    try {
      if (!word) return;

      // 只更新内存状态，不立即保存到数据库
      setChapterProgress((prev) => {
        const newWordStats = new Map(prev.wordStats);
        const currentStats = newWordStats.get(word) || {
          practiceCount: 0,
          lastPracticedAt: 0,
          isCorrect: false,
        };

        newWordStats.set(word, {
          practiceCount: currentStats.practiceCount + 1,
          lastPracticedAt: Date.now(),
          isCorrect: isCorrect,
        });

        return {
          completedWords: new Set([...Array.from(prev.completedWords), word]),
          wordStats: newWordStats,
        };
      });
    } catch (error) {
      console.error("更新章节练习状态失败:", error);
    }
  }, []);

  // 处理章节完成
  const handleChapterComplete = useCallback(
    async (stats: {
      accuracy: number;
      wpm: number;
      time: number;
      wrongWords: IWordReviewRecord[];
      correctWords: IWordReviewRecord[];
    }) => {
      try {
        // 批量保存章节练习过程中的单词数据
        console.log(
          "开始批量保存章节练习数据...",
          chapterProgress.wordStats.size,
          "个单词"
        );

        for (const [word, wordStat] of Array.from(
          chapterProgress.wordStats.entries()
        )) {
          try {
            // 完成单词复习（更新复习进度和练习次数）
            // 注意：completeWordReview内部已经会处理练习次数，不需要单独调用updateWordPracticeCount
            await completeWordReview(word, wordStat.lastPracticedAt, true);
          } catch (error) {
            console.error(`保存单词 ${word} 的数据失败:`, error);
          }
        }

        console.log("章节练习数据批量保存完成");

        // 清空暂存的章节进度数据
        setChapterProgress({
          completedWords: new Set(),
          wordStats: new Map(),
        });

        if (currentChapter) {
          // 更新章节练习次数
          const today = new Date().toISOString().split("T")[0];
          updateChapterPracticeCount(today, currentChapter);

          // 设置章节统计
          setChapterStats({
            accuracy: stats.accuracy,
            wpm: stats.wpm,
            time: stats.time,
            wrongWords: stats.wrongWords,
            correctWords: stats.correctWords,
          });

          // 显示结果弹窗
          setShowChapterResult(true);
        }

        // 局部更新章节状态，避免全局刷新导致的加载状态
        setChapters((prevChapters) =>
          prevChapters.map((chapter) => {
            if (chapter.chapterNumber === currentChapter) {
              // 更新当前章节的练习次数和完成状态
              const updatedWords = chapter.words.map((word) => ({
                ...word,
                todayPracticeCount: (word.todayPracticeCount || 0) + 1,
                lastPracticedAt: Date.now(),
              }));

              return {
                ...chapter,
                practiceCount: (chapter.practiceCount || 0) + 1,
                words: updatedWords,
                completedWords: updatedWords.length,
                isCompleted: true,
              };
            }
            return chapter;
          })
        );
      } catch (error) {
        console.error("处理章节完成失败:", error);
        // 即使出错也要显示结果，确保用户体验不中断
        if (currentChapter) {
          setChapterStats({
            accuracy: stats.accuracy,
            wpm: stats.wpm,
            time: stats.time,
            wrongWords: stats.wrongWords,
            correctWords: stats.correctWords,
          });
          setShowChapterResult(true);
        }
      }
    },
    [currentChapter, refreshTodayReviews, chapterProgress]
  );

  // 处理刷新
  const handleRefresh = async () => {
    try {
      await refreshTodayReviews();
    } catch (error) {
      console.error("刷新数据失败:", error);
      setError(t("status.error", "刷新数据失败"));
    }
  };

  // 章节切换处理
  const handleChapterChange = useCallback(
    (chapterNumber: number) => {
      startChapter(chapterNumber);
    },
    [startChapter]
  );

  // 渲染内容
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">
            {t("chapter.status.loading", "正在生成章节...")}
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            {t("status.retry", "重试")}
          </Button>
        </div>
      );
    }

    if (chapters.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {t("chapter.status.noReviewWords", "今日暂无复习单词")}
          </p>
          <Link href="/review/today">
            <Button variant="outline" className="mt-4">
              {t("today.title", "返回今日复习")}
            </Button>
          </Link>
        </div>
      );
    }

    // 直接显示练习界面
    return (
      <div>
        {/* 练习界面顶部 - 章节信息和选择器 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mt-4">
            <h2 className="text-xl font-semibold">
              {t("chapter.number", "第{{number}}章", {
                number: currentChapter,
              })}
              <span className="text-sm text-gray-600 ml-2">
                ({chapters[currentChapter - 1]?.totalWords}个单词)
              </span>
            </h2>
            <ChapterSelector
              chapters={chapters}
              currentChapter={currentChapter}
              onChapterChange={handleChapterChange}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              {t("common:buttons.refresh", "刷新")}
            </Button>
            <Link href="/review/today">
              <Button variant="outline">
                {t("today.title", "返回今日复习")}
              </Button>
            </Link>
          </div>
        </div>

        {/* 练习界面 */}
        {typingWords.length > 0 ? (
          <TypingPractice
            typingWords={typingWords}
            onWordComplete={handleWordComplete}
            onTypingComplete={handleChapterComplete}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">正在加载练习内容...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col container mx-auto h-screen transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center">
          <Link
            href="/review/today"
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            ← 返回
          </Link>
          <h1 className="text-xl font-semibold">
            {t("chapter.title", "章节复习")}
          </h1>
        </div>
      </div>

      {/* 主体内容 */}
      <ChapterErrorBoundary>{renderContent()}</ChapterErrorBoundary>

      {/* 章节完成结果弹窗 */}
      {showChapterResult && chapterStats && currentChapter && (
        <ChapterResultScreen
          chapterNumber={currentChapter}
          stats={chapterStats}
          onClose={() => setShowChapterResult(false)}
          onNextChapter={() => {
            setShowChapterResult(false);
            const nextChapter = currentChapter + 1;
            if (nextChapter <= chapters.length) {
              startChapter(nextChapter);
            } else {
              // 如果已经是最后一章，重置到第一章
              startChapter(1);
            }
          }}
          onRepeatChapter={() => {
            setShowChapterResult(false);
            startChapter(currentChapter);
          }}
          isLastChapter={currentChapter >= chapters.length}
        />
      )}
    </div>
  );
}
