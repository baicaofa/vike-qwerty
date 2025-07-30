/**
 * 优化的内存管理器
 * 提供轻量级的内存监控和清理功能
 */

interface MemoryStats {
  used: number;
  total: number;
  limit: number;
  usage: number;
}

class OptimizedMemoryManager {
  private static instance: OptimizedMemoryManager;
  private isMonitoring = false;
  private cleanupThreshold = 0.8; // 80% 内存使用率阈值
  private checkInterval = 30000; // 30秒检查一次
  private intervalId: NodeJS.Timeout | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  static getInstance(): OptimizedMemoryManager {
    if (!OptimizedMemoryManager.instance) {
      OptimizedMemoryManager.instance = new OptimizedMemoryManager();
    }
    return OptimizedMemoryManager.instance;
  }

  /**
   * 获取内存使用情况
   */
  getMemoryStats(): MemoryStats | null {
    if (typeof window === "undefined") return null;

    const perf = window.performance as any;
    if (!perf?.memory) return null;

    const used = perf.memory.usedJSHeapSize;
    const total = perf.memory.totalJSHeapSize;
    const limit = perf.memory.jsHeapSizeLimit;
    const usage = used / total;

    return { used, total, limit, usage };
  }

  /**
   * 轻量级内存清理
   */
  performCleanup(): void {
    if (typeof window === "undefined") return;

    try {
      // 清理性能标记
      if (window.performance?.clearMarks) {
        window.performance.clearMarks();
      }
      if (window.performance?.clearMeasures) {
        window.performance.clearMeasures();
      }

      // 清理大型 localStorage 项
      const largeKeys = [
        "critical_metrics",
        "word_stats_cache",
        "typing_history",
        "review_cache",
      ];

      let cleanedSize = 0;
      largeKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data && data.length > 10000) {
          // 只清理大于10KB的数据
          cleanedSize += data.length;
          localStorage.removeItem(key);
        }
      });

      // 清理全局缓存
      const cacheKeys = ["__WORD_CACHE__", "__DICT_CACHE__"];
      cacheKeys.forEach((key) => {
        if ((window as any)[key]) {
          delete (window as any)[key];
        }
      });

      if (cleanedSize > 0) {
        console.log(
          `🧹 内存清理完成，释放 ${(cleanedSize / 1024).toFixed(1)}KB`
        );
      }
    } catch (error) {
      console.warn("内存清理失败:", error);
    }
  }

  /**
   * 启动内存监控
   */
  startMonitoring(threshold = 0.8): void {
    if (this.isMonitoring || typeof window === "undefined") return;

    this.cleanupThreshold = threshold;
    this.isMonitoring = true;

    this.intervalId = setInterval(() => {
      const stats = this.getMemoryStats();
      if (stats && stats.usage > this.cleanupThreshold) {
        console.warn(`⚠️ 内存使用过高: ${(stats.usage * 100).toFixed(1)}%`);
        this.performCleanup();
      }
    }, this.checkInterval);

    console.log(`👀 内存监控已启动，阈值: ${(threshold * 100).toFixed(0)}%`);
  }

  /**
   * 停止内存监控
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    console.log("🛑 内存监控已停止");
  }

  /**
   * 设置清理阈值
   */
  setCleanupThreshold(threshold: number): void {
    this.cleanupThreshold = Math.max(0.5, Math.min(0.95, threshold));
  }

  /**
   * 获取当前监控状态
   */
  getMonitoringStatus(): { isMonitoring: boolean; threshold: number } {
    return {
      isMonitoring: this.isMonitoring,
      threshold: this.cleanupThreshold,
    };
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.stopMonitoring();
    OptimizedMemoryManager.instance = null as any;
  }
}

// 导出单例实例
export const memoryManager = OptimizedMemoryManager.getInstance();

// 默认启动监控（仅在浏览器环境中）
if (typeof window !== "undefined") {
  // 延迟启动，避免影响页面初始化
  setTimeout(() => {
    const stats = memoryManager.getMemoryStats();
    if (stats && stats.usage > 0.7) {
      console.warn("检测到高内存使用，执行清理...");
      memoryManager.performCleanup();
    }

    // 启动内存监控
    memoryManager.startMonitoring(0.85);
  }, 2000);

  // 页面卸载时清理
  window.addEventListener("beforeunload", () => {
    memoryManager.stopMonitoring();
  });
}

export default memoryManager;
