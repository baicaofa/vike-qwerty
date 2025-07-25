import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_CHARS = 3000;

export default function ArticleInput() {
  const { state, dispatch } = useContext(ArticleContext);
  const [charCount, setCharCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 使用i18n翻译
  const { t } = useTranslation("article");

  // 初始化时计算字符数
  useEffect(() => {
    setCharCount(state.articleText.length);
  }, [state.articleText]);

  // 处理文本变化
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const count = text.length;

    setCharCount(count);

    if (count > MAX_CHARS) {
      setIsError(true);
      setErrorMessage(t("input.errorTooLong", { count, maxChars: MAX_CHARS }));
      return;
    } else {
      setIsError(false);
      setErrorMessage("");
    }

    dispatch({
      type: ArticleActionType.SET_ARTICLE_TEXT,
      payload: text,
    });
  };

  // 清空文本
  const handleClear = () => {
    dispatch({
      type: ArticleActionType.SET_ARTICLE_TEXT,
      payload: "",
    });
    setCharCount(0);
    setIsError(false);
    setErrorMessage("");
  };

  // 进入下一步
  const handleNext = () => {
    if (state.articleText.trim().length === 0) {
      setIsError(true);
      setErrorMessage(t("input.errorEmpty"));
      return;
    }

    dispatch({ type: ArticleActionType.NEXT_STEP });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("input.title")}</h2>
      <p className="text-gray-600 mb-4">
        {t("input.description", { maxChars: MAX_CHARS })}
      </p>

      <div className="w-full mb-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="article-text"
            className="text-sm font-medium text-gray-700"
          >
            {t("input.label")}
          </label>
          <span
            className={`text-sm ${isError ? "text-red-500" : "text-gray-500"}`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>

        <textarea
          id="article-text"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-64 ${
            isError ? "border-red-500" : ""
          }`}
          placeholder={t("input.placeholder")}
          value={state.articleText}
          onChange={handleTextChange}
          maxLength={MAX_CHARS}
        ></textarea>

        {isError && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
      </div>

      <div className="flex justify-end space-x-4 w-full mt-4">
        <button
          type="button"
          className="my-btn-secondary"
          onClick={handleClear}
        >
          {t("input.clear")}
        </button>
        <button
          type="button"
          className="my-btn-primary hover:bg-blue-600"
          onClick={handleNext}
          disabled={isError || state.articleText.trim().length === 0}
        >
          {t("input.next")}
        </button>
      </div>
    </div>
  );
}
