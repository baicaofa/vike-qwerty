import type { FeedbackReply } from "@/services/feedbackService";
import { MessageSquare, Shield, User } from "lucide-react";
import type React from "react";

interface ReplyListProps {
  replies: FeedbackReply[];
  className?: string;
}

export const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  className = "",
}) => {
  if (!replies || replies.length === 0) {
    return null;
  }

  const getReplyIcon = (replyType: string) => {
    switch (replyType) {
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "user":
        return <User className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getReplyAuthor = (reply: FeedbackReply) => {
    switch (reply.replyType) {
      case "admin":
        return `${reply.adminUsername} (管理员)`;
      case "user":
        return `${reply.userUsername} (用户)`;
      default:
        return "未知用户";
    }
  };

  const getReplyStyle = (replyType: string) => {
    switch (replyType) {
      case "admin":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30";
      case "user":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
    }
  };

  const getAuthorTextStyle = (replyType: string) => {
    switch (replyType) {
      case "admin":
        return "text-blue-600 dark:text-blue-400";
      case "user":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-4 w-4 text-gray-600" />
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          对话记录 ({replies.length})
        </h4>
      </div>

      <div className="space-y-3">
        {replies.map((reply, index) => (
          <div
            key={index}
            className={`rounded-md border p-3 ${getReplyStyle(
              reply.replyType
            )}`}
          >
            <div className="mb-2 flex items-start space-x-2">
              {getReplyIcon(reply.replyType)}
              <div className="flex-1">
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {reply.content}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-medium ${getAuthorTextStyle(reply.replyType)}`}
              >
                {getReplyAuthor(reply)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
