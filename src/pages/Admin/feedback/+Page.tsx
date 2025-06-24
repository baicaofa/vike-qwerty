import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  FeedbackReply,
  getAllFeedback,
  replyToFeedback,
  updateFeedbackStatus,
} from "@/services/feedbackService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { navigate } from "vike/client/router";

interface FeedbackItem {
  _id: string;
  type: "bug" | "feature" | "suggestion" | "other";
  title: string;
  description: string;
  contactInfo?: string;
  userId?: {
    _id: string;
    username: string;
    email: string;
  };
  status: "new" | "in-review" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  replies?: FeedbackReply[];
}

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

const priorityLabels: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "紧急",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-800",
  "in-review": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function FeedbackAdminPage() {
  const auth = useAuth();
  const { isAuthenticated, userData, checkAuth } = auth;
  const toast = useToast();

  // 使用ref记录管理员检查是否已完成
  const adminCheckDoneRef = useRef(false);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");

  // 在组件挂载时检查认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("初始化认证状态失败:", error);
      }
    };

    initAuth();
  }, [checkAuth]);

  // 加载反馈数据
  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllFeedback(currentPage, 10);
      setFeedbacks(response.data);
      setTotalPages(response.pages);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [currentPage]);

  // 检查管理员权限
  useEffect(() => {
    // 避免重复执行管理员权限检查
    if (adminCheckDoneRef.current) {
      return;
    }

    console.log("认证状态:", isAuthenticated);
    console.log("用户数据:", userData);
    console.log("是否管理员:", userData?.isAdmin);

    const checkAdminAccess = async () => {
      // 先在控制台显示本地存储的用户信息
      const storedUser = localStorage.getItem("user");
      const storedUserData = storedUser ? JSON.parse(storedUser) : null;
      console.log("localStorage中的用户信息:", storedUserData);

      // 如果认证状态为true但userData为null，使用本地存储的用户数据
      let effectiveUserData = userData || storedUserData;

      if (isAuthenticated) {
        if (!userData) {
          // 如果已认证但userData为null，尝试调用checkAuth获取用户数据
          console.log("正在尝试获取用户数据...");
          try {
            await checkAuth();
            effectiveUserData = auth.userData || storedUserData;
            console.log("重新获取用户数据后:", effectiveUserData);
          } catch (error) {
            console.error("获取用户数据失败:", error);
          }
        }

        // 判断是否具有管理员权限
        const isAdmin = effectiveUserData?.isAdmin === true;
        console.log("管理员权限状态:", isAdmin);

        if (!isAdmin) {
          toast.error("您没有访问此页面的权限");
          console.log("用户不是管理员，准备跳转");
          // 根据您的反馈，您希望注释掉重定向功能，所以我们注释这一行
          // navigate("/");
        } else {
          // 加载反馈数据
          loadFeedbacks();
        }
      } else {
        console.log("用户未登录，准备跳转");
        // 根据您的反馈，您希望注释掉重定向功能，所以我们注释这一行
        // navigate("/login");
      }

      // 标记管理员检查已完成
      adminCheckDoneRef.current = true;
    };

    checkAdminAccess();
  }, [isAuthenticated, userData, toast, checkAuth, auth, loadFeedbacks]);

  // 当页码变化时重新加载数据
  useEffect(() => {
    if (adminCheckDoneRef.current) {
      loadFeedbacks();
    }
  }, [currentPage, loadFeedbacks]);

  // 更新反馈状态
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateFeedbackStatus(id, { status });
      toast.success("状态已更新");
      loadFeedbacks();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 更新优先级
  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      await updateFeedbackStatus(id, { priority });
      toast.success("优先级已更新");
      loadFeedbacks();
    } catch (error: any) {
      toast.error(error.message);
    }
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

  // 处理提交回复
  const handleSubmitReply = async () => {
    if (!selectedFeedback || !replyContent.trim()) return;

    try {
      await replyToFeedback(selectedFeedback._id, replyContent);
      toast.success("回复已添加");
      setReplyContent(""); // 清空输入
      loadFeedbacks(); // 重新加载反馈列表
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          用户反馈管理
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      类型
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      标题
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      状态
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      优先级
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      提交时间
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        暂无反馈数据
                      </td>
                    </tr>
                  ) : (
                    feedbacks.map((feedback) => (
                      <tr
                        key={feedback._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {typeLabels[feedback.type]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div className="line-clamp-1">{feedback.title}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <select
                            value={feedback.status}
                            onChange={(e) =>
                              handleUpdateStatus(feedback._id, e.target.value)
                            }
                            className="rounded border border-gray-300 bg-white  py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            aria-label="反馈状态"
                          >
                            {Object.entries(statusLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <select
                            value={feedback.priority}
                            onChange={(e) =>
                              handleUpdatePriority(feedback._id, e.target.value)
                            }
                            className="rounded border border-gray-300 bg-white  py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            aria-label="反馈优先级"
                          >
                            {Object.entries(priorityLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <button
                            onClick={() => handleViewDetails(feedback)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`rounded-md px-3 py-1 text-sm ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}

        {/* 详情模态框 */}
        {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  反馈详情
                </h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[selectedFeedback.status]
                    }`}
                  >
                    {statusLabels[selectedFeedback.status]}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      priorityColors[selectedFeedback.priority]
                    }`}
                  >
                    优先级: {priorityLabels[selectedFeedback.priority]}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {typeLabels[selectedFeedback.type]}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedFeedback.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                    {selectedFeedback.description}
                  </p>
                </div>

                {selectedFeedback.userId && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      用户信息
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      用户名: {selectedFeedback.userId.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      邮箱: {selectedFeedback.userId.email}
                    </p>
                  </div>
                )}

                {selectedFeedback.contactInfo && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      联系方式
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFeedback.contactInfo}
                    </p>
                  </div>
                )}

                <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    提交时间
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* 回复列表 */}
                {selectedFeedback.replies &&
                  selectedFeedback.replies.length > 0 && (
                    <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        管理员回复
                      </h4>
                      <div className="mt-2 space-y-3">
                        {selectedFeedback.replies.map((reply, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-2 dark:border-gray-600"
                          >
                            <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                              {reply.content}
                            </p>
                            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>{reply.adminUsername}</span>
                              <span>
                                {new Date(reply.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    添加回复
                  </h4>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="输入回复内容..."
                  />
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    提交回复
                  </button>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  {/* 状态按钮 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      更新状态:
                    </span>
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) =>
                        handleUpdateStatus(selectedFeedback._id, e.target.value)
                      }
                      className="rounded border border-gray-300 bg-white py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      aria-label="更新反馈状态"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 优先级按钮 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      优先级:
                    </span>
                    <select
                      value={selectedFeedback.priority}
                      onChange={(e) =>
                        handleUpdatePriority(
                          selectedFeedback._id,
                          e.target.value
                        )
                      }
                      className="rounded border border-gray-300 bg-white py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      aria-label="更新反馈优先级"
                    >
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
