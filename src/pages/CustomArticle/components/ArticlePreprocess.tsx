import { ArticleContext } from "../store";
import type { PreprocessSettings } from "../store/type";
import { ArticleActionType } from "../store/type";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ArticlePreprocess() {
  const { state, dispatch } = useContext(ArticleContext);
  const [previewText, setPreviewText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // 使用i18n翻译
  const { t } = useTranslation("article");

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

  // 移除标点符号开关
  const handleRemovePunctuationToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleSettingChange("removePunctuation", e.target.checked);
  };

  // 启用声音开关
  const handleEnableSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ArticleActionType.SET_ENABLE_SOUND,
      payload: e.target.checked,
    });
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
  }, [state.articleText, state.preprocessSettings]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("preprocess.title")}</h2>
      <p className="text-gray-600 mb-4">{t("preprocess.description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 左侧：设置选项 */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remove-punctuation"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={state.preprocessSettings.removePunctuation}
                onChange={handleRemovePunctuationToggle}
                aria-label={t("preprocess.removePunctuation")}
                title={t("preprocess.removePunctuationDesc")}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remove-punctuation"
                className="font-medium text-gray-700"
              >
                {t("preprocess.removePunctuation")}
              </label>
              <p className="text-gray-500">
                {t("preprocess.removePunctuationDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable-sound"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={state.enableSound}
                onChange={handleEnableSoundToggle}
                aria-label={t("preprocess.enableSound")}
                title={t("preprocess.enableSoundDesc")}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="enable-sound"
                className="font-medium text-gray-700"
              >
                {t("preprocess.enableSound")}
              </label>
              <p className="text-gray-500">{t("preprocess.enableSoundDesc")}</p>
            </div>
          </div>
        </div>

        {/* 右侧：预览 */}
        <div>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              {t("preprocess.preview")}
            </h3>
            <span className="text-xs text-gray-500">
              {t("preprocess.wordCount", { count: wordCount })}
            </span>
          </div>
          <div className="border rounded-md p-4 h-64 overflow-auto bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap">{previewText}</pre>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full mt-6">
        <button type="button" className="my-btn-secondary" onClick={handleBack}>
          {t("preprocess.back")}
        </button>

        <button
          type="button"
          className="my-btn-primary hover:bg-blue-600"
          onClick={handleNext}
        >
          {t("preprocess.startPractice")}
        </button>
      </div>
    </div>
  );
}
