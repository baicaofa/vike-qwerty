import type { ICustomWord } from "./db/customDictionary";
import {
  type ExcelParseProgress,
  getExcelWorkerManager,
  isWebWorkerSupported,
} from "./excel-worker-manager";
import {
  type ExcelParsingMetrics,
  performanceMonitor,
  withExcelParsingMonitoring,
} from "./performanceMonitor";
import { read, utils } from "xlsx";

/**
 * Excel文件解析结果接口
 */
export interface ExcelParseResult {
  success: boolean;
  data?: ICustomWord[];
  errors?: string[];
  totalRows?: number;
  validRows?: number;
}

/**
 * Excel解析选项接口
 */
export interface ExcelParseOptions {
  useWorker?: boolean;
  onProgress?: (progress: ExcelParseProgress) => boolean;
  timeout?: number;
}

/**
 * 内部解析Excel文件函数
 */
async function _parseExcelFile(
  file: File,
  options: ExcelParseOptions = {}
): Promise<ExcelParseResult> {
  const { useWorker = false, onProgress, timeout } = options;

  // 检查是否应该使用Worker
  const shouldUseWorker = useWorker && isWebWorkerSupported();

  if (shouldUseWorker) {
    try {
      // 使用Worker解析
      const workerManager = getExcelWorkerManager();
      return await workerManager.parseWithWorker(file, {
        onProgress,
        timeout,
      });
    } catch (error) {
      console.warn("Worker解析失败，降级到主线程解析:", error);
      // 降级到主线程解析
    }
  }

  // 主线程解析（原有逻辑，集成性能监控）
  return performanceMonitor.measureAsyncFunction(
    "excel-parsing-main-thread",
    async () => {
      try {
        // 读取文件内容
        const data = await readFileAsArrayBuffer(file);

        // 解析Excel文件
        const workbook = read(data, { type: "array" });

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

        // 验证和转换数据（支持进度回调）
        const { words, errors } = validateAndConvertData(jsonData, onProgress);

        return {
          success: errors.length === 0,
          data: words,
          errors: errors.length > 0 ? errors : undefined,
          totalRows: jsonData.length,
          validRows: words.length,
        };
      } catch (error) {
        console.error("解析Excel文件出错:", error);
        return {
          success: false,
          errors: [
            error instanceof Error ? error.message : "解析Excel文件失败",
          ],
        };
      }
    },
    "timing"
  );
}

/**
 * 将File对象读取为ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error("读取文件失败"));
      }
    };
    reader.onerror = (e) => {
      reject(new Error("读取文件失败: " + e.target?.error?.message));
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 验证和转换Excel数据为自定义单词格式
 */
function validateAndConvertData(
  data: Record<string, any>[],
  onProgress?: (progress: ExcelParseProgress) => boolean
): {
  words: ICustomWord[];
  errors: string[];
} {
  const words: ICustomWord[] = [];
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push("Excel文件为空或格式不正确");
    return { words, errors };
  }

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

  // 发送初始进度
  if (onProgress) {
    onProgress({
      totalRows: actualData.length,
      completedRows: 0,
      done: false,
      percentage: 0,
    });
  }

  actualData.forEach((row, index) => {
    try {
      // 每处理10行发送一次进度更新
      if (onProgress && index % 10 === 0) {
        const shouldContinue = onProgress({
          totalRows: actualData.length,
          completedRows: index,
          done: false,
          percentage: Math.round((index / actualData.length) * 100),
        });

        // 如果用户取消，停止处理
        if (!shouldContinue) {
          return;
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
        return;
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
        const pos = mapping.pos.map((key) => row[key]).find((val) => val) || "";
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
  });

  // 发送最终进度
  if (onProgress) {
    onProgress({
      totalRows: actualData.length,
      completedRows: actualData.length,
      done: true,
      percentage: 100,
    });
  }

  return { words, errors };
}

/**
 * 生成Excel模板数据
 * @returns 包含示例数据的Excel工作簿
 */
export function generateExcelTemplate() {
  // 创建工作簿
  const wb = utils.book_new();

  // 创建空的工作表
  const ws: any = {};

  // 定义列标题（合并字段说明）
  const columns = [
    "单词【必填】",
    "美式音标【选填】",
    "英式音标【选填】",
    "词性1【选填】",
    "中文释义1【选填】",
    "英文释义1【选填】",
    "词性2【选填】",
    "中文释义2【选填】",
    "英文释义2【选填】",
    "例句1英文【选填】",
    "例句1中文【选填】",
    "例句2英文【选填】",
    "例句2中文【选填】",
  ];

  const englishColumns = [
    "word",
    "usphone",
    "ukphone",
    "pos1",
    "chinese1",
    "english1",
    "pos2",
    "chinese2",
    "english2",
    "sentence1_en",
    "sentence1_cn",
    "sentence2_en",
    "sentence2_cn",
  ];

  // 示例数据
  const exampleData = [
    [
      "apple",
      "ˈæpl",
      "ˈæpəl",
      "n",
      "苹果",
      "a round fruit with red or green skin",
      "",
      "",
      "",
      "I eat an apple every day.",
      "我每天吃一个苹果。",
      "",
      "",
    ],
    [
      "computer",
      "kəmˈpjuːtər",
      "kəmˈpjuːtə(r)",
      "n",
      "计算机",
      "an electronic device for processing data",
      "",
      "",
      "",
      "I use my computer for work.",
      "我用电脑工作。",
      "This computer is very fast.",
      "这台电脑很快。",
    ],
    [
      "beautiful",
      "ˈbjuːtɪfl",
      "ˈbjuːtɪfl",
      "adj",
      "美丽的",
      "pleasing to look at",
      "",
      "",
      "",
      "She is a beautiful woman.",
      "她是一个美丽的女人。",
      "",
      "",
    ],
  ];

  // 填充第一行：中文列名
  columns.forEach((col, index) => {
    const cellAddress = utils.encode_cell({ r: 0, c: index });
    ws[cellAddress] = { v: col, t: "s" };
  });

  // 填充第二行：英文列名
  englishColumns.forEach((col, index) => {
    const cellAddress = utils.encode_cell({ r: 1, c: index });
    ws[cellAddress] = { v: col, t: "s" };
  });

  // 填充示例数据（从第3行开始）
  exampleData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellAddress = utils.encode_cell({ r: 2 + rowIndex, c: colIndex });
      ws[cellAddress] = { v: cell, t: "s" };
    });
  });

  // 设置工作表范围
  const range = utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: 2 + exampleData.length - 1, c: columns.length - 1 },
  });
  ws["!ref"] = range;

  // 设置列宽
  const colWidths = [
    { wch: 12 }, // 单词
    { wch: 15 }, // 美式音标
    { wch: 15 }, // 英式音标
    { wch: 8 }, // 词性1
    { wch: 15 }, // 中文释义1
    { wch: 25 }, // 英文释义1
    { wch: 8 }, // 词性2
    { wch: 15 }, // 中文释义2
    { wch: 25 }, // 英文释义2
    { wch: 30 }, // 例句1英文
    { wch: 30 }, // 例句1中文
    { wch: 30 }, // 例句2英文
    { wch: 30 }, // 例句2中文
  ];
  ws["!cols"] = colWidths;

  // 添加单词数据工作表到工作簿
  utils.book_append_sheet(wb, ws, "单词数据");

  // 创建说明工作表
  const instructionData = [
    {
      字段名称: "单词【必填】",
      说明: "英文单词，如：apple、computer",
      示例: "apple",
    },
    { 字段名称: "美式音标【选填】", 说明: "美式发音音标", 示例: "ˈæpl" },
    { 字段名称: "英式音标【选填】", 说明: "英式发音音标", 示例: "ˈæpəl" },
    {
      字段名称: "词性1【选填】",
      说明: "词性：n(名词)、v(动词)、adj(形容词)、adv(副词)等",
      示例: "n",
    },
    { 字段名称: "中文释义1【选填】", 说明: "第一个中文含义", 示例: "苹果" },
    {
      字段名称: "英文释义1【选填】",
      说明: "第一个英文解释",
      示例: "a round fruit with red or green skin",
    },
    {
      字段名称: "词性2【选填】",
      说明: "第二个词性（如果单词有多个词性）",
      示例: "v",
    },
    { 字段名称: "中文释义2【选填】", 说明: "第二个中文含义", 示例: "计算" },
    {
      字段名称: "英文释义2【选填】",
      说明: "第二个英文解释",
      示例: "to calculate",
    },
    {
      字段名称: "例句1英文【选填】",
      说明: "第一个英文例句",
      示例: "I eat an apple every day.",
    },
    {
      字段名称: "例句1中文【选填】",
      说明: "第一个例句的中文翻译",
      示例: "我每天吃一个苹果。",
    },
    {
      字段名称: "例句2英文【选填】",
      说明: "第二个英文例句",
      示例: "This apple is very sweet.",
    },
    {
      字段名称: "例句2中文【选填】",
      说明: "第二个例句的中文翻译",
      示例: "这个苹果很甜。",
    },
    { 字段名称: "", 说明: "", 示例: "" },
    { 字段名称: "使用说明", 说明: "", 示例: "" },
    { 字段名称: "1. 列名已标注【必填】或【选填】", 说明: "", 示例: "" },
    { 字段名称: '2. 只有"单词"列是必填的', 说明: "", 示例: "" },
    { 字段名称: "3. 其他所有字段都是选填的", 说明: "", 示例: "" },
    { 字段名称: "4. 可以只填写单词名称，其他信息后续编辑", 说明: "", 示例: "" },
    { 字段名称: "5. 支持最多2个词性和释义", 说明: "", 示例: "" },
    { 字段名称: "6. 支持最多2个例句", 说明: "", 示例: "" },
    { 字段名称: '7. 兼容旧格式的"翻译"字段', 说明: "", 示例: "" },
    { 字段名称: "8. 请从第3行开始填写实际数据", 说明: "", 示例: "" },
  ];

  const instructionWs = utils.json_to_sheet(instructionData);

  // 设置说明工作表的列宽
  const instructionColWidths = [
    { wch: 20 }, // 字段名称
    { wch: 40 }, // 说明
    { wch: 35 }, // 示例
  ];
  instructionWs["!cols"] = instructionColWidths;

  // 添加说明工作表到工作簿
  utils.book_append_sheet(wb, instructionWs, "使用说明");

  return wb;
}

/**
 * 解析Excel文件，提取单词数据（公共API，集成性能监控）
 * @param file Excel文件对象
 * @param options 解析选项，包含Worker使用、进度回调等配置
 * @returns 解析结果，包含成功标志和数据或错误信息
 */
export const parseExcelFile = withExcelParsingMonitoring(
  _parseExcelFile,
  (
    args: [File, ExcelParseOptions],
    result: ExcelParseResult,
    duration: number
  ): ExcelParsingMetrics => {
    const [file, options] = args;
    const { useWorker = false } = options;
    const shouldUseWorker = useWorker && isWebWorkerSupported();

    return {
      fileSize: file.size,
      totalRows: result.totalRows || 0,
      validRows: result.validRows || 0,
      parsingTime: duration,
      validationTime: duration * 0.4, // 估算验证时间约占40%（主线程验证更多）
      memoryUsage: 0, // 将由装饰器填充
      workerUsed: shouldUseWorker,
      errorCount: result.errors?.length || 0,
    };
  }
);
