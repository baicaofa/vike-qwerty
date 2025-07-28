/**
 * 应急内存清理工具
 * 用于在内存使用过高时立即释放内存
 */

interface MemoryInfo {
  used: number;
  total: number;
  limit: number;
  usage: number;
}

export class MemoryEmergencyCleanup {
  /**
   * 获取当前内存使用情况
   */
  static getMemoryInfo(): MemoryInfo | null {
    if (typeof window === "undefined") return null;

    const perf = window.performance as any;
    if (!perf.memory) return null;

    const used = perf.memory.usedJSHeapSize;
    const total = perf.memory.totalJSHeapSize;
    const limit = perf.memory.jsHeapSizeLimit;
    const usage = used / total;

    return { used, total, limit, usage };
  }

  /**
   * 立即执行内存清理
   */
  static emergencyCleanup(): void {
    console.log("🚨 执行应急内存清理...");

    try {
      // 1. 清理性能监控数据
      this.cleanupPerformanceMonitor();

      // 2. 清理localStorage
      this.cleanupLocalStorage();

      // 3. 清理全局缓存
      this.cleanupGlobalCaches();

      // 4. 强制垃圾回收（如果可用）
      this.forceGarbageCollection();

      const memoryInfo = this.getMemoryInfo();
      console.log("✅ 内存清理完成", memoryInfo);
    } catch (error) {
      console.error("❌ 内存清理失败:", error);
    }
  }

  /**
   * 清理性能监控器数据
   */
  private static cleanupPerformanceMonitor(): void {
    try {
      // 访问全局性能监控器
      const performanceMonitor = (window as any).performanceMonitor;
      if (performanceMonitor && performanceMonitor.emergencyCleanup) {
        performanceMonitor.emergencyCleanup();
      }

      // 清理performance entries
      if (window.performance && window.performance.clearMarks) {
        window.performance.clearMarks();
      }
      if (window.performance && window.performance.clearMeasures) {
        window.performance.clearMeasures();
      }

      console.log("📊 性能监控数据已清理");
    } catch (error) {
      console.warn("性能监控数据清理失败:", error);
    }
  }

  /**
   * 清理localStorage中的大数据
   */
  private static cleanupLocalStorage(): void {
    try {
      const keysToClean = [
        "critical_metrics",
        "word_stats_cache",
        "typing_history",
        "review_cache",
        "dict_cache",
      ];

      let totalCleaned = 0;
      keysToClean.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          totalCleaned += data.length;
          localStorage.removeItem(key);
        }
      });

      console.log(
        `🗑️ localStorage已清理，释放 ${(totalCleaned / 1024).toFixed(1)}KB`
      );
    } catch (error) {
      console.warn("localStorage清理失败:", error);
    }
  }

  /**
   * 清理全局缓存对象
   */
  private static cleanupGlobalCaches(): void {
    try {
      // 清理可能的全局缓存
      const globalThis = window as any;

      const cacheKeys = [
        "__WORD_CACHE__",
        "__DICT_CACHE__",
        "__AUDIO_CACHE__",
        "__TYPING_CACHE__",
      ];

      cacheKeys.forEach((key) => {
        if (globalThis[key]) {
          delete globalThis[key];
        }
      });

      console.log("🗃️ 全局缓存已清理");
    } catch (error) {
      console.warn("全局缓存清理失败:", error);
    }
  }

  /**
   * 强制垃圾回收（仅在开发环境或特殊浏览器中可用）
   */
  private static forceGarbageCollection(): void {
    try {
      // Chrome DevTools
      if ((window as any).gc) {
        (window as any).gc();
        console.log("🗑️ 强制垃圾回收已执行");
        return;
      }

      // 创建大量临时对象强制触发GC
      const tempArrays = [];
      for (let i = 0; i < 100; i++) {
        tempArrays.push(new Array(1000).fill(Math.random()));
      }
      // 立即释放引用
      tempArrays.length = 0;

      console.log("♻️ 已尝试触发垃圾回收");
    } catch (error) {
      console.warn("垃圾回收触发失败:", error);
    }
  }

  /**
   * 监控内存使用并在需要时自动清理
   */
  static startMemoryWatch(threshold = 0.85): void {
    const checkInterval = setInterval(() => {
      const memoryInfo = this.getMemoryInfo();
      if (memoryInfo && memoryInfo.usage > threshold) {
        console.warn(
          `⚠️ 内存使用过高: ${(memoryInfo.usage * 100).toFixed(1)}%`
        );
        this.emergencyCleanup();
      }
    }, 30000); // 每30秒检查一次

    // 页面卸载时清理定时器
    window.addEventListener("beforeunload", () => {
      clearInterval(checkInterval);
    });

    console.log(`👀 内存监控已启动，阈值: ${(threshold * 100).toFixed(0)}%`);
  }
}

// 立即执行一次清理
if (typeof window !== "undefined") {
  // 延迟执行，避免影响页面初始化
  setTimeout(() => {
    const memoryInfo = MemoryEmergencyCleanup.getMemoryInfo();
    if (memoryInfo && memoryInfo.usage > 0.8) {
      console.warn("检测到高内存使用，执行清理...");
      MemoryEmergencyCleanup.emergencyCleanup();
    }

    // 启动内存监控
    MemoryEmergencyCleanup.startMemoryWatch(0.85);
  }, 1000);
}

export default MemoryEmergencyCleanup;
