import { initI18n } from "@/i18n";
import {
  detectBrowserLanguage,
  detectLanguageFromUrl,
} from "@/store/languageAtom";
import { checkAndUpgradeDatabase } from "@/utils/db";
import { getLanguagePreference } from "@/utils/localStorage";
import type { OnHydrationEndAsync } from "vike/types";

// 全局水合完成后的初始化逻辑（不阻塞首屏）
const onHydrationEnd: OnHydrationEndAsync = async () => {
  console.log("🚀 应用水合完成，开始初始化...");

  try {
    // 1. 检查localStorage中的语言偏好
    const preferredLanguage = getLanguagePreference();
    const urlLanguage = detectLanguageFromUrl();

    // 2. 如果用户有语言偏好且与当前URL不匹配，进行重定向
    if (preferredLanguage && preferredLanguage !== urlLanguage) {
      const currentPath = window.location.pathname;
      const pathWithoutLocale = currentPath.replace(/^\/(zh|en)/, "") || "/";
      const newPath =
        preferredLanguage === "zh"
          ? pathWithoutLocale
          : `/${preferredLanguage}${pathWithoutLocale}`;

      // 避免重定向到相同路径
      if (newPath !== currentPath) {
        const { navigate } = await import("vike/client/router");
        await navigate(newPath);
        return;
      }
    }

    // 3. 从 URL 检测语言，如果没有则使用浏览器语言
    const finalLanguage =
      urlLanguage !== "zh" ? urlLanguage : detectBrowserLanguage();

    // 4. 初始化i18n（如果还未初始化）
    await initI18n(finalLanguage);

    // 5. 确保HTML lang属性与当前语言一致
    if (typeof document !== "undefined") {
      const htmlLang = finalLanguage === "zh" ? "zh-CN" : "en";
      if (document.documentElement.lang !== htmlLang) {
        document.documentElement.lang = htmlLang;
      }
    }

    // 6. 其他非核心初始化逻辑可以在这里添加
    // 例如：分析工具初始化、第三方服务初始化等

    // 检查并升级数据库
    await checkAndUpgradeDatabase();

    console.log("✅ 数据库初始化完成");
  } catch (error) {
    console.error("Failed to initialize i18n during hydration:", error);
    // 不抛出错误，避免影响页面正常功能
  }
};

export default onHydrationEnd as unknown as ReturnType<OnHydrationEndAsync>;
