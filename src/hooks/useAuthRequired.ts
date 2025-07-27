import { useAuth } from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";

export interface UseAuthRequiredOptions {
  feature?: string;
  redirectTo?: string;
  onAuthRequired?: () => void;
  autoCheck?: boolean;
}

export interface UseAuthRequiredResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  requireAuth: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
}

/**
 * 认证验证自定义Hook
 * 提供灵活的认证验证功能，支持不同场景下的认证需求
 *
 * @param options 配置选项
 * @returns 认证状态和相关方法
 */
export function useAuthRequired(
  options: UseAuthRequiredOptions = {}
): UseAuthRequiredResult {
  const {
    feature = "此功能",
    redirectTo = "/login",
    onAuthRequired,
    autoCheck = true,
  } = options;

  const { isAuthenticated, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(autoCheck);

  // 检查认证状态
  const checkAuthStatus = useCallback(async () => {
    if (!autoCheck) return;

    try {
      setIsLoading(true);
      await checkAuth();
    } catch (error) {
      console.error("认证检查失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth, autoCheck]);

  // 要求认证的方法
  const requireAuth = useCallback(async (): Promise<boolean> => {
    if (isAuthenticated) {
      return true;
    }

    // 触发认证要求回调
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      // 默认行为：跳转到登录页面
      window.location.href = redirectTo;
    }

    return false;
  }, [isAuthenticated, onAuthRequired, redirectTo]);

  // 自动检查认证状态
  useEffect(() => {
    if (autoCheck) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, autoCheck]);

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    checkAuthStatus,
  };
}
