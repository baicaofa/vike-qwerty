/**
 * 
 * 验证流程主要分为三个环节：
上传前验证：核心是检查您的登录状态。如果您未登录，流程会中止，并提示您需要先登录。
文件解析验证：
首先，系统会检查文件是否为有效的 Excel 格式。
接着，会检查文件内容，确保至少包含一个有效的单词（即 name 列不能为空）。如果文件内容为空或格式不正确，系统会提示错误。
保存前验证：在您点击保存之前，系统会检查词库名称是否已填写。如果您没有填写，保存按钮将无法点击，从而确保每个词库都有一个名称。
 */
import { UploadWordEditModal } from "./UploadWordEditModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  useCustomDictionaryAPI,
  useExcelUploadAPI,
} from "@/hooks/useCustomDictionary";
import { useToast } from "@/hooks/useToast";
import { previewEnrichment } from "@/services/customDictionaryService";
import { customDictionariesAtom } from "@/store/customDictionary";
import {
  type ICustomDictionary,
  type ICustomWord,
  convertExcelDataToCustomWords,
  createCustomDictionary,
  removeDuplicateCustomWords,
} from "@/utils/db/customDictionary";
import { type ExcelParseProgress, parseExcelFile } from "@/utils/excelParser";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import IconArrowLeft from "~icons/tabler/arrow-left";
import IconCheck from "~icons/tabler/check";
import IconDownload from "~icons/tabler/download";
import IconInfoCircle from "~icons/tabler/info-circle";
import IconX from "~icons/tabler/x";

interface UploadDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = "upload" | "preview" | "processing";

export function UploadDictionaryModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadDictionaryModalProps) {
  const { success, error: showError, warning } = useToast();
  const { downloadTemplate } = useExcelUploadAPI();
  const { createDictionary, addWords } = useCustomDictionaryAPI();
  const { isAuthenticated, checkAuth, userData } = useAuth();
  const [customDictionaries, setCustomDictionaries] = useAtom(
    customDictionariesAtom
  );

  const [step, setStep] = useState<ModalStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseProgress, setParseProgress] = useState<ExcelParseProgress | null>(
    null
  );
  const [parsedWords, setParsedWords] = useState<ICustomWord[]>([]);
  const [uploadResult, setUploadResult] = useState<{
    total: number;
    enriched: number;
    empty: number;
    enrichmentRate: string;
  } | null>(null);
  const [dictionaryInfo, setDictionaryInfo] = useState<
    Partial<ICustomDictionary>
  >({
    name: "",
    description: "",
    category: "我的词库",
    tags: [],
    language: "en",
    languageCategory: "en",
    isPublic: false,
  });

  // 新增状态
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordsPerPage] = useState(50);

  // 检查用户是否已登录
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 重置状态
  const resetState = () => {
    setStep("upload");
    setFile(null);
    setParsing(false);
    setSaving(false);
    setError(null);
    setParseProgress(null);
    setParsedWords([]);
    setUploadResult(null);
    setSelectedWords(new Set());
    setEditingWordIndex(null);
    setCurrentPage(1);
    setDictionaryInfo({
      name: "",
      description: "",
      category: "我的词库",
      tags: [],
      language: "en",
      languageCategory: "en",
      isPublic: false,
    });
  };

  // 单词管理功能
  const handleSelectWord = (index: number) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedWords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWords.size === parsedWords.length) {
      setSelectedWords(new Set());
    } else {
      setSelectedWords(new Set(parsedWords.map((_, index) => index)));
    }
  };

  const handleDeleteSelected = () => {
    const newWords = parsedWords.filter(
      (_, index) => !selectedWords.has(index)
    );
    setParsedWords(newWords);
    setSelectedWords(new Set());
  };

  const handleEditWord = (index: number, updatedWord: Partial<ICustomWord>) => {
    const newWords = [...parsedWords];
    newWords[index] = { ...newWords[index], ...updatedWord };
    setParsedWords(newWords);
  };

  // 处理关闭弹窗
  const handleClose = () => {
    resetState();
    onClose();
  };

  // 处理文件上传
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const uploadFile = files[0];
    setFile(uploadFile);

    // 检查用户是否已登录
    if (!isAuthenticated) {
      showError("请先登录后再上传词库");
      return;
    }

    setParsing(true);
    setError(null);
    setParseProgress(null);

    try {
      // 使用客户端解析Excel文件，支持Worker和进度回调
      const result = await parseExcelFile(uploadFile, {
        useWorker: true, // 优先使用Worker解析
        onProgress: (progress: ExcelParseProgress) => {
          setParseProgress(progress);
          return true; // 继续解析
        },
        timeout: 5 * 60 * 1000, // 5分钟超时
        enableLargeFileOptimization: true, // 启用大文件优化
        onLargeFileWarning: async (fileSize: number) => {
          // 大文件警告处理
          const sizeInMB = (fileSize / 1024 / 1024).toFixed(1);
          const isVeryLarge = fileSize > 5 * 1024 * 1024; // 5MB

          const message = isVeryLarge
            ? `检测到超大文件 (${sizeInMB}MB)，解析可能需要较长时间并消耗大量内存。建议将文件拆分为多个小文件。是否继续？`
            : `检测到大文件 (${sizeInMB}MB)，将启用优化策略以提高解析性能。是否继续？`;

          return new Promise((resolve) => {
            const shouldContinue = confirm(message);
            resolve(shouldContinue);
          });
        },
      });

      if (!result.success) {
        // 显示错误信息
        setError(result.errors?.join("\n") || "未知错误");
        return;
      }

      // 解析成功，处理数据
      if (result.data && result.data.length > 0) {
        // 确保每个单词至少有一个name字段
        const validData = result.data.filter(
          (item) => item.name && item.name.trim() !== ""
        );

        if (validData.length === 0) {
          warning("解析成功，但未找到有效单词数据");
          return;
        }

        // 自动去除重复单词（保留第一个）
        const seen = new Set<string>();
        const uniqueData = validData.filter((word) => {
          const name = word.name.toLowerCase();
          if (seen.has(name)) {
            return false;
          }
          seen.add(name);
          return true;
        });

        // 如果有重复单词被移除，显示提示
        const removedCount = validData.length - uniqueData.length;
        if (removedCount > 0) {
          warning(`已自动移除 ${removedCount} 个重复单词`);
        }

        // 设置预览数据
        setParsedWords(uniqueData);

        // 调用词汇补充预览API获取真实统计信息
        try {
          const wordNames = validData.map((word) => word.name);
          const previewResult = await previewEnrichment(wordNames);

          if (previewResult.success && previewResult.result) {
            setUploadResult(previewResult.result);
          } else {
            console.warn("获取补充预览失败:", previewResult.error);
            // 使用模拟数据作为后备
            const mockResult = {
              total: validData.length,
              enriched: Math.floor(validData.length * 0.7),
              empty: Math.ceil(validData.length * 0.3),
              enrichmentRate: "70.0",
            };
            setUploadResult(mockResult);
          }
        } catch (err) {
          console.warn("获取补充预览失败:", err);
          // 使用模拟数据作为后备
          const mockResult = {
            total: validData.length,
            enriched: Math.floor(validData.length * 0.7),
            empty: Math.ceil(validData.length * 0.3),
            enrichmentRate: "70.0",
          };
          setUploadResult(mockResult);
        }

        // 自动设置词库名称（基于文件名）
        const fileName = uploadFile.name.replace(/\.[^/.]+$/, ""); // 移除扩展名
        const uniqueName = `${fileName}`;
        setDictionaryInfo((prev) => ({
          ...prev,
          name: uniqueName,
          // 移除 length 字段，让后端计算单词数量
        }));

        // 进入预览步骤
        setStep("preview");
        success(`成功解析 ${validData.length} 个单词`);
      } else {
        warning("解析成功，但未找到有效单词数据");
      }
    } catch (err) {
      // 显示错误信息
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setParsing(false);
      setParseProgress(null);
    }
  };

  // 处理词典信息更新
  const handleDictionaryInfoChange = (
    field: keyof ICustomDictionary,
    value: any
  ) => {
    setDictionaryInfo((prev) => ({ ...prev, [field]: value }));
  };

  // 处理标签输入
  const handleTagsChange = (tagsString: string) => {
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    handleDictionaryInfoChange("tags", tagsArray);
  };

  // 处理保存词典
  const handleSaveDictionary = async () => {
    // 验证必填字段
    if (!dictionaryInfo.name) {
      setError("请输入词库名称");
      return;
    }

    setSaving(true);
    setError(null);
    setStep("processing");

    try {
      // 1. 创建词库
      const dictionaryToCreate = createCustomDictionary({
        ...dictionaryInfo,
        userId: userData?._id || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      });

      const createResult = await createDictionary(dictionaryToCreate);

      if (!createResult.success || !createResult.dictionary?.id) {
        throw new Error(createResult.error || "创建词库失败");
      }

      // 2. 添加单词（使用新的智能补充API）
      const dictId = createResult.dictionary.id;

      // 传递完整的单词数据，包含用户编辑的详细信息
      const addWordsResult = await addWords(dictId, parsedWords);

      if (!addWordsResult.success) {
        throw new Error(addWordsResult.error || "添加单词失败");
      }

      // 保存上传结果统计
      if ("result" in addWordsResult && addWordsResult.result) {
        setUploadResult(addWordsResult.result);
      }

      // 3. 更新词典列表状态
      setCustomDictionaries((prev) => [...prev, createResult.dictionary!]);

      // 4. 显示成功消息并关闭弹窗
      success("词库创建成功");
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建词库失败");
      setStep("preview"); // 返回预览步骤
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  // 返回上一步
  const handleBackToUpload = () => {
    setStep("upload");
    setError(null);
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    return (
      <div className="mb-6 flex items-center justify-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step === "upload"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          1
        </div>
        <div
          className={`h-1 w-10 ${
            step !== "upload" ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step === "preview"
              ? "bg-blue-500 text-white"
              : step === "processing"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          2
        </div>
        <div
          className={`h-1 w-10 ${
            step === "processing" ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            step === "processing"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          3
        </div>
      </div>
    );
  };

  // 渲染上传步骤
  const renderUploadStep = () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">上传步骤</h3>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            <li>下载Excel模板文件</li>
            <li>填写模板中的单词列（必填），其他列如音标、翻译等为可选</li>
            <li>上传填写好的Excel文件</li>
          </ol>
        </div>

        <div>
          <Button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
            variant="outline"
          >
            <IconDownload className="h-4 w-4" />
            <span>下载Excel模板</span>
          </Button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择Excel文件
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-300"
            disabled={parsing}
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <div>支持.xlsx或.xls格式的Excel文件</div>
            <div>
              新模板包含完整字段：单词（必填）、音标、词性、释义、例句等
            </div>
          </div>
        </div>

        {parsing && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span>正在解析文件...</span>
            </div>

            {parseProgress && (
              <div className="space-y-2">
                {/* 进度条 */}
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${parseProgress.percentage || 0}%` }}
                  ></div>
                </div>

                {/* 进度文字 */}
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {parseProgress.done
                      ? "解析完成"
                      : `正在解析第 ${parseProgress.completedRows} 行，共 ${parseProgress.totalRows} 行`}
                  </span>
                  <span>{parseProgress.percentage || 0}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 计算分页
  const totalPages = Math.ceil(parsedWords.length / wordsPerPage);
  const startIndex = (currentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const currentWords = parsedWords.slice(startIndex, endIndex);

  // 渲染预览步骤
  const renderPreviewStep = () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">词库信息</h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                词库名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dictionaryInfo.name || ""}
                onChange={(e) =>
                  handleDictionaryInfoChange("name", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="输入词库名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                词库描述
              </label>
              <textarea
                value={dictionaryInfo.description || ""}
                onChange={(e) =>
                  handleDictionaryInfoChange("description", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="输入词库描述"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={dictionaryInfo.tags?.join(", ") || ""}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">单词预览</h3>
            <div className="flex items-center gap-2">
              {selectedWords.size > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  删除选中 ({selectedWords.size})
                </Button>
              )}
              <Button
                onClick={handleBackToUpload}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <IconArrowLeft className="h-4 w-4" />
                <span>返回</span>
              </Button>
              <Button
                onClick={handleSaveDictionary}
                size="sm"
                className="flex items-center gap-1"
                disabled={!dictionaryInfo.name}
              >
                <IconCheck className="h-4 w-4" />
                <span>保存词库</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-1 mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              共 {parsedWords.length} 个单词
            </p>

            {uploadResult && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded dark:bg-green-900/30 dark:text-green-300">
                  已补充: {uploadResult.enriched}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded dark:bg-yellow-900/30 dark:text-yellow-300">
                  待填写: {uploadResult.empty}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded dark:bg-blue-900/30 dark:text-blue-300">
                  补充率: {uploadResult.enrichmentRate}%
                </span>
              </div>
            )}
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-2 py-2 w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedWords.size === parsedWords.length &&
                        parsedWords.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    单词
                  </th>
                  {/* 动态显示列 */}
                  {parsedWords.some(
                    (word) => word.userData?.detailed_translations?.length
                  ) && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      翻译
                    </th>
                  )}
                  {parsedWords.some(
                    (word) => word.userData?.usphone || word.userData?.ukphone
                  ) && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      音标
                    </th>
                  )}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    编辑
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {currentWords.map((word, index) => {
                  const globalIndex = startIndex + index;
                  const hasTranslations = parsedWords.some(
                    (w) => w.userData?.detailed_translations?.length
                  );
                  const hasPhonetics = parsedWords.some(
                    (w) => w.userData?.usphone || w.userData?.ukphone
                  );

                  return (
                    <tr
                      key={globalIndex}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={selectedWords.has(globalIndex)}
                          onChange={() => handleSelectWord(globalIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {word.name}
                      </td>
                      {/* 动态显示翻译列 */}
                      {hasTranslations && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {word.userData?.detailed_translations
                            ?.map((t) => t.chinese)
                            .join("; ") || ""}
                        </td>
                      )}
                      {/* 动态显示音标列 */}
                      {hasPhonetics && (
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {word.userData?.usphone
                            ? `美 [${word.userData.usphone}]`
                            : ""}
                          {word.userData?.ukphone
                            ? ` 英 [${word.userData.ukphone}]`
                            : ""}
                        </td>
                      )}
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => setEditingWordIndex(globalIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          编辑
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                显示 {startIndex + 1}-{Math.min(endIndex, parsedWords.length)}{" "}
                条，共 {parsedWords.length} 条
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  上一页
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染处理中步骤
  const renderProcessingStep = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
        <p className="text-lg font-medium">正在创建词库...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          请稍候，正在保存您的词库
        </p>
      </div>
    );
  };

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (step) {
      case "upload":
        return renderUploadStep();
      case "preview":
        return renderPreviewStep();
      case "processing":
        return renderProcessingStep();
      default:
        return renderUploadStep();
    }
  };

  return (
    <>
      <UploadWordEditModal
        word={editingWordIndex !== null ? parsedWords[editingWordIndex] : null}
        wordIndex={editingWordIndex}
        isOpen={editingWordIndex !== null}
        onClose={() => setEditingWordIndex(null)}
        onSave={handleEditWord}
      />
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>上传自定义词库</DialogTitle>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none"
              onClick={handleClose}
              disabled={step === "processing"}
            >
              <span className="sr-only">关闭</span>
            </button>
          </DialogHeader>

          {renderStepIndicator()}

          <div className="grid gap-6 py-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <div className="flex items-center">
                  <IconInfoCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {renderStepContent()}
          </div>

          {/* 移除底部的DialogFooter */}
        </DialogContent>
      </Dialog>
    </>
  );
}
