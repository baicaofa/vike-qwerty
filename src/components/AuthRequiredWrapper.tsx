import { LoadingUI } from "@/components/Loading";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useAuthRequired } from "@/hooks/useAuthRequired";
import React, { useState } from "react";

interface AuthRequiredWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  feature?: string;
  showModal?: boolean;
  redirectTo?: string;
  onAuthRequired?: () => void;
}

/**
 * 认证验证包装组件
 * 统一处理需要登录验证的功能，提供友好的用户体验
 */
const AuthRequiredWrapper: React.FC<AuthRequiredWrapperProps> = ({
  children,
  fallback,
  feature = "此功能",
  showModal = false,
  redirectTo = "/login",
  onAuthRequired,
}) => {
  const { isAuthenticated, isLoading, requireAuth } = useAuthRequired({
    feature,
    redirectTo,
    onAuthRequired: showModal ? undefined : onAuthRequired,
    autoCheck: true,
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 处理未认证状态
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (showModal) {
        setShowLoginPrompt(true);
        onAuthRequired?.();
      } else {
        // 使用Hook提供的requireAuth方法
        requireAuth();
      }
    }
  }, [isAuthenticated, isLoading, showModal, onAuthRequired, requireAuth]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <LoadingUI className="mx-auto mb-2" />
          <p className="text-gray-600 text-sm">验证登录状态...</p>
        </div>
      </div>
    );
  }

  // 未认证状态
  if (!isAuthenticated) {
    if (showModal) {
      return (
        <>
          <LoginPromptModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            feature={feature}
            onLogin={() => (window.location.href = redirectTo)}
          />
          {fallback || (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md mx-auto">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  需要登录才能使用{feature}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  请登录您的账户以继续使用此功能
                </p>
                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  立即登录
                </button>
              </div>
            </div>
          )}
        </>
      );
    }

    // 不显示模态框时返回fallback或null
    return fallback || null;
  }

  // 已认证，渲染子组件
  return <>{children}</>;
};

export default React.memo(AuthRequiredWrapper);
