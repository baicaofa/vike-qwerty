import { useToast } from "../../hooks/useToast";
import { voteFeedback } from "../../services/feedbackService";
import { getDeviceFingerprint } from "../../utils/deviceFingerprint";
// 优化导入：只导入需要的图标
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface VoteButtonsProps {
  feedbackId: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  onVoteChange?: (voteData: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
  }) => void;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  feedbackId,
  upvotes,
  downvotes,
  userVote,
  onVoteChange,
}) => {
  const toast = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  const [currentUserVote, setCurrentUserVote] = useState(userVote);

  const handleVote = async (vote: "up" | "down") => {
    if (isVoting) return;

    try {
      setIsVoting(true);

      // 准备投票数据
      const voteAction = currentUserVote === vote ? "remove" : vote;
      const deviceId = getDeviceFingerprint(); // 统一使用设备指纹
      const voteData = {
        vote: voteAction,
        deviceId,
      };

      const response = await voteFeedback(feedbackId, voteData);

      // 更新状态
      setCurrentUpvotes(response.data.upvotes);
      setCurrentDownvotes(response.data.downvotes);
      setCurrentUserVote(response.data.userVote);

      // 通知父组件
      if (onVoteChange) {
        onVoteChange({
          upvotes: response.data.upvotes,
          downvotes: response.data.downvotes,
          userVote: response.data.userVote,
        });
      }
    } catch (error) {
      // 添加详细错误日志
      console.error("投票失败详情:", error);
      if (error instanceof Error) {
        console.error("错误消息:", error.message);
      }
      if (error instanceof Response || (error as any).response) {
        const response = (error as any).response || error;
        console.error("错误状态码:", response.status);
        console.error("错误响应:", response.data);
      }

      toast.error(error instanceof Error ? error.message : "投票失败");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        type="button"
        onClick={() => handleVote("up")}
        disabled={isVoting}
        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors ${
          currentUserVote === "up"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="点赞"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{currentUpvotes}</span>
      </button>

      <button
        type="button"
        onClick={() => handleVote("down")}
        disabled={isVoting}
        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors ${
          currentUserVote === "down"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="踩"
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{currentDownvotes}</span>
      </button>
    </div>
  );
};
