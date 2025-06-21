import { isOpenDarkModeAtom } from "@/store";
import useAuthStore from "@/store/auth";
import { checkAndUpgradeDatabase } from "@/utils/db";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import type { PageContextClient } from "vike/types";

// 请调整导入路径

interface ClientWrapperProps {
  pageContext: PageContextClient;
  children: React.ReactNode;
}

export function ClientWrapper({ pageContext, children }: ClientWrapperProps) {
  const darkMode = useAtomValue(isOpenDarkModeAtom); // 从 Jotai 获取 darkMode
  const { checkAuth } = useAuthStore(); // 获取认证状态检查函数
  const [dbError, setDbError] = useState<string | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // 检查用户认证状态
    checkAuth();
  }, [checkAuth]);

  // 添加数据库版本检查和上报
  useEffect(() => {
    const checkDatabaseVersion = async () => {
      try {
        // 检查并升级数据库
        const result = await checkAndUpgradeDatabase();

        // 上报数据库版本信息
        if (result.success) {
          setIsDbReady(true);
          setDbError(null);

          // 生成一个匿名的用户ID，使用localStorage确保同一设备不会重复上报
          let deviceId = localStorage.getItem("device_id");
          if (!deviceId) {
            deviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem("device_id", deviceId);
          }

          // 上报数据库版本信息到服务器
          try {
            await axios.post("/api/db-stats", {
              deviceId,
              currentVersion: result.currentVersion,
              expectedVersion: result.expectedVersion,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
            });
            console.log("数据库版本信息上报成功");
          } catch (error) {
            // 静默失败，不影响用户体验
            console.error("数据库版本信息上报失败:", error);
          }
        } else {
          setDbError(result.error || "数据库初始化失败");
          setIsDbReady(false);
        }
      } catch (error) {
        console.error("数据库版本检查失败:", error);
        setDbError(error instanceof Error ? error.message : String(error));
        setIsDbReady(false);
      }
    };

    // 只在客户端执行
    if (typeof window !== "undefined") {
      checkDatabaseVersion();
    }
  }, []);

  useEffect(() => {
    // 全局条件检查

    // 原始逻辑
    if (typeof window === "undefined") return;

    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return <>{children}</>;
}
