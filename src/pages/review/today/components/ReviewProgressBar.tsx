import type React from "react";

interface ReviewProgressBarProps {
  progress: number;
  className?: string;
}

/**
 * 复习进度条组件
 */
const ReviewProgressBar: React.FC<ReviewProgressBarProps> = ({
  progress,
  className = "",
}) => {
  // 根据进度确定颜色
  const getColorClass = () => {
    if (progress < 25) return "bg-red-600";
    if (progress < 50) return "bg-yellow-600";
    if (progress < 75) return "bg-blue-600";
    return "bg-green-600";
  };

  return (
    <div className={`bg-gray-200 rounded-full h-3 w-64 ${className}`}>
      <div
        className={`${getColorClass()} h-3 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(100, progress)}%` }}
      ></div>
    </div>
  );
};

export default ReviewProgressBar;
