/**
 * 性能监控工具
 * 用于监控复习系统的性能指标和系统健康状况
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: "memory" | "timing" | "database" | "render" | "network";
  metadata?: Record<string, unknown>;
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

// 定期记录内存使用情况
if (typeof window !== "undefined") {
  setInterval(() => {
    performanceMonitor.recordMemoryUsage();
  }, 30000); // 每30秒记录一次
}

export default performanceMonitor;
