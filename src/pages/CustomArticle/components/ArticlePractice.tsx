import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import { useSaveArticle } from "@/utils/db/article";
import { useContext, useEffect, useRef, useState } from "react";

export default function ArticlePractice() {
  const { state, dispatch } = useContext(ArticleContext);
  const [currentText, setCurrentText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const saveArticle = useSaveArticle();

  // 当前段落
  const currentSegment = state.segments[state.currentSegmentIndex];

  // 计算进度
  const progress =
    (state.currentSegmentIndex / (state.segments.length || 1)) * 100;

  // 处理键盘输入
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!state.isTyping || state.isPaused || state.isFinished) return;

    const input = e.target.value;
    setTypedText(input);

    // 更新用户输入
    dispatch({
      type: ArticleActionType.UPDATE_USER_INPUT,
      payload: input,
    });

    // 检查是否完成当前段落
    if (currentSegment && input.length >= currentSegment.text.length) {
      // 检查最后一个字符是否正确
      if (
        input[input.length - 1] ===
        currentSegment.text[currentSegment.text.length - 1]
      ) {
        // 移动到下一个段落
        dispatch({ type: ArticleActionType.NEXT_SEGMENT });
        setTypedText("");

        // 如果是最后一个段落，完成练习
        if (state.currentSegmentIndex >= state.segments.length - 1) {
          dispatch({ type: ArticleActionType.FINISH_TYPING });
          setIsCompleted(true);
        }
      }
    }
  };

  // 开始练习
  const handleStart = () => {
    dispatch({ type: ArticleActionType.START_TYPING });
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // 暂停练习
  const handlePause = () => {
    dispatch({ type: ArticleActionType.PAUSE_TYPING });
  };

  // 恢复练习
  const handleResume = () => {
    dispatch({ type: ArticleActionType.RESUME_TYPING });
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // 重新开始
  const handleRestart = () => {
    dispatch({ type: ArticleActionType.RESET_TYPING });
    setTypedText("");
    setIsCompleted(false);
  };

  // 返回上一步
  const handleBack = () => {
    dispatch({ type: ArticleActionType.RESET_TYPING });
    dispatch({ type: ArticleActionType.PREV_STEP });
  };

  // 保存文章
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await saveArticle({
        title: state.articleText.substring(0, 30) + "...",
        content: state.processedText,
        createdAt: Date.now(),
      });

      dispatch({ type: ArticleActionType.SET_SAVED, payload: true });
      alert("文章已保存成功！");
    } catch (error) {
      console.error("保存文章失败:", error);
      alert("保存文章失败，请重试。");
    } finally {
      setIsSaving(false);
    }
  };

  // 更新当前文本
  useEffect(() => {
    if (currentSegment) {
      setCurrentText(currentSegment.text);
    }
  }, [currentSegment]);

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

  // 渲染字符，高亮当前位置和错误
  const renderText = () => {
    if (!currentText) return null;

    return (
      <div className="text-lg font-mono leading-relaxed">
        {currentText.split("").map((char, index) => {
          // 已输入的字符
          if (index < typedText.length) {
            // 错误的字符
            if (typedText[index] !== char) {
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
          if (index === typedText.length) {
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

          <button
            type="button"
            className="my-btn-primary"
            onClick={handleSave}
            disabled={isSaving || state.isSaved}
          >
            {isSaving ? "保存中..." : state.isSaved ? "已保存" : "保存文章"}
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
                段落: {state.currentSegmentIndex + 1} / {state.segments.length}
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

          {/* 文本显示区域 */}
          <div className="w-full bg-white p-6 rounded-lg shadow-md mb-4">
            {/* 当前段落 */}
            <div className="mb-4">
              {state.preprocessSettings.focusMode ? (
                // 专注模式：只显示当前段落
                renderText()
              ) : (
                // 普通模式：显示前后段落
                <>
                  {/* 前一个段落（灰色） */}
                  {state.currentSegmentIndex > 0 && (
                    <div className="text-gray-400 mb-4">
                      {state.segments[state.currentSegmentIndex - 1]?.text}
                    </div>
                  )}

                  {/* 当前段落（高亮） */}
                  {renderText()}

                  {/* 下一个段落（灰色） */}
                  {state.currentSegmentIndex < state.segments.length - 1 && (
                    <div className="text-gray-400 mt-4">
                      {state.segments[state.currentSegmentIndex + 1]?.text}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="w-full mb-4">
            <input
              ref={textInputRef}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typedText}
              onChange={handleInput}
              disabled={!state.isTyping || state.isPaused || state.isFinished}
              placeholder={
                state.isTyping ? "开始输入..." : '点击"开始"按钮开始练习'
              }
              aria-label="打字输入区"
            />
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center space-x-4">
            {!state.isTyping && !state.isFinished && (
              <button
                type="button"
                className="my-btn-primary"
                onClick={handleStart}
              >
                开始
              </button>
            )}

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
