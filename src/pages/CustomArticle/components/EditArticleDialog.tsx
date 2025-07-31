import { ArticleContext } from "../store";
import type { CustomArticle, PreprocessSettings } from "../store/type";
import { ArticleActionType } from "../store/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSaveArticle, useUpdateArticle } from "@/utils/db/article";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface EditArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: CustomArticle; // 要编辑的文章
  mode: "edit" | "create"; // 编辑模式或创建模式
}

const MAX_CHARS = 3000;

export default function EditArticleDialog({
  open,
  onOpenChange,
  article,
  mode,
}: EditArticleDialogProps) {
  const { state, dispatch } = useContext(ArticleContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [previewText, setPreviewText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [preprocessSettings, setPreprocessSettings] =
    useState<PreprocessSettings>({
      removePunctuation: false,
    });
  const [enableSound, setEnableSound] = useState(false);
  const [saveMode, setSaveMode] = useState<"overwrite" | "new">("new"); // 保存模式

  const saveArticle = useSaveArticle();
  const updateArticle = useUpdateArticle();

  // i18n
  const { t } = useTranslation("article");

  // 初始化表单数据
  useEffect(() => {
    if (article && open) {
      setTitle(article.title);
      setContent(article.content);
      setCharCount(article.content.length);
      // 可以根据需要设置其他字段
    }
  }, [article, open]);

  // 处理文本变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const count = text.length;

    setCharCount(count);
    setContent(text);

    if (count > MAX_CHARS) {
      setIsError(true);
      setErrorMessage(t("input.errorTooLong", { count, maxChars: MAX_CHARS }));
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  };

  // 处理标题变化
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 处理预处理设置变更
  const handleRemovePunctuationToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreprocessSettings({
      ...preprocessSettings,
      removePunctuation: e.target.checked,
    });
  };

  // 启用声音开关
  const handleEnableSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableSound(e.target.checked);
  };

  // 更新预览文本和单词数量
  useEffect(() => {
    if (currentStep !== 2) return;

    let processed = content;

    // 如果需要移除标点符号
    if (preprocessSettings.removePunctuation) {
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
  }, [content, preprocessSettings, currentStep]);

  // 下一步
  const handleNextStep = () => {
    if (title.trim().length === 0) {
      setIsError(true);
      setErrorMessage(t("input.errorNoTitle"));
      return;
    }

    if (content.trim().length === 0) {
      setIsError(true);
      setErrorMessage(t("input.errorNoContent"));
      return;
    }

    if (isError) {
      return;
    }

    setCurrentStep(2);
  };

  // 上一步
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // 生成唯一标题
  const generateUniqueTitle = (baseTitle: string): string => {
    const timestamp = new Date().toLocaleString();
    return `${baseTitle} (${timestamp})`;
  };

  // 保存文章
  const handleSaveArticle = async () => {
    try {
      let finalTitle = title.trim();

      if (saveMode === "new") {
        // 新建模式：生成唯一标题
        finalTitle = generateUniqueTitle(finalTitle);
      }

      if (mode === "edit" && article && saveMode === "overwrite") {
        // 覆盖模式：更新现有文章
        await updateArticle({
          ...article,
          title: finalTitle,
          content: content,
        });
      } else {
        // 新建模式：保存为新文章
        await saveArticle({
          title: finalTitle,
          content: content,
          createdAt: Date.now(),
          isOfficial: false,
        });
      }

      // 更新当前练习状态
      dispatch({ type: ArticleActionType.RESET_TYPING });
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TEXT,
        payload: content,
      });
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TITLE,
        payload: finalTitle,
      });
      dispatch({
        type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
        payload: preprocessSettings,
      });
      dispatch({
        type: ArticleActionType.SET_ENABLE_SOUND,
        payload: enableSound,
      });
      dispatch({ type: ArticleActionType.PROCESS_TEXT });
      dispatch({ type: ArticleActionType.SET_CURRENT_WORD_INDEX, payload: 0 });

      // 关闭弹窗
      onOpenChange(false);
      resetForm();

      // 直接进入练习步骤
      dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
    } catch (error) {
      console.error(t("upload.saveErrorLog"), error);
      alert(t("upload.saveError"));
    }
  };

  // 重置表单
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCharCount(0);
    setIsError(false);
    setErrorMessage("");
    setCurrentStep(1);
    setPreprocessSettings({
      removePunctuation: false,
    });
    setEnableSound(false);
    setSaveMode("new");
  };

  // 关闭弹窗时重置表单
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // 渲染步骤1：编辑文章
  const renderStep1 = () => (
    <>
      <div className="grid gap-4 py-4">
        {/* 标题输入 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right text-sm font-medium">
            {t("editor.articleTitle")}
          </label>
          <input
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="col-span-3 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            placeholder={t("editor.articleTitlePlaceholder")}
          />
        </div>

        {/* 内容输入 */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label
            htmlFor="content"
            className="text-right text-sm font-medium pt-2"
          >
            {t("editor.articleContent")}
          </label>
          <div className="col-span-3 space-y-2">
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              placeholder={t("editor.articleContentPlaceholder")}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {t("editor.charCount")}: {charCount}/{MAX_CHARS}
              </span>
              {isError && <span className="text-red-500">{errorMessage}</span>}
            </div>
          </div>
        </div>

        {/* 保存模式选择（仅在编辑模式下显示） */}
        {mode === "edit" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">
              {t("editor.saveMode")}
            </label>
            <div className="col-span-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="overwrite"
                  checked={saveMode === "overwrite"}
                  onChange={(e) =>
                    setSaveMode(e.target.value as "overwrite" | "new")
                  }
                  className="text-blue-600"
                />
                <span className="text-sm">{t("editor.overwriteMode")}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="new"
                  checked={saveMode === "new"}
                  onChange={(e) =>
                    setSaveMode(e.target.value as "overwrite" | "new")
                  }
                  className="text-blue-600"
                />
                <span className="text-sm">{t("editor.newMode")}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => handleOpenChange(false)}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleNextStep} disabled={isError}>
          {t("common.next")}
        </Button>
      </DialogFooter>
    </>
  );

  // 渲染步骤2：预览和设置
  const renderStep2 = () => (
    <>
      <div className="grid gap-4 py-4">
        {/* 预览区域 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("editor.preview")}</label>
          <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50 text-sm">
            <div className="whitespace-pre-wrap">{previewText}</div>
          </div>
          <div className="text-xs text-gray-500">
            {t("editor.wordCount")}: {wordCount}
          </div>
        </div>

        {/* 预处理设置 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.preprocessSettings")}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preprocessSettings.removePunctuation}
                onChange={handleRemovePunctuationToggle}
                className="text-blue-600"
              />
              <span className="text-sm">{t("editor.removePunctuation")}</span>
            </label>
          </div>
        </div>

        {/* 声音设置 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.soundSettings")}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enableSound}
                onChange={handleEnableSoundToggle}
                className="text-blue-600"
              />
              <span className="text-sm">{t("editor.enableSound")}</span>
            </label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handlePrevStep}>
          {t("common.previous")}
        </Button>
        <Button onClick={handleSaveArticle}>
          {mode === "edit"
            ? t("editor.saveChanges")
            : t("editor.createArticle")}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? t("editor.editArticle")
              : t("editor.createArticle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? t("editor.editArticleDesc")
              : t("editor.createArticleDesc")}
          </DialogDescription>
        </DialogHeader>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className="w-8 h-1 bg-gray-200"></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
        </div>

        {currentStep === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
}
