import { initI18n } from "@/i18n";
import {
  detectBrowserLanguage,
  detectLanguageFromUrl,
} from "@/store/languageAtom";
import type { OnHydrationEndAsync } from "vike/types";

/**
 * 全局水合完成后的初始化逻辑
 * 在页面可交互后异步执行，不阻塞渲染
 */
export const onHydrationEnd: OnHydrationEndAsync = async (): Promise<
  ReturnType<OnHydrationEndAsync>
> => {
  try {
    // 1. 从 URL 检测语言，如果没有则使用浏览器语言
    const urlLanguage = detectLanguageFromUrl();
    const finalLanguage =
      urlLanguage !== "zh" ? urlLanguage : detectBrowserLanguage();

    // 2. 初始化i18n（如果还未初始化）
    await initI18n(finalLanguage);

    // 3. 确保HTML lang属性与当前语言一致
    if (typeof document !== "undefined") {
      const htmlLang = finalLanguage === "zh" ? "zh-CN" : "en";
      if (document.documentElement.lang !== htmlLang) {
        document.documentElement.lang = htmlLang;
      }
    }

    // 4. 其他非核心初始化逻辑可以在这里添加
    // 例如：分析工具初始化、第三方服务初始化等
  } catch (error) {
    console.error("Failed to initialize i18n during hydration:", error);
    // 不抛出错误，避免影响页面正常功能
  }
};
