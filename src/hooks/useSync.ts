import {
  syncData,
  hasPendingChanges,
  SyncState,
  SyncResult,
} from "@/services/syncService";
import useAuthStore from "@/store/auth";
import { useState, useCallback, useEffect } from "react";

// 同步配置
const SYNC_INTERVAL = 5 * 60 * 1000; // 5分钟
const SYNC_ONLINE_INTERVAL = 30 * 1000; // 30秒

export const useSync = () => {
  const { isAuthenticated } = useAuthStore();
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // 检查网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 检查是否有待同步的变更
  const checkPendingChanges = useCallback(async () => {
    if (isAuthenticated) {
      const pending = await hasPendingChanges();
      setHasChanges(pending);
    }
  }, [isAuthenticated]);

  // 执行同步
  const triggerSync = useCallback(async (): Promise<SyncResult> => {
    // 如果用户未登录或正在同步中，则不执行同步
    if (!isAuthenticated || syncState === "syncing") {
      return {
        success: false,
        error: {
          message: !isAuthenticated ? "用户未登录" : "同步正在进行中",
        },
      };
    }

    setSyncState("syncing");

    try {
      const result = await syncData();
      setLastSyncResult(result);
      setSyncState(result.success ? "success" : "error");

      // 同步完成后，重新检查是否有待同步的变更
      await checkPendingChanges();

      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "同步过程中发生未知错误",
        },
      };
      setLastSyncResult(errorResult);
      setSyncState("error");
      return errorResult;
    }
  }, [isAuthenticated, syncState, checkPendingChanges]);

  // 定期同步
  useEffect(() => {
    let intervalId: number | null = null;

    // 如果用户已登录，设置定期同步
    if (isAuthenticated) {
      // 初始检查
      checkPendingChanges();

      // 设置定期同步
      const interval = isOnline ? SYNC_ONLINE_INTERVAL : SYNC_INTERVAL;
      intervalId = window.setInterval(async () => {
        // 如果有待同步的变更，执行同步
        if (hasChanges) {
          await triggerSync();
        } else {
          // 即使没有变更，也定期检查一次
          await checkPendingChanges();
        }
      }, interval);
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, isOnline, hasChanges, triggerSync, checkPendingChanges]);

  // 网络状态变化时，如果从离线变为在线，立即检查并同步
  useEffect(() => {
    if (isOnline && isAuthenticated) {
      checkPendingChanges();
      if (hasChanges) {
        triggerSync();
      }
    }
  }, [isOnline, isAuthenticated, hasChanges, triggerSync, checkPendingChanges]);

  return {
    syncState,
    lastSyncResult,
    hasChanges,
    isOnline,
    triggerSync,
    checkPendingChanges,
  };
};
