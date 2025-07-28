// src/index.tsx
import { isOpenDarkModeAtom } from "@/store";
// 引入应急内存清理工具
import "@/utils/memoryEmergencyCleanup";
import "animate.css";
import { useAtomValue } from "jotai";
import mixpanel from "mixpanel-browser";
import process from "process";
import { useEffect } from "react";
import "react-app-polyfill/stable";

if (process.env.NODE_ENV === "production") {
  mixpanel.init("bdc492847e9340eeebd53cc35f321691");
} else {
  mixpanel.init("5474177127e4767124c123b2d7846e2a", { debug: true });
}

// 共享逻辑（如暗黑模式和移动端检测）
export function useRootLogic() {
  const darkMode = useAtomValue(isOpenDarkModeAtom);

  useEffect(() => {
    if (typeof window === "undefined") return;

    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);
}
