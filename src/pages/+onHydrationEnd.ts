import { initI18n } from "@/i18n";
import { detectBrowserLanguage } from "@/store/languageAtom";
import type { OnHydrationEndAsync } from "vike/types";

/**
 * 全局水合完成后的初始化逻辑
 * 在页面可交互后异步执行，不阻塞渲染
 */
export const onHydrationEnd: OnHydrationEndAsync = async (): Promise<
  ReturnType<OnHydrationEndAsync>
> => {
  try {
    // 1. 初始化i18n（如果还未初始化）
    const browserLanguage = detectBrowserLanguage();
    await initI18n(browserLanguage);

    // 2. 确保HTML lang属性与当前语言一致
    if (typeof document !== "undefined") {
      const htmlLang = browserLanguage === "zh" ? "zh-CN" : "en";
      if (document.documentElement.lang !== htmlLang) {
        document.documentElement.lang = htmlLang;
      }
    }

    // 3. 其他非核心初始化逻辑可以在这里添加
    // 例如：分析工具初始化、第三方服务初始化等

    console.log("i18n hydration completed successfully");
  } catch (error) {
    console.error("Failed to initialize i18n during hydration:", error);
    // 不抛出错误，避免影响页面正常功能
  }
};
