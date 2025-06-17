import { FeedbackDialog } from "../../components/FeedbackDialog";
import Layout from "../../components/Layout";
import { VoteButtons } from "../../components/VoteButtons";
import { useToast } from "../../hooks/useToast";
import { getPublicFeedback } from "../../services/feedbackService";
import * as LucideIcons from "lucide-react";
import React, { useState, useEffect } from "react";

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
    username: string;
  };
}

export default function FeedbackPage() {
  const toast = useToast();

  // 状态管理
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );

  // 筛选和排序状态
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "upvotes">("newest");

  // 加载反馈数据
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
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  // 监听筛选、排序和分页变化
  useEffect(() => {
    loadFeedbacks();
  }, [currentPage, filterType, filterStatus, sortOption]);

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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                          {typeLabels[feedback.type]}
                        </span>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            statusColors[feedback.status]
                          }`}
                        >
                          {statusLabels[feedback.status]}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <div className="px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  反馈详情
                </h2>
                <button
                  onClick={handleCloseDetails}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-label="关闭"
                >
                  <LucideIcons.X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {typeLabels[selectedFeedback.type]}
                </span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    statusColors[selectedFeedback.status]
                  }`}
                >
                  {statusLabels[selectedFeedback.status]}
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
            </div>
            <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">
              <button
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
