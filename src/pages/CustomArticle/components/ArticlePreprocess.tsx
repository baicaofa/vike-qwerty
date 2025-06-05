import { ArticleContext } from "../store";
import type { PreprocessSettings, SegmentationType } from "../store/type";
import { ArticleActionType } from "../store/type";
import { useContext, useEffect, useState } from "react";

export default function ArticlePreprocess() {
  const { state, dispatch } = useContext(ArticleContext);
  const [previewText, setPreviewText] = useState("");
  const [segmentCount, setSegmentCount] = useState(0);

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

  // 分段类型变更
  const handleSegmentationTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as SegmentationType;
    handleSettingChange("segmentationType", value);
  };

  // 自定义长度变更
  const handleCustomLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      handleSettingChange("customSegmentLength", value);
    }
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

  // 速度目标变更
  const handleSpeedTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === "" ? undefined : parseInt(e.target.value, 10);
    if (value === undefined || (!isNaN(value) && value > 0)) {
      handleSettingChange("speedTarget", value);
    }
  };

  // 专注模式开关
  const handleFocusModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingChange("focusMode", e.target.checked);
  };

  // 简化标点开关
  const handleSimplifyPunctuationToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleSettingChange("simplifyPunctuation", e.target.checked);
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

  // 更新预览文本
  useEffect(() => {
    // 模拟处理后的文本预览
    let processed = state.articleText;

    // 计算分段数量
    let segments: string[] = [];
    let customLength: number;

    switch (state.preprocessSettings.segmentationType) {
      case "sentence":
        segments = processed.split(/(?<=[.!?])\s+/);
        break;
      case "paragraph":
        segments = processed.split(/\n+/).filter((p) => p.trim().length > 0);
        break;
      case "custom": {
        customLength = state.preprocessSettings.customSegmentLength || 100;
        for (let i = 0; i < processed.length; i += customLength) {
          segments.push(processed.substring(i, i + customLength));
        }
        break;
      }
    }

    setSegmentCount(segments.length);

    // 如果启用重复练习，显示重复次数
    if (
      state.preprocessSettings.repetitionEnabled &&
      state.preprocessSettings.repetitionCount > 1
    ) {
      setSegmentCount(
        segments.length * state.preprocessSettings.repetitionCount
      );
    }

    // 如果需要简化标点
    if (state.preprocessSettings.simplifyPunctuation) {
      processed = processed
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[…]/g, "...")
        .replace(/[—–]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    }

    setPreviewText(processed);
  }, [state.articleText, state.preprocessSettings]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">文本预处理</h2>
      <p className="text-gray-600 mb-4">调整文本设置以获得最佳练习体验。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 左侧：设置选项 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="segmentation-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              分段方式
            </label>
            <select
              id="segmentation-type"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={state.preprocessSettings.segmentationType}
              onChange={handleSegmentationTypeChange}
              aria-label="选择分段方式"
              title="选择文本分段的方式"
            >
              <option value="paragraph">按段落</option>
              <option value="sentence">按句子</option>
              <option value="custom">自定义长度</option>
            </select>
          </div>

          {state.preprocessSettings.segmentationType === "custom" && (
            <div>
              <label
                htmlFor="custom-segment-length"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                自定义分段长度
              </label>
              <input
                id="custom-segment-length"
                type="number"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={state.preprocessSettings.customSegmentLength || 100}
                onChange={handleCustomLengthChange}
                min={1}
                aria-label="自定义分段长度"
                title="设置每个分段的字符数量"
                placeholder="输入分段长度"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              id="repetition-enabled"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={state.preprocessSettings.repetitionEnabled}
              onChange={handleRepetitionToggle}
              aria-label="启用重复练习"
              title="对每个段落重复练习"
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
                title="设置每个段落重复练习的次数"
                placeholder="输入重复次数"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="speed-target"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              目标速度 (WPM，可选)
            </label>
            <input
              id="speed-target"
              type="number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={state.preprocessSettings.speedTarget || ""}
              onChange={handleSpeedTargetChange}
              placeholder="例如：60"
              min={1}
              aria-label="目标速度"
              title="设置打字练习的目标速度（每分钟单词数）"
            />
          </div>

          <div className="flex items-center">
            <input
              id="focus-mode"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={state.preprocessSettings.focusMode}
              onChange={handleFocusModeToggle}
              aria-label="专注模式"
              title="启用专注模式，只显示当前段落"
            />
            <label
              htmlFor="focus-mode"
              className="ml-2 block text-sm text-gray-700"
            >
              专注模式（只显示当前段落）
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="simplify-punctuation"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={state.preprocessSettings.simplifyPunctuation}
              onChange={handleSimplifyPunctuationToggle}
              aria-label="简化标点符号"
              title="简化文本中的标点符号"
            />
            <label
              htmlFor="simplify-punctuation"
              className="ml-2 block text-sm text-gray-700"
            >
              简化标点符号
            </label>
          </div>
        </div>

        {/* 右侧：预览 */}
        <div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">预览</h3>
            <span className="text-xs text-gray-500">
              分段数量: {segmentCount}
            </span>
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
