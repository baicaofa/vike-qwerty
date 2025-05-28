import type { SyncResult, SyncState } from "@/services/syncService";
import {
  hasPendingChanges,
  syncFromCloud,
  syncToCloud,
} from "@/services/syncService";
import useAuthStore from "@/store/auth";
import { useCallback, useEffect, useRef, useState } from "react";

// 同步配置
const SYNC_INTERVAL = 5 * 60 * 1000; // 5分钟
const SYNC_ONLINE_INTERVAL = 60 * 1000; // 60秒
const MAX_RETRY_COUNT = 3; // 最大重试次数
const RETRY_DELAY = 5000; // 重试延迟（毫秒）
const DEBOUNCE_DELAY = 1000; // 防抖延迟（毫秒）

// SSR安全获取初始网络状态
const getInitialOnline = () => {
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    return navigator.onLine;
  }
  return true; // SSR时假定在线，避免mismatch
};

export const useSync = () => {
  const { isAuthenticated } = useAuthStore();
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnline());
  const [retryCount, setRetryCount] = useState<number>(0);
  const [initialSyncDone, setInitialSyncDone] = useState<boolean>(false);

  // 使用 ref 跟踪定时器和防抖状态
  const intervalIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const isSyncPendingRef = useRef<boolean>(false);

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
    if (!isAuthenticated) return;
    const pending = await hasPendingChanges();
    setHasChanges(pending);
  }, [isAuthenticated]);

  // 执行本地到云端的同步
  const performUploadSync = useCallback(async (): Promise<SyncResult> => {
    console.log("执行本地到云端同步", new Date().toISOString());
    if (!isAuthenticated) {
      return { success: false, error: { message: "用户未登录" } };
    }
    if (syncState === "syncing" || isSyncPendingRef.current) {
      return { success: false, error: { message: "同步正在进行中" } };
    }

    isSyncPendingRef.current = true;
    setSyncState("syncing");

    try {
      const result = await syncToCloud();
      console.log("本地到云端同步结果:", result.success ? "成功" : "失败");
      setLastSyncResult(result);
      setSyncState(result.success ? "success" : "error");
      setRetryCount(result.success ? 0 : retryCount + 1);
      await checkPendingChanges(); // 同步后检查剩余变更
      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "同步失败",
        },
      };
      setLastSyncResult(errorResult);
      setSyncState("error");
      setRetryCount((prev) => prev + 1);
      return errorResult;
    } finally {
      isSyncPendingRef.current = false;
    }
  }, [isAuthenticated, syncState, retryCount, checkPendingChanges]);

  // 执行云端到本地的同步
  const performDownloadSync = useCallback(async (): Promise<SyncResult> => {
    console.log("执行云端到本地同步", new Date().toISOString());
    if (!isAuthenticated) {
      return { success: false, error: { message: "用户未登录" } };
    }
    if (syncState === "syncing" || isSyncPendingRef.current) {
      return { success: false, error: { message: "同步正在进行中" } };
    }

    isSyncPendingRef.current = true;
    setSyncState("syncing");

    try {
      const result = await syncFromCloud();
      console.log("云端到本地同步结果:", result.success ? "成功" : "失败");
      setLastSyncResult(result);
      setSyncState(result.success ? "success" : "error");
      setInitialSyncDone(true); // 标记初始同步已完成
      return result;
    } catch (error) {
      const errorResult: SyncResult = {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "同步失败",
        },
      };
      setLastSyncResult(errorResult);
      setSyncState("error");
      return errorResult;
    } finally {
      isSyncPendingRef.current = false;
    }
  }, [isAuthenticated, syncState]);

  // 手动触发同步（供外部调用）
  const triggerSync = useCallback(
    async (direction: "upload" | "download" | "both" = "both") => {
      if (isSyncPendingRef.current) return lastSyncResult;

      if (direction === "upload") {
        return performUploadSync();
      } else if (direction === "download") {
        return performDownloadSync();
      } else {
        // 先下载再上传
        const downloadResult = await performDownloadSync();
        if (!downloadResult.success) return downloadResult;
        return performUploadSync();
      }
    },
    [performUploadSync, performDownloadSync, lastSyncResult]
  );

  // 初始化时执行一次云端到本地同步
  useEffect(() => {
    if (isAuthenticated && isOnline && !initialSyncDone) {
      console.log("初始化同步：从云端到本地");
      performDownloadSync();
    }
  }, [isAuthenticated, isOnline, initialSyncDone, performDownloadSync]);

  // 定时执行本地到云端同步
  useEffect(() => {
    // 清理现有定时器
    const cleanup = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    // 如果未认证，停止所有同步
    if (!isAuthenticated) {
      cleanup();
      setSyncState("idle");
      setRetryCount(0);
      return;
    }

    // 初始化时检查变更
    checkPendingChanges();

    // 定义本地到云端同步循环
    const startSyncLoop = () => {
      cleanup(); // 确保只有一个定时器

      const interval = isOnline ? SYNC_ONLINE_INTERVAL : SYNC_INTERVAL;
      intervalIdRef.current = window.setInterval(async () => {
        console.log("定时触发本地到云端同步检查", {
          state: syncState,
          isPending: isSyncPendingRef.current,
          time: new Date().toISOString(),
        });

        // 基础条件判断
        if (!isSyncPendingRef.current && isAuthenticated) {
          // 检查是否有本地变更需要同步
          const hasLocalChanges = await hasPendingChanges();
          if (hasLocalChanges) {
            await performUploadSync(); // 只在有本地变更时执行上传
          }
        }
      }, interval);
    };

    // 启动同步循环
    startSyncLoop();

    // 网络状态变化时重新调整同步间隔
    if (isOnline && !intervalIdRef.current) {
      startSyncLoop();
    }

    // 清理函数
    return cleanup;
  }, [
    isAuthenticated,
    isOnline,
    retryCount,
    performUploadSync,
    checkPendingChanges,
  ]);

  return {
    syncState,
    lastSyncResult,
    hasChanges,
    isOnline,
    triggerSync,
    checkPendingChanges,
    initialSyncDone,
  };
};
