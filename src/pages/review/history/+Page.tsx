import ReviewNav from "@/components/ReviewNav";
import { Link } from "@/components/ui/Link";
import { useReviewHistory } from "@/hooks/useSpacedRepetition";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import { WordReviewRecord } from "@/utils/db/wordReviewRecord";
import type React from "react";
import { useState } from "react";

// 辅助函数：将IWordReviewRecord转换为WordReviewRecord实例
const toWordRecord = (word: IWordReviewRecord): WordReviewRecord => {
  const record = new WordReviewRecord(
    word.word,
    word.sourceDicts,
    word.preferredDict,
    word.firstSeenAt,
    word.lastReviewedAt
  );
  Object.assign(record, word);
  return record;
};

const TimeRangeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const options = [
    { value: "7d", label: "最近7天" },
    { value: "30d", label: "最近30天" },
    { value: "90d", label: "最近3个月" },
    { value: "all", label: "全部时间" },
  ];

  return (
    <select
      aria-label="选择时间范围"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const HistoryChart: React.FC<{
  data: Array<{ date: string; reviewed: number; accuracy: number }>;
}> = ({ data }) => {
  const maxReviewed = Math.max(...data.map((d) => d.reviewed));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-16 text-sm text-gray-600">{item.date}</div>
          <div className="flex-1 relative h-8 bg-gray-100 rounded">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 rounded flex items-center justify-end pr-2"
              style={{ width: `${(item.reviewed / maxReviewed) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">
                {item.reviewed}
              </span>
            </div>
          </div>
          <div className="w-16 text-sm text-gray-600 text-right">
            {item.accuracy}%
          </div>
        </div>
      ))}
    </div>
  );
};

const WordHistoryCard: React.FC<{
  word: IWordReviewRecord;
}> = ({ word }) => {
  // 使用lastReviewDate作为最后复习时间
  const lastReviewTime = word.lastReviewDate;

  const getLevelColor = (level: number) => {
    if (level >= 5) return "text-green-600 bg-green-50";
    if (level >= 3) return "text-blue-600 bg-blue-50";
    if (level >= 1) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{word.word}</h3>
        <div
          className={`px-2 py-1 rounded text-sm font-medium ${getLevelColor(
            word.currentIntervalIndex
          )}`}
        >
          等级 {word.currentIntervalIndex}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">复习次数:</span>
          <span className="ml-2 font-medium">{word.reviewLevel}</span>
        </div>
        <div>
          <span className="text-gray-600">当前等级:</span>
          <span className="ml-2 font-medium">Lv.{word.reviewLevel}</span>
        </div>
        <div>
          <span className="text-gray-600">连续正确:</span>
          <span className="ml-2 font-medium">{word.consecutiveCorrect}</span>
        </div>
        <div>
          <span className="text-gray-600">最后复习:</span>
          <span className="ml-2 font-medium">
            {lastReviewTime
              ? new Date(lastReviewTime).toLocaleDateString()
              : "未复习"}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>词典: {word.preferredDict}</span>
          <span>
            下次复习: {new Date(word.nextReviewAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red";
}> = ({ title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
    </div>
  );
};

export default function ReviewHistory() {
  const [timeRange, setTimeRange] = useState("30d");
  const [sortBy, setSortBy] = useState<
    "recent" | "frequency" | "strength" | "level"
  >("recent");
  const { history, stats, loading } = useReviewHistory(timeRange);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载历史记录中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 生成图表数据（模拟数据，实际应该从历史记录中计算）
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      }),
      reviewed: Math.floor(Math.random() * 50) + 10,
      accuracy: Math.floor(Math.random() * 30) + 70,
    };
  });

  const getSortedWords = () => {
    if (!history) return [];

    const sorted = [...history];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => b.lastReviewedAt - a.lastReviewedAt);
      case "frequency":
        return sorted.sort((a, b) => b.reviewLevel - a.reviewLevel);
      case "strength":
        return sorted.sort((a, b) => {
          const aRecord = toWordRecord(a);
          const bRecord = toWordRecord(b);
          return (
            bRecord.getCurrentMemoryStrength() -
            aRecord.getCurrentMemoryStrength()
          );
        });
      case "level":
        return sorted.sort((a, b) => b.reviewLevel - a.reviewLevel);
      default:
        return sorted;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewNav />

      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">复习历史</h1>
          <Link
            href="/review/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 返回仪表板
          </Link>
        </div>
        <p className="text-gray-600">查看您的复习记录和学习进展</p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

            <select
              aria-label="选择排序方式"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "recent"
                    | "frequency"
                    | "strength"
                    | "level"
                )
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">按最近复习排序</option>
              <option value="frequency">按复习频次排序</option>
              <option value="strength">按记忆强度排序</option>
              <option value="level">按复习等级排序</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            共 {history?.length || 0} 个单词记录
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="总复习次数"
            value={stats.totalReviews}
            color="blue"
          />
          <StatCard
            title="平均准确率"
            value={`${stats.averageAccuracy}%`}
            color="green"
          />
          <StatCard
            title="学习天数"
            value={stats.studyDays}
            subtitle="有复习记录的天数"
            color="yellow"
          />
          <StatCard
            title="掌握单词"
            value={stats.masteredWords}
            subtitle="记忆强度 > 80%"
            color="green"
          />
        </div>
      )}

      {/* 复习趋势图表 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">复习趋势</h2>
        <HistoryChart data={chartData} />
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>每日复习数量和准确率</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>复习数量</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>准确率</span>
            </div>
          </div>
        </div>
      </div>

      {/* 单词历史列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          单词复习记录
        </h2>

        {history && history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getSortedWords().map((word) => (
              <WordHistoryCard key={word.id} word={word} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              暂无复习记录
            </h3>
            <p className="text-gray-600 mb-4">
              开始复习单词后，这里将显示您的学习历史
            </p>
            <Link
              href="/review/today"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              开始复习
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
