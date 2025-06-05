import Page from "./+Page.tsx";

export default {
  route: "/updates", // 将此页面映射到 /updates 路径
  Page, // 指定页面组件
  // 添加客户端水合配置
  hydrationCanBeAborted: true,
  clientRouting: true,
};
