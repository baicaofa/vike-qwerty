import Page from "./+Page";
import type { Config } from "vike/types";

export default {
  // 词典编辑路由，支持自定义词典ID格式（custom_前缀）
  route: "/gallery/@id/edit",
  // 页面组件
  Page,
  // 启用客户端路由
  clientRouting: true,
  // 允许中断水合
  hydrationCanBeAborted: true,
  // 传递路由参数到客户端
  passToClient: ["pageProps", "routeParams", "urlPathname"],
} satisfies Config;
