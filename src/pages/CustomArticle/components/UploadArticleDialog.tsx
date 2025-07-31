import { ArticleContext } from "../store";
import type { PreprocessSettings } from "../store/type";
import { ArticleActionType } from "../store/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSaveArticle } from "@/utils/db/article";
import {
  parseWordDocument,
  validateWordFile,
} from "@/utils/wordDocumentParser";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UploadArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_CHARS = 3000;

export default function UploadArticleDialog({
  open,
  onOpenChange,
}: UploadArticleDialogProps) {
  const { state, dispatch } = useContext(ArticleContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveArticle = useSaveArticle();
  // i18n
  const { t } = useTranslation("article");

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

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!validateWordFile(file)) {
      setUploadError(t("upload.invalidFileType"));
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const result = await parseWordDocument(file);

      if (result.success) {
        setTitle(result.title || "");
        setContent(result.content);
        setCharCount(result.content.length);
        setIsError(false);
        setErrorMessage("");
      } else {
        setUploadError(result.error || t("upload.parseError"));
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      setUploadError(t("upload.uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  // 触发文件选择
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 更新预览文本和单词数量
  useEffect(() => {
    setPreviewText(content);

    // 计算单词数量
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(wordCount);
  }, [content]);

  // 开始练习并自动保存文章
  const handleStartPractice = async () => {
    try {
      // 自动保存文章到数据库
      await saveArticle({
        title: title.trim(),
        content: content,
        createdAt: Date.now(),
        isOfficial: false,
      });

      // 先重置练习状态
      dispatch({ type: ArticleActionType.RESET_TYPING });

      // 设置文章内容
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TEXT,
        payload: content,
      });

      // 设置文章标题
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TITLE,
        payload: title.trim(),
      });

      // 处理文本
      dispatch({ type: ArticleActionType.PROCESS_TEXT });

      // 重置当前单词索引，确保从第一个单词开始
      dispatch({ type: ArticleActionType.SET_CURRENT_WORD_INDEX, payload: 0 });

      // 关闭弹窗
      onOpenChange(false);

      // 重置表单
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

    setIsUploading(false);
    setUploadError("");
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 关闭弹窗时重置表单
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // 渲染主界面：输入文章和设置
  const renderMainContent = () => (
    <>
      <div className="grid gap-4 py-4">
        {/* 文件上传区域 */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label className="text-right text-sm font-medium pt-2">
            {t("upload.uploadFile")}
          </label>
          <div className="col-span-3 space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileSelect}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("upload.uploading")}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {t("upload.selectWordFile")}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {t("upload.supportedFormats")}: .docx, .doc (最大 10MB)
              </p>
            </div>
            {uploadError && (
              <div className="text-red-500 text-sm">{uploadError}</div>
            )}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="col-span-4 border-t border-gray-200 my-4"></div>

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
          <div className="text-right">
            <label htmlFor="content" className="text-sm font-medium">
              {t("editor.articleContent")}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {charCount}/{MAX_CHARS}
            </p>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className={`col-span-3 flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 ${
              isError ? "border-red-500" : ""
            }`}
            placeholder={t("editor.articleContentPlaceholder")}
            maxLength={MAX_CHARS + 100} // 允许稍微超出以便显示错误信息
          ></textarea>
        </div>

        {/* 错误信息 */}
        {isError && (
          <div className="text-red-500 text-sm col-start-2 col-span-3">
            {errorMessage}
          </div>
        )}

        {/* 分隔线 */}
        <div className="col-span-4 border-t border-gray-200 my-4"></div>

        {/* 预览 */}
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

      <DialogFooter>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2"
        >
          {t("common:buttons.reset")}
        </button>
        <button
          type="button"
          onClick={handleStartPractice}
          disabled={isError || !title.trim() || !content.trim()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2"
        >
          {t("upload.startPractice")}
        </button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("upload.title")}</DialogTitle>
          <DialogDescription>{t("upload.description")}</DialogDescription>
        </DialogHeader>

        {renderMainContent()}
      </DialogContent>
    </Dialog>
  );
}
