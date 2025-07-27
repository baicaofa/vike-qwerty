/**
 * 性能监控工具
 * 用于监控复习系统的性能指标和系统健康状况
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category:
    | "memory"
    | "timing"
    | "database"
    | "render"
    | "network"
    | "excel-parsing";
  metadata?: Record<string, unknown>;
}

/**
 * Excel解析性能指标接口
 */
interface ExcelParsingMetrics {
  fileSize: number;
  totalRows: number;
  validRows: number;
  parsingTime: number;
  validationTime: number;
  memoryUsage: number;
  workerUsed: boolean;
  errorCount: number;
}

interface SystemHealth {
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  databasePerformance: {
    averageQueryTime: number;
    slowQueries: number;
    totalQueries: number;
  };
  renderPerformance: {
    averageFPS: number;
    slowRenders: number;
    totalRenders: number;
  };
  errorRate: {
    errors: number;
    total: number;
    percentage: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // 最多保存1000个指标
  private isEnabled = true;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    if (typeof window === "undefined") return;

    try {
      // 监控长任务
      if ("PerformanceObserver" in window) {
        const longTaskObserver = new PerformanceObserver(
          (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
              this.recordMetric({
                name: "long-task",
                value: entry.duration,
                timestamp: Date.now(),
                category: "timing",
                metadata: {
                  startTime: entry.startTime,
                  name: entry.name,
                },
              });
            }
          }
        );

        try {
          longTaskObserver.observe({ entryTypes: ["longtask"] });
          this.observers.push(longTaskObserver);
        } catch (e) {
          console.warn("Long task observer not supported");
        }

        // 监控导航性能
        const navigationObserver = new PerformanceObserver(
          (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
              this.recordMetric({
                name: "navigation",
                value: entry.duration,
                timestamp: Date.now(),
                category: "timing",
                metadata: {
                  type: (entry as PerformanceNavigationTiming).type,
                  redirectCount: (entry as PerformanceNavigationTiming)
                    .redirectCount,
                },
              });
            }
          }
        );

        try {
          navigationObserver.observe({ entryTypes: ["navigation"] });
          this.observers.push(navigationObserver);
        } catch (e) {
          console.warn("Navigation observer not supported");
        }
      }
    } catch (error) {
      console.warn("Failed to initialize performance observers:", error);
    }
  }

  /**
   * 记录性能指标
   */
  recordMetric(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    this.metrics.push(metric);

    // 保持指标数量在限制内
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.splice(0, this.metrics.length - this.maxMetrics);
    }

    // 如果是关键性能问题，立即报告
    if (this.isCriticalMetric(metric)) {
      this.reportCriticalMetric(metric);
    }
  }

  /**
   * 判断是否为关键性能指标
   */
  private isCriticalMetric(metric: PerformanceMetric): boolean {
    switch (metric.name) {
      case "long-task":
        return metric.value > 50; // 超过50ms的长任务
      case "database-query":
        return metric.value > 1000; // 超过1秒的数据库查询
      case "memory-usage":
        return metric.value > 0.9; // 内存使用超过90%
      default:
        return false;
    }
  }

  /**
   * 报告关键性能问题
   */
  private reportCriticalMetric(metric: PerformanceMetric) {
    console.warn("Critical performance metric detected:", metric);

    // 这里可以发送到监控服务
    // 暂时存储到localStorage
    const criticalMetrics = JSON.parse(
      localStorage.getItem("critical_metrics") || "[]"
    );
    criticalMetrics.push(metric);

    // 只保留最近的50个关键指标
    if (criticalMetrics.length > 50) {
      criticalMetrics.splice(0, criticalMetrics.length - 50);
    }

    localStorage.setItem("critical_metrics", JSON.stringify(criticalMetrics));
  }

  /**
   * 测量函数执行时间
   */
  measureFunction<T>(
    name: string,
    fn: () => T,
    category: PerformanceMetric["category"] = "timing"
  ): T {
    const startTime = performance.now();

    try {
      const result = fn();

      // 如果是Promise，等待完成后记录
      if (result instanceof Promise) {
        result.finally(() => {
          const endTime = performance.now();
          this.recordMetric({
            name,
            value: endTime - startTime,
            timestamp: Date.now(),
            category,
            metadata: { async: true },
          });
        });
      } else {
        const endTime = performance.now();
        this.recordMetric({
          name,
          value: endTime - startTime,
          timestamp: Date.now(),
          category,
        });
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric({
        name: `${name}-error`,
        value: endTime - startTime,
        timestamp: Date.now(),
        category,
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  }

  /**
   * 测量异步函数执行时间
   */
  async measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>,
    category: PerformanceMetric["category"] = "timing"
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const endTime = performance.now();

      this.recordMetric({
        name,
        value: endTime - startTime,
        timestamp: Date.now(),
        category,
        metadata: { async: true },
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric({
        name: `${name}-error`,
        value: endTime - startTime,
        timestamp: Date.now(),
        category,
        metadata: {
          async: true,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  }

  /**
   * 记录内存使用情况
   */
  recordMemoryUsage() {
    if (typeof window === "undefined" || !("performance" in window)) return;

    try {
      const perf = window.performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      if (perf.memory) {
        const usage = perf.memory.usedJSHeapSize / perf.memory.totalJSHeapSize;

        this.recordMetric({
          name: "memory-usage",
          value: usage,
          timestamp: Date.now(),
          category: "memory",
          metadata: {
            used: perf.memory.usedJSHeapSize,
            total: perf.memory.totalJSHeapSize,
            limit: perf.memory.jsHeapSizeLimit,
          },
        });
      }
    } catch (error) {
      console.warn("Failed to record memory usage:", error);
    }
  }

  /**
   * 获取系统健康状况
   */
  getSystemHealth(): SystemHealth {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      (m) => now - m.timestamp < 5 * 60 * 1000
    ); // 最近5分钟

    // 内存使用情况
    const memoryMetrics = recentMetrics.filter(
      (m) => m.name === "memory-usage"
    );
    const latestMemory = memoryMetrics[memoryMetrics.length - 1];

    // 数据库性能
    const dbMetrics = recentMetrics.filter((m) => m.category === "database");
    const avgDbTime =
      dbMetrics.length > 0
        ? dbMetrics.reduce((sum, m) => sum + m.value, 0) / dbMetrics.length
        : 0;
    const slowDbQueries = dbMetrics.filter((m) => m.value > 1000).length;

    // 渲染性能
    const renderMetrics = recentMetrics.filter((m) => m.category === "render");
    const avgRenderTime =
      renderMetrics.length > 0
        ? renderMetrics.reduce((sum, m) => sum + m.value, 0) /
          renderMetrics.length
        : 0;
    const slowRenders = renderMetrics.filter((m) => m.value > 16.67).length; // 超过60fps

    // 错误率
    const errorMetrics = recentMetrics.filter((m) => m.name.includes("error"));
    const totalOperations = recentMetrics.length;
    const errorRate =
      totalOperations > 0 ? errorMetrics.length / totalOperations : 0;

    return {
      memoryUsage: {
        used:
          typeof latestMemory?.metadata?.used === "number"
            ? latestMemory.metadata.used
            : 0,
        total:
          typeof latestMemory?.metadata?.total === "number"
            ? latestMemory.metadata.total
            : 0,
        percentage:
          typeof latestMemory?.value === "number" ? latestMemory.value : 0,
      },
      databasePerformance: {
        averageQueryTime: avgDbTime,
        slowQueries: slowDbQueries,
        totalQueries: dbMetrics.length,
      },
      renderPerformance: {
        averageFPS: avgRenderTime > 0 ? 1000 / avgRenderTime : 60,
        slowRenders,
        totalRenders: renderMetrics.length,
      },
      errorRate: {
        errors: errorMetrics.length,
        total: totalOperations,
        percentage: errorRate,
      },
    };
  }

  /**
   * 获取性能指标
   */
  getMetrics(
    category?: PerformanceMetric["category"],
    limit = 100
  ): PerformanceMetric[] {
    let filtered = this.metrics;

    if (category) {
      filtered = filtered.filter((m) => m.category === category);
    }

    return filtered.slice(-limit);
  }

  /**
   * 清理旧指标
   */
  cleanup(olderThan = 24 * 60 * 60 * 1000) {
    // 默认24小时
    const cutoff = Date.now() - olderThan;
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff);
  }

  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * 记录Excel解析性能指标
   */
  recordExcelParsingMetrics(metrics: ExcelParsingMetrics) {
    if (!this.isEnabled) return;

    const timestamp = Date.now();

    // 记录总体解析时间
    this.recordMetric({
      name: "excel-parsing-total-time",
      value: metrics.parsingTime,
      timestamp,
      category: "excel-parsing",
      metadata: {
        fileSize: metrics.fileSize,
        totalRows: metrics.totalRows,
        validRows: metrics.validRows,
        workerUsed: metrics.workerUsed,
        errorCount: metrics.errorCount,
      },
    });

    // 记录验证时间
    this.recordMetric({
      name: "excel-validation-time",
      value: metrics.validationTime,
      timestamp,
      category: "excel-parsing",
      metadata: {
        totalRows: metrics.totalRows,
        validRows: metrics.validRows,
        errorRate: metrics.errorCount / metrics.totalRows,
      },
    });

    // 记录内存使用
    this.recordMetric({
      name: "excel-parsing-memory",
      value: metrics.memoryUsage,
      timestamp,
      category: "memory",
      metadata: {
        fileSize: metrics.fileSize,
        workerUsed: metrics.workerUsed,
      },
    });

    // 记录解析效率（行/秒）
    const rowsPerSecond = metrics.totalRows / (metrics.parsingTime / 1000);
    this.recordMetric({
      name: "excel-parsing-efficiency",
      value: rowsPerSecond,
      timestamp,
      category: "excel-parsing",
      metadata: {
        fileSize: metrics.fileSize,
        workerUsed: metrics.workerUsed,
      },
    });
  }

  /**
   * 检测Excel解析性能问题
   */
  detectExcelParsingIssues(metrics: ExcelParsingMetrics): string[] {
    const issues: string[] = [];

    // 检测解析时间过长
    const timeThreshold = metrics.fileSize > 1024 * 1024 ? 30000 : 10000; // 大文件30秒，小文件10秒
    if (metrics.parsingTime > timeThreshold) {
      issues.push(
        `解析时间过长: ${(metrics.parsingTime / 1000).toFixed(1)}秒 (建议: <${
          timeThreshold / 1000
        }秒)`
      );
    }

    // 检测内存使用过高
    const memoryThreshold = metrics.fileSize * 3; // 内存使用不应超过文件大小的3倍
    if (metrics.memoryUsage > memoryThreshold) {
      issues.push(
        `内存使用过高: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`
      );
    }

    // 检测错误率过高
    const errorRate = metrics.errorCount / metrics.totalRows;
    if (errorRate > 0.1) {
      issues.push(`错误率过高: ${(errorRate * 100).toFixed(1)}% (建议: <10%)`);
    }

    // 检测解析效率过低
    const efficiency = metrics.totalRows / (metrics.parsingTime / 1000);
    const minEfficiency = metrics.workerUsed ? 100 : 50; // Worker应该更高效
    if (efficiency < minEfficiency) {
      issues.push(
        `解析效率过低: ${efficiency.toFixed(
          1
        )}行/秒 (建议: >${minEfficiency}行/秒)`
      );
    }

    return issues;
  }

  /**
   * 获取Excel解析性能建议
   */
  getExcelParsingRecommendations(metrics: ExcelParsingMetrics): string[] {
    const recommendations: string[] = [];

    // 文件大小建议
    if (metrics.fileSize > 5 * 1024 * 1024) {
      recommendations.push("建议将大文件拆分为多个小文件以提高解析效率");
    }

    // Worker使用建议
    if (!metrics.workerUsed && metrics.fileSize > 1024 * 1024) {
      recommendations.push("建议对大文件使用Web Worker解析以避免UI阻塞");
    }

    // 数据质量建议
    const errorRate = metrics.errorCount / metrics.totalRows;
    if (errorRate > 0.05) {
      recommendations.push("建议检查Excel文件格式，减少数据错误以提高解析效率");
    }

    // 性能优化建议
    const efficiency = metrics.totalRows / (metrics.parsingTime / 1000);
    if (efficiency < 50) {
      recommendations.push("建议优化数据格式或减少复杂的验证逻辑");
    }

    return recommendations;
  }

  /**
   * 获取Excel解析性能统计
   */
  getExcelParsingStats(): {
    totalParsings: number;
    averageTime: number;
    averageEfficiency: number;
    workerUsageRate: number;
    commonIssues: string[];
  } {
    const excelMetrics = this.metrics.filter(
      (m) =>
        m.category === "excel-parsing" && m.name === "excel-parsing-total-time"
    );

    if (excelMetrics.length === 0) {
      return {
        totalParsings: 0,
        averageTime: 0,
        averageEfficiency: 0,
        workerUsageRate: 0,
        commonIssues: [],
      };
    }

    const totalParsings = excelMetrics.length;
    const averageTime =
      excelMetrics.reduce((sum, m) => sum + m.value, 0) / totalParsings;

    const efficiencyMetrics = this.metrics.filter(
      (m) => m.name === "excel-parsing-efficiency"
    );
    const averageEfficiency =
      efficiencyMetrics.length > 0
        ? efficiencyMetrics.reduce((sum, m) => sum + m.value, 0) /
          efficiencyMetrics.length
        : 0;

    const workerUsageCount = excelMetrics.filter(
      (m) => m.metadata?.workerUsed
    ).length;
    const workerUsageRate = workerUsageCount / totalParsings;

    // 分析常见问题
    const commonIssues: string[] = [];
    if (averageTime > 15000) commonIssues.push("解析时间普遍过长");
    if (averageEfficiency < 75) commonIssues.push("解析效率偏低");
    if (workerUsageRate < 0.5) commonIssues.push("Worker使用率偏低");

    return {
      totalParsings,
      averageTime,
      averageEfficiency,
      workerUsageRate,
      commonIssues,
    };
  }

  /**
   * 销毁监控器
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

/**
 * Excel解析性能监控装饰器
 */
export function withExcelParsingMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  getMetrics: (args: T, result: R, duration: number) => ExcelParsingMetrics
) {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

    try {
      const result = await fn(...args);
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const duration = endTime - startTime;
      const memoryUsed = Math.max(0, endMemory - startMemory);

      // 获取性能指标
      const metrics = getMetrics(args, result, duration);
      metrics.memoryUsage = memoryUsed;

      // 记录性能指标
      performanceMonitor.recordExcelParsingMetrics(metrics);

      // 检测性能问题
      const issues = performanceMonitor.detectExcelParsingIssues(metrics);
      if (issues.length > 0) {
        console.warn("Excel解析性能问题:", issues);
      }

      // 获取优化建议
      const recommendations =
        performanceMonitor.getExcelParsingRecommendations(metrics);
      if (recommendations.length > 0) {
        console.info("Excel解析优化建议:", recommendations);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // 记录错误情况的性能指标
      const errorMetrics: ExcelParsingMetrics = {
        fileSize: 0,
        totalRows: 0,
        validRows: 0,
        parsingTime: duration,
        validationTime: 0,
        memoryUsage: 0,
        workerUsed: false,
        errorCount: 1,
      };

      performanceMonitor.recordExcelParsingMetrics(errorMetrics);
      throw error;
    }
  };
}

/**
 * 导出Excel解析性能指标类型
 */
export type { ExcelParsingMetrics };

// 定期记录内存使用情况
if (typeof window !== "undefined") {
  setInterval(() => {
    performanceMonitor.recordMemoryUsage();
  }, 30000); // 每30秒记录一次
}

export default performanceMonitor;
