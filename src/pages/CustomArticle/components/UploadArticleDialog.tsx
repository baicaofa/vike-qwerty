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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaveArticle } from "@/utils/db/article";
import {
  getFileSizeDescription,
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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 字符统计组件
const CharCounter = ({
  current: count,
  max: maxChars,
}: {
  current: number;
  max: number;
}) => {
  const { t } = useTranslation("article");
  const isNearLimit = count > maxChars * 0.8;
  const isOverLimit = count > maxChars;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`${
          isOverLimit
            ? "text-red-500"
            : isNearLimit
            ? "text-orange-500"
            : "text-gray-500"
        }`}
      >
        {count}/{maxChars}
      </span>
      {isOverLimit && (
        <span className="text-red-500 font-medium">
          {t("upload.overLimit")}
        </span>
      )}
      {isNearLimit && !isOverLimit && (
        <span className="text-orange-500">{t("upload.nearLimit")}</span>
      )}
    </div>
  );
};

// 文件上传组件
const FileUploadSection = ({
  onFileUpload,
  onTitleChange,
  onContentChange,
  onError,
  title,
  content,
  isUploading,
  uploadError,
}: {
  onFileUpload: (title: string, content: string) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onError: (error: string) => void;
  title: string;
  content: string;
  isUploading: boolean;
  uploadError: string;
}) => {
  const { t } = useTranslation("article");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!validateWordFile(file)) {
      onError(t("upload.invalidFileType"));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError(
        `文件大小超过限制，最大支持 ${getFileSizeDescription(MAX_FILE_SIZE)}`
      );
      return;
    }

    try {
      const result = await parseWordDocument(file);
      if (result.success) {
        onTitleChange(result.title || "");
        onContentChange(result.content);
        onError(""); // 清除错误
      } else {
        onError(result.error || t("upload.parseError"));
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      onError(t("upload.uploadError"));
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await handleFileUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await handleFileUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-700">
          {t("upload.selectWordFile")}
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.doc"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>

            <div className="space-y-2">
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
                  t("upload.selectFile")
                )}
              </button>

              <p className="text-sm text-gray-500">
                {t("upload.dragDropText")}
              </p>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>{t("upload.supportedFormatsText")}</p>
              <p>
                {t("upload.fileSizeLimit", {
                  size: getFileSizeDescription(MAX_FILE_SIZE),
                })}
              </p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {getFileSizeDescription(selectedFile.size)}
              </p>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-red-700">{uploadError}</span>
          </div>
        )}
      </div>

      {/* 文章标题编辑 */}
      {content && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("upload.articleTitle")}
          </label>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("upload.articleTitlePlaceholder")}
          />
        </div>
      )}

      {/* 内容预览 */}
      {content && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              {t("upload.contentPreview")}
            </label>
            <CharCounter current={content.length} max={MAX_CHARS} />
          </div>
          <div className="border border-gray-300 rounded-md p-4 h-48 overflow-auto bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap text-gray-700">
              {content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// 文本输入组件
const TextInputSection = ({
  onTitleChange,
  onContentChange,
  title,
  content,
}: {
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  title: string;
  content: string;
}) => {
  const { t } = useTranslation("article");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onContentChange(text);
  };

  const handleClearText = () => {
    onContentChange("");
  };

  return (
    <div className="space-y-6">
      {/* 文章标题 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t("upload.articleTitle")}
        </label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t("upload.articleTitlePlaceholder")}
        />
      </div>

      {/* 文本输入区域 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {t("upload.articleContent")}
          </label>
          <div className="flex items-center gap-3">
            <CharCounter current={content.length} max={MAX_CHARS} />
            {content && (
              <button
                type="button"
                onClick={handleClearText}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {t("upload.clearText")}
              </button>
            )}
          </div>
        </div>

        <textarea
          value={content}
          onChange={handleContentChange}
          className={`w-full min-h-[200px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            content.length > MAX_CHARS ? "border-red-300" : "border-gray-300"
          }`}
          placeholder={t("upload.articleContentPlaceholder")}
          maxLength={MAX_CHARS + 100} // 允许稍微超出以便显示错误信息
        />

        {content.length > MAX_CHARS && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {t("upload.charLimitExceeded", {
              count: content.length,
              maxChars: MAX_CHARS,
            })}
          </div>
        )}
      </div>

      {/* 实时预览 */}
      {content && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("upload.contentPreviewLabel")}
          </label>
          <div className="border border-gray-300 rounded-md p-4 h-48 overflow-auto bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap text-gray-700">
              {content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default function UploadArticleDialog({
  open,
  onOpenChange,
}: UploadArticleDialogProps) {
  const { state, dispatch } = useContext(ArticleContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("file");

  const saveArticle = useSaveArticle();
  const { t } = useTranslation("article");

  // 处理文件上传
  const handleFileUpload = async (title: string, content: string) => {
    setIsUploading(true);
    setUploadError("");

    // 模拟上传延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setTitle(title);
    setContent(content);
    setIsUploading(false);
  };

  // 处理错误
  const handleError = (error: string) => {
    setUploadError(error);
  };

  // 处理标题变化
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

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
    setIsUploading(false);
    setUploadError("");
    setActiveTab("file");
  };

  // 关闭弹窗时重置表单
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // 验证表单
  const isFormValid =
    title.trim() && content.trim() && content.length <= MAX_CHARS;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("upload.title")}</DialogTitle>
          <DialogDescription>{t("upload.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="flex items-center gap-2">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {t("upload.fileUploadTab")}
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t("upload.textInputTab")}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="file" className="h-full">
                <FileUploadSection
                  onFileUpload={handleFileUpload}
                  onTitleChange={handleTitleChange}
                  onContentChange={handleContentChange}
                  onError={handleError}
                  title={title}
                  content={content}
                  isUploading={isUploading}
                  uploadError={uploadError}
                />
              </TabsContent>

              <TabsContent value="text" className="h-full">
                <TextInputSection
                  onTitleChange={handleTitleChange}
                  onContentChange={handleContentChange}
                  title={title}
                  content={content}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="mt-6">
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
            disabled={!isFormValid}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2"
          >
            {t("upload.startPractice")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
