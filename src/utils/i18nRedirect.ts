import type { SupportedLanguage } from "@/store/languageAtom";

/**
 * 处理国际化重定向的工具函数
 */

/**
 * 检查是否需要重定向到本地化URL
 * @param pathname - 当前路径
 * @param preferredLanguage - 用户偏好语言
 * @returns 重定向URL或null
 */
export function checkI18nRedirect(
  pathname: string,
  preferredLanguage: SupportedLanguage
): string | null {
  const supportedLanguages = ["zh", "en"];
  const pathSegments = pathname.split("/").filter(Boolean);

  // 如果路径已经包含语言前缀，不需要重定向
  if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
    return null;
  }

  // 如果用户偏好语言不是默认语言（中文），重定向到本地化URL
  if (preferredLanguage !== "zh") {
    return `/${preferredLanguage}${pathname}`;
  }

  return null;
}

/**
 * 从本地化URL中提取原始路径
 * @param localizedPath - 本地化路径
 * @returns 原始路径和语言信息
 */
export function extractPathInfo(localizedPath: string): {
  originalPath: string;
  language: SupportedLanguage;
} {
  const supportedLanguages: SupportedLanguage[] = ["zh", "en"];
  const pathSegments = localizedPath.split("/").filter(Boolean);

  if (
    pathSegments.length > 0 &&
    supportedLanguages.includes(pathSegments[0] as SupportedLanguage)
  ) {
    return {
      originalPath: "/" + pathSegments.slice(1).join("/"),
      language: pathSegments[0] as SupportedLanguage,
    };
  }

  return {
    originalPath: localizedPath,
    language: "zh",
  };
}

/**
 * 生成多语言链接映射
 * @param originalPath - 原始路径
 * @returns 多语言链接映射
 */
export function generateI18nLinks(
  originalPath: string
): Record<SupportedLanguage, string> {
  const supportedLanguages: SupportedLanguage[] = ["zh", "en"];
  const links: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;

  supportedLanguages.forEach((lang) => {
    if (lang === "zh") {
      links[lang] = originalPath;
    } else {
      links[lang] = `/${lang}${originalPath}`;
    }
  });

  return links;
}

/**
 * 检查路径是否为有效的语言代码
 * @param segment - 路径段
 * @returns 是否为有效语言代码
 */
export function isValidLanguageCode(
  segment: string
): segment is SupportedLanguage {
  return ["zh", "en"].includes(segment);
}

/**
 * 获取默认语言
 * @returns 默认语言代码
 */
export function getDefaultLanguage(): SupportedLanguage {
  return "zh";
}

/**
 * 获取支持的语言列表
 * @returns 支持的语言列表
 */
export function getSupportedLanguages(): readonly SupportedLanguage[] {
  return ["zh", "en"] as const;
}
