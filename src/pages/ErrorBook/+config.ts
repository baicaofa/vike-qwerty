import Page from "./+Page.tsx";

export default {
  route: "/error-book", // 将此页面映射到根路径 /
  Page, // 指定页面组件
  // 添加客户端水合配置
  hydrationCanBeAborted: true,
  clientRouting: true,
};
