import RecommendedArticlesDialog from "../components/RecommendedArticlesDialog";
import UploadArticleDialog from "../components/UploadArticleDialog";
import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import useKeySounds from "@/hooks/useKeySounds";
import { isChineseSymbol, isLegal } from "@/utils";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

// 当前单词组件，使用memo优化渲染
const CurrentWord = memo(
  ({
    word,
    userInput,
    letterStates,
    wordRef,
  }: {
    word: { name: string };
    userInput: string;
    letterStates: string[];
    wordRef: React.RefObject<HTMLSpanElement>;
  }) => {
    if (!word) return null;

    return (
      <span
        ref={wordRef}
        className="bg-blue-100 font-bold relative"
        id="current-word"
      >
        {word.name.split("").map((char, charIndex) => {
          const charKey = `current-char-${charIndex}`;

          // 已输入的字符
          if (charIndex < userInput.length) {
            // 错误的字符
            if (letterStates[charIndex] === "wrong") {
              return (
                <span key={charKey} className="bg-red-200 text-red-800">
                  {char}
                </span>
              );
            }
            // 正确的字符
            return (
              <span key={charKey} className="bg-green-100 text-green-800">
                {char}
              </span>
            );
          }
          // 当前需要输入的字符
          if (charIndex === userInput.length) {
            return (
              <span
                key={charKey}
                className="bg-blue-200 text-blue-800 animate-pulse"
              >
                {char}
              </span>
            );
          }
          // 未输入的字符
          return <span key={charKey}>{char}</span>;
        })}{" "}
      </span>
    );
  }
);

// 添加displayName
CurrentWord.displayName = "CurrentWord";

export default function ArticlePractice() {
  const { state, dispatch } = useContext(ArticleContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds();

  // 使用i18n翻译
  const { t } = useTranslation("article");

  // 弹窗状态
  const [showRecommendedDialog, setShowRecommendedDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // 声音控制状态
  const [enableSound, setEnableSound] = useState(false);

  // 打开推荐文章弹窗
  const handleOpenRecommendedDialog = () => {
    // 暂停当前练习
    if (state.isTyping && !state.isPaused) {
      safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
    }
    setShowRecommendedDialog(true);
  };

  // 切换标点符号显示
  const handleTogglePunctuation = () => {
    // 如果正在练习，先暂停
    if (state.isTyping && !state.isPaused) {
      safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
    }

    // 更新预处理设置
    dispatch({
      type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
      payload: {
        removePunctuation: !state.preprocessSettings.removePunctuation,
      },
    });

    // 重新处理文本
    dispatch({ type: ArticleActionType.PROCESS_TEXT });

    // 如果之前正在练习，恢复练习
    if (state.isTyping && !state.isPaused) {
      safeDispatch({ type: ArticleActionType.RESUME_TYPING });
    }
  };

  // 打开上传文章弹窗
  const handleOpenUploadDialog = () => {
    // 暂停当前练习
    if (state.isTyping && !state.isPaused) {
      safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
    }
    setShowUploadDialog(true);
  };

  // 查看保存的文章
  const handleViewHistory = () => {
    safeDispatch({ type: ArticleActionType.SET_VIEW_HISTORY, payload: true });
  };

  // 使用ref跟踪当前单词元素
  const currentWordRef = useRef<HTMLSpanElement>(null);

  // 使用ref跟踪组件是否已卸载
  const isMountedRef = useRef(true);

  // 当前单词
  const currentWord = state.words[state.currentWordIndex];

  // 计算进度
  const progress = (state.currentWordIndex / (state.words.length || 1)) * 100;

  // 安全地分发action，确保组件仍然挂载
  const safeDispatch = useCallback(
    (action: any) => {
      if (isMountedRef.current) {
        dispatch(action);
      }
    },
    [dispatch]
  );

  // 处理键盘输入
  const handleInput = useCallback(
    (char: string) => {
      if (!state.isTyping || state.isPaused || state.isFinished) return;

      const input = state.userInput + char;

      // 更新用户输入
      safeDispatch({
        type: ArticleActionType.UPDATE_USER_INPUT,
        payload: input,
      });

      // 检查输入的字符
      if (currentWord) {
        const inputChar = char;
        const correctChar = currentWord.name[state.userInput.length];

        // 使用大小写不敏感的比较
        const isEqual = inputChar.toLowerCase() === correctChar.toLowerCase();

        if (isEqual) {
          // 输入正确
          safeDispatch({
            type: ArticleActionType.UPDATE_LETTER_STATE,
            payload: { index: state.userInput.length, state: "correct" },
          });
          playKeySound();

          // 检查是否完成当前单词
          if (input.length === currentWord.name.length) {
            // 完成单词 - 立即处理，不使用setTimeout
            safeDispatch({ type: ArticleActionType.NEXT_WORD });

            // 如果是最后一个单词，完成练习
            if (state.currentWordIndex >= state.words.length - 1) {
              safeDispatch({ type: ArticleActionType.FINISH_TYPING });
              setIsCompleted(true);
              playHintSound();
            }
          }
        } else {
          // 输入错误
          safeDispatch({
            type: ArticleActionType.UPDATE_LETTER_STATE,
            payload: { index: state.userInput.length, state: "wrong" },
          });
          safeDispatch({
            type: ArticleActionType.ADD_ERROR,
            payload: state.userInput.length,
          });
          playBeepSound();
        }
      }
    },
    [
      state,
      safeDispatch,
      currentWord,
      playKeySound,
      playBeepSound,
      playHintSound,
    ]
  );

  // 统一的键盘事件处理
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const char = e.key;

      if (isChineseSymbol(char)) {
        alert(t("practice.inputMethodWarning"));
        return;
      }

      // 如果已经完成，不处理键盘事件
      if (isCompleted) return;

      // 只处理合法的按键，并且不是组合键
      if (
        (isLegal(char) || char === " ") &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();

        if (!state.isTyping) {
          // 开始练习
          safeDispatch({
            type: ArticleActionType.START_TYPING,
          });
        } else if (!state.isPaused && !state.isFinished) {
          // 处理输入
          handleInput(char);
        }
      }
    };

    // 设置事件监听器
    window.addEventListener("keydown", onKeyDown);

    // 清理事件监听器
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    state.isTyping,
    state.isPaused,
    state.isFinished,
    isCompleted,
    safeDispatch,
    handleInput,
  ]);

  // 错误后重置输入
  useEffect(() => {
    if (state.hasWrong) {
      const timer = setTimeout(() => {
        safeDispatch({
          type: ArticleActionType.RESET_WRONG_INPUT,
        });
      }, 300); // 300毫秒后重置

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.hasWrong, safeDispatch]);

  // 暂停练习
  const handlePause = useCallback(() => {
    safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
  }, [safeDispatch]);

  // 恢复练习
  const handleResume = useCallback(() => {
    safeDispatch({ type: ArticleActionType.RESUME_TYPING });
  }, [safeDispatch]);

  // 重新开始
  const handleRestart = useCallback(() => {
    safeDispatch({ type: ArticleActionType.RESET_TYPING });
    setIsCompleted(false);
  }, [safeDispatch]);

  // 返回上一步
  const handleBack = useCallback(() => {
    safeDispatch({ type: ArticleActionType.RESET_TYPING });
    // 不再需要返回上一步，因为现在是直接进入练习页面
    // safeDispatch({ type: ArticleActionType.PREV_STEP });
    // 改为显示历史记录
    safeDispatch({ type: ArticleActionType.SET_VIEW_HISTORY, payload: true });
  }, [safeDispatch]);

  // 播放当前单词发音
  const playCurrentWordSound = useCallback(() => {
    if (currentWord && state.isTyping && !state.isPaused && enableSound) {
      // 使用浏览器的语音合成API
      const utterance = new SpeechSynthesisUtterance(currentWord.name);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord, state.isTyping, state.isPaused, enableSound]);

  // 自动播放当前单词发音
  useEffect(() => {
    if (
      state.isTyping &&
      !state.isPaused &&
      state.userInput.length === 0 &&
      enableSound
    ) {
      playCurrentWordSound();
    }
  }, [
    state.currentWordIndex,
    state.isTyping,
    state.isPaused,
    state.userInput.length,
    enableSound,
    playCurrentWordSound,
  ]);

  // 计时器
  useEffect(() => {
    let timerId: number;

    if (state.isTyping && !state.isPaused && !state.isFinished) {
      timerId = window.setInterval(() => {
        safeDispatch({ type: ArticleActionType.TICK_TIMER });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [state.isTyping, state.isPaused, state.isFinished, safeDispatch]);

  // 安全的滚动到当前单词位置
  const scrollToCurrentWord = useCallback(() => {
    if (state.isTyping && !state.isPaused) {
      // 使用requestAnimationFrame确保DOM已更新
      requestAnimationFrame(() => {
        if (currentWordRef.current) {
          currentWordRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    }
  }, [state.isTyping, state.isPaused]);

  // 自动滚动到当前单词位置
  useEffect(() => {
    // 当单词索引变化时滚动
    if (state.isTyping && !state.isPaused) {
      // 添加短暂延迟确保DOM已更新
      const scrollTimer = setTimeout(() => {
        scrollToCurrentWord();
      }, 10);

      return () => clearTimeout(scrollTimer);
    }
  }, [state.currentWordIndex, scrollToCurrentWord]);

  // 组件卸载时更新ref
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 渲染全文，高亮当前单词
  const renderFullArticle = useCallback(() => {
    if (!state.words.length) return null;

    return (
      <div className="flex flex-col items-center">
        {/* 文章全文 */}
        <div className="text-base leading-relaxed mb-4 w-full whitespace-pre-wrap">
          {state.words.map((word, index) => {
            const isCurrentWord = index === state.currentWordIndex;
            const isPastWord = index < state.currentWordIndex;

            // 为每个单词创建一个唯一的key
            const wordKey = `word-${index}`;

            if (isCurrentWord) {
              // 当前单词，使用memo组件
              return (
                <CurrentWord
                  key={wordKey}
                  word={word}
                  userInput={state.userInput}
                  letterStates={state.letterStates}
                  wordRef={currentWordRef}
                />
              );
            }

            // 其他单词
            return (
              <span
                key={wordKey}
                className={isPastWord ? "text-gray-400" : "text-gray-700"}
              >
                {word.name}{" "}
              </span>
            );
          })}
        </div>

        {/* 提示信息 */}
        {!state.isTyping && (
          <div className="text-center text-gray-600 mb-4 animate-pulse">
            {t("practice.pressAnyKey", "按任意键开始练习")}
          </div>
        )}
      </div>
    );
  }, [
    state.words,
    state.currentWordIndex,
    state.userInput,
    state.letterStates,
    state.isTyping,
  ]);

  // 渲染结果
  const renderResult = useCallback(() => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2 text-center">
          {t("practice.completed", "练习完成")}
        </h2>
        <h3 className="text-lg font-medium mb-4 text-center text-gray-600">
          {state.articleTitle || t("practice.customArticle", "自定义文章")}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">
              {t("practice.timeLabel", "耗时")}
            </div>
            <div className="text-xl font-semibold">
              {Math.round(state.elapsedTime)}
              {t("practice.seconds", "秒")}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">
              {t("practice.speedLabel", "速度")}
            </div>
            <div className="text-xl font-semibold">{state.speed} WPM</div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">
              {t("practice.accuracyLabel", "准确率")}
            </div>
            <div className="text-xl font-semibold">
              {state.accuracy.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">
              {t("practice.errorsLabel", "错误次数")}
            </div>
            <div className="text-xl font-semibold">{state.errors}</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="my-btn-secondary"
            onClick={handleRestart}
          >
            {t("practice.practiceAgain", "重新练习")}
          </button>

          <button type="button" className="my-btn-primary" onClick={handleBack}>
            {t("practice.backToList", "返回文章列表")}
          </button>
        </div>
      </div>
    );
  }, [
    state.elapsedTime,
    state.speed,
    state.accuracy,
    state.errors,
    state.articleTitle,
    handleRestart,
    handleBack,
  ]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* 页面顶部的操作按钮 */}
      <div className="flex justify-center mb-6 space-x-4 w-full">
        <button
          type="button"
          onClick={handleOpenRecommendedDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {t("practice.articleLibrary", "文章库")}
        </button>
        <button
          type="button"
          onClick={handleViewHistory}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>{t("practice.personalArticles", "个人文章")}</span>
        </button>
        <button
          type="button"
          onClick={handleOpenUploadDialog}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {t("practice.uploadArticle", "上传文章")}
        </button>

        {/* 标点符号控制按钮 */}
        <button
          type="button"
          onClick={handleTogglePunctuation}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
            state.preprocessSettings.removePunctuation
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
          title={
            state.preprocessSettings.removePunctuation
              ? t("practice.showPunctuation", "显示标点符号")
              : t("practice.hidePunctuation", "隐藏标点符号")
          }
        >
          {state.preprocessSettings.removePunctuation ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>{t("practice.showPunctuation", "显示标点符号")}</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{t("practice.hidePunctuation", "隐藏标点符号")}</span>
            </>
          )}
        </button>

        {/* 声音控制按钮 */}
        <button
          type="button"
          onClick={() => setEnableSound(!enableSound)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
            enableSound
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
          title={
            enableSound
              ? t("practice.disableSound", "禁用声音")
              : t("practice.enableSound", "启用声音")
          }
        >
          {enableSound ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <span>{t("practice.disableSound", "禁用声音")}</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <span>{t("practice.enableSound", "启用声音")}</span>
            </>
          )}
        </button>
      </div>

      {/* 文章标题 */}
      <div className="w-full mb-4 text-center">
        <h3 className="text-l  text-gray-800">
          {t("practice.source", {
            title:
              state.articleTitle || t("practice.customArticle", "自定义文章"),
          })}
        </h3>
      </div>

      {!state.isFinished ? (
        <>
          <div className="w-full mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">
                {t("practice.wordProgress", {
                  current: state.currentWordIndex + 1,
                  total: state.words.length,
                })}
              </div>
              <div className="text-sm font-medium">
                {t("practice.speed", { speed: state.speed })}
              </div>
              <div className="text-sm font-medium">
                {t("practice.accuracy", {
                  accuracy: state.accuracy.toFixed(2),
                })}
              </div>
              <div className="text-sm font-medium">
                {t("practice.time", { time: Math.round(state.elapsedTime) })}
              </div>
            </div>

            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 文章内容显示区域 */}
          <div className="w-full bg-white p-6 rounded-lg shadow-md mb-4 max-h-[60vh] overflow-auto font-mono text-base">
            {renderFullArticle()}
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center space-x-4">
            {state.isTyping && !state.isPaused && (
              <button
                type="button"
                className="my-btn-secondary"
                onClick={handlePause}
              >
                {t("practice.pause", "暂停")}
              </button>
            )}

            {state.isTyping && state.isPaused && (
              <button
                type="button"
                className="my-btn-primary"
                onClick={handleResume}
              >
                {t("practice.resume", "继续")}
              </button>
            )}

            <button
              type="button"
              className="my-btn-secondary"
              onClick={handleRestart}
              disabled={!state.isTyping && !state.isFinished}
            >
              {t("practice.restart", "重新开始")}
            </button>

            <button
              type="button"
              className="my-btn-secondary"
              onClick={handleBack}
            >
              {t("practice.backToList", "返回文章列表")}
            </button>

            {state.isTyping && (
              <button
                type="button"
                className="my-btn-secondary"
                onClick={scrollToCurrentWord}
              >
                {t("practice.backToCurrentPosition", "返回当前位置")}
              </button>
            )}

            {/* 标点符号切换按钮 */}
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                state.preprocessSettings.removePunctuation
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
              onClick={handleTogglePunctuation}
              title={
                state.preprocessSettings.removePunctuation
                  ? t("practice.showPunctuation", "显示标点符号")
                  : t("practice.hidePunctuation", "隐藏标点符号")
              }
            >
              {state.preprocessSettings.removePunctuation ? (
                <>
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  {t("practice.showPunctuation", "显示标点符号")}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {t("practice.hidePunctuation", "隐藏标点符号")}
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        // 练习完成后显示结果
        <>
          {isCompleted && (
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                className="my-btn-primary"
                onClick={handleRestart}
              >
                {t("practice.practiceAgain", "重新练习")}
              </button>
              <button
                type="button"
                className="my-btn-secondary"
                onClick={handleBack}
              >
                {t("practice.backToList", "返回文章列表")}
              </button>
            </div>
          )}
          {renderResult()}
        </>
      )}

      {/* 推荐文章弹窗 */}
      <RecommendedArticlesDialog
        open={showRecommendedDialog}
        onOpenChange={setShowRecommendedDialog}
      />

      {/* 上传自定义文章弹窗 */}
      <UploadArticleDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </div>
  );
}
