/**
 * Excel解析Web Worker
 * 在后台线程中执行Excel文件解析，避免阻塞主线程UI
 */
// 导入xlsx库 - 在Worker中使用ES模块导入
import { utils, read } from "xlsx";

// 定义消息类型
interface WorkerMessage {
  type: "parse" | "cancel" | "pause" | "resume";
  data?: {
    fileBuffer: ArrayBuffer;
    fileName: string;
    fileSize?: number;
    chunkSize?: number;
    enableLargeFileOptimization?: boolean;
  };
}

interface WorkerResponse {
  type: "progress" | "success" | "error";
  data?: any;
}

// 定义Excel解析结果接口（与主线程保持一致）
interface ExcelParseResult {
  success: boolean;
  data?: ICustomWord[];
  errors?: string[];
  totalRows?: number;
  validRows?: number;
}

// 定义自定义单词接口（简化版，与主线程保持一致）
interface ICustomWord {
  id?: string;
  dictId?: string;
  name: string;
  index?: number;
  sourceType?: "official" | "user_custom" | "empty";
  officialWordId?: string;
  userData?: {
    usphone: string;
    ukphone: string;
    sentences: Array<{
      english: string;
      chinese: string;
    }>;
    detailed_translations: Array<{
      pos: string;
      chinese: string;
      english: string;
    }>;
  };
  isUserModified?: boolean;
  isEmpty?: boolean;
}

// Worker状态管理
let isProcessing = false;
let shouldCancel = false;
let isPaused = false;
let currentProcessingData: any = null;

// 大文件处理配置
const LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB
const DEFAULT_CHUNK_SIZE = 1000; // 每次处理1000行
const LARGE_FILE_CHUNK_SIZE = 500; // 大文件每次处理500行
const MEMORY_CHECK_INTERVAL = 100; // 每100行检查一次内存

/**
 * 检查内存使用情况
 */
function checkMemoryUsage(): {
  used: number;
  limit: number;
  shouldCleanup: boolean;
} {
  // 在Worker中，我们无法直接访问performance.memory，使用估算
  const estimatedUsed = currentProcessingData
    ? JSON.stringify(currentProcessingData).length
    : 0;
  const estimatedLimit = 50 * 1024 * 1024; // 50MB估算限制

  return {
    used: estimatedUsed,
    limit: estimatedLimit,
    shouldCleanup: estimatedUsed > estimatedLimit * 0.8, // 80%时清理
  };
}

/**
 * 清理内存
 */
function cleanupMemory() {
  // 清理临时数据
  if (currentProcessingData) {
    currentProcessingData = null;
  }

  // 强制垃圾回收（如果支持）
  if (typeof self.gc === "function") {
    self.gc();
  }
}

/**
 * 发送进度消息到主线程
 */
function sendProgress(
  completedRows: number,
  totalRows: number,
  done: boolean = false,
  memoryInfo?: any
) {
  const response: WorkerResponse = {
    type: "progress",
    data: {
      totalRows,
      completedRows,
      done,
      percentage:
        totalRows > 0 ? Math.round((completedRows / totalRows) * 100) : 0,
      memoryInfo,
    },
  };
  self.postMessage(response);
}

/**
 * 发送成功结果到主线程
 */
function sendSuccess(result: ExcelParseResult) {
  const response: WorkerResponse = {
    type: "success",
    data: result,
  };
  self.postMessage(response);
}

/**
 * 发送错误消息到主线程
 */
function sendError(error: string) {
  const response: WorkerResponse = {
    type: "error",
    data: { error },
  };
  self.postMessage(response);
}

/**
 * 验证和转换Excel数据为自定义单词格式（支持大文件优化）
 * 移植自主线程的validateAndConvertData函数
 */
async function validateAndConvertData(
  data: Record<string, any>[],
  enableLargeFileOptimization: boolean = false
): Promise<{
  words: ICustomWord[];
  errors: string[];
}> {
  const words: ICustomWord[] = [];
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push("Excel文件为空或格式不正确");
    return { words, errors };
  }

  // 存储当前处理数据
  currentProcessingData = data;

  // 发送初始进度
  const memoryInfo = checkMemoryUsage();
  sendProgress(0, data.length, false, memoryInfo);

  // 跳过标题行，从实际数据开始（通常从第3行开始，即索引2）
  let startIndex = 0;
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i];
    // 获取可能的单词字段值
    const wordValue =
      row.word ||
      row.Word ||
      row["单词"] ||
      row["单词【必填】"] ||
      row["A"] ||
      row[Object.keys(row)[0]];
    // 如果找到实际的单词数据（不是标题文字），从这里开始
    if (
      wordValue &&
      typeof wordValue === "string" &&
      wordValue.trim() !== "" &&
      wordValue !== "word" &&
      wordValue !== "单词" &&
      wordValue !== "单词【必填】" &&
      !wordValue.includes("【必填】") &&
      !wordValue.includes("【选填】") &&
      wordValue.length > 0 &&
      /^[a-zA-Z]/.test(wordValue)
    ) {
      // 确保是以字母开头的单词
      startIndex = i;
      break;
    }
  }

  const actualData = data.slice(startIndex);

  if (actualData.length === 0) {
    errors.push("Excel文件中没有找到有效的单词数据");
    return { words, errors };
  }

  const firstRow = actualData[0];
  const hasWord =
    "word" in firstRow ||
    "Word" in firstRow ||
    "单词" in firstRow ||
    "单词【必填】" in firstRow;

  if (!hasWord) {
    errors.push("Excel文件缺少必要的列: word/Word/单词/单词【必填】");
    return { words, errors };
  }

  // 确定处理策略
  const isLargeFile = actualData.length > 1000 || enableLargeFileOptimization;
  const chunkSize = isLargeFile ? LARGE_FILE_CHUNK_SIZE : DEFAULT_CHUNK_SIZE;
  const progressInterval = isLargeFile ? 50 : 10; // 大文件更频繁的进度更新

  // 分块处理数据
  for (
    let chunkStart = 0;
    chunkStart < actualData.length;
    chunkStart += chunkSize
  ) {
    // 检查是否需要取消
    if (shouldCancel) {
      break;
    }

    // 检查是否需要暂停
    while (isPaused && !shouldCancel) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const chunkEnd = Math.min(chunkStart + chunkSize, actualData.length);
    const chunk = actualData.slice(chunkStart, chunkEnd);

    // 处理当前块
    for (let i = 0; i < chunk.length; i++) {
      const index = chunkStart + i;
      const row = chunk[i];

      // 检查是否需要取消
      if (shouldCancel) {
        break;
      }

      try {
        // 更频繁的进度更新
        if (index % progressInterval === 0) {
          const memoryInfo = checkMemoryUsage();
          sendProgress(index, actualData.length, false, memoryInfo);

          // 检查内存使用，必要时清理
          if (memoryInfo.shouldCleanup) {
            cleanupMemory();
          }
        }

        // 获取单词名称 - 支持多种字段名和列位置
        const name =
          row.word ||
          row.Word ||
          row["单词"] ||
          row["单词【必填】"] ||
          row["A"] ||
          row[Object.keys(row)[0]];

        if (!name || typeof name !== "string" || name.trim() === "") {
          errors.push(`第${startIndex + index + 2}行: 单词不能为空`);
          continue;
        }

        // 获取音标 - 支持多种字段名和列位置
        const usphone =
          row.usphone ||
          row.phonetic ||
          row.Phonetic ||
          row["音标"] ||
          row["美式音标"] ||
          row["美式音标【选填】"] ||
          row["B"] ||
          "";
        const ukphone =
          row.ukphone ||
          row["英式音标"] ||
          row["英式音标【选填】"] ||
          row["C"] ||
          "";

        // 获取详细翻译
        const detailed_translations: Array<{
          pos: string;
          chinese: string;
          english: string;
        }> = [];

        // 处理新格式的详细翻译 - 支持字段名和列位置
        const translationMappings = [
          {
            pos: ["pos1", "词性1", "词性1【选填】", "D"],
            chinese: ["chinese1", "中文释义1", "中文释义1【选填】", "E"],
            english: ["english1", "英文释义1", "英文释义1【选填】", "F"],
          },
          {
            pos: ["pos2", "词性2", "词性2【选填】", "G"],
            chinese: ["chinese2", "中文释义2", "中文释义2【选填】", "H"],
            english: ["english2", "英文释义2", "英文释义2【选填】", "I"],
          },
        ];

        translationMappings.forEach((mapping) => {
          const pos =
            mapping.pos.map((key) => row[key]).find((val) => val) || "";
          const chinese =
            mapping.chinese.map((key) => row[key]).find((val) => val) || "";
          const english =
            mapping.english.map((key) => row[key]).find((val) => val) || "";

          if (chinese && chinese.trim() !== "") {
            detailed_translations.push({
              pos: pos.trim(),
              chinese: chinese.trim(),
              english: english.trim() || "暂无英文释义", // 如果english为空，设置默认值
            });
          }
        });

        // 获取例句 - 支持字段名和列位置
        const sentences: Array<{ english: string; chinese: string }> = [];
        const sentenceMappings = [
          {
            english: ["sentence1_en", "例句1英文", "例句1英文【选填】", "J"],
            chinese: ["sentence1_cn", "例句1中文", "例句1中文【选填】", "K"],
          },
          {
            english: ["sentence2_en", "例句2英文", "例句2英文【选填】", "L"],
            chinese: ["sentence2_cn", "例句2中文", "例句2中文【选填】", "M"],
          },
        ];

        sentenceMappings.forEach((mapping) => {
          const english =
            mapping.english.map((key) => row[key]).find((val) => val) || "";
          const chinese =
            mapping.chinese.map((key) => row[key]).find((val) => val) || "";

          if (english && english.trim() !== "") {
            sentences.push({
              english: english.trim(),
              chinese: chinese.trim(),
            });
          }
        });

        // 构建用户数据
        const hasUserData =
          detailed_translations.length > 0 ||
          sentences.length > 0 ||
          (typeof usphone === "string" && usphone.trim() !== "") ||
          (typeof ukphone === "string" && ukphone.trim() !== "");

        const userData = hasUserData
          ? {
              usphone: typeof usphone === "string" ? usphone.trim() : "",
              ukphone: typeof ukphone === "string" ? ukphone.trim() : "",
              sentences,
              detailed_translations,
            }
          : undefined;

        const wordObj: Partial<ICustomWord> = {
          name: name.trim(),
          sourceType: userData ? "user_custom" : "empty",
          userData,
          isUserModified: !!userData,
          isEmpty: !userData,
        };

        words.push(wordObj as ICustomWord);
      } catch (error) {
        errors.push(
          `第${startIndex + index + 2}行: 数据格式错误 - ${
            error instanceof Error ? error.message : "未知错误"
          }`
        );
      }
    }

    // 块处理完成后，让出控制权给其他任务
    if (chunkEnd < actualData.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  // 清理处理数据
  currentProcessingData = null;

  // 发送最终进度
  const finalMemoryInfo = checkMemoryUsage();
  sendProgress(actualData.length, actualData.length, true, finalMemoryInfo);

  // 最终内存清理
  cleanupMemory();

  return { words, errors };
}

/**
 * 在Worker中解析Excel文件（支持大文件优化）
 */
async function parseExcelInWorker(
  fileBuffer: ArrayBuffer,
  fileSize: number = 0,
  enableLargeFileOptimization: boolean = false
): Promise<ExcelParseResult> {
  try {
    // 检测是否为大文件
    const isLargeFile =
      fileSize > LARGE_FILE_THRESHOLD || enableLargeFileOptimization;

    if (isLargeFile) {
      console.log(
        `检测到大文件 (${(fileSize / 1024 / 1024).toFixed(2)}MB)，启用优化策略`
      );
    }

    // 解析Excel文件
    const workbook = read(fileBuffer, { type: "array" });

    // 获取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        errors: ["Excel文件不包含工作表"],
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];

    // 将工作表转换为JSON
    const jsonData = utils.sheet_to_json<Record<string, any>>(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return {
        success: false,
        errors: ["Excel文件不包含数据"],
      };
    }

    // 验证和转换数据（支持大文件优化）
    const { words, errors } = await validateAndConvertData(
      jsonData,
      isLargeFile
    );

    return {
      success: errors.length === 0,
      data: words,
      errors: errors.length > 0 ? errors : undefined,
      totalRows: jsonData.length,
      validRows: words.length,
    };
  } catch (error) {
    console.error("Worker解析Excel文件出错:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "解析Excel文件失败"],
    };
  }
}

// Worker消息处理
self.onmessage = async function (event: MessageEvent<WorkerMessage>) {
  const { type, data } = event.data;

  switch (type) {
    case "parse":
      if (isProcessing) {
        sendError("Worker正在处理其他任务");
        return;
      }

      if (!data?.fileBuffer) {
        sendError("缺少文件数据");
        return;
      }

      isProcessing = true;
      shouldCancel = false;

      try {
        const result = await parseExcelInWorker(
          data.fileBuffer,
          data.fileSize || 0,
          data.enableLargeFileOptimization || false
        );
        sendSuccess(result);
      } catch (error) {
        sendError(error instanceof Error ? error.message : "解析失败");
      } finally {
        isProcessing = false;
        shouldCancel = false;
        isPaused = false;
      }
      break;

    case "cancel":
      shouldCancel = true;
      break;

    case "pause":
      isPaused = true;
      break;

    case "resume":
      isPaused = false;
      break;

    default:
      sendError(`未知的消息类型: ${type}`);
  }
};

// Worker错误处理
self.onerror = function (error) {
  console.error("Worker错误:", error);
  sendError("Worker执行错误");
};

// Worker未处理的Promise拒绝
self.addEventListener("unhandledrejection", function (event) {
  console.error("Worker未处理的Promise拒绝:", event.reason);
  sendError("Worker异步操作失败");
});
