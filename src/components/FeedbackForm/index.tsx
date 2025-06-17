import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { submitFeedback, FeedbackFormData } from "@/services/feedbackService";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import IconMessageCircle from "~icons/tabler/message-circle";
import IconX from "~icons/tabler/x";

interface FeedbackFormProps {
  onClose?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
  const { isAuthenticated, userData } = useAuth();
  const toast = useToast();

  // 表单状态
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "suggestion",
    title: "",
    description: "",
    contactInfo: isAuthenticated ? userData?.email : "",
  });

  // 表单提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 验证表单
    if (!formData.title.trim()) {
      setError("请输入标题");
      return;
    }

    if (!formData.description.trim()) {
      setError("请输入详细描述");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFeedback(formData);
      setSubmitSuccess(true);
      toast.success("感谢您的反馈！");

      // 重置表单
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          用户反馈
        </h2>
        <Dialog.Close asChild>
          <button
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="关闭"
          >
            <IconX />
          </button>
        </Dialog.Close>
      </div>

      {submitSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <IconMessageCircle className="mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            反馈已提交
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            感谢您的反馈！我们会认真考虑您的意见。
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="type"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              反馈类型
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
              <option value="bug">Bug反馈</option>
              <option value="feature">功能请求</option>
              <option value="suggestion">建议与改进</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              标题
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="简短描述您的反馈"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              详细描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请详细描述您的问题或建议"
              rows={5}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              maxLength={2000}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/2000
            </p>
          </div>

          <div>
            <label
              htmlFor="contactInfo"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              联系方式（可选）
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="邮箱或其他联系方式"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {isAuthenticated
                ? "我们将使用您的账号邮箱与您联系"
                : "填写联系方式，以便我们回复您"}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
            </Dialog.Close>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isSubmitting ? "提交中..." : "提交反馈"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
