import { ArticleContext } from "../store";
import type { PreprocessSettings } from "../store/type";
import { ArticleActionType } from "../store/type";
import { useContext, useEffect, useState } from "react";

export default function ArticlePreprocess() {
  const { state, dispatch } = useContext(ArticleContext);
  const [previewText, setPreviewText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // 处理设置变更
  const handleSettingChange = <K extends keyof PreprocessSettings>(
    key: K,
    value: PreprocessSettings[K]
  ) => {
    dispatch({
      type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
      payload: { [key]: value },
    });
  };

  // 重复练习开关
  const handleRepetitionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange("repetitionEnabled", e.target.checked);
  };

  // 重复次数变更
  const handleRepetitionCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      handleSettingChange("repetitionCount", value);
    }
  };

  // 移除标点符号开关
  const handleRemovePunctuationToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleSettingChange("removePunctuation", e.target.checked);
  };

  // 返回上一步
  const handleBack = () => {
    dispatch({ type: ArticleActionType.PREV_STEP });
  };

  // 进入下一步
  const handleNext = () => {
    // 先处理文本
    dispatch({ type: ArticleActionType.PROCESS_TEXT });
    // 进入下一步
    dispatch({ type: ArticleActionType.NEXT_STEP });
  };

  // 更新预览文本和单词数量
  useEffect(() => {
    let processed = state.articleText;

    // 如果需要移除标点符号
    if (state.preprocessSettings.removePunctuation) {
      processed = processed
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    setPreviewText(processed);

    // 计算单词数量
    const wordCount = processed
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(wordCount);

    // 如果启用重复练习，显示重复次数
    if (
      state.preprocessSettings.repetitionEnabled &&
      state.preprocessSettings.repetitionCount > 1
    ) {
      setWordCount(wordCount * state.preprocessSettings.repetitionCount);
    }
  }, [state.articleText, state.preprocessSettings]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">文本预处理</h2>
      <p className="text-gray-600 mb-4">调整文本设置以获得最佳练习体验。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 左侧：设置选项 */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="repetition-enabled"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={state.preprocessSettings.repetitionEnabled}
              onChange={handleRepetitionToggle}
              aria-label="启用重复练习"
              title="对每个单词重复练习"
            />
            <label
              htmlFor="repetition-enabled"
              className="ml-2 block text-sm text-gray-700"
            >
              启用重复练习
            </label>
          </div>

          {state.preprocessSettings.repetitionEnabled && (
            <div>
              <label
                htmlFor="repetition-count"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                重复次数
              </label>
              <input
                id="repetition-count"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={state.preprocessSettings.repetitionCount}
                onChange={handleRepetitionCountChange}
                min={1}
                max={10}
                aria-label="重复次数"
                title="设置每个单词重复练习的次数"
                placeholder="输入重复次数"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              id="remove-punctuation"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={state.preprocessSettings.removePunctuation}
              onChange={handleRemovePunctuationToggle}
              aria-label="移除标点符号"
              title="从文本中移除所有标点符号"
            />
            <label
              htmlFor="remove-punctuation"
              className="ml-2 block text-sm text-gray-700"
            >
              移除标点符号
            </label>
          </div>
        </div>

        {/* 右侧：预览 */}
        <div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">预览</h3>
            <span className="text-xs text-gray-500">单词数量: {wordCount}</span>
          </div>
          <div className="border rounded-md p-4 h-64 overflow-auto bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap">{previewText}</pre>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full mt-6">
        <button type="button" className="my-btn-secondary" onClick={handleBack}>
          返回
        </button>
        <button type="button" className="my-btn-primary" onClick={handleNext}>
          开始练习
        </button>
      </div>
    </div>
  );
}
