import type React from "react";

interface RoundProgressProps {
  currentRound: number;
  completedWords: number;
  totalWords: number;
  completionRate: number;
}

/**
 * 轮次进度显示组件
 * 展示当前轮次的完成度信息
 */
const RoundProgress: React.FC<RoundProgressProps> = ({
  currentRound,
  completedWords,
  totalWords,
  completionRate,
}) => {
  // 根据完成率获取进度条颜色
  const getProgressBarColor = () => {
    if (completionRate >= 75) return "bg-green-500";
    if (completionRate >= 50) return "bg-blue-500";
    if (completionRate >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="mb-4">
        <p className="text-xl font-medium">第 {currentRound} 轮</p>
        <p className="text-sm text-gray-500">
          完成 {completedWords} / {totalWords} 个单词
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`${getProgressBarColor()} h-4 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${completionRate}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>0%</span>
        <span>{completionRate}%</span>
        <span>100%</span>
      </div>

      <div className="mt-4 text-sm">
        {completionRate < 100 ? (
          <p className="text-blue-600">
            还需完成 {totalWords - completedWords} 个单词才能进入下一轮
          </p>
        ) : (
          <p className="text-green-600">此轮次已完成，可以开始下一轮</p>
        )}
      </div>
    </div>
  );
};

export default RoundProgress;
