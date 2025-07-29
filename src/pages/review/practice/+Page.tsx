/**
 * 复习练习页面 (+Page.tsx)
 *
 * 本组件实现对当天需要复习的单词进行打字练习功能。
 * 通过复用Typing页面的打字组件，为用户提供一致的打字体验。
 *
 * 主要功能：
 * 1. 根据用户的练习状态(已练习/未练习)显示不同的单词列表
 * 2. 支持URL参数控制显示模式(如practiced=1显示已练习单词)
 * 3. 记录单词的练习状态，完成后更新单词的复习记录
 * 4. 提供友好的用户界面和交互体验
 *
 * 依赖的主要组件和hooks：
 * - WordPanel: Typing页面的单词面板组件，用于显示和处理打字练习
 * - TypingProvider/TypingContext: 提供打字状态和控制功能的上下文
 * - useTodayReviews: 获取今日需要复习的单词
 */
import { Link } from "@/components/ui/Link";
// 导入 UI 组件
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTodayReviews } from "@/hooks/useSpacedRepetition";
import Setting from "@/pages/Typing/components/Setting";
// 直接复用 Typing 页面的组件
import WordPanel from "@/pages/Typing/components/WordPanel";
import {
  TypingContext,
  TypingProvider,
  TypingStateActionType,
} from "@/pages/Typing/store/";
import type { WordWithIndex } from "@/typings";
import { isChineseSymbol, isLegal } from "@/utils";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import {
  getPracticedWords,
  getUnpracticedWords,
  updateWordPracticeCount,
} from "@/utils/reviewRounds";
import {
  adaptReviewWordsToTypingWords,
  extractWordNameFromTypingWord,
} from "@/utils/reviewToTypingAdapter";
import { completeWordReview } from "@/utils/spaced-repetition";
import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";

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
  }) => void;
}) {
  // 每次typingWords变化时，重新创建一个key，强制重新渲染TypingProvider
  const [providerKey, setProviderKey] = useState(0);

  useEffect(() => {
    // 当typingWords变化时，重置key以强制重新渲染
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
  }) => void;
}) {
  // 使用useContext获取打字上下文
  const typingContext = useContext(TypingContext);

  // 如果上下文不存在，提供默认值
  const {
    state = { isTyping: false },
    dispatch = () => {
      /* 空实现用于默认值 */
    },
    words = [],
    stats = { accuracy: 0, wpm: 0, time: 0 },
    index = 0,
    isCompleted = false,
  } = typingContext || {};

  // 监听isCompleted状态，当完成所有单词时触发onTypingComplete
  useEffect(() => {
    if (isCompleted && stats) {
      onTypingComplete(stats);
    }
  }, [isCompleted, stats, onTypingComplete]);

  // 添加键盘事件监听器，用于开始打字练习
  useEffect(() => {
    // 按任意键开始
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key;

      // 检查是否使用输入法
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
        // 开始练习
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

      // 提取单词名称
      const wordName = extractWordNameFromTypingWord(word.name);

      // 调用外部回调，更新单词状态
      onWordComplete(wordName, isCorrect);

      // 移动到下一个单词
      if (index < words.length - 1) {
        dispatch({
          type: TypingStateActionType.SKIP_2_WORD_INDEX,
          newIndex: index + 1,
        });
      } else {
        // 如果是最后一个单词，标记为完成
        dispatch({ type: TypingStateActionType.FINISH_CHAPTER });
      }
    },
    [dispatch, index, words.length, onWordComplete]
  );

  // 如果上下文不存在，显示加载状态
  if (!typingContext) {
    return <div>加载中...</div>;
  }

  // 计算进度百分比
  const progressPercentage =
    words.length > 0 ? (index / words.length) * 100 : 0;

  return (
    <>
      {/* 进度条 - 显示整体完成进度 */}
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
                      {stats?.accuracy ? (stats.accuracy * 100).toFixed(1) : 0}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    速度:{" "}
                    <span className="font-medium">{stats?.wpm || 0} WPM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 单词显示面板 - 核心打字组件 */}
            <div className="relative">
              <WordPanel
                mode="review" // 设置为复习模式
                onWordComplete={handleWordFinish}
              />
            </div>
          </div>
        </div>

        {/* 侧边栏（在大屏幕显示） */}
        <div className="hidden md:block w-64 border-l p-4 overflow-y-auto">
          <div className="flex flex-col space-y-6">
            {/* 设置面板 - 复用Typing页面的设置组件 */}
            <Setting />

            {/* 进度信息 - 详细显示练习统计 */}
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
                    {stats?.accuracy ? (stats.accuracy * 100).toFixed(1) : 0}%
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
 * 复习练习页面组件
 * 按照练习次数优先展示单词，未练习的单词优先
 */
export default function ReviewPracticePage() {
  // =========== 状态管理 ===========

  // 从useTodayReviews hook获取复习数据
  const { reviews, refreshTodayReviews, allPracticed } = useTodayReviews();

  // 界面状态
  const [selectedTab, setSelectedTab] = useState("unpracticed"); // 当前选中的标签：已练习/未练习
  const [typingWords, setTypingWords] = useState<string[]>([]); // 转换为打字组件格式的单词列表
  const [isLoading, setIsLoading] = useState(true); // 加载状态
  const [showCompleted, setShowCompleted] = useState(false); // 是否显示完成弹窗
  const [practicedParam, setPracticedParam] = useState<string | null>(null); // URL参数中的practiced值
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [refreshing, setRefreshing] = useState(false); // 刷新状态
  const [fadeIn, setFadeIn] = useState(false); // 淡入效果控制

  // =========== 视觉效果 ===========

  /**
   * 添加淡入效果
   * 当加载完成后延迟显示内容，使过渡更加平滑
   */
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setFadeIn(true);
      }, 100);
    } else {
      setFadeIn(false);
    }
  }, [isLoading]);

  // =========== URL参数处理 ===========

  /**
   * 从URL参数获取配置
   * 例如：?practiced=1 表示显示已练习的单词
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const practiced = urlParams.get("practiced");
    setPracticedParam(practiced);

    if (practiced === "1") {
      setSelectedTab("practiced");
    }
  }, []);

  // =========== 数据加载 ===========

  /**
   * 加载单词数据
   * 根据selectedTab和URL参数决定显示已练习或未练习的单词
   * 如果一种类型没有单词，会自动切换到另一种类型
   */
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // 如果没有复习数据，直接设置加载完成并返回
    if (reviews.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      let targetWords: IWordReviewRecord[] = [];

      // 如果URL中指定了practiced=1，则加载已练习的单词
      if (selectedTab === "practiced" || practicedParam === "1") {
        targetWords = getPracticedWords(reviews);
        if (targetWords.length === 0 && !allPracticed) {
          // 如果没有已练习的单词且不是所有单词都已练习，则回退到未练习单词
          targetWords = getUnpracticedWords(reviews);
          // 如果是因为没有已练习的单词而回退，更新选中的标签
          if (selectedTab === "practiced") {
            setSelectedTab("unpracticed");
          }
        }
      } else {
        // 默认加载未练习的单词
        targetWords = getUnpracticedWords(reviews);
        if (targetWords.length === 0) {
          // 如果没有未练习的单词，则加载已练习的单词
          targetWords = getPracticedWords(reviews);
          // 如果是因为没有未练习的单词而切换，更新选中的标签
          if (selectedTab === "unpracticed") {
            setSelectedTab("practiced");
          }
        }
      }

      // 将单词记录转换为打字组件使用的格式
      const adaptedWords = adaptReviewWordsToTypingWords(targetWords);
      setTypingWords(adaptedWords);
    } catch (error) {
      console.error("加载练习单词失败:", error);
      setError("加载练习单词失败，请刷新页面重试");
    } finally {
      // 添加短暂延迟，使过渡更平滑
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [reviews, selectedTab, practicedParam, allPracticed]);

  // =========== 事件处理函数 ===========

  /**
   * 完成单词练习的处理函数
   *
   * 当用户完成一个单词的打字时:
   * 1. 更新单词的练习次数
   * 2. 更新复习记录
   * 3. 刷新统计数据，确保仪表板显示最新数据
   *
   * @param word - 完成的单词
   * @param isCorrect - 是否正确输入
   */
  const handleWordComplete = useCallback(
    async (word: string, _isCorrect: boolean) => {
      try {
        if (!word) return;

        // 更新单词的练习次数
        await updateWordPracticeCount(word, true);

        // 更新复习记录
        await completeWordReview(
          word, // 单词名称
          Date.now(), // 当前时间戳
          true // 标记为当前轮次的首次复习
        );

        // 注释掉刷新统计数据的调用，避免每次完成单词后页面重新渲染
        // 只在整个练习完成后（handleTypingComplete）再刷新数据
        // await refreshTodayReviews();
      } catch (error) {
        console.error("更新单词练习状态失败:", error);
      }
    },
    []
  );

  /**
   * 处理打字完成事件
   * 当用户完成整个练习时，显示完成弹窗并刷新数据
   *
   * @param stats - 打字统计信息
   */
  const handleTypingComplete = useCallback(
    async (stats: { accuracy: number; wpm: number; time: number }) => {
      try {
        setShowCompleted(true);
        // 刷新今日复习数据
        await refreshTodayReviews();
      } catch (error) {
        console.error("处理打字完成事件失败:", error);
      }
    },
    [refreshTodayReviews]
  );

  /**
   * 关闭完成弹窗
   */
  const handleCloseCompletionModal = () => {
    setShowCompleted(false);
  };

  /**
   * 处理切换练习模式
   * 在已练习和未练习单词模式之间切换
   * 同时更新URL参数，以便分享或刷新页面时保持状态
   */
  const togglePracticeMode = () => {
    const newTab = selectedTab === "unpracticed" ? "practiced" : "unpracticed";
    setSelectedTab(newTab);

    // 更新URL参数，便于分享或刷新页面时保持状态
    const urlParams = new URLSearchParams(window.location.search);
    if (newTab === "practiced") {
      urlParams.set("practiced", "1");
    } else {
      urlParams.delete("practiced");
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  /**
   * 处理刷新按钮点击
   * 重新获取今日复习数据
   */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshTodayReviews();
    } catch (error) {
      console.error("刷新数据失败:", error);
      setError("刷新数据失败，请稍后再试");
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * 返回今日复习页面
   */
  const handleReturnToReviewPage = () => {
    window.location.href = "/review/today";
  };

  /**
   * 重新开始练习
   */
  const handleRestart = () => {
    handleCloseCompletionModal();
    // 重新加载数据
    refreshTodayReviews();
  };

  // =========== 条件渲染 ===========

  /**
   * 加载中状态
   */
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center">
            <Link
              href="/review/today"
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              ← 返回
            </Link>
            <h1 className="text-xl font-semibold">复习练习</h1>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">加载练习数据中...</p>
            <p className="text-gray-500 text-sm mt-2">正在准备您的复习单词</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 错误状态
   */
  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center">
            <Link
              href="/review/today"
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              ← 返回
            </Link>
            <h1 className="text-xl font-semibold">复习练习</h1>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full"
            >
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  刷新中...
                </>
              ) : (
                "重试"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleReturnToReviewPage}
              className="w-full mt-2"
            >
              返回复习页面
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 没有单词可练习
   */
  if (typingWords.length === 0) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center">
            <Link
              href="/review/today"
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              ← 返回
            </Link>
            <h1 className="text-xl font-semibold">复习练习</h1>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="text-center max-w-md p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-lg font-medium mb-6">今日没有需要复习的单词</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              恭喜！您已经完成了所有今天需要复习的单词。您可以返回复习页面查看您的复习进度。
            </p>
            <Button size="lg" onClick={handleReturnToReviewPage}>
              返回复习页面
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========== 主体渲染 ===========

  /**
   * 主要打字练习界面
   */
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
          <h1 className="text-xl font-semibold">复习练习</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm">
            {selectedTab === "unpracticed" ? (
              <Badge variant="outline" className="bg-blue-50">
                未练习单词
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50">
                已练习单词
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={togglePracticeMode}
            disabled={isLoading || typingWords.length === 0}
            className="text-sm"
          >
            {selectedTab === "unpracticed"
              ? "切换到已练习模式"
              : "切换到未练习模式"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-sm"
          >
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                刷新中...
              </>
            ) : (
              "刷新数据"
            )}
          </Button>
        </div>
      </div>

      {/* 打字练习组件 */}
      <TypingPractice
        typingWords={typingWords}
        onWordComplete={handleWordComplete}
        onTypingComplete={handleTypingComplete}
      />

      {/* 练习完成弹窗 - 显示练习结果 */}
      {showCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all duration-300 animate-slideIn">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">练习完成！</h2>
            <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between mb-2 py-2 border-b dark:border-gray-700">
                <span>总单词数:</span>
                <span className="font-semibold">{typingWords.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>练习模式:</span>
                <span className="font-semibold">
                  {selectedTab === "unpracticed" ? "未练习单词" : "已练习单词"}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCloseCompletionModal}>
                关闭
              </Button>
              <Button onClick={handleRestart}>再练习一次</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
