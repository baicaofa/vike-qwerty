import { isOpenDarkModeAtom } from "@/store";
import useAuthStore from "@/store/auth";
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

  useEffect(() => {
    // 检查用户认证状态
    checkAuth();
  }, [checkAuth]);

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
