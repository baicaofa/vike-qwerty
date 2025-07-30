/**
 * PerformanceMonitor React 包装组件
 * 将 performanceMonitor 实例包装为 React 组件
 */
import { performanceMonitor } from "./performanceMonitor";
import type React from "react";
import { useEffect, useState } from "react";

interface PerformanceMonitorProps {
  onHealthUpdate?: (health: any) => void;
  onMetricsUpdate?: (metrics: any[]) => void;
  autoStart?: boolean;
}

/**
 * PerformanceMonitor React 组件
 */
const PerformanceMonitorComponent: React.FC<PerformanceMonitorProps> = ({
  onHealthUpdate,
  onMetricsUpdate,
  autoStart = true,
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (autoStart) {
      performanceMonitor.setEnabled(true);
      performanceMonitor.startMemoryMonitoring();
      setIsMonitoring(true);
    }

    // 定期更新系统健康状况
    const healthInterval = setInterval(() => {
      const health = performanceMonitor.getSystemHealth();
      onHealthUpdate?.(health);
    }, 30000); // 每30秒更新一次

    // 定期更新性能指标
    const metricsInterval = setInterval(() => {
      const metrics = performanceMonitor.getMetrics();
      onMetricsUpdate?.(metrics);
    }, 60000); // 每60秒更新一次

    return () => {
      clearInterval(healthInterval);
      clearInterval(metricsInterval);
      if (autoStart) {
        performanceMonitor.stopMemoryMonitoring();
        setIsMonitoring(false);
      }
    };
  }, [autoStart, onHealthUpdate, onMetricsUpdate]);

  // 这个组件不渲染任何UI，只提供监控功能
  return null;
};

export default PerformanceMonitorComponent;
