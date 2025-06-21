import type { ReviewStatsData } from "@/hooks/useReviewStats";
import React, { memo } from "react";

/**
 * 复习统计组件Props
 */
interface ReviewStatsProps {
  stats: ReviewStatsData;
  performanceLevel?: string;
  className?: string;
}

/**
 * 格式化时间显示
 */
function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * 获取准确率颜色
 */
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return "text-green-600";
  if (accuracy >= 85) return "text-blue-600";
  if (accuracy >= 70) return "text-yellow-600";
  return "text-red-600";
}

/**
 * 获取连击颜色和图标
 */
function getStreakDisplay(streak: number): { color: string; icon: string } {
  if (streak >= 10) return { color: "text-purple-600", icon: "🔥" };
  if (streak >= 5) return { color: "text-orange-600", icon: "⚡" };
  if (streak >= 3) return { color: "text-blue-600", icon: "✨" };
  return { color: "text-gray-600", icon: "💫" };
}

/**
 * 获取表现等级显示
 */
function getPerformanceLevelDisplay(level: string): {
  text: string;
  color: string;
  icon: string;
} {
  switch (level) {
    case "excellent":
      return { text: "优秀", color: "text-green-600", icon: "🏆" };
    case "good":
      return { text: "良好", color: "text-blue-600", icon: "👍" };
    case "fair":
      return { text: "一般", color: "text-yellow-600", icon: "📈" };
    case "needs-improvement":
      return { text: "需改进", color: "text-red-600", icon: "💪" };
    case "warming-up":
    default:
      return { text: "热身中", color: "text-gray-600", icon: "🔄" };
  }
}

/**
 * 统计卡片组件
 */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  animate?: boolean;
}

const StatCard = memo(
  ({
    title,
    value,
    subtitle,
    color = "text-gray-900",
    icon,
    animate = false,
  }: StatCardProps) => (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${
        animate ? "transition-all duration-300 ease-in-out" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div
        className={`text-2xl font-bold ${color} ${
          animate ? "transition-colors duration-300" : ""
        }`}
      >
        {value}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
);

StatCard.displayName = "StatCard";

/**
 * 进度条组件
 */
interface ProgressBarProps {
  progress: number; // 0-1
  className?: string;
}

const ProgressBar = memo(({ progress, className = "" }: ProgressBarProps) => {
  const percentage = Math.round(progress * 100);

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">进度</span>
        <span className="text-sm font-semibold text-gray-900">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

/**
 * 复习统计显示组件
 * 使用React.memo优化渲染性能
 */
export const ReviewStats = memo(
  ({
    stats,
    performanceLevel = "warming-up",
    className = "",
  }: ReviewStatsProps) => {
    const accuracyColor = getAccuracyColor(stats.accuracy);
    const streakDisplay = getStreakDisplay(stats.currentStreak);
    const performanceDisplay = getPerformanceLevelDisplay(performanceLevel);

    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-50 ${className}`}
      >
        {/* 准确率 */}
        <StatCard
          title="准确率"
          value={`${stats.accuracy}%`}
          subtitle={`${stats.correctCount}/${stats.totalCount}`}
          color={accuracyColor}
          icon="🎯"
          animate
        />

        {/* 平均用时 */}
        <StatCard
          title="平均用时"
          value={formatTime(stats.averageTime)}
          subtitle={
            stats.totalCount > 0
              ? `总计 ${formatTime(stats.totalTime)}`
              : undefined
          }
          color="text-blue-600"
          icon="⏱️"
          animate
        />

        {/* 连击数 */}
        <StatCard
          title="连击"
          value={stats.currentStreak}
          subtitle={stats.maxStreak > 0 ? `最高 ${stats.maxStreak}` : undefined}
          color={streakDisplay.color}
          icon={streakDisplay.icon}
          animate
        />

        {/* 表现等级 */}
        <StatCard
          title="表现"
          value={performanceDisplay.text}
          color={performanceDisplay.color}
          icon={performanceDisplay.icon}
          animate
        />

        {/* 进度条 */}
        <ProgressBar
          progress={stats.progress}
          className="md:col-span-1 lg:col-span-1"
        />
      </div>
    );
  }
);

ReviewStats.displayName = "ReviewStats";

export default ReviewStats;
