import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { voteFeedback } from "../../services/feedbackService";
import * as LucideIcons from "lucide-react";
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
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  const [currentUserVote, setCurrentUserVote] = useState(userVote);

  const handleVote = async (vote: "up" | "down") => {
    if (!isAuthenticated) {
      toast.error("请先登录后再投票");
      return;
    }

    if (isVoting) return;

    try {
      setIsVoting(true);
      // 如果用户已经投了相同的票，则取消投票
      const voteAction = currentUserVote === vote ? "remove" : vote;
      const response = await voteFeedback(feedbackId, voteAction);

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
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote("up")}
        disabled={isVoting}
        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors ${
          currentUserVote === "up"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="点赞"
      >
        <LucideIcons.ThumbsUp className="h-4 w-4" />
        <span>{currentUpvotes}</span>
      </button>

      <button
        onClick={() => handleVote("down")}
        disabled={isVoting}
        className={`flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors ${
          currentUserVote === "down"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="踩"
      >
        <LucideIcons.ThumbsDown className="h-4 w-4" />
        <span>{currentDownvotes}</span>
      </button>
    </div>
  );
};
