import { Link } from "../../../components/ui/Link";
import {
  useDailyReviewPlan,
  useReviewConfig,
  useReviewStatistics,
} from "../../../hooks/useSpacedRepetition";
import ReviewNav from "@/components/ReviewNav";
import type React from "react";

// 图表组件（简化版，可以后续替换为更复杂的图表库）
const ProgressChart: React.FC<{
  data: Array<{
    date: string;
    reviewed: number;
    target: number;
    accuracy: number;
  }>;
}> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.reviewed, d.target)));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{item.date}</div>
            <div className="text-xs text-gray-500">
              准确率: {item.accuracy}%
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative h-6 bg-gray-200 rounded">
              <div
                className="absolute left-0 top-0 h-full bg-blue-500 rounded flex items-center justify-center"
                style={{ width: `${(item.reviewed / maxValue) * 100}%` }}
              >
                {item.reviewed > 0 && (
                  <span className="text-xs text-white font-medium">
                    {item.reviewed}
                  </span>
                )}
              </div>
              <div
                className="absolute left-0 top-0 h-full border-2 border-blue-300 rounded pointer-events-none"
                style={{ width: `${(item.target / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-20 text-sm text-gray-600">
              {item.reviewed}/{item.target}
            </div>
          </div>
          {/* 准确率条 */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative h-2 bg-gray-100 rounded">
              <div
                className={`absolute left-0 top-0 h-full rounded ${
                  item.accuracy >= 90
                    ? "bg-green-500"
                    : item.accuracy >= 80
                    ? "bg-blue-500"
                    : item.accuracy >= 70
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${item.accuracy}%` }}
              />
            </div>
            <div className="w-20 text-xs text-gray-500">{item.accuracy}%</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  color?: "blue" | "green" | "yellow" | "red" | "gray";
}> = ({ title, value, subtitle, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const trendIcons = {
    up: "↗️",
    down: "↘️",
    stable: "➡️",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {trend && <span className="text-lg">{trendIcons[trend]}</span>}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
    </div>
  );
};

export default function ReviewDashboard() {
  const { stats, loading: statsLoading } = useReviewStatistics();
  const { config, loading: configLoading } = useReviewConfig();
  const { plan, loading: planLoading } = useDailyReviewPlan();

  if (statsLoading || configLoading || planLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 生成最近7天的复习数据（使用真实统计数据或模拟数据）
  const recentProgress =
    stats?.weeklyProgress ||
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("zh-CN", {
          month: "numeric",
          day: "numeric",
        }),
        reviewed: 0,
        target: config?.dailyReviewTarget || 50,
        accuracy: 0, // 默认准确率为0
      };
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewNav />

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">复习仪表板</h1>
        <p className="text-gray-600">查看您的复习进度和统计数据</p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="今日复习"
          value={stats?.reviewedToday || 0}
          subtitle={`目标: ${config?.dailyReviewTarget || 50}`}
          color="blue"
          trend={
            (stats?.reviewedToday || 0) >= (config?.dailyReviewTarget || 50)
              ? "up"
              : "stable"
          }
        />

        <StatCard
          title="待复习单词"
          value={stats?.dueWords || 0}
          subtitle="需要复习"
          color={
            (stats?.dueWords || 0) > 20
              ? "red"
              : (stats?.dueWords || 0) > 10
              ? "yellow"
              : "green"
          }
        />

        <StatCard
          title="总复习次数"
          value={stats?.monthlyStats?.totalReviews || 0}
          subtitle="累计复习"
          color="green"
        />

        <StatCard
          title="连续复习天数"
          value={stats?.streakDays || 0}
          subtitle="保持记录"
          color="yellow"
          trend="up"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 复习进度图表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            最近7天复习进度
          </h2>
          <ProgressChart data={recentProgress} />
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>实际复习</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-300 rounded"></div>
              <span>目标数量</span>
            </div>
          </div>
        </div>

        {/* 复习统计 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">复习统计</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总单词数</span>
              <span className="font-semibold">{stats?.totalWords || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已复习单词</span>
              <span className="font-semibold">
                {stats?.totalWords && stats?.dueWords
                  ? stats.totalWords - stats.dueWords
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">本周复习次数</span>
              <span className="font-semibold">
                {stats?.weeklyProgress
                  ? stats.weeklyProgress.reduce(
                      (sum, day) => sum + day.reviewed,
                      0
                    )
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 今日复习计划 */}
      {plan && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            今日复习计划
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {plan.urgentWords?.length || 0}
              </div>
              <div className="text-sm text-blue-800">紧急复习</div>
              <div className="text-xs text-blue-600 mt-1">需要立即复习</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {plan.normalWords?.length || 0}
              </div>
              <div className="text-sm text-yellow-800">正常复习</div>
              <div className="text-xs text-yellow-600 mt-1">按计划复习</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {plan.reviewWords?.length || 0}
              </div>
              <div className="text-sm text-green-800">复习单词</div>
              <div className="text-xs text-green-600 mt-1">巩固记忆</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {plan.estimatedTime}
              </div>
              <div className="text-sm text-purple-800">预估时间</div>
              <div className="text-xs text-purple-600 mt-1">分钟</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">难度等级:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  plan.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : plan.difficulty === "normal"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {plan.difficulty === "easy"
                  ? "轻松"
                  : plan.difficulty === "normal"
                  ? "适中"
                  : "困难"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {plan.loadRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/review/today"
          className="block p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📖</div>
          <h3 className="text-lg font-semibold mb-1">开始今日复习</h3>
          <p className="text-sm opacity-90">
            复习 {stats?.dueWords || 0} 个到期单词
          </p>
        </Link>

        <Link
          href="/review/settings"
          className="block p-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">⚙️</div>
          <h3 className="text-lg font-semibold mb-1">复习设置</h3>
          <p className="text-sm opacity-90">调整复习参数和偏好</p>
        </Link>

        <Link
          href="/review/history"
          className="block p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="text-lg font-semibold mb-1">复习历史</h3>
          <p className="text-sm opacity-90">查看详细的复习记录</p>
        </Link>
      </div>
    </div>
  );
}
