import { FeedbackDialog } from "../../components/FeedbackDialog";
import FeedbackNav from "../../components/FeedbackNav";
import Layout from "../../components/Layout";
import { ReplyList } from "../../components/ReplyList";
import { VoteButtons } from "../../components/VoteButtons";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import type { FeedbackReply } from "../../services/feedbackService";
import {
  getPublicFeedback,
  replyToFeedbackAsUser,
} from "../../services/feedbackService";
// 优化导入：只导入需要的图标
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// 反馈类型和状态标签映射
const typeLabels: Record<string, string> = {
  bug: "Bug反馈",
  feature: "功能请求",
  suggestion: "建议与改进",
  other: "其他",
};

const statusLabels: Record<string, string> = {
  new: "新反馈",
  "in-review": "处理中",
  resolved: "已解决",
  rejected: "已拒绝",
};

// 状态颜色
const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  "in-review":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  resolved:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// 反馈项接口
interface FeedbackItem {
  _id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  createdAt: string;
  userId?: {
    _id: string;
    username: string;
  };
  replies?: FeedbackReply[];
}

export default function FeedbackPage() {
  const toast = useToast();
  const auth = useAuth();
  const { isAuthenticated, userData } = auth;

  // 状态管理
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [userReplyContent, setUserReplyContent] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 筛选和排序状态
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "upvotes">("newest");

  // 监听筛选、排序和分页变化
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);

        // 构建筛选参数
        const filters: Record<string, string> = {};
        if (filterType) filters.type = filterType;
        if (filterStatus) filters.status = filterStatus;

        const response = await getPublicFeedback(
          currentPage,
          10,
          filters,
          sortOption
        );

        setFeedbacks(response.data);
        setTotalPages(response.pages);
        setError("");
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "加载反馈数据时出错");
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [currentPage, filterType, filterStatus, sortOption]);

  // 当筛选/排序变更时，重置到第1页
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterStatus, sortOption]);

  // 模态打开时锁定背景滚动，关闭时恢复
  useEffect(() => {
    if (selectedFeedback) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedFeedback]);

  // 模态 Esc 关闭与焦点陷阱
  useEffect(() => {
    if (!selectedFeedback) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseDetails();
      } else if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !modalRef.current.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last || !modalRef.current.contains(active)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    // 初始聚焦到模态
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 0);

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedFeedback]);

  // 处理投票变更
  const handleVoteChange = (
    feedbackId: string,
    voteData: {
      upvotes: number;
      downvotes: number;
      userVote: "up" | "down" | null;
    }
  ) => {
    // 更新本地状态
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback._id === feedbackId ? { ...feedback, ...voteData } : feedback
      )
    );
  };

  // 处理页面切换
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 显示反馈详情
  const handleViewDetails = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
  };

  // 关闭详情模态框
  const handleCloseDetails = () => {
    setSelectedFeedback(null);
    setUserReplyContent("");
  };

  // 处理用户回复
  const handleUserReply = async () => {
    if (!selectedFeedback || !userReplyContent.trim() || isReplySubmitting)
      return;

    // 检查用户是否已登录
    if (!isAuthenticated || !userData) {
      toast.error("请先登录后再回复");
      return;
    }

    try {
      setIsReplySubmitting(true);
      await replyToFeedbackAsUser(selectedFeedback._id, userReplyContent);
      toast.success("回复已提交");
      setUserReplyContent("");

      // 重新加载反馈数据
      const response = await getPublicFeedback(
        currentPage,
        10,
        { type: filterType, status: filterStatus },
        sortOption
      );
      setFeedbacks(response.data);

      // 更新选中的反馈
      const updatedFeedback = response.data.find(
        (f: FeedbackItem) => f._id === selectedFeedback._id
      );
      if (updatedFeedback) {
        setSelectedFeedback(updatedFeedback);
      } else {
        toast.info && toast.info("该反馈已移动或当前页不可见，已关闭详情");
        handleCloseDetails();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "回复失败";
      toast.error(errorMessage);
    } finally {
      setIsReplySubmitting(false);
    }
  };

  // 构建分页按钮
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex justify-center">
        <nav className="inline-flex space-x-1 rounded-md shadow-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <Layout>
      <FeedbackNav />
      <div className="mx-auto w-full max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            用户反馈
          </h1>
          <div className="mt-4 flex sm:mt-0">
            <FeedbackDialog buttonClassName="bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700" />
          </div>
        </div>

        {/* 筛选和排序控制 */}
        <div className="mb-6 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div>
              <label
                htmlFor="filter-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                类型
              </label>
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300  py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="">全部类型</option>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="filter-status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                状态
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300  py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="">全部状态</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="sort-option"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              排序
            </label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "newest" | "upvotes")
              }
              className="mt-1 block w-full rounded-md border border-gray-300  py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="newest">最新</option>
              <option value="upvotes">最热</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : (
          <>
            {feedbacks.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">暂无反馈数据</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-800"
                  >
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {typeLabels[feedback.type] ?? "其他"}
                        </span>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            statusColors[feedback.status] ??
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {statusLabels[feedback.status] ?? "未知状态"}
                        </span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-lg font-medium text-gray-900 dark:text-white">
                        {feedback.title}
                      </h3>
                      <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                        {feedback.description}
                      </p>
                      <div className="mb-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {feedback.userId
                            ? `由 ${feedback.userId.username} 提交`
                            : "匿名提交"}
                        </span>
                        <span className="mx-2">·</span>
                        <span>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* 回复指示器 */}
                      {feedback.replies && feedback.replies.length > 0 && (
                        <>
                          <div className="mb-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            <span>{feedback.replies.length} 条管理员回复</span>
                          </div>

                          {/* 最新一条回复预览 */}
                          <div className="mb-3 rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                            <p className="line-clamp-2 text-xs text-gray-700 dark:text-gray-300">
                              {
                                feedback.replies[feedback.replies.length - 1]
                                  .content
                              }
                            </p>
                            <div className="mt-1 flex justify-end text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                Keybr (管理员)
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between">
                        <VoteButtons
                          feedbackId={feedback._id}
                          upvotes={feedback.upvotes}
                          downvotes={feedback.downvotes}
                          userVote={feedback.userVote}
                          onVoteChange={(voteData) =>
                            handleVoteChange(feedback._id, voteData)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleViewDetails(feedback)}
                          className="rounded-md px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {renderPagination()}
          </>
        )}
      </div>

      {/* 反馈详情模态框 */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="w-full max-w-2xl overflow-y-auto max-h-[85vh] rounded-lg bg-white shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  反馈详情
                </h2>
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-label="关闭"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {typeLabels[selectedFeedback.type] ?? "其他"}
                </span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    statusColors[selectedFeedback.status] ??
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {statusLabels[selectedFeedback.status] ?? "未知状态"}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedFeedback.title}
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {selectedFeedback.description}
                </p>
              </div>

              <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFeedback.userId
                        ? `由 ${selectedFeedback.userId.username} 提交`
                        : "匿名提交"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(selectedFeedback.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <VoteButtons
                    feedbackId={selectedFeedback._id}
                    upvotes={selectedFeedback.upvotes}
                    downvotes={selectedFeedback.downvotes}
                    userVote={selectedFeedback.userVote}
                    onVoteChange={(voteData) =>
                      handleVoteChange(selectedFeedback._id, voteData)
                    }
                  />
                </div>
              </div>

              {/* 回复列表 */}
              <ReplyList
                replies={selectedFeedback.replies || []}
                className="mt-4"
              />

              {/* 回复功能 - 仅登录用户可见 */}
              {isAuthenticated && (
                <div className="mt-4 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                  <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    添加回复
                  </h4>

                  <div className="space-y-3">
                    <textarea
                      value={userReplyContent}
                      onChange={(e) => setUserReplyContent(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                      rows={3}
                      placeholder="输入您的回复..."
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {userReplyContent.length}/1000
                      </span>
                      <button
                        onClick={handleUserReply}
                        disabled={!userReplyContent.trim()}
                        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        提交回复
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">
              <button
                type="button"
                onClick={handleCloseDetails}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
