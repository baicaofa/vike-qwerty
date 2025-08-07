import { initI18n } from "../i18n";
import { TypingContext, initialState } from "../pages/Typing/store";
import {
  type SupportedLanguage,
  detectBrowserLanguage,
  detectLanguageFromUrl,
} from "../store/languageAtom";
import { getLanguagePreference } from "../utils/localStorage";
import { ClientWrapper } from "./ClientWrapper";
import "./PageLayout.css";
import { Provider as JotaiProvider, createStore } from "jotai";
import type React from "react";
import { hydrateRoot } from "react-dom/client";
import type { PageContextClient } from "vike/types";

interface PageContext extends PageContextClient {
  Page: React.ComponentType<any>;
  urlPathname: string;
  config: {
    Layout?:
      | React.ComponentType<{ children: React.ReactNode }>
      | React.ComponentType<{ children: React.ReactNode }>[];
  };
}

// 缓存 root 实例，避免重复 hydrate
let root: ReturnType<typeof hydrateRoot> | null = null;

export async function onRenderClient(pageContext: PageContext) {
  const { Page, config } = pageContext;
  const { Layout } = config;
  const container = document.getElementById("root");

  if (!container) {
    throw new Error("Root element not found");
  }

  // 初始化i18n（客户端）
  // 优先检查localStorage中的语言偏好，然后使用 pageContext 中的 locale，最后从 URL 或浏览器检测
  const preferredLanguage = getLanguagePreference();
  const pageLocale = (pageContext as any).locale as SupportedLanguage;
  const urlLanguage = detectLanguageFromUrl();
  const browserLanguage = detectBrowserLanguage();

  const finalLanguage =
    preferredLanguage || pageLocale || urlLanguage || browserLanguage;
  await initI18n(finalLanguage);

  const typingContextValue = {
    state: initialState,
    dispatch: () => {
      // 实际的 dispatch 函数会在组件内部通过 useReducer 创建
      console.warn("Initial dispatch called");
    },
  };

  // 创建一个 Jotai store 实例用于客户端渲染
  const store = createStore();

  let pageView = <Page pageContext={pageContext} />;
  if (Layout) {
    if (Array.isArray(Layout)) {
      pageView = Layout.reduceRight(
        (children, L) => <L>{children}</L>,
        pageView
      );
    } else {
      pageView = <Layout>{pageView}</Layout>;
    }
  }

  const app = (
    <JotaiProvider store={store}>
      <TypingContext.Provider value={typingContextValue}>
        <ClientWrapper pageContext={pageContext}>{pageView}</ClientWrapper>
      </TypingContext.Provider>
    </JotaiProvider>
  );

  if (!root) {
    root = hydrateRoot(container, app);
  } else {
    root.render(app);
  }
}
