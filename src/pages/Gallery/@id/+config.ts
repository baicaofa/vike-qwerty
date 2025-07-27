// /gallery/@id/+config.ts
import Page from "./+Page";
import type { Config } from "vike/types";

export default {
  // 动态路由，支持词典 ID 参数（包括自定义词典的custom_前缀）
  route: "/gallery/:id",
  // 页面组件
  Page,
  // 启用客户端路由
  clientRouting: true,
  // 允许中断水合
  hydrationCanBeAborted: true,
  // 传递路由参数到客户端
  passToClient: ["pageProps", "routeParams", "urlPathname"],
} satisfies Config;
