// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN'
}

// 错误代码枚举
export enum ErrorCode {
  // 网络错误
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  NETWORK_SERVER_ERROR = 'NETWORK_SERVER_ERROR',
  
  // 验证错误
  VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
  VALIDATION_TOO_LONG = 'VALIDATION_TOO_LONG',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  VALIDATION_DUPLICATE = 'VALIDATION_DUPLICATE',
  
  // 数据库错误
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED = 'DATABASE_QUERY_FAILED',
  DATABASE_RECORD_NOT_FOUND = 'DATABASE_RECORD_NOT_FOUND',
  DATABASE_CONSTRAINT_VIOLATION = 'DATABASE_CONSTRAINT_VIOLATION',
  
  // 权限错误
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PERMISSION_INSUFFICIENT = 'PERMISSION_INSUFFICIENT',
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: number;
  context?: Record<string, any>;
}

// 错误处理配置
export interface ErrorHandlerConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  retryable?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

// 错误处理结果
export interface ErrorHandleResult {
  handled: boolean;
  shouldRetry?: boolean;
  retryAfter?: number;
  userMessage?: string;
}

// 错误处理器类
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorHistory: ErrorInfo[] = [];
  private maxHistorySize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // 处理错误
  handleError(
    error: Error | string | any,
    config: ErrorHandlerConfig = {},
    context?: Record<string, any>
  ): ErrorHandleResult {
    const errorInfo = this.createErrorInfo(error, context);
    this.addToHistory(errorInfo);

    // 记录到控制台
    if (config.logToConsole !== false) {
      this.logError(errorInfo);
    }

    // 显示Toast消息
    if (config.showToast) {
      this.showToast(errorInfo);
    }

    // 判断是否可重试
    const shouldRetry = this.isRetryable(errorInfo, config);

    return {
      handled: true,
      shouldRetry,
      retryAfter: shouldRetry ? (config.retryDelay || 1000) : undefined,
      userMessage: this.getUserMessage(errorInfo)
    };
  }

  // 创建错误信息
  private createErrorInfo(error: Error | string | any, context?: Record<string, any>): ErrorInfo {
    let type = ErrorType.UNKNOWN;
    let code = ErrorCode.UNKNOWN_ERROR;
    let message = '未知错误';
    let details = '';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
      details = error.stack || '';
      
      // 根据错误类型分类
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        type = ErrorType.NETWORK;
        code = ErrorCode.NETWORK_SERVER_ERROR;
      } else if (error.name === 'ValidationError') {
        type = ErrorType.VALIDATION;
        code = ErrorCode.VALIDATION_REQUIRED;
      } else if (error.name === 'DatabaseError') {
        type = ErrorType.DATABASE;
        code = ErrorCode.DATABASE_QUERY_FAILED;
      }
    } else if (error && typeof error === 'object') {
      // 处理API错误响应
      if (error.errorCode) {
        code = error.errorCode as ErrorCode;
        message = error.error || error.message || '操作失败';
        
        // 根据错误代码分类
        switch (code) {
          case ErrorCode.DUPLICATE_TITLE:
            type = ErrorType.VALIDATION;
            break;
          case ErrorCode.ARTICLE_NOT_FOUND:
            type = ErrorType.DATABASE;
            break;
          case ErrorCode.EMPTY_TITLE:
          case ErrorCode.EMPTY_CONTENT:
          case ErrorCode.TITLE_TOO_LONG:
          case ErrorCode.CONTENT_TOO_LONG:
            type = ErrorType.VALIDATION;
            break;
          default:
            type = ErrorType.UNKNOWN;
        }
      } else {
        message = error.message || '操作失败';
      }
    }

    return {
      type,
      code,
      message,
      details,
      timestamp: Date.now(),
      context
    };
  }

  // 添加错误到历史记录
  private addToHistory(errorInfo: ErrorInfo): void {
    this.errorHistory.push(errorInfo);
    
    // 限制历史记录大小
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }
  }

  // 记录错误到控制台
  private logError(errorInfo: ErrorInfo): void {
    const logMessage = `[${errorInfo.type}] ${errorInfo.code}: ${errorInfo.message}`;
    
    switch (errorInfo.type) {
      case ErrorType.NETWORK:
        console.warn(logMessage, errorInfo);
        break;
      case ErrorType.VALIDATION:
        console.warn(logMessage, errorInfo);
        break;
      case ErrorType.DATABASE:
        console.error(logMessage, errorInfo);
        break;
      case ErrorType.PERMISSION:
        console.error(logMessage, errorInfo);
        break;
      default:
        console.error(logMessage, errorInfo);
    }
  }

  // 显示Toast消息
  private showToast(errorInfo: ErrorInfo): void {
    // 这里可以集成Toast组件
    // 暂时使用alert作为替代
    const userMessage = this.getUserMessage(errorInfo);
    if (userMessage) {
      // 使用更友好的提示方式
      this.showFriendlyMessage(userMessage, errorInfo.type);
    }
  }

  // 显示友好消息
  private showFriendlyMessage(message: string, type: ErrorType): void {
    // 这里可以集成更好的UI组件
    // 暂时使用alert
    alert(message);
  }

  // 获取用户友好的错误消息
  private getUserMessage(errorInfo: ErrorInfo): string {
    switch (errorInfo.code) {
      case ErrorCode.NETWORK_TIMEOUT:
        return '网络连接超时，请检查网络后重试';
      case ErrorCode.NETWORK_OFFLINE:
        return '网络连接已断开，请检查网络连接';
      case ErrorCode.NETWORK_SERVER_ERROR:
        return '服务器暂时不可用，请稍后重试';
      
      case ErrorCode.VALIDATION_REQUIRED:
        return '请填写必填项';
      case ErrorCode.VALIDATION_TOO_LONG:
        return '内容长度超出限制';
      case ErrorCode.VALIDATION_INVALID_FORMAT:
        return '格式不正确，请检查输入';
      case ErrorCode.VALIDATION_DUPLICATE:
        return '内容已存在，请使用其他内容';
      case ErrorCode.DUPLICATE_TITLE:
        return '文章标题已存在，请使用其他标题';
      case ErrorCode.EMPTY_TITLE:
        return '请输入文章标题';
      case ErrorCode.EMPTY_CONTENT:
        return '请输入文章内容';
      case ErrorCode.TITLE_TOO_LONG:
        return '文章标题不能超过100个字符';
      case ErrorCode.CONTENT_TOO_LONG:
        return '文章内容不能超过50000个字符';
      case ErrorCode.SUSPICIOUS_CONTENT:
        return '文章内容包含不安全的字符，请检查后重试';
      
      case ErrorCode.DATABASE_CONNECTION_FAILED:
        return '数据库连接失败，请刷新页面重试';
      case ErrorCode.DATABASE_QUERY_FAILED:
        return '数据操作失败，请重试';
      case ErrorCode.DATABASE_RECORD_NOT_FOUND:
        return '数据不存在或已被删除';
      case ErrorCode.ARTICLE_NOT_FOUND:
        return '文章不存在或已被删除';
      
      case ErrorCode.PERMISSION_DENIED:
        return '权限不足，无法执行此操作';
      case ErrorCode.PERMISSION_INSUFFICIENT:
        return '权限不足，请联系管理员';
      
      default:
        return errorInfo.message || '操作失败，请重试';
    }
  }

  // 判断是否可重试
  private isRetryable(errorInfo: ErrorInfo, config: ErrorHandlerConfig): boolean {
    if (config.retryable === false) return false;
    
    // 网络错误通常可以重试
    if (errorInfo.type === ErrorType.NETWORK) {
      return true;
    }
    
    // 数据库连接错误可以重试
    if (errorInfo.code === ErrorCode.DATABASE_CONNECTION_FAILED) {
      return true;
    }
    
    // 验证错误通常不需要重试
    if (errorInfo.type === ErrorType.VALIDATION) {
      return false;
    }
    
    // 权限错误不需要重试
    if (errorInfo.type === ErrorType.PERMISSION) {
      return false;
    }
    
    return config.retryable === true;
  }

  // 获取错误历史
  getErrorHistory(): ErrorInfo[] {
    return [...this.errorHistory];
  }

  // 清理错误历史
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  // 获取错误统计
  getErrorStats(): Record<ErrorType, number> {
    const stats: Record<ErrorType, number> = {
      [ErrorType.NETWORK]: 0,
      [ErrorType.VALIDATION]: 0,
      [ErrorType.DATABASE]: 0,
      [ErrorType.PERMISSION]: 0,
      [ErrorType.UNKNOWN]: 0
    };

    this.errorHistory.forEach(error => {
      stats[error.type]++;
    });

    return stats;
  }

  // 检查是否有特定类型的错误
  hasErrorsOfType(type: ErrorType, timeWindow?: number): boolean {
    const now = Date.now();
    const window = timeWindow || 24 * 60 * 60 * 1000; // 默认24小时

    return this.errorHistory.some(error => 
      error.type === type && (now - error.timestamp) < window
    );
  }
}

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance();

// 便捷函数
export const handleError = (
  error: Error | string | any,
  config?: ErrorHandlerConfig,
  context?: Record<string, any>
) => errorHandler.handleError(error, config, context);

// 重试函数
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw error;
      }

      // 检查是否应该重试
      const handleResult = handleError(error, { retryable: true });
      if (!handleResult.shouldRetry) {
        throw error;
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};