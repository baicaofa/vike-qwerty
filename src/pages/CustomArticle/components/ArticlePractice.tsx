import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import useKeySounds from "@/hooks/useKeySounds";
import { isChineseSymbol, isLegal } from "@/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function ArticlePractice() {
  const { state, dispatch } = useContext(ArticleContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds();

  // 当前单词
  const currentWord = state.words[state.currentWordIndex];

  // 计算进度
  const progress = (state.currentWordIndex / (state.words.length || 1)) * 100;

  // 处理键盘输入
  const handleInput = useCallback(
    (char: string) => {
      if (!state.isTyping || state.isPaused || state.isFinished) return;

      const input = state.userInput + char;

      // 更新用户输入
      dispatch({
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
          dispatch({
            type: ArticleActionType.UPDATE_LETTER_STATE,
            payload: { index: state.userInput.length, state: "correct" },
          });
          playKeySound();

          // 检查是否完成当前单词
          if (input.length === currentWord.name.length) {
            // 完成单词
            setTimeout(() => {
              // 移动到下一个单词
              dispatch({ type: ArticleActionType.NEXT_WORD });

              // 如果是最后一个单词，完成练习
              if (state.currentWordIndex >= state.words.length - 1) {
                dispatch({ type: ArticleActionType.FINISH_TYPING });
                setIsCompleted(true);
                playHintSound();
              }
            }, 100);
          }
        } else {
          // 输入错误
          dispatch({
            type: ArticleActionType.UPDATE_LETTER_STATE,
            payload: { index: state.userInput.length, state: "wrong" },
          });
          dispatch({
            type: ArticleActionType.ADD_ERROR,
            payload: state.userInput.length,
          });
          playBeepSound();
        }
      }
    },
    [state, dispatch, currentWord, playKeySound, playBeepSound, playHintSound]
  );

  // 键盘事件处理
  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        const char = e.key;

        if (isChineseSymbol(char)) {
          alert("您正在使用输入法，请关闭输入法。");
          return;
        }

        if (
          !isCompleted &&
          e.key !== "Enter" &&
          (isLegal(e.key) || e.key === " ") &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          // 开始练习
          dispatch({
            type: ArticleActionType.START_TYPING,
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
    } else {
      // 如果已经在练习中，处理输入
      const onKeyDown = (e: KeyboardEvent) => {
        const char = e.key;

        if (isChineseSymbol(char)) {
          alert("您正在使用输入法，请关闭输入法。");
          return;
        }

        if (
          (isLegal(char) || char === " ") &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          handleInput(char);
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
  }, [state.isTyping, isCompleted, dispatch, handleInput]);

  // 错误后重置输入
  useEffect(() => {
    if (state.hasWrong) {
      const timer = setTimeout(() => {
        dispatch({
          type: ArticleActionType.RESET_WRONG_INPUT,
        });
      }, 300); // 300毫秒后重置

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.hasWrong, dispatch]);

  // 暂停练习
  const handlePause = () => {
    dispatch({ type: ArticleActionType.PAUSE_TYPING });
  };

  // 恢复练习
  const handleResume = () => {
    dispatch({ type: ArticleActionType.RESUME_TYPING });
  };

  // 重新开始
  const handleRestart = () => {
    dispatch({ type: ArticleActionType.RESET_TYPING });
    setIsCompleted(false);
  };

  // 返回上一步
  const handleBack = () => {
    dispatch({ type: ArticleActionType.RESET_TYPING });
    dispatch({ type: ArticleActionType.PREV_STEP });
  };

  // 播放当前单词发音
  const playCurrentWordSound = () => {
    if (currentWord && state.isTyping && !state.isPaused && state.enableSound) {
      // 使用浏览器的语音合成API
      const utterance = new SpeechSynthesisUtterance(currentWord.name);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // 自动播放当前单词发音
  useEffect(() => {
    if (
      state.isTyping &&
      !state.isPaused &&
      state.userInput.length === 0 &&
      state.enableSound
    ) {
      playCurrentWordSound();
    }
  }, [
    state.currentWordIndex,
    state.isTyping,
    state.isPaused,
    state.userInput.length,
    state.enableSound,
  ]);

  // 计时器
  useEffect(() => {
    let timerId: number;

    if (state.isTyping && !state.isPaused && !state.isFinished) {
      timerId = window.setInterval(() => {
        dispatch({ type: ArticleActionType.TICK_TIMER });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [state.isTyping, state.isPaused, state.isFinished, dispatch]);

  // 确保在组件卸载时清理所有键盘事件监听器
  useEffect(() => {
    return () => {
      if (keydownHandlerRef.current) {
        window.removeEventListener("keydown", keydownHandlerRef.current);
        keydownHandlerRef.current = null;
      }
    };
  }, []);

  // 渲染文章上下文，高亮当前单词
  const renderArticleContent = () => {
    if (!state.words.length) return null;

    // 获取当前单词在原文中的位置
    const currentPosition = currentWord?.startPosition || 0;

    // 创建一个包含前后文的片段
    let startPos = Math.max(0, currentPosition - 100);
    let endPos = Math.min(
      state.processedText.length,
      currentPosition + currentWord?.name.length + 100
    );

    // 调整以确保不会截断单词
    while (startPos > 0 && /\S/.test(state.processedText[startPos - 1])) {
      startPos--;
    }

    while (
      endPos < state.processedText.length &&
      /\S/.test(state.processedText[endPos])
    ) {
      endPos++;
    }

    // 将上下文分成三部分：前文、当前单词、后文
    const beforeWord = state.processedText.substring(startPos, currentPosition);
    const afterWord = state.processedText.substring(
      currentPosition + currentWord?.name.length,
      endPos
    );

    return (
      <div className="flex flex-col items-center">
        {/* 文章上下文 */}
        <div className="text-lg leading-relaxed mb-4">
          <span className="text-gray-500">{beforeWord}</span>
          <span className="bg-blue-100 font-bold relative">
            {/* 当前单词，带有输入状态显示 */}
            <span className="relative">
              {currentWord?.name.split("").map((char, index) => {
                // 已输入的字符
                if (index < state.userInput.length) {
                  // 错误的字符
                  if (state.letterStates[index] === "wrong") {
                    return (
                      <span key={index} className="bg-red-200 text-red-800">
                        {char}
                      </span>
                    );
                  }
                  // 正确的字符
                  return (
                    <span key={index} className="bg-green-100 text-green-800">
                      {char}
                    </span>
                  );
                }
                // 当前需要输入的字符
                if (index === state.userInput.length) {
                  return (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 animate-pulse"
                    >
                      {char}
                    </span>
                  );
                }
                // 未输入的字符
                return <span key={index}>{char}</span>;
              })}
            </span>
          </span>
          <span className="text-gray-500">{afterWord}</span>
        </div>

        {/* 提示信息 */}
        {!state.isTyping && (
          <div className="text-center text-gray-600 mb-4 animate-pulse">
            按任意键开始练习
          </div>
        )}
      </div>
    );
  };

  // 渲染结果
  const renderResult = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">练习完成！</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">时间</div>
            <div className="text-xl font-semibold">
              {Math.round(state.elapsedTime)}秒
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">速度</div>
            <div className="text-xl font-semibold">{state.speed} WPM</div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">准确率</div>
            <div className="text-xl font-semibold">
              {state.accuracy.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">错误数</div>
            <div className="text-xl font-semibold">{state.errors}</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="my-btn-secondary"
            onClick={handleRestart}
          >
            再次练习
          </button>

          <button type="button" className="my-btn-primary" onClick={handleBack}>
            返回设置
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {!state.isFinished ? (
        <>
          <div className="w-full mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">
                单词: {state.currentWordIndex + 1} / {state.words.length}
              </div>
              <div className="text-sm font-medium">速度: {state.speed} WPM</div>
              <div className="text-sm font-medium">
                准确率: {state.accuracy.toFixed(2)}%
              </div>
              <div className="text-sm font-medium">
                时间: {Math.round(state.elapsedTime)}秒
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
          <div className="w-full bg-white p-6 rounded-lg shadow-md mb-4">
            {renderArticleContent()}
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center space-x-4">
            {state.isTyping && !state.isPaused && (
              <button
                type="button"
                className="my-btn-secondary"
                onClick={handlePause}
              >
                暂停
              </button>
            )}

            {state.isTyping && state.isPaused && (
              <button
                type="button"
                className="my-btn-primary"
                onClick={handleResume}
              >
                继续
              </button>
            )}

            <button
              type="button"
              className="my-btn-secondary"
              onClick={handleRestart}
              disabled={!state.isTyping && !state.isFinished}
            >
              重新开始
            </button>

            <button
              type="button"
              className="my-btn-secondary"
              onClick={handleBack}
            >
              返回设置
            </button>
          </div>
        </>
      ) : (
        // 练习完成后显示结果
        renderResult()
      )}
    </div>
  );
}
