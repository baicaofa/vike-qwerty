/**
 * Excel Worker管理器
 * 负责Web Worker的生命周期管理、消息通信、错误处理和资源清理
 */
import type { ExcelParseResult } from "./excelParser";
import {
  type ExcelParsingMetrics,
  withExcelParsingMonitoring,
} from "./performanceMonitor";

// 复用现有的进度回调模式
export interface ExcelParseProgress {
  totalRows: number;
  completedRows: number;
  done: boolean;
  percentage?: number;
}

// Worker解析选项
export interface ExcelWorkerOptions {
  useWorker?: boolean;
  onProgress?: (progress: ExcelParseProgress) => boolean;
  timeout?: number; // 解析超时时间（毫秒）
  enableLargeFileOptimization?: boolean; // 启用大文件优化
  onLargeFileWarning?: (fileSize: number) => Promise<boolean>; // 大文件警告回调
}

// Worker消息类型定义
interface WorkerMessage {
  type: "parse" | "cancel" | "pause" | "resume";
  data?: {
    fileBuffer: ArrayBuffer;
    fileName: string;
    fileSize?: number;
    enableLargeFileOptimization?: boolean;
  };
}

interface WorkerResponse {
  type: "progress" | "success" | "error";
  data?: any;
}

/**
 * Excel Worker管理器类
 * 单例模式，管理Worker的创建、销毁和通信
 */
export class ExcelWorkerManager {
  private static instance: ExcelWorkerManager;
  private worker: Worker | null = null;
  private isWorkerSupported: boolean;
  private currentResolve: ((value: ExcelParseResult) => void) | null = null;
  private currentReject: ((reason: any) => void) | null = null;
  private currentProgressCallback:
    | ((progress: ExcelParseProgress) => boolean)
    | null = null;
  private parseTimeout: NodeJS.Timeout | null = null;

  // 大文件处理配置
  private static readonly LARGE_FILE_THRESHOLD = 1024 * 1024; // 1MB
  private static readonly VERY_LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB

  private constructor() {
    // 检测Web Worker支持
    this.isWorkerSupported = typeof Worker !== "undefined";
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ExcelWorkerManager {
    if (!ExcelWorkerManager.instance) {
      ExcelWorkerManager.instance = new ExcelWorkerManager();
    }
    return ExcelWorkerManager.instance;
  }

  /**
   * 检查是否支持Web Worker
   */
  public isSupported(): boolean {
    return this.isWorkerSupported;
  }

  /**
   * 检测是否为大文件
   */
  private isLargeFile(fileSize: number): boolean {
    return fileSize > ExcelWorkerManager.LARGE_FILE_THRESHOLD;
  }

  /**
   * 检测是否为超大文件
   */
  private isVeryLargeFile(fileSize: number): boolean {
    return fileSize > ExcelWorkerManager.VERY_LARGE_FILE_THRESHOLD;
  }

  /**
   * 获取文件大小描述
   */
  private getFileSizeDescription(fileSize: number): string {
    if (fileSize < 1024) {
      return `${fileSize} B`;
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(1)} KB`;
    } else {
      return `${(fileSize / 1024 / 1024).toFixed(1)} MB`;
    }
  }

  /**
   * 显示大文件警告并获取用户确认
   */
  private async showLargeFileWarning(
    fileSize: number,
    onLargeFileWarning?: (fileSize: number) => Promise<boolean>
  ): Promise<boolean> {
    if (onLargeFileWarning) {
      return await onLargeFileWarning(fileSize);
    }

    // 默认警告处理
    const sizeDesc = this.getFileSizeDescription(fileSize);
    const isVeryLarge = this.isVeryLargeFile(fileSize);

    const message = isVeryLarge
      ? `检测到超大文件 (${sizeDesc})，解析可能需要较长时间并消耗大量内存。建议将文件拆分为多个小文件。是否继续？`
      : `检测到大文件 (${sizeDesc})，将启用优化策略以提高解析性能。是否继续？`;

    return confirm(message);
  }

  /**
   * 创建Worker实例
   */
  private createWorker(): Worker {
    if (!this.isWorkerSupported) {
      throw new Error("当前环境不支持Web Worker");
    }

    try {
      // 使用Vite的Web Worker语法
      const worker = new Worker(
        new URL("/workers/excel-parser-worker.ts", import.meta.url),
        { type: "module" }
      );

      // 设置Worker消息处理
      worker.onmessage = this.handleWorkerMessage.bind(this);
      worker.onerror = this.handleWorkerError.bind(this);

      return worker;
    } catch (error) {
      console.error("创建Worker失败:", error);
      throw new Error("创建Web Worker失败");
    }
  }

  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(event: MessageEvent<WorkerResponse>) {
    const { type, data } = event.data;

    switch (type) {
      case "progress":
        if (this.currentProgressCallback && data) {
          const shouldContinue = this.currentProgressCallback(data);
          if (!shouldContinue) {
            this.cancelParsing();
          }
        }
        break;

      case "success":
        this.clearTimeout();
        if (this.currentResolve && data) {
          this.currentResolve(data);
          this.cleanup();
        }
        break;

      case "error":
        this.clearTimeout();
        if (this.currentReject) {
          this.currentReject(new Error(data?.error || "Worker解析失败"));
          this.cleanup();
        }
        break;

      default:
        console.warn("未知的Worker消息类型:", type);
    }
  }

  /**
   * 处理Worker错误
   */
  private handleWorkerError(error: ErrorEvent) {
    console.error("Worker错误:", error);
    this.clearTimeout();
    if (this.currentReject) {
      this.currentReject(new Error("Worker执行错误: " + error.message));
      this.cleanup();
    }
  }

  /**
   * 设置解析超时
   */
  private setTimeout(timeout: number) {
    this.parseTimeout = setTimeout(() => {
      if (this.currentReject) {
        this.currentReject(new Error("Excel解析超时"));
        this.cleanup();
      }
    }, timeout);
  }

  /**
   * 清除解析超时
   */
  private clearTimeout() {
    if (this.parseTimeout) {
      clearTimeout(this.parseTimeout);
      this.parseTimeout = null;
    }
  }

  /**
   * 清理当前解析状态
   */
  private cleanup() {
    this.currentResolve = null;
    this.currentReject = null;
    this.currentProgressCallback = null;
    this.clearTimeout();
  }

  /**
   * 销毁Worker
   */
  private destroyWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  /**
   * 取消当前解析
   */
  public cancelParsing(): void {
    if (this.worker) {
      const message: WorkerMessage = { type: "cancel" };
      this.worker.postMessage(message);
    }
    this.cleanup();
  }

  /**
   * 使用Worker解析Excel文件（内部方法）
   */
  private async _parseWithWorker(
    file: File,
    options: ExcelWorkerOptions = {}
  ): Promise<ExcelParseResult> {
    if (!this.isWorkerSupported) {
      throw new Error("当前环境不支持Web Worker");
    }

    // 检测大文件并处理
    const fileSize = file.size;
    const isLarge = this.isLargeFile(fileSize);

    if (isLarge) {
      // 显示大文件警告
      const shouldContinue = await this.showLargeFileWarning(
        fileSize,
        options.onLargeFileWarning
      );
      if (!shouldContinue) {
        throw new Error("用户取消了大文件解析");
      }
    }

    // 启用大文件优化
    const enableOptimization =
      isLarge || options.enableLargeFileOptimization || false;

    return new Promise<ExcelParseResult>((resolve, reject) => {
      try {
        // 创建Worker（如果不存在）
        if (!this.worker) {
          this.worker = this.createWorker();
        }

        // 设置回调
        this.currentResolve = resolve;
        this.currentReject = reject;
        this.currentProgressCallback = options.onProgress || null;

        // 设置超时（默认5分钟）
        const timeout = options.timeout || 5 * 60 * 1000;
        this.setTimeout(timeout);

        // 读取文件为ArrayBuffer
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result instanceof ArrayBuffer) {
            const message: WorkerMessage = {
              type: "parse",
              data: {
                fileBuffer: e.target.result,
                fileName: file.name,
                fileSize: fileSize,
                enableLargeFileOptimization: enableOptimization,
              },
            };

            // 发送解析任务到Worker
            this.worker!.postMessage(message, [e.target.result]);
          } else {
            reject(new Error("读取文件失败"));
          }
        };

        reader.onerror = () => {
          reject(new Error("读取文件失败: " + reader.error?.message));
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 使用Worker解析Excel文件（公共方法，集成性能监控）
   */
  public parseWithWorker = withExcelParsingMonitoring(
    this._parseWithWorker.bind(this),
    (
      args: [File, ExcelWorkerOptions],
      result: ExcelParseResult,
      duration: number
    ): ExcelParsingMetrics => {
      const [file, options] = args;
      return {
        fileSize: file.size,
        totalRows: result.totalRows || 0,
        validRows: result.validRows || 0,
        parsingTime: duration,
        validationTime: duration * 0.3, // 估算验证时间约占30%
        memoryUsage: 0, // 将由装饰器填充
        workerUsed: true,
        errorCount: result.errors?.length || 0,
      };
    }
  );

  /**
   * 销毁管理器实例
   */
  public destroy(): void {
    this.cancelParsing();
    this.destroyWorker();
  }
}

/**
 * 获取Excel Worker管理器实例
 */
export function getExcelWorkerManager(): ExcelWorkerManager {
  return ExcelWorkerManager.getInstance();
}

/**
 * 检查Web Worker支持
 */
export function isWebWorkerSupported(): boolean {
  return typeof Worker !== "undefined";
}

/**
 * 使用Worker解析Excel文件的便捷函数
 */
export async function parseExcelWithWorker(
  file: File,
  options: ExcelWorkerOptions = {}
): Promise<ExcelParseResult> {
  const manager = getExcelWorkerManager();

  if (!manager.isSupported()) {
    throw new Error("当前环境不支持Web Worker，请使用主线程解析");
  }

  return manager.parseWithWorker(file, options);
}
