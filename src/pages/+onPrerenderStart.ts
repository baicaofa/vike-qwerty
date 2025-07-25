import type { OnPrerenderStartSync } from "vike/types";

/**
 * 预渲染开始钩子
 * 为每种支持的语言生成对应的页面
 */
export const onPrerenderStart: OnPrerenderStartSync = (prerenderContext) => {
  const locales = ["zh", "en"] as const;
  const defaultLocale = "zh";

  const pageContexts: any[] = [];

  prerenderContext.pageContexts.forEach((pageContext) => {
    // 检查是否已经被其他钩子本地化处理
    if ((pageContext as any).locale) {
      // 已经本地化，直接添加
      pageContexts.push(pageContext);
    } else {
      // 为每种语言复制页面上下文
      locales.forEach((locale) => {
        let { urlOriginal } = pageContext;

        // 为非默认语言添加语言前缀
        if (locale !== defaultLocale) {
          urlOriginal = `/${locale}${pageContext.urlOriginal}`;
        }

        pageContexts.push({
          ...pageContext,
          urlOriginal,
          locale,
        });
      });
    }
  });

  return {
    prerenderContext: {
      pageContexts,
    },
  };
};
