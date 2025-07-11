import { ArticleContext } from "../store";
import { ArticleActionType, PreprocessSettings } from "../store/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSaveArticle } from "@/utils/db/article";
import { useContext, useEffect, useState } from "react";

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
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [previewText, setPreviewText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [preprocessSettings, setPreprocessSettings] =
    useState<PreprocessSettings>({
      removePunctuation: false,
    });
  const [enableSound, setEnableSound] = useState(false);

  const saveArticle = useSaveArticle();

  // 处理文本变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const count = text.length;

    setCharCount(count);
    setContent(text);

    if (count > MAX_CHARS) {
      setIsError(true);
      setErrorMessage(`超出字符限制 (${count}/${MAX_CHARS})`);
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
    if (currentStep === 1) {
      if (!title.trim()) {
        setIsError(true);
        setErrorMessage("请输入文章标题");
        return;
      }

      if (!content.trim()) {
        setIsError(true);
        setErrorMessage("请输入文章内容");
        return;
      }

      if (content.length > MAX_CHARS) {
        setIsError(true);
        setErrorMessage(
          `文章内容超出字符限制 (${content.length}/${MAX_CHARS})`
        );
        return;
      }

      setCurrentStep(2);
      setIsError(false);
      setErrorMessage("");
    }
  };

  // 上一步
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
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

      // 设置预处理设置
      dispatch({
        type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
        payload: preprocessSettings,
      });

      // 设置声音设置
      dispatch({
        type: ArticleActionType.SET_ENABLE_SOUND,
        payload: enableSound,
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
      console.error("保存文章失败:", error);
      alert("保存文章失败，请重试。");
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
  };

  // 关闭弹窗时重置表单
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // 渲染步骤1：输入文章
  const renderStep1 = () => (
    <>
      <div className="grid gap-4 py-4">
        {/* 标题输入 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right text-sm font-medium">
            文章标题
          </label>
          <input
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="col-span-3 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            placeholder="请输入文章标题"
          />
        </div>

        {/* 内容输入 */}
        <div className="grid grid-cols-4 items-start gap-4">
          <div className="text-right">
            <label htmlFor="content" className="text-sm font-medium">
              文章内容
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
            placeholder="请输入或粘贴文章内容..."
            maxLength={MAX_CHARS + 100} // 允许稍微超出以便显示错误信息
          ></textarea>
        </div>

        {/* 错误信息 */}
        {isError && (
          <div className="text-red-500 text-sm col-start-2 col-span-3">
            {errorMessage}
          </div>
        )}
      </div>

      <DialogFooter>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2"
        >
          重置
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={isError || !title.trim() || !content.trim()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2"
        >
          下一步
        </button>
      </DialogFooter>
    </>
  );

  // 渲染步骤2：预处理设置
  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 左侧：设置选项 */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remove-punctuation"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={preprocessSettings.removePunctuation}
                onChange={handleRemovePunctuationToggle}
                aria-label="移除标点符号"
                title="从文本中移除所有标点符号"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remove-punctuation"
                className="font-medium text-gray-700"
              >
                移除标点符号
              </label>
              <p className="text-gray-500">
                移除文本中的标点符号，专注于单词训练，提高打字效率
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable-sound"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={enableSound}
                onChange={handleEnableSoundToggle}
                aria-label="播放单词读音"
                title="练习时播放当前单词的读音"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="enable-sound"
                className="font-medium text-gray-700"
              >
                播放单词读音
              </label>
              <p className="text-gray-500">
                默认关闭，练习较快不建议开启，读音会加载不及时
              </p>
            </div>
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

      <DialogFooter className="mt-6">
        <div className="flex justify-between w-full">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2"
            onClick={handlePrevStep}
          >
            上一步
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleStartPractice}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2"
            >
              开始练习
            </button>
          </div>
        </div>
      </DialogFooter>
    </>
  );

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="flex justify-center mb-4">
      <div className="flex items-center">
        {/* 第一步 */}
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            currentStep === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          1
        </div>
        <div
          className={`w-12 h-1 ${
            currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>

        {/* 第二步 */}
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>上传自定义文章</DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? `输入您想要练习的文章标题和内容，最多${MAX_CHARS}个字符`
              : "调整文本设置以获得最佳练习体验"}
          </DialogDescription>
        </DialogHeader>

        {renderStepIndicator()}

        {currentStep === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
}
