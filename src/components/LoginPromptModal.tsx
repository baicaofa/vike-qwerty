import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  description?: string;
  onLogin?: () => void;
  showLearnMore?: boolean;
  onLearnMore?: () => void;
}

/**
 * 登录引导模态框组件
 * 提供友好的登录引导界面，替代生硬的页面跳转
 */
const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  feature = "此功能",
  description,
  onLogin,
  showLearnMore = false,
  onLearnMore,
}) => {
  const defaultDescription = `${feature}需要登录后才能使用。登录后您可以享受完整的功能体验，包括数据同步、个人设置保存等服务。`;

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = "/login";
    }
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      // 默认行为：滚动到页面顶部或显示帮助信息
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            需要登录才能使用{feature}
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col space-y-3 sm:flex-col sm:space-x-0 sm:space-y-3">
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            立即登录
          </Button>

          <div className="flex space-x-3">
            {showLearnMore && (
              <Button
                onClick={handleLearnMore}
                variant="outline"
                className="flex-1"
              >
                了解更多
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              className={showLearnMore ? "flex-1" : "w-full"}
            >
              稍后再说
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(LoginPromptModal);
