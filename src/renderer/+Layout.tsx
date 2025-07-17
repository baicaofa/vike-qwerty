import { ClientWrapper } from "./ClientWrapper";
import "./PageLayout.css";
import { Provider as JotaiProvider, createStore } from "jotai";
import type React from "react";
import { usePageContext } from "vike-react/usePageContext";

// 创建全局的Jotai store
const globalStore = createStore();

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();

  return (
    <JotaiProvider store={globalStore}>
      <ClientWrapper pageContext={pageContext}>{children}</ClientWrapper>
    </JotaiProvider>
  );
}
