/**
 * 简化复习系统核心模块
 * 基于固定间隔序列的渐进式复习系统
 */

// 简化的优先级计算
export { filterDueWords, filterUrgentWords } from "./priorityCalculator";

// 简化的复习计划生成
export {
  generateDailyReviewPlan,
  getDueWordsForReview,
  updateWordReviewSchedule,
  syncWordPracticeToReview,
  completeWordReview,
  resetDailyReviewCounts,
  type DailyReviewPlan,
} from "./scheduleGenerator";

// 配置管理
export {
  getReviewConfig,
  updateReviewConfig,
  applyPresetConfig,
  resetToDefaultConfig,
  getConfigRecommendations,
  exportConfig,
  importConfig,
  clearConfigCache,
  DEFAULT_REVIEW_CONFIG,
  PRESET_CONFIGS,
} from "./config";

// 数据模型
export type { IWordReviewRecord } from "../db/wordReviewRecord";
export type { IReviewHistory } from "../db/reviewHistory";
export type { IReviewConfig } from "../db/reviewConfig";
export { WordReviewRecord } from "../db/wordReviewRecord";
export { ReviewHistory } from "../db/reviewHistory";
export { ReviewConfig } from "../db/reviewConfig";

/**
 * 算法版本信息
 */
export const ALGORITHM_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  toString: () => "1.0.0",
};

/**
 * 简化复习系统常量
 */
export const ALGORITHM_CONSTANTS = {
  // 时间常量（毫秒）
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_MINUTE: 60 * 1000,

  // 默认间隔序列（天）
  DEFAULT_INTERVALS: [1, 3, 7, 15, 30, 60],

  // 复习进度阈值
  PROGRESS_THRESHOLDS: {
    EXCELLENT: 0.9,
    GOOD: 0.7,
    FAIR: 0.5,
    POOR: 0.3,
    CRITICAL: 0.1,
  },

  // 响应时间分类（毫秒）
  RESPONSE_TIME_CATEGORIES: {
    VERY_FAST: 1000,
    FAST: 2000,
    NORMAL: 3000,
    SLOW: 5000,
    VERY_SLOW: 8000,
  },
};

/**
 * 简化复习系统工具函数
 */
export const AlgorithmUtils = {
  /**
   * 将毫秒转换为天数
   */
  millisecondsToDays: (ms: number): number => {
    return ms / ALGORITHM_CONSTANTS.ONE_DAY;
  },

  /**
   * 将天数转换为毫秒
   */
  daysToMilliseconds: (days: number): number => {
    return days * ALGORITHM_CONSTANTS.ONE_DAY;
  },

  /**
   * 格式化复习进度为百分比
   */
  formatProgress: (progress: number): string => {
    return `${Math.round(progress * 100)}%`;
  },

  /**
   * 获取复习进度等级
   */
  getProgressLevel: (progress: number): string => {
    const thresholds = ALGORITHM_CONSTANTS.PROGRESS_THRESHOLDS;
    if (progress >= thresholds.EXCELLENT) return "excellent";
    if (progress >= thresholds.GOOD) return "good";
    if (progress >= thresholds.FAIR) return "fair";
    if (progress >= thresholds.POOR) return "poor";
    return "critical";
  },

  /**
   * 获取复习等级名称
   */
  getReviewLevelName: (level: number): string => {
    const levels = [
      "beginner",
      "novice",
      "intermediate",
      "advanced",
      "expert",
      "master",
      "perfect",
    ];
    return levels[Math.min(level, levels.length - 1)] || "beginner";
  },

  /**
   * 获取响应时间分类
   */
  getResponseTimeCategory: (responseTime: number): string => {
    const categories = ALGORITHM_CONSTANTS.RESPONSE_TIME_CATEGORIES;
    if (responseTime <= categories.VERY_FAST) return "very_fast";
    if (responseTime <= categories.FAST) return "fast";
    if (responseTime <= categories.NORMAL) return "normal";
    if (responseTime <= categories.SLOW) return "slow";
    return "very_slow";
  },

  /**
   * 计算两个时间戳之间的天数差
   */
  daysBetween: (timestamp1: number, timestamp2: number): number => {
    return Math.abs(timestamp2 - timestamp1) / ALGORITHM_CONSTANTS.ONE_DAY;
  },

  /**
   * 获取今天的开始时间戳
   */
  getTodayStart: (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  },

  /**
   * 获取今天的结束时间戳
   */
  getTodayEnd: (): number => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today.getTime();
  },

  /**
   * 检查时间戳是否为今天
   */
  isToday: (timestamp: number): boolean => {
    const today = new Date();
    const date = new Date(timestamp);
    return today.toDateString() === date.toDateString();
  },

  /**
   * 生成复习会话ID
   */
  generateSessionId: (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

/**
 * 算法性能监控
 */
export class AlgorithmPerformanceMonitor {
  private static metrics: Map<
    string,
    {
      count: number;
      totalTime: number;
      averageTime: number;
      maxTime: number;
      minTime: number;
    }
  > = new Map();

  /**
   * 开始性能监控
   */
  static startTiming(operation: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric(operation, duration);
    };
  }

  /**
   * 记录性能指标
   */
  private static recordMetric(operation: string, duration: number): void {
    const existing = this.metrics.get(operation);

    if (existing) {
      existing.count++;
      existing.totalTime += duration;
      existing.averageTime = existing.totalTime / existing.count;
      existing.maxTime = Math.max(existing.maxTime, duration);
      existing.minTime = Math.min(existing.minTime, duration);
    } else {
      this.metrics.set(operation, {
        count: 1,
        totalTime: duration,
        averageTime: duration,
        maxTime: duration,
        minTime: duration,
      });
    }
  }

  /**
   * 获取性能报告
   */
  static getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};

    this.metrics.forEach((metric, operation) => {
      report[operation] = {
        ...metric,
        averageTime: Math.round(metric.averageTime * 100) / 100,
        maxTime: Math.round(metric.maxTime * 100) / 100,
        minTime: Math.round(metric.minTime * 100) / 100,
      };
    });

    return report;
  }

  /**
   * 清除性能数据
   */
  static clearMetrics(): void {
    this.metrics.clear();
  }
}

/**
 * 算法调试工具
 */
export class AlgorithmDebugger {
  private static isEnabled = false;
  private static logs: Array<{
    timestamp: number;
    operation: string;
    data: any;
  }> = [];

  /**
   * 启用调试模式
   */
  static enable(): void {
    this.isEnabled = true;
  }

  /**
   * 禁用调试模式
   */
  static disable(): void {
    this.isEnabled = false;
  }

  /**
   * 记录调试信息
   */
  static log(operation: string, data: any): void {
    if (!this.isEnabled) return;

    const logEntry = {
      timestamp: Date.now(),
      operation,
      data,
    };

    this.logs.push(logEntry);

    // 保持最近1000条日志
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  /**
   * 获取调试日志
   */
  static getLogs(): Array<{
    timestamp: number;
    operation: string;
    data: any;
  }> {
    return [...this.logs];
  }

  /**
   * 清除调试日志
   */
  static clearLogs(): void {
    this.logs = [];
  }
}
